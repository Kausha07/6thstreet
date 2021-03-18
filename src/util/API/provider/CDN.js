import { doFetch } from '../helper/Fetch';

class CDN {
    get(someUrl) {
        // Make sure the CDN domain is not passed
        const relativeUrl = someUrl.replace('https://mobilecdn.6thstreet.com/', '/');

        const url = `/cdn/${relativeUrl}`
            .replace(/([^:]\/)\/+/g, '$1'); // this replaces // to /

        const options = {
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        };

        return doFetch(url, options);
    }
}

export default new CDN();
