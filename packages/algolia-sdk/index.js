import {
    getBrands,
    getPDP,
    getPLP,
    getPopularBrands,
    init,
    searchBy,
    getProductBySku
} from './app';

import { getIndex } from './app/utils';

const AlgoliaSDK = {
    client: null,
    index: null,
    env: 'production',

    init: (appID, adminKey) => {
        AlgoliaSDK.client = init(appID, adminKey);
    },

    setIndex: (locale, env) => {
        const indexName = getIndex(locale, env);
        AlgoliaSDK.index = AlgoliaSDK.client.initIndex(indexName);
        AlgoliaSDK.env = env;
    },

    getPLP: (URL) => getPLP(URL, { client: AlgoliaSDK.client, env: AlgoliaSDK.env }),
    getPDP: (params) => getPDP(params, { index: AlgoliaSDK.index }),
    searchBy: (params) => searchBy(params, { index: AlgoliaSDK.index }),
    getPopularBrands: (limit) => getPopularBrands(limit, { index: AlgoliaSDK.index }),
    getBrands: (gender) => getBrands(gender, { index: AlgoliaSDK.index }),
    getProductBySku: (params) => getProductBySku(params, { index: AlgoliaSDK.index })
};

export default AlgoliaSDK;
