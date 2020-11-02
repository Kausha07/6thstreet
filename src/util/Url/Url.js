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

export const appendWithStoreCode = (pathname) => pathname;
