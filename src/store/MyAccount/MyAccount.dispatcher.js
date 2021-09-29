import MyAccountQuery from "Query/MyAccount.query";
import VueIntegrationQueries from "Query/vueIntegration.query";
import {
  updateCustomerDetails,
  updateCustomerSignInStatus,
} from "SourceStore/MyAccount/MyAccount.action";
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
import { showNotification } from "Store/Notification/Notification.action";
import { ORDERS } from "Store/Order/Order.reducer";
import { setStoreCredit } from "Store/StoreCredit/StoreCredit.action";
import StoreCreditDispatcher from "Store/StoreCredit/StoreCredit.dispatcher";
import { getInitialState as getStoreCreditInitialState } from "Store/StoreCredit/StoreCredit.reducer";
import WishlistDispatcher from "Store/Wishlist/Wishlist.dispatcher";
import {
  getMobileApiAuthorizationToken,
  getOrders,
  resetPassword,
  resetPasswordWithToken,
  updateCustomerData,
} from "Util/API/endpoint/MyAccount/MyAccount.enpoint";
import {
  deleteAuthorizationToken,
  deleteMobileAuthorizationToken,
  getAuthorizationToken,
  getMobileAuthorizationToken,
  getUUID,
  setAuthorizationToken,
  setMobileAuthorizationToken,
} from "Util/Auth";
import BrowserDatabase from "Util/BrowserDatabase";
import Event, { EVENT_GTM_GENERAL_INIT, VUE_PAGE_VIEW } from "Util/Event";
import { prepareQuery } from "Util/Query";
import { executePost, fetchMutation } from "Util/Request";
import { setCrossSubdomainCookie } from "Util/Url/Url";
import { updateGuestUserEmail } from "./MyAccount.action";

export {
  CUSTOMER,
  ONE_MONTH_IN_SECONDS,
} from "SourceStore/MyAccount/MyAccount.dispatcher";
export const RESET_EMAIL = "RESET_EMAIL";
export const CART_ID_CACHE_KEY = "CART_ID_CACHE_KEY";
export class MyAccountDispatcher extends SourceMyAccountDispatcher {
  requestCustomerData(dispatch) {
    const query = MyAccountQuery.getCustomerQuery();

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

        dispatch(updateCustomerDetails({ ...stateCustomer, ...data }));
        BrowserDatabase.setItem(
          { ...stateCustomer, ...data },
          CUSTOMER,
          ONE_MONTH_IN_SECONDS
        );

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
            // url: window.location.href,
            userID: userID,
          },
        });
      },
      () => {
        window.location.reload();
      }
    );
  }

  logout(_, dispatch) {
    dispatch(updateCustomerSignInStatus(false));
    // dispatch(updateGuestUserEmail(""));
    deleteAuthorizationToken();
    deleteMobileAuthorizationToken();
    dispatch(setCartId(null));
    dispatch(removeCartItems());

    CartDispatcher.getCart(dispatch);
    WishlistDispatcher.updateInitialWishlistData(dispatch);

    BrowserDatabase.deleteItem(ORDERS);
    BrowserDatabase.deleteItem(CUSTOMER);

    dispatch(updateCustomerDetails({}));
    dispatch(setStoreCredit(getStoreCreditInitialState()));
    dispatch(setClubApparel(getClubApparelInitialState()));
    setCrossSubdomainCookie("authData", "", 1, true);
    Event.dispatch(EVENT_GTM_GENERAL_INIT);

    //after logout dispatching custom event
    const loginEvent = new CustomEvent("userLogout");
    window.dispatchEvent(loginEvent);
  }

  /**
   * Create account action
   * @param {{customer: Object, password: String}} [options={}]
   * @memberof MyAccountDispatcher
   */
  createAccount(options = {}, dispatch) {
    const mutation = MyAccountQuery.getCreateAccountMutation(options);

    return fetchMutation(mutation).then(
      (data) => {
        const {
          createCustomer: { customer },
        } = data;
        const { confirmation_required } = customer;

        if (confirmation_required) {
          return 2;
        }

        return 1;
      },
      (error) => {
        dispatch(showNotification("error", error[0].message));
        Promise.reject();

        return false;
      }
    );
  }

  async signIn(options = {}, dispatch) {
    const mutation = MyAccountQuery.getSignInMutation(options);

    try {
      const result = await fetchMutation(mutation);
      const {
        generateCustomerToken: { token },
      } = result;

      setAuthorizationToken(token);
      dispatch(updateCustomerSignInStatus(true));

      await this.handleMobileAuthorization(dispatch, options);
      await WishlistDispatcher.updateInitialWishlistData(dispatch);
      await StoreCreditDispatcher.getStoreCredit(dispatch);
      setCrossSubdomainCookie("authData", this.getCustomerData(), "1");
      this.requestCustomerData(dispatch);

      Event.dispatch(EVENT_GTM_GENERAL_INIT);

      return true;
    } catch ([e]) {
      deleteAuthorizationToken();
      deleteMobileAuthorizationToken();

      throw e;
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

  async handleMobileAuthorization(dispatch, options) {
    const { email: username, password } = options;
    const { data: { token, user: { custom_attributes, gender, id } } = {} } =
      await getMobileApiAuthorizationToken({
        username,
        password,
        cart_id: BrowserDatabase.getItem(CART_ID_CACHE_KEY),
      });
    const phoneAttribute = custom_attributes.filter(
      ({ attribute_code }) => attribute_code === "contact_no"
    );
    const isPhone = phoneAttribute[0].value
      ? phoneAttribute[0].value.search("undefined") < 0
      : false;

    dispatch(setCartId(null));
    setMobileAuthorizationToken(token);

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
        itemPrice
      );
    });
  }

  setCustomAttributes(dispatch, custom_attributes) {
    const customer = BrowserDatabase.getItem(CUSTOMER) || {};
    const phoneAttribute = custom_attributes.filter(
      ({ attribute_code }) => attribute_code === "contact_no"
    );
    const isVerifiedAttribute = custom_attributes.filter(
      ({ attribute_code }) => attribute_code === "is_mobile_otp_verified"
    );

    const { value: phoneNumber } =
      phoneAttribute && phoneAttribute[0] ? phoneAttribute[0] : null;
    const { value: isVerified } =
      isVerifiedAttribute && isVerifiedAttribute[0]
        ? isVerifiedAttribute[0]
        : { value: false };

    dispatch(
      updateCustomerDetails({ ...customer, phone: phoneNumber, isVerified })
    );
  }

  setGender(dispatch, gender) {
    const customer = BrowserDatabase.getItem(CUSTOMER) || {};

    dispatch(updateCustomerDetails({ ...customer, gender }));
  }

  setGuestUserEmail(dispatch, email) {
    dispatch(updateGuestUserEmail(email));
  }

  forgotPassword(dispatch, options = {}) {
    const { email } = options;

    BrowserDatabase.setItem(email, RESET_EMAIL, ONE_MONTH_IN_SECONDS);

    return resetPassword({ email });
  }

  resetPassword(data) {
    //return resetPasswordWithToken({ ...data, email: BrowserDatabase.getItem(RESET_EMAIL) });
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
