import { doFetch } from '../helper/Fetch';

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
        const payload = (value) => (['post', 'put', 'delete'].includes(method) ? value : {});
        const options = {
            method,
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
