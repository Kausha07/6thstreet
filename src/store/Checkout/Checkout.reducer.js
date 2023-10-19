import {
    SET_SHIPPING,
    SET_CART_TOTAL,
} from './Checkout.action';

export const getInitialState = () => ({
    shipping: {},
    cartTotal: 0,
});

export const CheckoutReducer = (state = getInitialState(), action) => {
    const { type } = action;

    switch (type) {
    case SET_SHIPPING:
        const { shipping } = action;

        return {
            ...state,
            shipping,
        };

    case SET_CART_TOTAL:
        const { cartTotal } = action;
        return {
            ...state,
            cartTotal,
        };

    default:
        return state;
    }
};

export default CheckoutReducer;
