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
import {CART_ITEMS_CACHE_KEY} from "../Cart/Cart.reducer";
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
      const defaultShippingAddress = Object.values(response.data).filter(
        (address) => {
          return address.default_shipping === true;
        }
      );
      const countryCode = getCountryFromUrl();
      if (
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
        if(countryCode == "SA") {
          let items_in_cart = BrowserDatabase.getItem(CART_ITEMS_CACHE_KEY) || [];
          request.intl_vendors=null;
          let items = [];
          items_in_cart.map(item => items.push({ sku : item.sku, intl_vendor : item?.full_item_info?.cross_border ? item?.full_item_info?.international_vendor : null}));
          request.items = items;
        }
        this.estimateDefaultEddResponse(dispatch, request);
        dispatch(setCustomerDefaultShippingAddress(defaultShippingAddress[0]));
      } else if (sessionStorage.getItem("EddAddressReq")) {
        const response = sessionStorage.getItem("EddAddressRes")
          ? JSON.parse(sessionStorage.getItem("EddAddressRes"))
          : null;
        const request = JSON.parse(sessionStorage.getItem("EddAddressReq"));
        dispatch(setEddResponse(response, request));
      } else {
        if (!login) {
          const { country_code, city, area } = response.data[0];
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
          if(countryCode == "SA") {
            request.country = "SA";
            let items_in_cart = BrowserDatabase.getItem(CART_ITEMS_CACHE_KEY) || [];
            request.intl_vendors=null;
            let items = [];
            items_in_cart.map(item => items.push({ sku : item.sku, intl_vendor : item?.full_item_info?.cross_border ? item?.full_item_info?.international_vendor : null}));
            request.items = items;
          }
          this.estimateDefaultEddResponse(dispatch, request);
        } else {
          dispatch(setEddResponse(null, null));
          dispatch(setCustomerDefaultShippingAddress(null));
        }
      }
    } else if (sessionStorage.getItem("EddAddressReq")) {
      const response = sessionStorage.getItem("EddAddressRes")
        ? JSON.parse(sessionStorage.getItem("EddAddressRes"))
        : null;
      const request = JSON.parse(sessionStorage.getItem("EddAddressReq"));
      dispatch(setEddResponse(response, request));
      dispatch(setCustomerDefaultShippingAddress(null));
    } else {
      dispatch(setEddResponse(null, null));
      dispatch(setCustomerDefaultShippingAddress(null));
    }
  };
  requestCustomerData(dispatch, login = false) {
    const query = MyAccountQuery.getCustomerQuery();
    const {
      MyAccountReducer: { addressCityData = [] },
    } = getStore().getState();
    getShippingAddresses().then(async (response) => {
      if (response.data) {
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
        dispatch(
          updateCustomerDetails({
            ...stateCustomer,
            ...data,
            ...(getPhoneNumberFromCookie && {
              phone: getPhoneNumberFromCookie,
            }),
          }),
        );
        BrowserDatabase.setItem(
          {
            ...stateCustomer,
            ...data,
            ...(getPhoneNumberFromCookie && {
              phone: getPhoneNumberFromCookie,
            }),
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
    sessionStorage.removeItem("EddAddressReq");
    sessionStorage.removeItem("EddAddressRes");
    BrowserDatabase.deleteItem(ORDERS);
    BrowserDatabase.deleteItem(CUSTOMER);
    localStorage.removeItem("RmaId");
    BrowserDatabase.deleteItem("TT_Data");
    setCrossSubdomainCookie("customerPrimaryPhone", "", 1, true);
    dispatch(updateCustomerDetails({}));
    dispatch(setStoreCredit(getStoreCreditInitialState()));
    dispatch(setClubApparel(getClubApparelInitialState()));
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
    setCrossSubdomainCookie("authData", this.getCustomerData(), "90");
    this.requestCustomerData(dispatch, true);

    Event.dispatch(EVENT_GTM_GENERAL_INIT);
  }

  async signInOTP(options = {}, dispatch) {
    try {
      await this.handleMobileAuthorizationOTP(dispatch, options);
      dispatch(updateCustomerSignInStatus(true));
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
      ({ attribute_code }) => attribute_code === "contact_no",
    );
    const isPhone = phoneAttribute[0]?.value
      ? phoneAttribute[0].value.search("undefined") < 0
      : false;
    if (user?.email) {
      MOE_AddUniqueID(user?.email);
    }
    dispatch(setCartId(null));
    setMobileAuthorizationToken(token);
    setAuthorizationToken(t);
    if (isPhone) {
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
       MOE_AddUniqueID(options?.email);
    }
    const phoneAttribute = custom_attributes?.filter(
      ({ attribute_code }) => attribute_code === "contact_no",
    );
    const isPhone = phoneAttribute[0]?.value
      ? phoneAttribute[0].value.search("undefined") < 0
      : false;

    dispatch(setCartId(null));
    setMobileAuthorizationToken(token);
    options.hasOwnProperty("type") ? setAuthorizationToken(t) : null;
    if (isPhone) {
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
    setCrossSubdomainCookie("customerPrimaryPhone", phoneNumber, "30");
    dispatch(
      updateCustomerDetails({ ...customer, phone: phoneNumber, isVerified }),
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
    try {
      MobileAPI.post(`eddservice/estimate`, request).then((response) => {
        if (response.success) {
          dispatch(setEddResponseForPDP(response?.result, request));
          sessionStorage.setItem(
            "EddAddressResForPDP",
            JSON.stringify(response?.result),
          );
          sessionStorage.setItem("EddAddressReq", JSON.stringify(request));
        } else {
          dispatch(setEddResponseForPDP({}, request));
          sessionStorage.removeItem("EddAddressResForPDP");
        }
      });
    } catch (error) {
      dispatch(setEddResponseForPDP(null, request));
      sessionStorage.removeItem("EddAddressResForPDP");
    }
  }
// type --> false for call from checkout because we don't need to save this data for other pages it should be true 
  estimateEddResponse(dispatch, request, type) {
    try {
      MobileAPI.post(`eddservice/estimate`, request).then((response) => {
        if (response.success) {
          if (request["intl_vendors"]) {
            dispatch(setIntlEddResponse(response?.result));
          } else {
            dispatch(setEddResponse(response?.result, request));
          }
          if (type) {
            if (request["intl_vendors"]) {
              sessionStorage.setItem(
                "IntlEddAddressRes",
                JSON.stringify(response.result),
              );
            } else {
              sessionStorage.setItem("EddAddressReq", JSON.stringify(request));
              sessionStorage.setItem(
                "EddAddressRes",
                JSON.stringify(response.result),
              );
            }
          }
        } else {
          if (request["intl_vendors"]) {
            dispatch(setIntlEddResponse({}));
            sessionStorage.removeItem("IntlEddAddressRes");
          } else {
            dispatch(setEddResponse({}, request));
            sessionStorage.removeItem("EddAddressReq");
            sessionStorage.removeItem("EddAddressRes");
          }
        }
      });
    } catch (error) {
      if (request["intl_vendors"]) {
        dispatch(setIntlEddResponse(null));
        sessionStorage.removeItem("IntlEddAddressRes");
      } else {
        dispatch(setEddResponse(null, request));
        sessionStorage.removeItem("EddAddressReq");
        sessionStorage.removeItem("EddAddressRes");
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
      custom_attributes: {
        contact_no: phone,
        dob,
      },
    };

    dispatch(updateCustomerDetails({ ...data, ...mappedData }));

    // eslint-disable-next-line
    return updateCustomerData(mappedData);
  }
}

export default new MyAccountDispatcher();