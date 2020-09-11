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
        const locale = process.env.REACT_APP_LOCATE;
        const localePrefix = relativeURL.indexOf('?') >= 0 ? '&' : '?';
        const url = `/api/${relativeURL}${localePrefix}locale=${locale}`
            .replace(/([^:]\/)\/+/g, '$1'); // this replaces // to /

        const onPost = (value) => (method === 'post' ? value : {});
        const tokenHeader = this.token ? { 'X-API-Token': this.token } : {};

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...tokenHeader
            },
            ...onPost({ body: JSON.stringify(body) })
        };

        return doFetch(url, options);
    }

    post(url, data) {
        return this._fetch('post', url, data);
    }

    get(url) {
        return this._fetch('get', url);
    }
}

export default new MobileAPI();
