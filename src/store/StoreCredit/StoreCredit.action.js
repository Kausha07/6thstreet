export const SET_STORE_CREDIT = 'SET_STORE_CREDIT';
export const SET_STORE_CREDIT_STATE = 'UPDATE_STORE_CREDIT_STATE';
export const SET_IS_LOADING = 'UPDATE_STORE_CREDIT_STATE';

export const setStoreCredit = (storeCredit) => ({
    type: SET_STORE_CREDIT,
    storeCredit
});

export const updateStoreCreditState = (applied) => ({
    type: SET_STORE_CREDIT_STATE,
    applied
});

export const setIsLoading = (isLoading) => ({
    type: SET_IS_LOADING,
    isLoading
});
