import MyAccountQuery from "Query/MyAccount.query";
import VueIntegrationQueries from "Query/vueIntegration.query";
import {
  updateCustomerDetails,
  updateCustomerSignInStatus,
} from "SourceStore/MyAccount/MyAccount.action";
import {
  setCustomerAddressData,
  setCustomerDefaultShippingAddress,
  setEddResponse,
  setEddResponseForPDP,
  setIntlEddResponse,
  setDefaultEddAddress,
  setCitiesData,
  setAddressLoader,
  setVueTrendingBrandsBannerActive,
  setUserIdForVueTrendingBrands,
  setSignInIsLoading,
  setExpressServicable,
  setSelectedCityArea,
  setExpressCutOffTime,
  setisExpressPopUpOpen,
  setisExpressPLPAddressForm,
} from "Store/MyAccount/MyAccount.action";
import {
  CUSTOMER,
  MyAccountDispatcher as SourceMyAccountDispatcher,
  ONE_MONTH_IN_SECONDS,
} from "SourceStore/MyAccount/MyAccount.dispatcher";
import { removeCartItems, setCartId } from "Store/Cart/Cart.action";
import CartDispatcher from "Store/Cart/Cart.dispatcher";
import { setClubApparel } from "Store/ClubApparel/ClubApparel.action";
import ClubApparelDispatcher from "Store/ClubApparel/ClubApparel.dispatcher";
import { getInitialState as getClubApparelInitialState } from "Store/ClubApparel/ClubApparel.reducer";
import { ORDERS } from "Store/Order/Order.reducer";
import { setStoreCredit } from "Store/StoreCredit/StoreCredit.action";
import StoreCreditDispatcher from "Store/StoreCredit/StoreCredit.dispatcher";
import { getInitialState as getStoreCreditInitialState } from "Store/StoreCredit/StoreCredit.reducer";
import WishlistDispatcher from "Store/Wishlist/Wishlist.dispatcher";
import AppConfigDispatcher from "Store/AppConfig/AppConfig.dispatcher";
import MobileAPI from "Util/API/provider/MobileAPI";
import {
  getMobileApiAuthorizationToken,
  getOrders,
  resetPassword,
  resetPasswordWithToken,
  updateCustomerData,
  expressServicable,
  cutOffTime,
} from "Util/API/endpoint/MyAccount/MyAccount.enpoint";
import { getShippingAddresses } from "Util/API/endpoint/Checkout/Checkout.endpoint";
import {
  deleteAuthorizationToken,
  deleteMobileAuthorizationToken,
  getAuthorizationToken,
  getMobileAuthorizationToken,
  getUUID,
  setAuthorizationToken,
  setMobileAuthorizationToken,
} from "Util/Auth";
import { getStore } from "Store";
import BrowserDatabase from "Util/BrowserDatabase";
import Event, {
  EVENT_GTM_GENERAL_INIT,
  VUE_PAGE_VIEW,
  MOE_AddUniqueID,
  MOE_destroySession,
  MOE_addUserAttribute,
  VIP_CUSTOMER,
} from "Util/Event";
import { prepareQuery } from "Util/Query";
import { executePost, fetchMutation } from "Util/Request";
import { setCrossSubdomainCookie } from "Util/Url/Url";
import { updateGuestUserEmail } from "./MyAccount.action";
import Wishlist from "Store/Wishlist/Wishlist.dispatcher";
import { isArabic } from "Util/App";
import { sha256 } from "js-sha256";
import { getCookie } from "Util/Url/Url";
import { showNotification } from "Store/Notification/Notification.action";
export {
  CUSTOMER,
  ONE_MONTH_IN_SECONDS,
} from "SourceStore/MyAccount/MyAccount.dispatcher";
export const RESET_EMAIL = "RESET_EMAIL";
export const CART_ID_CACHE_KEY = "CART_ID_CACHE_KEY";
import { getCountryFromUrl } from "Util/Url";
import { CART_ITEMS_CACHE_KEY } from "../Cart/Cart.reducer";
import MagentoAPI from "Util/API/provider/MagentoAPI";
export class MyAccountDispatcher extends SourceMyAccountDispatcher {
  getArabicCityArea = (city, area, addressCityData) => {
    let finalArea = area;
    let finalCity = city;
    if (
      isArabic() &&
      addressCityData &&
      Object.values(addressCityData).length > 0
    ) {
      let finalResp = Object.values(addressCityData).filter((cityData) => {
        return cityData.city === city;
      });
      if (finalResp.length > 0) {
        let engAreaIndex = Object.keys(finalResp[0].areas).filter((key) => {
          if (finalResp[0].areas[key] === area) {
            return key;
          }
        });
        let arabicArea = Object.values(finalResp[0].areas_ar).filter(
          (area, index) => {
            if (index === parseInt(engAreaIndex[0])) {
              return area;
            }
          },
        );
        finalArea = arabicArea[0];
        finalCity = finalResp[0].city_ar;
      }
    }
    return { finalArea, finalCity };
  };
  setEDDresultData = (response, finalRes, dispatch, login) => {
    if (response.data && Object.values(response.data).length > 0 && finalRes && finalRes.length > 0) {
      const {
        AppConfig: { edd_info = {}, isExpressDelivery = false, vwoData = {}, isNewCheckoutPageEnable = false },
      } = getStore().getState();
      const defaultShippingAddress = Object.values(response.data).filter(
        (address) => {
          return address.default_shipping === true;
        }
      );
      const countryCode = getCountryFromUrl();

      if (localStorage.getItem("EddAddressReq") && ((isExpressDelivery && vwoData?.Express?.isFeatureEnabled) || isNewCheckoutPageEnable)) {
        const request = JSON.parse(localStorage.getItem("EddAddressReq"));
        dispatch(
          setCustomerDefaultShippingAddress(defaultShippingAddress?.[0])
        );
        let payload = {};

        if (edd_info.has_item_level) {
          let items_in_cart = BrowserDatabase.getItem(CART_ITEMS_CACHE_KEY);
          request.intl_vendors = null;
          let items = [];
          items_in_cart?.map((item) => {
            if (
              !(
                item &&
                item.full_item_info &&
                item.full_item_info.cross_border &&
                !edd_info?.has_cross_border_enabled
              )
            ) {
              payload = {
                sku: item.sku,
                intl_vendor:
                  item?.full_item_info?.cross_border &&
                  edd_info.international_vendors &&
                  item.full_item_info.international_vendor &&
                  edd_info.international_vendors.indexOf(
                    item.full_item_info.international_vendor
                  ) > -1
                    ? item?.full_item_info?.international_vendor
                    : null,
              };
              payload["qty"] = parseInt(item?.full_item_info?.available_qty);
              payload["cross_border_qty"] = parseInt(
                item?.full_item_info?.cross_border_qty
              )
                ? parseInt(item?.full_item_info?.cross_border_qty)
                : "";
              payload["brand"] = item?.full_item_info?.brand_name;
              items.push(payload);
            }
          });
          request.items = items;
          if (items.length) {
            this.estimateEddResponse(dispatch, request, true);
          }
        }
      } else if (
        defaultShippingAddress &&
        Object.values(defaultShippingAddress).length > 0 && defaultShippingAddress[0]["country_code"] && countryCode == defaultShippingAddress[0]["country_code"]
      ) {
        const { country_code, city, area } = defaultShippingAddress[0];
        const { finalCity, finalArea } = this.getArabicCityArea(
          city,
          area,
          finalRes
        );
        let request = {
          country: country_code,
          city: isArabic() ? finalCity : city,
          area: isArabic() ? finalArea : area,
          courier: null,
          source: null,
        };
        let payload = {};
        if(edd_info.has_item_level) {
          let items_in_cart = BrowserDatabase.getItem(CART_ITEMS_CACHE_KEY) || [];
          request.intl_vendors=null;
          let items = [];
          items_in_cart.map(item => {
            if(!(item && item.full_item_info && item.full_item_info.cross_border && !edd_info?.has_cross_border_enabled)) {
              payload = { sku : item.sku, intl_vendor : edd_info.international_vendors && item.full_item_info.international_vendor && edd_info.international_vendors.indexOf(item.full_item_info.international_vendor)>-1 ? item?.full_item_info?.international_vendor : null}
              payload["qty"] = parseInt(item?.full_item_info?.available_qty);
              payload["cross_border_qty"] = parseInt(item?.full_item_info?.cross_border_qty) ? parseInt(item?.full_item_info?.cross_border_qty): "";
              payload["brand"] = item?.full_item_info?.brand_name;
              items.push(payload);
            }
          });
          request.items = items;
          if(items.length) this.estimateDefaultEddResponse(dispatch, request);
        } else {
          this.estimateDefaultEddResponse(dispatch, request);
        }
        dispatch(setCustomerDefaultShippingAddress(defaultShippingAddress[0]));
      } else if (localStorage.getItem("EddAddressReq")) {
        const response = localStorage.getItem("EddAddressRes")
          ? JSON.parse(localStorage.getItem("EddAddressRes"))
          : null;
        const request = JSON.parse(localStorage.getItem("EddAddressReq"));
        dispatch(setEddResponse(response, request));
      } else {
        if (!login) {
          const { country_code, city, area } = response.data[0];
          const countryCode = getCountryFromUrl();
          if(countryCode == country_code){
            const { finalCity, finalArea } = this.getArabicCityArea(
              city,
              area,
              finalRes
            );
            let request = {
              country: country_code,
              city: isArabic() ? finalCity : city,
              area: isArabic() ? finalArea : area,
              courier: null,
              source: null,
            };
            let payload = {};
            if(edd_info.has_item_level) {
              request.country = "SA";
              let items_in_cart = BrowserDatabase.getItem(CART_ITEMS_CACHE_KEY) || [];
              request.intl_vendors=null;
              let items = [];
              items_in_cart.map(item => {
                if(!(item && item.full_item_info && item.full_item_info.cross_border && !edd_info?.has_cross_border_enabled)) {
                  payload = { sku : item.sku, intl_vendor : edd_info.international_vendors && item.full_item_info.international_vendor && edd_info.international_vendors.indexOf(item.full_item_info.international_vendor)>-1 ? item?.full_item_info?.international_vendor : null}
                  payload["qty"] = parseInt(item?.full_item_info?.available_qty);
                  payload["cross_border_qty"] = parseInt(item?.full_item_info?.cross_border_qty) ? parseInt(item?.full_item_info?.cross_border_qty): "";
                  payload["brand"] = item?.full_item_info?.brand_name;
                  items.push(payload);
                }
              });
              request.items = items;
              if(items.length) this.estimateDefaultEddResponse(dispatch, request);
            } else {
              this.estimateDefaultEddResponse(dispatch, request);
            }
          }
        } else {
          dispatch(setEddResponse(null, null));
          dispatch(setCustomerDefaultShippingAddress(null));
        }
      }
    } else if (localStorage.getItem("EddAddressReq")) {
      const response = localStorage.getItem("EddAddressRes")
        ? JSON.parse(localStorage.getItem("EddAddressRes"))
        : null;
      const request = JSON.parse(localStorage.getItem("EddAddressReq"));
      dispatch(setEddResponse(response, request));
      dispatch(setCustomerDefaultShippingAddress(null));
    } else {
      dispatch(setEddResponse(null, null));
      dispatch(setCustomerDefaultShippingAddress(null));
    }
  };
  async requestCustomerData(dispatch, login = false) {
    const query = MyAccountQuery.getCustomerQuery();
    const {
      MyAccountReducer: { addressCityData = [], newAddressSaved = false },
      AppConfig: { isExpressDelivery = false, vwoData = {}, isNewCheckoutPageEnable = false },
    } = getStore().getState();

    const country_code = getCountryFromUrl();

    if (!localStorage.getItem("EddAddressReq") && (isExpressDelivery || isNewCheckoutPageEnable)) {
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
            localStorage.setItem("EddAddressReq", JSON.stringify(requestObj));
            localStorage.setItem(
              "currentSelectedAddress",
              JSON.stringify(response?.data)
            );
          }
        }
      );
    }

    getShippingAddresses().then(async (response) => {
      if (response.data) {
        if (newAddressSaved && (isExpressDelivery || isNewCheckoutPageEnable)) {
          let countryWiseAddresses = response?.data?.filter(
            (obj) => obj?.country_code === getCountryFromUrl()
          );
          let newlyAddedAddress = countryWiseAddresses?.[countryWiseAddresses.length-1];
          const {country_code = "", city = "", area = "" } = newlyAddedAddress;
          let requestObj = {
            country: country_code,
            city: city,
            area: area,
            courier: null,
            source: null,
          };
          localStorage.setItem("EddAddressReq", JSON.stringify(requestObj));
            localStorage.setItem(
              "currentSelectedAddress",
              JSON.stringify(newlyAddedAddress)
            );
            this.selectedCityArea(dispatch, newlyAddedAddress);
            this.expressPopUpOpen(dispatch, false);
        }
        if (addressCityData.length === 0) {
          AppConfigDispatcher.getCities().then((resp) => {
            this.setEDDresultData(response, resp.data, dispatch, login);
          });
        } else {
          this.setEDDresultData(response, addressCityData, dispatch, login);
        }
        dispatch(setCustomerAddressData(response.data));
        dispatch(setAddressLoader(false));
      }
    });
    const stateCustomer = BrowserDatabase.getItem(CUSTOMER) || {};
    if (stateCustomer.id) {
      dispatch(updateCustomerDetails(stateCustomer));
    }

    return executePost(prepareQuery([query])).then(
      ({ customer }) => {
        const { firstname = "", lastname } = customer;
        const data = {
          ...customer,
          firstname:
            firstname.indexOf(" ") > 0
              ? firstname.substr(0, firstname.indexOf(" "))
              : firstname,
          lastname:
            firstname.indexOf(" ") > 0
              ? firstname.substr(firstname.indexOf(" ") + 1)
              : lastname,
        };
        const customer_data = { ...stateCustomer, ...data };
        const getPhoneNumberFromCookie = getCookie("customerPrimaryPhone")
          ? getCookie("customerPrimaryPhone")
          : null;
        const isVipCustomer = getCookie("isTopTierCustomer")
          ? getCookie("isTopTierCustomer")
          : null;
        dispatch(
          updateCustomerDetails({
            ...stateCustomer,
            ...data,
            ...(getPhoneNumberFromCookie && {
              phone: getPhoneNumberFromCookie,
            }),
            ...(isVipCustomer && {
              vipCustomer: isVipCustomer,
            })
          }),
        );
        BrowserDatabase.setItem(
          {
            ...stateCustomer,
            ...data,
            ...(getPhoneNumberFromCookie && {
              phone: getPhoneNumberFromCookie,
            }),
            ...(isVipCustomer && {
              vipCustomer: isVipCustomer,
            })
          },
          CUSTOMER,
          ONE_MONTH_IN_SECONDS,
        );
        const TiktokData = {
          mail: customer_data?.email ? sha256(customer_data?.email) : null,
          phone: customer_data?.phone
            ? sha256(customer_data?.phone)
            : getPhoneNumberFromCookie
            ? sha256(getPhoneNumberFromCookie)
            : null,
        };
        BrowserDatabase.setItem(TiktokData, "TT_Data", ONE_MONTH_IN_SECONDS);
        //after login dispatching custom event
        const loginEvent = new CustomEvent("userLogin");
        window.dispatchEvent(loginEvent);
        const customerData = BrowserDatabase.getItem("customer");
        const userID = customerData && customerData.id ? customerData.id : null;
        const locale = VueIntegrationQueries.getLocaleFromUrl();
        VueIntegrationQueries.vueAnalayticsLogger({
          event_name: VUE_PAGE_VIEW,
          params: {
            event: VUE_PAGE_VIEW,
            pageType: "menu",
            currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
            clicked: Date.now(),
            uuid: getUUID(),
            referrer: window.location.href,
            url: window.location.href,
            userID: userID,
          },
        });
      },
      () => {
        window.location.reload();
      },
    );
  }

  logout(_, dispatch) {
    dispatch(updateCustomerSignInStatus(false));
    dispatch(setSignInIsLoading(false));
    // dispatch(updateGuestUserEmail(""));
    deleteAuthorizationToken();
    deleteMobileAuthorizationToken();
    dispatch(showNotification("success", __("You have been logged out")));
    dispatch(setCartId(null));
    dispatch(removeCartItems());
    dispatch(setCustomerDefaultShippingAddress(null));
    dispatch(setEddResponse(null, null));
    dispatch(setDefaultEddAddress(null, null));
    dispatch(setCustomerAddressData([]));
    CartDispatcher.getCart(dispatch);
    WishlistDispatcher.updateInitialWishlistData(dispatch);
    localStorage.removeItem("EddAddressReq");
    localStorage.removeItem("currentSelectedAddress");
    localStorage.removeItem("EddAddressRes");
    BrowserDatabase.deleteItem(ORDERS);
    BrowserDatabase.deleteItem(CUSTOMER);
    localStorage.removeItem("RmaId");
    BrowserDatabase.deleteItem("TT_Data");
    setCrossSubdomainCookie("customerPrimaryPhone", "", 1, true);
    setCrossSubdomainCookie("isTopTierCustomer", "", 1, true);
    dispatch(updateCustomerDetails({}));
    dispatch(setStoreCredit(getStoreCreditInitialState()));
    dispatch(setClubApparel(getClubApparelInitialState()));
    dispatch(setUserIdForVueTrendingBrands(null));
    dispatch(setVueTrendingBrandsBannerActive(false));
    setCrossSubdomainCookie("authData", "", 1, true);
    Event.dispatch(EVENT_GTM_GENERAL_INIT);
    MOE_destroySession();

    //after logout dispatching custom event
    const loginEvent = new CustomEvent("userLogout");
    window.dispatchEvent(loginEvent);
  }

  /**
   * Create account action
   * @param {{customer: Object, password: String}} [options={}]
   * @memberof MyAccountDispatcher
   */

  async createAccountNew(options) {
    return await MobileAPI.post(`/register`, options);
  }
  async loginAccount(options) {
    return await MobileAPI.post("/login", options);
  }

  async getCitiesData(dispatch) {
    try {
      let finalRes = await AppConfigDispatcher.getCities();
      dispatch(setCitiesData(finalRes?.data));
    } catch (error) {
      dispatch(setCitiesData([]));
    }
  }

  async resetUserPassword(options) {
    return await MobileAPI.put("/customers/me/password", options);
  }

  async signInCommonBlock(dispatch) {
    const wishlistItem = localStorage.getItem("Wishlist_Item");
    if (wishlistItem) {
      await Wishlist.addSkuToWishlist(dispatch, wishlistItem);
      localStorage.removeItem("Wishlist_Item");
    }
    await WishlistDispatcher.updateInitialWishlistData(dispatch);
    await StoreCreditDispatcher.getStoreCredit(dispatch);
    setCrossSubdomainCookie("authData", this.getCustomerData(), "365");
    this.requestCustomerData(dispatch, true);

    Event.dispatch(EVENT_GTM_GENERAL_INIT);
  }

  async signInOTP(options = {}, dispatch) {
    try {
      await this.handleMobileAuthorizationOTP(dispatch, options);
      dispatch(updateCustomerSignInStatus(true));
      dispatch(setSignInIsLoading(true));
      this.signInCommonBlock(dispatch);
      return true;
    } catch ([e]) {
      deleteAuthorizationToken();
      deleteMobileAuthorizationToken();
      throw e;
    }
  }
  async signIn(options = {}, dispatch) {
    if (options.hasOwnProperty("type")) {
      try {
        await this.handleMobileAuthorization(dispatch, options);
        dispatch(updateCustomerSignInStatus(true));
        dispatch(setSignInIsLoading(true));
        this.signInCommonBlock(dispatch);
        return true;
      } catch ([e]) {
        deleteAuthorizationToken();
        deleteMobileAuthorizationToken();
        throw e;
      }
    } else {
      const mutation = MyAccountQuery.getSignInMutation(options);
      try {
        const result = await fetchMutation(mutation);
        const {
          generateCustomerToken: { token },
        } = result;
        setAuthorizationToken(token);

        await this.handleMobileAuthorization(dispatch, options);
        dispatch(updateCustomerSignInStatus(true));
        dispatch(setSignInIsLoading(true));

        this.signInCommonBlock(dispatch);
        return true;
      } catch ([e]) {
        deleteAuthorizationToken();
        deleteMobileAuthorizationToken();

        throw e;
      }
    }
  }

  getCustomerData() {
    const mobileToken = getMobileAuthorizationToken();
    const authToken = getAuthorizationToken();

    if (mobileToken && authToken) {
      const params = `mobileToken=${mobileToken}&authToken=${authToken}`;

      return btoa(params);
    }

    return "";
  }
  // handleMobileAuthCommonBlockOTP(){}

  async handleMobileAuthorizationOTP(dispatch, options) {
    const {
      data: { token, t, user, user: { custom_attributes, gender, id } } = {},
    } = options;
    const phoneAttribute = custom_attributes?.filter(
      ({ attribute_code }) => attribute_code === "contact_no"
    );
    const topTierAttribute = custom_attributes?.filter(
      ({ attribute_code }) => attribute_code === "top_tier_customer"
    );
    const vipCustomer =
      topTierAttribute[0] && topTierAttribute[0]?.value == 1
        ? topTierAttribute[0]?.value
        : "";
    const isPhone = phoneAttribute[0]?.value
      ? phoneAttribute[0].value.search("undefined") < 0
      : false;
    if (user?.email) {
      MOE_AddUniqueID(user?.email?.toLowerCase());
    }
    if (vipCustomer) {
      MOE_addUserAttribute(VIP_CUSTOMER, true);
    } else {
      MOE_addUserAttribute(VIP_CUSTOMER, false);
    }
    dispatch(setCartId(null));
    setMobileAuthorizationToken(token);
    setAuthorizationToken(t);
    if (isPhone || vipCustomer) {
      this.setCustomAttributes(dispatch, custom_attributes);
    }

    this.setGender(dispatch, gender);

    // Run async as Club Apparel is not visible anywhere after login
    ClubApparelDispatcher.getMember(dispatch, id);

    // Temporarily disabled art merge logic
    // const { Cart: { cartItems: oldCartItems = [] } } = getStore().getState();
    // if (oldCartItems.length !== 0) {
    //     await CartDispatcher.getCart(dispatch);
    //     this._addProductsFromGuest(dispatch, oldCartItems);
    //     return;
    // }
    dispatch(removeCartItems());

    // Run async otherwise login gets slow
    CartDispatcher.getCart(dispatch);
  }

  // handleMobileAuthCommonBlock(){}
  async handleMobileAuthorization(dispatch, options) {
    const { email: username, password } = options;
    const { data: { token, t, user: { custom_attributes, gender, id } } = {} } =
      await getMobileApiAuthorizationToken(
        options.hasOwnProperty("type")
          ? options
          : {
            username,
            password,
            cart_id: BrowserDatabase.getItem(CART_ID_CACHE_KEY),
          }
      );
    if (options?.email){
       MOE_AddUniqueID(options?.email?.toLowerCase());
    }
    const topTierAttribute = custom_attributes?.filter(
      ({ attribute_code }) => attribute_code === "top_tier_customer"
    );
    const vipCustomer =
      topTierAttribute[0] && topTierAttribute[0]?.value == 1
        ? topTierAttribute[0]?.value
        : "";
    const phoneAttribute = custom_attributes?.filter(
      ({ attribute_code }) => attribute_code === "contact_no",
    );
    const isPhone = phoneAttribute[0]?.value
      ? phoneAttribute[0].value.search("undefined") < 0
      : false;
    if (vipCustomer) {
      MOE_addUserAttribute(VIP_CUSTOMER, true);
    } else {
      MOE_addUserAttribute(VIP_CUSTOMER, false);
    }
    dispatch(setCartId(null));
    dispatch(setUserIdForVueTrendingBrands(id));
    setMobileAuthorizationToken(token);
    options.hasOwnProperty("type") ? setAuthorizationToken(t) : null;
    if (isPhone || vipCustomer) {
      this.setCustomAttributes(dispatch, custom_attributes);
    }

    this.setGender(dispatch, gender);

    // Run async as Club Apparel is not visible anywhere after login
    ClubApparelDispatcher.getMember(dispatch, id);

    // Temporarily disabled art merge logic
    // const { Cart: { cartItems: oldCartItems = [] } } = getStore().getState();
    // if (oldCartItems.length !== 0) {
    //     await CartDispatcher.getCart(dispatch);
    //     this._addProductsFromGuest(dispatch, oldCartItems);
    //     return;
    // }
    dispatch(removeCartItems());

    // Run async otherwise login gets slow
    CartDispatcher.getCart(dispatch);
  }

  _addProductsFromGuest(dispatch, oldCartItems) {
    oldCartItems.forEach((product) => {
      const {
        full_item_info,
        full_item_info: { size_option },
        color,
        optionValue,
        basePrice,
        brand_name,
        thumbnail_url,
        url,
        itemPrice,
      } = product;

      CartDispatcher.addProductToCart(
        dispatch,
        { ...full_item_info, optionId: size_option, optionValue },
        color,
        optionValue,
        basePrice,
        brand_name,
        thumbnail_url,
        url,
        itemPrice,
      );
    });
  }

  setCustomAttributes(dispatch, custom_attributes) {
    const customer = BrowserDatabase.getItem(CUSTOMER) || {};
    const phoneAttribute = custom_attributes.filter(
      ({ attribute_code }) => attribute_code === "contact_no",
    );
    const isVerifiedAttribute = custom_attributes.filter(
      ({ attribute_code }) => attribute_code === "is_mobile_otp_verified",
    );
    const { value: phoneNumber } =
      phoneAttribute && phoneAttribute[0] ? phoneAttribute[0] : null;
    const { value: isVerified } =
      isVerifiedAttribute && isVerifiedAttribute[0]
        ? isVerifiedAttribute[0]
        : { value: false };
    const topTierAttribute = custom_attributes?.filter(
      ({ attribute_code }) => attribute_code === "top_tier_customer"
    );
    const { value: vipCustomer } =
      topTierAttribute && topTierAttribute[0]?.value == 1
        ? topTierAttribute[0]
        : { value: "" };
    setCrossSubdomainCookie("customerPrimaryPhone", phoneNumber, "365");
    setCrossSubdomainCookie("isTopTierCustomer", vipCustomer, "365");
    dispatch(
      updateCustomerDetails({
        ...customer,
        phone: phoneNumber,
        vipCustomer,
        isVerified,
      })
    );
  }

  setGender(dispatch, gender) {
    const customer = BrowserDatabase.getItem(CUSTOMER) || {};

    dispatch(updateCustomerDetails({ ...customer, gender }));
  }

  setGuestUserEmail(dispatch, email) {
    dispatch(updateGuestUserEmail(email));
  }
  estimateEddResponseForPDP(dispatch, request){
    const {
      AppConfig: { isExpressDelivery = false, vwoData = {} },
    } = getStore().getState();

    if (isExpressDelivery && vwoData?.Express?.isFeatureEnabled) {
      let reqOBJ = JSON.parse(localStorage.getItem("EddAddressReq"));

      request.city = reqOBJ?.city ? reqOBJ?.city : request?.city;
      request.area = reqOBJ?.area ? reqOBJ?.area : request?.area;
      request.country = reqOBJ?.country ? reqOBJ?.country : request?.country;
    }

    try {
      MobileAPI.post(`eddservice/estimate`, request).then((response) => {
        if (response.success) {
          dispatch(setEddResponseForPDP(response?.result, request));
          localStorage.setItem(
            "EddAddressResForPDP",
            JSON.stringify(response?.result),
          );
          localStorage.setItem("EddAddressReq", JSON.stringify(request));
        } else {
          dispatch(setEddResponseForPDP({}, request));
          localStorage.removeItem("EddAddressResForPDP");
        }
      });
    } catch (error) {
      dispatch(setEddResponseForPDP(null, request));
      localStorage.removeItem("EddAddressResForPDP");
    }
  }
// type --> false for call from checkout because we don't need to save this data for other pages it should be true 
  async estimateEddResponse(dispatch, request, type) {
    const {
      AppConfig: { isExpressDelivery = false, vwoData = {}, isNewCheckoutPageEnable = false },
    } = getStore().getState();
    
    if ((isExpressDelivery && vwoData?.Express?.isFeatureEnabled) || isNewCheckoutPageEnable) {
      let reqOBJ = JSON.parse(localStorage.getItem("EddAddressReq"));

      request.city = reqOBJ?.city ? reqOBJ?.city : request?.city;
      request.area = reqOBJ?.area ? reqOBJ?.area : request?.area;
      request.country = reqOBJ?.country ? reqOBJ?.country : request?.country;
    }

    try {
      await MobileAPI.post(`eddservice/estimate`, request).then((response) => {
        if (response.success) {
          if (request["intl_vendors"]) {
            dispatch(setIntlEddResponse(response?.result));
          } else {
            dispatch(setEddResponse(response?.result, request));
          }
          if (type) {
            if (request["intl_vendors"]) {
              localStorage.setItem(
                "IntlEddAddressRes",
                JSON.stringify(response.result),
              );
            } else {
              localStorage.setItem("EddAddressReq", JSON.stringify(request));
              localStorage.setItem(
                "EddAddressRes",
                JSON.stringify(response.result),
              );
            }
          }
        } else {
          if (request["intl_vendors"]) {
            dispatch(setIntlEddResponse({}));
            localStorage.removeItem("IntlEddAddressRes");
          } else if ((!isExpressDelivery && !vwoData?.Express?.isFeatureEnabled) || !isNewCheckoutPageEnable) {
            //adding express condition bcz if edd api throws error then this block can't remove EddAddressReq
            dispatch(setEddResponse({}, request));
            localStorage.removeItem("EddAddressReq");
            localStorage.removeItem("EddAddressRes");
          }
        }
      });
    } catch (error) {
      if (request["intl_vendors"]) {
        dispatch(setIntlEddResponse(null));
        localStorage.removeItem("IntlEddAddressRes");
      } else {
        dispatch(setEddResponse(null, request));
        localStorage.removeItem("EddAddressReq");
        localStorage.removeItem("EddAddressRes");
      }
    }
  }

  estimateDefaultEddResponse(dispatch, request) {
    try {
      MobileAPI.post(`eddservice/estimate`, request).then((response) => {
        if (response.success) {
          dispatch(setEddResponse(response.result, request));
          dispatch(setDefaultEddAddress(response.result, request));
        } else {
          dispatch(setEddResponse(response.errorMessage, request));
          dispatch(setDefaultEddAddress(response.errorMessage, request));
        }
      });
    } catch (error) {
      dispatch(setEddResponse(null, request));
      dispatch(setDefaultEddAddress(null, request));
    }
  }

  forgotPassword(dispatch, options = {}) {
    const { email } = options;

    BrowserDatabase.setItem(email, RESET_EMAIL, ONE_MONTH_IN_SECONDS);

    return resetPassword({ email });
  }

  resetPassword(data) {
    return resetPasswordWithToken({ ...data, email: "" });
  }

  async getOrders(limit, offset) {
    return getOrders(limit, offset);
  }

  updateCustomerData(dispatch, data) {
    const { fullname, gender, email, phone, dob } = data;

    const mappedData = {
      firstname: fullname,
      email,
      gender,
      dob,
      custom_attributes: {
        contact_no: phone,
      },
    };

    dispatch(updateCustomerDetails({ ...data, ...mappedData }));

    // eslint-disable-next-line
    return updateCustomerData(mappedData);
  }

  async expressService(dispatch, data) {
    const response = await expressServicable(data);

    if (response) {
      dispatch(setExpressServicable(response));
    }
  }

  selectedCityArea(dispatch, data) {
    dispatch(setSelectedCityArea(data));
  }

  async expressCutOffTime(dispatch) {
    const response = await cutOffTime();
    if (response) {
      dispatch(setExpressCutOffTime(response));
    }
  }

  expressPopUpOpen(dispatch, val) {
    dispatch(setisExpressPopUpOpen(val));
  }

  setExpressPLPAddressForm(dispatch, val) {
    dispatch(setisExpressPLPAddressForm(val));
  }
}

export default new MyAccountDispatcher();