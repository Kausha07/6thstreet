import { doFetch } from '../helper/Fetch';
import { merge } from '../helper/Object';

class CatalogueAPI {
    makeRequest(type, pathname, body, userOptions = {}) {
        const CATALOGUE_BASE_URL = process.env.REACT_APP_CATALOGUE_URL;
        const options = merge({}, userOptions);

        if (body) {
            // Handle POST requests
            options.body = JSON.stringify(body);
        }
        const url = `${CATALOGUE_BASE_URL}catalogue/${pathname}`;
        return doFetch(url, options);
    }

    get(url) {
        return this.makeRequest("get", url);
    }

    delete(url, body) {
        return this.makeRequest("delete", url, body);
    }

    post(url, body, options) {
        return this.makeRequest("post", url, body, options);
    }
}

export default new CatalogueAPI();
