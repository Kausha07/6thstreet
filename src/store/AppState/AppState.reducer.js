import BrowserDatabase from 'Util/BrowserDatabase';

import {
    SET_COUNTRY,
    SET_GENDER,
    SET_LANGUAGE,
    SET_LOCALE,
    SET_PDP_WIDGET_DATA
} from './AppState.action';

export const APP_STATE_CACHE_KEY = 'APP_STATE_CACHE_KEY';

export const getInitialState = () => (
    {
        ...(BrowserDatabase.getItem(APP_STATE_CACHE_KEY) || {
            locale: '', // en-ae, ar-ae, en-sa, ar-sa, en-kw, ar-kw ...
            country: '', // one of AE, SA, KW, OM, BH, QA
            language: 'en', // one of en, ar
            gender: 'women' // one of 'men', 'women', 'kids'
        }),
        pdpWidgetsData: []
    }
);

export const updateCacheAndReturn = (state) => {
    const ONE_YEAR_IN_SECONDS = 31536000; // this will invalidate config after one year
    BrowserDatabase.setItem(state, APP_STATE_CACHE_KEY, ONE_YEAR_IN_SECONDS);
    return state;
};

export const buildLocale = (language, country) => {
    if (!language || !country) {
        return '';
    }

    return `${language}-${country}`.toLowerCase();
};

export const AppStateReducer = (state = getInitialState(), action) => {
    const {
        country,
        language
    } = state;

    const {
        type,
        gender,
        locale = '',
        pdpWidgetsData,
        country: actionCountry,
        language: actionLanguage,
    } = action;

    switch (type) {
        case SET_COUNTRY:
            return updateCacheAndReturn({
                ...state,
                country: actionCountry,
                locale: buildLocale(language, actionCountry)
            });

        case SET_LANGUAGE:
            return updateCacheAndReturn({
                ...state,
                language: actionLanguage,
                locale: buildLocale(actionLanguage, country)
            });

        case SET_GENDER:
            return updateCacheAndReturn({
                ...state,
                gender
            });

        case SET_LOCALE:
            return updateCacheAndReturn({
                locale,
                country: locale.slice(0, 2).toUpperCase(),
                // eslint-disable-next-line no-magic-numbers
                language: locale.slice(3, 5)
            });
        case SET_PDP_WIDGET_DATA:
            return {
                ...state,
                pdpWidgetsData
            };
        default:
            return state;
    }
};

export default AppStateReducer;
