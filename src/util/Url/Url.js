import { LOCALES } from './Url.config';

export {
    updateQueryParamWithoutHistory,
    removeQueryParamWithoutHistory,
    getUrlParam,
    getQueryParam,
    convertQueryStringToKeyValuePairs,
    updateKeyValuePairs,
    convertKeyValuesToQueryString,
    generateQuery,
    setQueryParams,
    clearQueriesFromUrl,
    objectToUri
} from 'SourceUtil/Url/Url';

// eslint-disable-next-line arrow-body-style
export const getLocaleFromUrl = () => {
    return LOCALES.reduce((acc, locale) => {
        if (location.host.includes(locale)) {
            acc.push(locale);
        }

        return acc;
    }, []).toString();
};

export const getLanguageFromUrl = () => {
    const locale = getLocaleFromUrl();

    if (locale) {
        return locale.substring(0, 2);
    }

    return '';
};

export const getCountryFromUrl = () => {
    const locale = getLocaleFromUrl();

    if (locale) {
        return locale.substring('3', '5').toUpperCase();
    }

    return '';
};

export const getUrlParams = (isEncoded = false) => {
    const { search } = location;
    const params = isEncoded ? search.substring(1).split('&') : atob(search.substring(1)).split('&');

    return params.reduce((acc, param) => {
        acc[param.substr(0, param.indexOf('='))] = param.substr(param.indexOf('=') + 1);

        return acc;
    }, {});
};

export const setCrossSubdomainCookie = (name, value, days, isExpired = false) => {
    const assign = `${name}=${escape(value)};`;
    const d = new Date();
    // eslint-disable-next-line no-magic-numbers
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const time = isExpired ? 'Thu, 01 Jan 1970 00:00:01 GMT' : d.toUTCString();
    const expires = `expires=${time};`;
    const path = 'path=/;';
    const url = location.host;
    const domain = `domain=${url.substr(url.indexOf('.'))};`;
    document.cookie = assign + expires + path + domain;
};

export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }

    return '';
};

export const appendWithStoreCode = (pathname) => pathname;
