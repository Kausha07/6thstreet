import BrowserDatabase from 'Util/BrowserDatabase';

import {
    SET_COUNTRY,
    SET_GENDER,
    SET_LANGUAGE,
    SET_LOCALE,
    SET_PDP_WIDGET_DATA,
    SET_COUNTRY_FOR_WELCOME,
    SET_LANGUAGE_FOR_WELCOME
} from './AppState.action';

export const APP_STATE_CACHE_KEY = 'APP_STATE_CACHE_KEY';

export const APP_STATE_CACHE_KEY_WELCOME = 'APP_STATE_CACHE_KEY_WELCOME';

export const getInitials = () => {

    let country = ''
    let lang = ''
    let locale = ''
    let langOptions = ['en', 'ar']

    let k = BrowserDatabase.getItem(APP_STATE_CACHE_KEY)
    if(k && k.data.country){
        country = k.data.country
    }
    if(k && k.data.language){
        lang = k.data.language
    }
    if(k && k.data.locale){
        locale = k.data.locale
    }

    if(!k){
        if(langOptions.includes(window.navigator.language.slice(0,2))){
            lang = window.navigator.language.slice(0,2)
        }
        else{
            lang = 'en'
        }
        country = 'AE'
    }
    let data = {
        language: lang,
        country: country,
        locale: locale
    }
    return data

}

export const getInitialState = () => (
    {
        ...(BrowserDatabase.getItem(APP_STATE_CACHE_KEY) || {
            locale: getInitials().locale, // en-ae, ar-ae, en-sa, ar-sa, en-kw, ar-kw ...
            country: getInitials().country, // one of AE, SA, KW, OM, BH, QA
            language: getInitials().language, // one of en, ar
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
        locale,
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
                gender: gender
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
        case SET_COUNTRY_FOR_WELCOME:
            return updateCacheAndReturn({
                ...state,
                country: actionCountry
            });
            case SET_LANGUAGE_FOR_WELCOME:
                return updateCacheAndReturn({
                ...state,
                language: actionLanguage
            });
        default:
            return state;
    }
};

export default AppStateReducer;
