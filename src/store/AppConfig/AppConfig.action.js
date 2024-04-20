export const SET_APP_CONFIG = 'SET_APP_CONFIG';
export const SET_HOME_PAGE_PERSONALISATION_CONFIG = 'SET_HOME_PAGE_PERSONALISATION_CONFIG';

export const setAppConfig = (config) => ({
    type: SET_APP_CONFIG,
    config
});

export const setHomePagePersonalisationConfig = (homepagePersonalisationConfig) => ({
    type: SET_HOME_PAGE_PERSONALISATION_CONFIG,
    homepagePersonalisationConfig
})
