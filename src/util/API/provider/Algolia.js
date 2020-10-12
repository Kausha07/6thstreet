import AlgoliaSDK from '@6thstreetdotcom/algolia-sdk';
import { getStore } from 'Store';

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

export class Algolia {
    constructor(options = {}) {
        const { AppState: { locale: appLocale } } = getStore().getState();

        const {
            locale = appLocale || process.env.REACT_APP_LOCATE,
            env = process.env.REACT_APP_ALGOLIA_ENV,
            appId = process.env.REACT_APP_ALGOLIA_APP_ID,
            adminKey = process.env.REACT_APP_ALGOLIA_KEY,
            index = ''
        } = options;

        AlgoliaSDK.init(
            appId,
            adminKey,
        );

        AlgoliaSDK.setIndex.call(
            AlgoliaSDK,
            locale,
            env,
            index
        );
    }

    async getPLP(params = {}) {
        const { AppState: { locale = process.env.REACT_APP_LOCATE } } = getStore().getState();

        const url = queryString({
            ...params,
            // TODO: get proper locale
            locale
        });

        // TODO: add validation
        return AlgoliaSDK.getPLP(`/?${url}`);
    }

    async getPDP(params = {}) {
        const {
            id = '',
            highlights = PRODUCT_HIGHLIGHTS
        } = params;

        // TODO: add validation
        return AlgoliaSDK.getPDP({ id, highlights });
    }

    // getSuggestions(params) {
    //     return AlgoliaSDK.getSuggestions(params);
    // }

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

export default Algolia;
