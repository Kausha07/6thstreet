import { APP_CONFIG_CACHE_KEY } from 'Store/AppConfig/AppConfig.reducer';
import { APP_STATE_CACHE_KEY } from 'Store/AppState/AppState.reducer';
import { ONE_MONTH_IN_SECONDS, STORE_CREDIT } from 'Store/StoreCredit/StoreCredit.dispatcher';
import BrowserDatabase from 'Util/BrowserDatabase';

import {
    SET_IS_LOADING,
    SET_STORE_CREDIT,
    SET_STORE_CREDIT_STATE
} from './StoreCredit.action';

export const getCurrency = () => {
    const { country } = BrowserDatabase.getItem(APP_STATE_CACHE_KEY) || {};
    const { config: { countries = {} } = {} } = BrowserDatabase.getItem(APP_CONFIG_CACHE_KEY) || {};
    const { currency } = countries[country] || {};

    return currency || '';
};

export const getInitialState = () => ({
    current_balance: `${ getCurrency() } 0`,
    history: [],
    isLoading: true
});

export const getFallbackState = () => {
    const dbStoreCredit = BrowserDatabase.getItem(STORE_CREDIT) || null;
    const { storeCredit: initialState } = getInitialState();
    const storeCredit = dbStoreCredit || initialState;

    return { storeCredit };
};

export const StoreCreditReducer = (state = getFallbackState(), action) => {
    const { type } = action;

    switch (type) {
    case SET_IS_LOADING:
        const { isLoading } = action;

        return {
            ...state,
            isLoading
        };
    case SET_STORE_CREDIT_STATE:
        const { applied } = action;

        return {
            ...state,
            applied,
            isLoading: false
        };
    case SET_STORE_CREDIT:
        const { storeCredit = getInitialState() } = action;

        BrowserDatabase.setItem(
            storeCredit,
            STORE_CREDIT,
            ONE_MONTH_IN_SECONDS
        );

        return {
            ...state,
            storeCredit,
            isLoading: false
        };

    default:
        return state;
    }
};

export default StoreCreditReducer;
