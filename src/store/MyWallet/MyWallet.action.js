export const SET_MY_WALLET = 'SET_MY_WALLET';
export const SET_MY_WALLET_STATE = 'UPDATE_MY_WALLET_STATE';
export const SET_IS_MY_WALLET_LOADING = 'IS_MY_WALLET_LOADING';

export const setMyWallet = (myWallet) => ({
    type: SET_MY_WALLET,
    myWallet
});

export const updateMyWalletState = (applied) => ({
    type: SET_MY_WALLET_STATE,
    applied
});

export const setIsLoading = (isLoading) => ({
    type: SET_IS_MY_WALLET_LOADING,
    isLoading
});
