import { getStore } from 'Store';

import { doFetch } from '../helper/Fetch';

class MobileAPI {
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
        const { AppState: { locale } } = getStore().getState();
        const localePrefix = relativeURL.indexOf('?') >= 0 ? '&' : '?';
        const url = `/api/${relativeURL}${localePrefix}locale=${locale}`
            .replace(/([^:]\/)\/+/g, '$1'); // this replaces // to /

        const payload = (value) => (['post', 'put', 'delete'].includes(method) ? value : {});
        const tokenHeader = this.token ? { 'X-API-Token': this.token } : {};

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...tokenHeader
            },
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

export default new MobileAPI();
