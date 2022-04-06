import { CUSTOMER } from "Store/MyAccount/MyAccount.dispatcher";
import { isSignedIn as isInitiallySignedIn } from "Util/Auth";
import BrowserDatabase from "Util/BrowserDatabase";
import { ONE_MONTH_IN_SECONDS } from "Util/Request/QueryDispatcher";

import {
  SET_IS_MOBILE_TAB_ACTIVE,
  SET_GUEST_USER_EMAIL,
  UPDATE_CUSTOMER_DETAILS,
  UPDATE_CUSTOMER_PASSWORD_FORGOT_STATUS,
  UPDATE_CUSTOMER_PASSWORD_RESET_STATUS,
  UPDATE_CUSTOMER_SIGN_IN_STATUS,
  SET_CUSTOMER_ADDRESS_DATA,
  SET_CUSTOMER_DEFAULT_SHIPPING_ADDRESS,
  SET_ADDRESS_LOADING_STATUS,
} from "./MyAccount.action";

export const initialState = {
  isSignedIn: isInitiallySignedIn(),
  passwordResetStatus: false,
  isPasswordForgotSend: false,
  customer: {},
  mobileTabActive: true,
  guestUserEmail: "",
  addresses: [],
  isAddressLoading: false,
  defaultShippingAddress: null,
  EDDResponse: [
    {
      source: "thankyou",
      edd_message_en: "Arriving by 06 Apr, Wednesday",
      edd_message_ar: null,
      edd_date: "2022-04-06",
      featute_flag_status: 1,
    },
    {
      source: "pdp",
      edd_message_en: "Delivery by 06 Apr, Wednesday",
      edd_message_ar: null,
      edd_date: "2022-04-06",
      featute_flag_status: 1,
    },
    {
      source: "cart",
      edd_message_en: "Delivery by 06 Apr, Wednesday",
      edd_message_ar: null,
      edd_date: "2022-04-06",
      featute_flag_status: 1,
    },
    {
      source: "myorder",
      edd_message_en: "Arriving by 06 Apr, Wednesday",
      edd_message_ar: null,
      edd_date: "2022-04-06",
      featute_flag_status: 0,
    },
  ],
};

export const MyAccountReducer = (state = initialState, action) => {
  const {
    status,
    customer,
    guestUserEmail,
    addresses,
    isLoading,
    defaultaddress,
  } = action;

  switch (action.type) {
    case UPDATE_CUSTOMER_SIGN_IN_STATUS:
      return {
        ...state,
        isSignedIn: status,
      };
    case SET_ADDRESS_LOADING_STATUS:
      return {
        ...state,
        isAddressLoading: isLoading,
      };

    case SET_GUEST_USER_EMAIL:
      return {
        ...state,
        guestUserEmail,
      };
    case SET_CUSTOMER_ADDRESS_DATA:
      return {
        ...state,
        addresses,
      };
    case SET_CUSTOMER_DEFAULT_SHIPPING_ADDRESS:
      return {
        ...state,
        defaultShippingAddress: defaultaddress,
      };
    case UPDATE_CUSTOMER_PASSWORD_RESET_STATUS:
      return {
        ...state,
        passwordResetStatus: status,
      };

    case UPDATE_CUSTOMER_PASSWORD_FORGOT_STATUS:
      return {
        ...state,
        isPasswordForgotSend: !state.isPasswordForgotSend,
      };

    case UPDATE_CUSTOMER_DETAILS:
      const { firstname = "", lastname = "" } = customer;
      const data =
        firstname || lastname
          ? {
              ...customer,
              firstname:
                firstname.indexOf(" ") > 0
                  ? firstname.substr(0, firstname.indexOf(" "))
                  : firstname,
              lastname:
                firstname.indexOf(" ") > 0
                  ? firstname.substr(firstname.indexOf(" ") + 1)
                  : lastname,
            }
          : customer;

      BrowserDatabase.setItem(data, CUSTOMER, ONE_MONTH_IN_SECONDS);

      return {
        ...state,
        customer: data,
      };

    case SET_IS_MOBILE_TAB_ACTIVE:
      const { isActive } = action;

      return {
        ...state,
        mobileTabActive: isActive,
      };

    default:
      return state;
  }
};

export default MyAccountReducer;
