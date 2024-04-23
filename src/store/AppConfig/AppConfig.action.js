export const SET_APP_CONFIG = 'SET_APP_CONFIG';
export const SET_AB_TESTING_CONFIG = 'SET_AB_TESTING_CONFIG';

export const setAppConfig = (config) => ({
    type: SET_APP_CONFIG,
    config
});

export const setABTestingConfig = (abTestingConfig) => ({
    type: SET_AB_TESTING_CONFIG,
    abTestingConfig
})
