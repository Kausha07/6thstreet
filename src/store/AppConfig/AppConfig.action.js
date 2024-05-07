export const SET_APP_CONFIG = 'SET_APP_CONFIG';
export const SET_AB_TESTING_CONFIG = 'SET_AB_TESTING_CONFIG';
export const SET_VWO_DATA = "SET_VWO_DATA";
export const SET_VARIATIONS = 'SET_VARIATIONS';

export const setAppConfig = (config) => ({
    type: SET_APP_CONFIG,
    config
});

export const setABTestingConfig = (abTestingConfig) => ({
    type: SET_AB_TESTING_CONFIG,
    abTestingConfig
})

export const setVWOConfig = (vwoData) => ({
    type: SET_VWO_DATA,
    vwoData
})

export const setVariations = (variations) => ({
  type: SET_VARIATIONS,
  variations,
});
