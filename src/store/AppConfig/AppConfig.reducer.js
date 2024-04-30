import BrowserDatabase from 'Util/BrowserDatabase';

import { SET_APP_CONFIG, SET_AB_TESTING_CONFIG, SET_VARIATIONS } from './AppConfig.action';
import { getCountryFromUrl } from 'Util/Url/Url';

export const APP_CONFIG_CACHE_KEY = 'APP_CONFIG_CACHE_KEY';

export const getInitialState = () => {
    const storedState = BrowserDatabase.getItem(APP_CONFIG_CACHE_KEY);
    const defaultState = {
        config: {},
        edd_info: null,
        suggestionEnabled: true,
        is_exchange_enabled:false,
        ctcReturnEnabled:false,
        is_live_party_enabled:false,
        isAlgoliaEventsEnabled: false,
        isVIPEnabled: false,
        is_msite_megamenu_enabled: false,
        abTestingConfig: {},
        variations: {},
    };
    const initialState =
    storedState && Object.keys(storedState)?.length > 0
        ? { storedState, abTestingConfig: {} }
        : defaultState;
    return initialState;
};


export const AppConfigReducer = (state = getInitialState(), action) => {
    const {
        type,
        config,
        abTestingConfig = {},
        variations = {}
    } = action;

    switch (type) {
        case SET_APP_CONFIG:
            const ONE_YEAR_IN_SECONDS = 31536000;
            const getCountryCode = getCountryFromUrl();

            const newState = {
                ...state,
                config,
                newSigninSignupVersionEnabled: config.countries[getCountryCode]?.new_signin_signup_version_enabled,
                IsReferralEnabled: config.countries[getCountryCode]?.is_referral_enabled,
                isSignInCartNudgeEnabled: config.countries[getCountryCode]?.is_signin_cart_nudge_enabled,
                edd_info: config.countries[getCountryCode]?.edd_info,
                suggestionEnabled: config.countries[getCountryCode]?.query_suggestion_enabled,
                is_exchange_enabled: config.countries[getCountryCode]?.is_exchange_enabled,
                ctcReturnEnabled: config.countries[getCountryCode]?.is_ctc_return_enabled,
                is_live_party_enabled: config.countries[getCountryCode]?.is_live_party_enabled,
                isAlgoliaEventsEnabled: config.countries[getCountryCode]?.isAlgoliaEventsEnabled,
                hasSizePredictor: config.countries[getCountryCode]?.hasSizePredictor,
                international_shipping_fee : config.countries[getCountryCode]?.international_shipping_fee,
                isVIPEnabled: config.countries[getCountryCode]?.isVipEnabled || false,
                isClubApparelEnabled: config.countries[getCountryCode]?.isClubApparelEnabled || false,
                isProductRatingEnabled: config.countries[getCountryCode]?.isProductRatingEnabled || false,
                is_msite_megamenu_enabled: config.countries[getCountryCode]?.is_msite_megamenu_enabled || false,
            };

            // this will invalidate config after one year
            BrowserDatabase.setItem(
                newState,
                APP_CONFIG_CACHE_KEY,
                ONE_YEAR_IN_SECONDS
            );

            // We do not care about multiple state update,
            // the Redux will not trigger component update
            // because it does shallow compartment
            return newState;
        case SET_AB_TESTING_CONFIG: {
            return  {
                ...state,
                abTestingConfig
            };
        }

        case SET_VARIATIONS: {
            BrowserDatabase.setItem(variations, "variations");
            return {
                ...state,
                variations
            }
        }

        default:
            return state;
    }
};

export default AppConfigReducer;
