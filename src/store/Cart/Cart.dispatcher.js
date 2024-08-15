import { getStore } from "Store";
import {
  processingCartRequest,
  removeCartItem,
  removeCartItems,
  setCartId,
  setCartTotals,
  updateCartItem,
  setCheckoutDetails,
  setCartCoupon,
  setIsCouponRequest,
} from "Store/Cart/Cart.action";
import { showNotification } from "Store/Notification/Notification.action";
import {
  addProductToCart,
  applyCouponCode,
  createCart,
  getCart,
  getCoupon,
  removeCouponCode,
  removeProductFromCart,
  updateProductInCart,
  siteWideCouponUpdate,
} from "Util/API/endpoint/Cart/Cart.enpoint";
import BrowserDatabase from "Util/BrowserDatabase";
import Logger from "Util/Logger";
import { LAST_CART_ID_CACHE_KEY } from "../MobileCart/MobileCart.reducer";
export const GUEST_QUOTE_ID = "guest_quote_id";
import MyAccountDispatcher from "Store/MyAccount/MyAccount.dispatcher";
import { resetCart } from "Store/Cart/Cart.action";
import { setCartTotal } from "Store/Checkout/Checkout.action";
import { getCountryFromUrl } from "Util/Url";
import MobileAPI from "Util/API/provider/MobileAPI";
export class CartDispatcher {
  async setCheckoutStep(dispatch, checkoutDetails = false) {
    dispatch(setCheckoutDetails(checkoutDetails));
  }

  async getCart(
    dispatch,
    isNewCart = false,
    createNewCart = true,
    isToMakeLastOrderAPICall = true
  ) {
    const {
      Cart: { cartId },
      AppConfig: {
        isExpressDelivery = false,
        vwoData = {},
        isNewCheckoutPageEnable = false,
      },
    } = getStore().getState();

    const country_code = getCountryFromUrl();
    if (
      !localStorage.getItem("currentSelectedAddress") &&
      isToMakeLastOrderAPICall &&
      !localStorage.getItem("EddAddressReq") &&
      (isExpressDelivery || isNewCheckoutPageEnable)
    ) {
      await MobileAPI.get(`order/last?country_specific=true`).then(
        (response) => {
          if (
            response?.data?.city &&
            response?.data?.area &&
            response?.data?.country?.toLowerCase() ===
              country_code?.toLowerCase()
          ) {
            let requestObj = {
              country: country_code,
              city: response?.data?.city,
              area: response?.data?.area,
              courier: null,
              source: null,
            };
            // localStorage.setItem("EddAddressReq", JSON.stringify(requestObj));
            localStorage.setItem(
              "currentSelectedAddress",
              JSON.stringify(response?.data)
            );
          }
        }
      );
    }

    const cart_id = BrowserDatabase.getItem(LAST_CART_ID_CACHE_KEY);
    if ((!cartId || isNewCart) && createNewCart) {
      try {
        const { data: requestedCartId = null } = await createCart(cart_id);
        if (!requestedCartId) {
          dispatch(
            showNotification(
              "error",
              __(
                "There was an error creating your cart, please refresh the page in a little while"
              )
            )
          );

          return;
        }
        BrowserDatabase.deleteItem(LAST_CART_ID_CACHE_KEY);
        dispatch(setCartId(requestedCartId));
        await this.getCartTotals(dispatch, requestedCartId);
      } catch (e) {
        Logger.log(e);
      }
    } else {
      if (cartId) {
        await this.getCartTotals(dispatch, cartId);
      }
    }
  }

  async setCartItems(dispatch, data) {
    try {
      const { items = [] } = data || {};

      if (items?.length >= 0) {
        dispatch(processingCartRequest());
        dispatch(removeCartItems());

        items.map((item) => {
          const {
            thumbnail,
            color,
            size_value: optionValue,
            brand_name: brandName,
            price,
            original_price: basePrice,
            id,
            availability,
            available_qty,
            extension_attributes,
          } = item;

          return dispatch(
            updateCartItem(
              { ...item, item_id: id },
              color,
              optionValue,
              basePrice,
              brandName,
              thumbnail,
              "",
              price,
              availability,
              available_qty,
              extension_attributes
            )
          );
        });
      }
    } catch (e) {
      Logger.log(e);
    }
  }

  async getCartTotals(dispatch, cartId, isSecondTry = false) {
    const cityAreaFromSelectionPopUp = BrowserDatabase.getItem(
      "cityAreaFromSelectionPopUp"
    );
    const reqObj =
      JSON.parse(localStorage.getItem("currentSelectedAddress")) ||
      cityAreaFromSelectionPopUp;
    const params = {
      area: reqObj?.area || "",
      city: reqObj?.city || "",
      address_type: reqObj?.mailing_address_type || "37303",
    };
    try {
      dispatch(processingCartRequest());
      const response = await getCart(cartId, params);
      if (response == "Request does not match any route.") {
        // MyAccountDispatcher.logout(null, dispatch);
        dispatch(resetCart());
      }
      const { data } = response;
      const lastCouponCode = localStorage.getItem("lastCouponCode");
      if (
        data.coupon_code === null &&
        data.items.length > 0 &&
        lastCouponCode &&
        lastCouponCode.length > 0
      ) {
        const couponAppliedResponse = await applyCouponCode({
          cartId,
          couponCode: lastCouponCode,
        });
        if (typeof couponAppliedResponse === "string") {
          dispatch(showNotification("error", couponAppliedResponse));
        }
        localStorage.removeItem("lastCouponCode");
      }
      const cart_id = BrowserDatabase.getItem(LAST_CART_ID_CACHE_KEY);
      if (!data) {
        try {
          const { data: requestedCartId = null } = await createCart(cart_id);
          dispatch(removeCartItems());

          if (!requestedCartId) {
            dispatch(
              showNotification(
                "error",
                __(
                  "There was an error creating your cart, please refresh the page in a little while"
                )
              )
            );

            return;
          }
          BrowserDatabase.deleteItem(LAST_CART_ID_CACHE_KEY);
          dispatch(setCartId(requestedCartId));

          if (!isSecondTry) {
            await this.getCartTotals(dispatch, requestedCartId, true);
          }
        } catch (e) {
          Logger.log(e);
        }
      } else {
        dispatch(setCartTotal(data?.total || 0))
        await this.setCartItems(dispatch, data);
        dispatch(setCartTotals(data));
      }
    } catch (e) {
      Logger.log(e);
    }
  }

  async addProductToCart(
    dispatch,
    productData,
    color,
    optionValue,
    basePrice = null,
    brand_name,
    thumbnail_url,
    url,
    itemPrice,
    searchQueryId = null,
    cartIdURL,
    liveparty
  ) {
    if (cartIdURL) dispatch(setCartId(cartIdURL));

    const {
      Cart: { cartId },
    } = getStore().getState();
    let newCartId;
    if (!cartId) {
      try {
        const cart_id = BrowserDatabase.getItem(LAST_CART_ID_CACHE_KEY);
        const { data: requestedCartId = null } = await createCart(cart_id);
        newCartId = requestedCartId;
        if (!requestedCartId) {
          dispatch(
            showNotification(
              "error",
              __(
                "There was an error creating your cart, please refresh the page in a little while"
              )
            )
          );

          return;
        }
        BrowserDatabase.deleteItem(LAST_CART_ID_CACHE_KEY);
        dispatch(setCartId(requestedCartId));
        await this.getCartTotals(dispatch, requestedCartId);
      } catch (e) {
        Logger.log(e);
      }
    }
    try {
      dispatch(processingCartRequest());
      const response = await addProductToCart({
        ...productData,
        cartId: cartId || newCartId,
        searchQueryId,
      });
      const { data } = response;
      dispatch(
        updateCartItem(
          data,
          color,
          optionValue,
          basePrice,
          brand_name,
          thumbnail_url,
          url,
          itemPrice
        )
      );
      let updateCartID = cartId || newCartId;
      await this.getCartTotals(dispatch, updateCartID);
      return (liveparty ? response  : !data ? response : null);
    } catch (e) {
      Logger.log(e);
      if (e) {
        const err = false;
        dispatch(showNotification("error", __("There was an error")));

        return err;
      }
    }

    return null;
  }

  async removeProductFromCart(dispatch, productId) {
    const {
      Cart: { cartId },
    } = getStore().getState();

    try {
      const { data } = await removeProductFromCart({ cartId, productId });

      // if 'data' in response was not true there was some error
      // catch will process that
      if (data) {
        dispatch(removeCartItem({ item_id: productId }));
        // await this.getCart(dispatch);
      }
    } catch (e) {
      Logger.log(e);
    }

    await this.getCartTotals(dispatch, cartId);
  }

  async updateProductInCart(
    dispatch,
    productId,
    qty,
    color,
    optionValue,
    basePrice = null,
    brand_name,
    thumbnail_url,
    url,
    itemPrice
  ) {
    const {
      Cart: { cartId },
    } = getStore().getState();

    try {
      const response = await updateProductInCart({ cartId, productId, qty });
      const { data } = response;

      dispatch(
        updateCartItem(
          data,
          color,
          optionValue,
          basePrice,
          brand_name,
          thumbnail_url,
          url,
          itemPrice
        )
      );
      await this.getCartTotals(dispatch, cartId);

      return !data ? response : null;
    } catch (e) {
      Logger.log(e);
    }

    return null;
  }

  async applyCouponCode(dispatch, couponCode) {
    const {
      Cart: { cartId },
    } = getStore().getState();

    try {
      const response = await applyCouponCode({ cartId, couponCode });
      if (typeof response === "string") {
        dispatch(showNotification("error", response));
        return response;
      }

      await this.getCartTotals(dispatch, cartId);
      
      if(response === null){
        dispatch(showNotification("success", __("Coupon was applied!")));
        return response;
      }

      if(response.message){
        dispatch(showNotification("success", response.message));  
      }else {
        dispatch(showNotification("success", __("Coupon was applied!")));
      }
      return response;
      
    } catch (e) {
      dispatch(
        showNotification(
          "error",
          __("The coupon code isn't valid. Verify the code and try again.")
        )
      );

      Logger.log(e);
    }
  }

  async removeCouponCode(dispatch, data={}) {
    const {
      Cart: { cartId },
    } = getStore().getState();

    try {
      dispatch(setIsCouponRequest(true));
      const resp = await removeCouponCode({ cartId, ...data });
      await this.getCartTotals(dispatch, cartId);
      dispatch(setIsCouponRequest(false));
      if(resp && typeof resp === "string") {
        dispatch(showNotification("error", resp));
      }else {
        dispatch(showNotification("success", __("Coupon was removed!")));
      }
      return resp;
    } catch (e) {
      dispatch(setIsCouponRequest(false));
      dispatch(
        showNotification(
          "error",
          __("The coupon code isn't valid. Verify the code and try again.")
        )
      );

      Logger.log(e);
    }
  }

  async getCoupon(dispatch) {
    const {
      Cart: { cartId },
    } = getStore().getState();
    try {
      const { avail_coupons } = await getCoupon(cartId);
      dispatch(setCartCoupon(avail_coupons));
      return;
    } catch (e) {
      dispatch(setCartCoupon());
      Logger.log(e);
    }
  }

  async updateSidewideCoupon(dispatch, quoteId, flag, is_guest) {
    const {
      Cart: { cartId },
    } = getStore().getState();
    try {
      dispatch(setIsCouponRequest(true));
      const Response = await siteWideCouponUpdate({ quoteId, flag, is_guest });
      if(Response) {
        await this.getCartTotals(dispatch, cartId);
      }
      if(!Response?.status){
        dispatch(showNotification("error", Response?.msg ));
      }else if(Response?.status && flag ) {
        dispatch(showNotification("success", __("Coupon was applied!")));
      } else {
        dispatch(showNotification("success", __("Coupon was removed!")));
      }
      dispatch(setIsCouponRequest(false));
      return Response;
    } catch (e) {
      dispatch(
        showNotification(
          "error",
          __("The coupon code isn't valid. Verify the code and try again.")
        )
      );
      dispatch(setIsCouponRequest(false));
      Logger.log(e);
    }
  }
  
}

export default new CartDispatcher();
