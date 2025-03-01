import { getStore } from "Store";
import { getMobileAuthorizationToken } from "Util/Auth";
import BrowserDatabase from "Util/BrowserDatabase";
import { getUUID } from "Util/Auth";
import { doFetch } from '../helper/Fetch';
import { getQueryParam } from "Util/Url";
import { CAREEM_PAY } from "Component/CareemPay/CareemPay.config";
import isMobile from "Util/Mobile";

class MobileAPI {
    async _fetch(method, relativeURL, body = {}, header={}) {
        // TODO: get proper locale
        const token = getMobileAuthorizationToken();
        const { AppState: { locale } } = getStore().getState();
        const localePrefix = relativeURL.indexOf('?') >= 0 ? '&' : '?';
        const url = `/api/${relativeURL}${localePrefix}locale=${locale}`
            .replace(/([^:]\/)\/+/g, '$1'); // this replaces // to /

        const payload = (value) => (['post', 'put', 'delete'].includes(method) ? value : {});
        const Apptoken = getQueryParam("token", location);
        const tokenHeader = Apptoken ? { 'X-API-Token': Apptoken } : token ? { 'X-API-Token': token } : {};
        const customer = BrowserDatabase.getItem("customer") || {};
        const userId = customer?.id ? customer?.id : getUUID();
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-App-Version': '2.23.0',
                'Request-Source': 'PWA',
                ...tokenHeader,
                ...header,
                'Userid': userId,
                'Request-Platform': isMobile.any() ? 'msite' : 'desktop',
            },
            ...payload({ body: JSON.stringify(body) })
        };

        // In Careem Pay order API, in error case we need both the data and message field. - API format is also changes in this case.
        if(body?.payment?.method === CAREEM_PAY ){
            const isCareemPay = true;
            return doFetch(url, options, true, isCareemPay);
        }

        return doFetch(url, options, true);
    }

    post(url, data) {
        return this._fetch('post', url, data);
    }

    get(url, header={}) {
        return this._fetch('get', url, {}, header);
    }

    delete(url) {
        return this._fetch('delete', url);
    }

    put(url, data) {
        return this._fetch('put', url, data);
    }
}

export default new MobileAPI();
