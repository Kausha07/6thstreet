export {
    UPDATE_CUSTOMER_SIGN_IN_STATUS,
    UPDATE_CUSTOMER_DETAILS,
    UPDATE_CUSTOMER_PASSWORD_FORGOT_STATUS,
    UPDATE_CUSTOMER_PASSWORD_RESET_STATUS,
    updateCustomerDetails,
    updateCustomerPasswordForgotStatus,
    updateCustomerPasswordResetStatus,
    updateCustomerSignInStatus
} from 'SourceStore/MyAccount/MyAccount.action';

export const SET_IS_MOBILE_TAB_ACTIVE = 'SET_IS_MOBILE_TAB_ACTIVE';

export const setIsMobileTabActive = (isActive) => ({
    type: SET_IS_MOBILE_TAB_ACTIVE,
    isActive
});
