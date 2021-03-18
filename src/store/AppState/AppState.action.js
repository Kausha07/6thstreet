export const SET_COUNTRY = 'SET_COUNTRY';
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const SET_GENDER = 'SET_GENDER';
export const SET_LOCALE = 'SET_LOCALE';

export const setCountry = (country) => ({
    type: SET_COUNTRY,
    country
});

export const setLanguage = (language) => ({
    type: SET_LANGUAGE,
    language
});

export const setGender = (gender) => ({
    type: SET_GENDER,
    gender
});

export const setLocale = (locale) => ({
    type: SET_LOCALE,
    locale
});
