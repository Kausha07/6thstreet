export const SET_SHIPPING = 'SET_SHIPPING';
export const PROCESSING_PAYMENT_METHOD = 'PROCESSING_PAYMENT_METHOD';

export const setShipping = (shipping) => ({
    type: SET_SHIPPING,
    shipping
});

export const processingPaymentMethod = (process) => ({
    type: PROCESSING_PAYMENT_METHOD,
    process
});
