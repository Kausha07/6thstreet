export {
  UPDATE_CUSTOMER_SIGN_IN_STATUS,
  UPDATE_CUSTOMER_DETAILS,
  UPDATE_CUSTOMER_PASSWORD_FORGOT_STATUS,
  UPDATE_CUSTOMER_PASSWORD_RESET_STATUS,
  updateCustomerDetails,
  updateCustomerPasswordForgotStatus,
  updateCustomerPasswordResetStatus,
  updateCustomerSignInStatus,
} from "SourceStore/MyAccount/MyAccount.action";

export const SET_IS_MOBILE_TAB_ACTIVE = "SET_IS_MOBILE_TAB_ACTIVE";
export const SET_GUEST_USER_EMAIL = "SET_GUEST_USER_EMAIL";
export const SET_CUSTOMER_ADDRESS_DATA = "SET_CUSTOMER_ADDRESS_DATA";
export const SET_ADDRESS_LOADING_STATUS = "SET_ADDRESS_LOADING_STATUS";

export const setIsMobileTabActive = (isActive) => ({
  type: SET_IS_MOBILE_TAB_ACTIVE,
  isActive,
});

export const setAddressLoadingStatus = (isLoading) => ({
  type: SET_ADDRESS_LOADING_STATUS,
  isLoading,
});

export const updateGuestUserEmail = (guestUserEmail) => ({
  type: SET_GUEST_USER_EMAIL,
  guestUserEmail,
});

export const setCustomerAddressData = (addresses) => ({
  type: SET_CUSTOMER_ADDRESS_DATA,
  addresses,
});