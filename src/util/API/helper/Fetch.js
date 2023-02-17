import { getErrorMsg } from './API';
import { store } from "../../../store/index";
import MyAccountDispatcher from "Store/MyAccount/MyAccount.dispatcher"

// eslint-disable-next-line
export const doFetch = async (url, options,  checkUser=false, isCareemPay=false) => {
    try {
        const response = await fetch(url, options);
        const { ok, status } = response;
        const regExpUrl = /verify|send/;

        if (!ok && !url.match(regExpUrl)) {
            const error = getErrorMsg(response, isCareemPay);

        // In Careem Pay order API, in error case we need both the data and message field. - API format is also changes in this case. 
            if(isCareemPay) {
                return error;
            }

            if(status === 412 && checkUser) {
                MyAccountDispatcher.logout(null, store.dispatch)
            }

            if (typeof error !== 'object') {
                throw new Error(error);
            } else {
                return error;
            }
        }
        return response.json();
    } catch (e) {
        return { error: e };
    }
};
