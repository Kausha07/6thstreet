import { doFetch } from '../helper/Fetch';
import * as cert from '../cert/merchant.cer';
import * as key from '../cert/processing.pem';

/* eslint-disable-next-line fp/no-let */
let certValue;
let keyValue

class ApplePay {
    setToken(token) {
        this.token = token;
    }

    removeToken() {
        this.token = '';
    }

    hasToken() {
        return !!this.token;
    }

    async _fetch(method, url, body = {}) {
        fetch(cert)
            .then((r) => r.text())
            .then((text) => {
                certValue = text;
            });

        fetch(key)
            .then((r) => r.text())
            .then((text) => {
                keyValue = text;
            });

        const payload = (value) => (['post', 'put', 'delete'].includes(method) ? value : {});
        const options = {
            method,
            cert: certValue,
            key: keyValue,
            ...payload({ body: JSON.stringify(body) })
        };

        return doFetch(url, options);
    }

    post(url, data) {
        return this._fetch('post', url, data);
    }

    get(url) {
        return this._fetch('get', url);
    }

    delete(url) {
        return this._fetch('delete', url);
    }

    put(url, data) {
        return this._fetch('put', url, data);
    }
}

export default new ApplePay();
