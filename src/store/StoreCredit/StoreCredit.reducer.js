import { ONE_MONTH_IN_SECONDS, STORE_CREDIT } from 'Store/StoreCredit/StoreCredit.dispatcher';
import BrowserDatabase from 'Util/BrowserDatabase';

import {
    SET_STORE_CREDIT
} from './StoreCredit.action';

export const getInitialState = () => ({
    current_balance: '0',
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
    const {
        storeCredit = {},
        type
    } = action;

    switch (type) {
    case SET_STORE_CREDIT:
        BrowserDatabase.setItem(storeCredit, STORE_CREDIT, ONE_MONTH_IN_SECONDS);

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
