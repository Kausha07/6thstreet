import AlgoliaSDK from '@6thstreetdotcom/algolia-sdk';

import { queryString } from '../helper/Object';

export const PRODUCT_HIGHLIGHTS = [
    'color',
    'gender',
    'material',
    'leg_length',
    'skirt_length',
    'sleeve_length',
    'dress_length',
    'neck_line',
    'heel_height',
    'toe_shape'
];

class Algolia {
    constructor() {
        this.init();

        AlgoliaSDK.setIndex.call(
            AlgoliaSDK,
            process.env.REACT_APP_LOCATE,
            process.env.REACT_APP_ALGOLIA_ENV
        );
    }

    init() {
        AlgoliaSDK.init(
            process.env.REACT_APP_ALGOLIA_APP_ID,
            process.env.REACT_APP_ALGOLIA_KEY,
        );
    }

    setIndex(locale, env) {
        AlgoliaSDK.setIndex(locale, env);
    }

    async getPLP(params = {}) {
        const url = queryString({
            ...params,
            // TODO: get proper locale
            locale: process.env.REACT_APP_LOCATE
        });

        // TODO: add validation
        return AlgoliaSDK.getPLP(`/?${url}`);
    }

    async getPDP(params = {}) {
        const {
            sku = '',
            highlights = PRODUCT_HIGHLIGHTS
        } = params;

        // TODO: add validation
        return AlgoliaSDK.getPDP({ sku, highlights });
    }

    searchBy(params) {
        return AlgoliaSDK.searchBy(params);
    }

    async getBrands(gender) {
        // TODO: validate data, possible cache
        const { data = [] } = await AlgoliaSDK.getBrands(gender) || {};
        return data;
    }

    async getPopularBrands(limit) {
        // TODO: validate data, possible cache
        const { data = [] } = await AlgoliaSDK.getPopularBrands(limit) || {};
        return data;
    }
}

export default new Algolia();
