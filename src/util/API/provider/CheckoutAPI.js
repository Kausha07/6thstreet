import { doFetch } from '../helper/Fetch';

class CheckoutAPI {
    setToken(token) {
        this.token = token;
    }

    removeToken() {
        this.token = '';
    }

    hasToken() {
        return !!this.token;
    }

    async _fetch(method, relativeURL, body = {}) {
        // TODO: get proper locale
        const url = `/api2/v2${relativeURL}`;

        const payload = (value) => (['post', 'put', 'delete'].includes(method) ? value : {});
        const tokenHeader = this.token ? { 'X-API-Token': this.token } : {};

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-App-Version': '2.20.0',
                'Cache-Control': 'no-cache',
                ...tokenHeader
            },
            ...payload({ body: JSON.stringify(body) })
        };

        options.headers.Authorization = process.env.REACT_APP_CHECKOUT_COM_API_AUTH_KEY;

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

export default new CheckoutAPI();
