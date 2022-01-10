import { getStore } from "Store";
import {
  processingCartRequest,
  removeCartItem,
  removeCartItems,
  setCartId,
  setCartTotals,
  updateCartItem,
  setCheckoutDetails,
} from "Store/Cart/Cart.action";
import { showNotification } from "Store/Notification/Notification.action";
import {
  addProductToCart,
  applyCouponCode,
  createCart,
  getCart,
  removeCouponCode,
  removeProductFromCart,
  updateProductInCart,
} from "Util/API/endpoint/Cart/Cart.enpoint";
import BrowserDatabase from "Util/BrowserDatabase";
import Logger from "Util/Logger";
import { LAST_CART_ID_CACHE_KEY } from "../MobileCart/MobileCart.reducer";
export const GUEST_QUOTE_ID = "guest_quote_id";

export class CartDispatcher {
  async setCheckoutStep(dispatch, checkoutDetails = false) {
    dispatch(setCheckoutDetails(checkoutDetails));
  }

  async getCart(dispatch, isNewCart = false) {
    const {
      Cart: { cartId },
    } = getStore().getState();
    console.log("get cart called (store cart id)", cartId)
    const cart_id = BrowserDatabase.getItem(LAST_CART_ID_CACHE_KEY);
    console.log("get cart called (last cart id)", cart_id)
    if (!cartId || isNewCart) {
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
      await this.getCartTotals(dispatch, cartId);
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
    try {
      dispatch(processingCartRequest());
      const { data } = await getCart(cartId);
      const cart_id = BrowserDatabase.getItem(LAST_CART_ID_CACHE_KEY);
      console.log("get cart totals (store cart id )", cartId)
      console.log("get cart totals (last cart id )", cart_id)
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
    searchQueryId = null
  ) {
    const {
      Cart: { cartId },
    } = getStore().getState();
    try {
      dispatch(processingCartRequest());
      const response = await addProductToCart({
        ...productData,
        cartId,
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
      await this.getCartTotals(dispatch, cartId);

      return !data ? response : null;
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
        return;
      }

      await this.getCartTotals(dispatch, cartId);
      dispatch(showNotification("success", __("Coupon was applied!")));
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

  async removeCouponCode(dispatch, couponCode) {
    const {
      Cart: { cartId },
    } = getStore().getState();

    try {
      await removeCouponCode({ cartId, couponCode });
      await this.getCartTotals(dispatch, cartId);

      dispatch(showNotification("success", __("Coupon was removed!")));
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
}

export default new CartDispatcher();
