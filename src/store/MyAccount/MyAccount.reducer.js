import { CUSTOMER } from 'Store/MyAccount/MyAccount.dispatcher';
import {
    isSignedIn as isInitiallySignedIn
} from 'Util/Auth';
import BrowserDatabase from 'Util/BrowserDatabase';
import { ONE_MONTH_IN_SECONDS } from 'Util/Request/QueryDispatcher';

import {
    UPDATE_CUSTOMER_DETAILS,
    UPDATE_CUSTOMER_PASSWORD_FORGOT_STATUS,
    UPDATE_CUSTOMER_PASSWORD_RESET_STATUS,
    UPDATE_CUSTOMER_SIGN_IN_STATUS
} from './MyAccount.action';

export const initialState = {
    isSignedIn: isInitiallySignedIn(),
    passwordResetStatus: false,
    isPasswordForgotSend: false,
    customer: {}
};

export const MyAccountReducer = (state = initialState, action) => {
    const { status, customer } = action;

    switch (action.type) {
    case UPDATE_CUSTOMER_SIGN_IN_STATUS:
        return {
            ...state,
            isSignedIn: status
        };

    case UPDATE_CUSTOMER_PASSWORD_RESET_STATUS:
        return {
            ...state,
            passwordResetStatus: status
        };

    case UPDATE_CUSTOMER_PASSWORD_FORGOT_STATUS:
        return {
            ...state,
            isPasswordForgotSend: !state.isPasswordForgotSend
        };

    case UPDATE_CUSTOMER_DETAILS:
        const { firstname = '', lastname = '' } = customer;
        const data = firstname || lastname
            ? {
                ...customer,
                firstname: firstname.indexOf(' ') > 0 ? firstname.substr(0, firstname.indexOf(' ')) : firstname,
                lastname: firstname.indexOf(' ') > 0 ? firstname.substr(firstname.indexOf(' ') + 1) : lastname
            }
            : customer;

        BrowserDatabase.setItem(data, CUSTOMER, ONE_MONTH_IN_SECONDS);

        return {
            ...state,
            customer: data
        };

    default:
        return state;
    }
};

export default MyAccountReducer;
