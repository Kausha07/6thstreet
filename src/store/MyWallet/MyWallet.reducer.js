import { ONE_MONTH_IN_SECONDS, MY_WALLET } from 'Store/MyWallet/MyWallet.dispatcher';
import { getCurrency } from 'Util/App';
import BrowserDatabase from 'Util/BrowserDatabase';

import {
    SET_MY_WALLET,
    SET_MY_WALLET_STATE,
    SET_IS_MY_WALLET_LOADING,   
} from './StoreCredit.action';

export const getInitialState = () => ({
    current_balance: `${ getCurrency() } 0`,
    history: [],
    isLoading: true
});

export const getFallbackState = () => {
    const dbMyWallet = BrowserDatabase.getItem(MY_WALLET) || null;
    const { myWallet: initialState } = getInitialState();
    const myWallet = dbMyWallet || initialState;

    return { myWallet };
};

export const MyWalletReducer = (state = getFallbackState(), action) => {
    const { type } = action;

    switch (type) {
    case SET_IS_MY_WALLET_LOADING:
        const { isLoading } = action;

        return {
            ...state,
            isLoading
        };
    case SET_MY_WALLET_STATE:
        const { applied } = action;

        return {
            ...state,
            applied,
            isLoading: false
        };
    case SET_MY_WALLET:
        const { myWallet = getInitialState() } = action;

        BrowserDatabase.setItem(
            myWallet,
            MY_WALLET,
            ONE_MONTH_IN_SECONDS
        );

        return {
            ...state,
            myWallet,
            isLoading: false
        };

    default:
        return state;
    }
};

export default MyWalletReducer;
