import {
    SET_SHIPPING,
    SET_CART_TOTAL,
    SET_IS_ADDRESS_SELECTED,
} from './Checkout.action';

export const getInitialState = () => ({
    shipping: {},
    cartTotal: 0,
    isAddressSelected: false,
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

    case SET_IS_ADDRESS_SELECTED:
        const { isAddress } = action;
      return {
        ...state,
        isAddressSelected: isAddress,
      }

    default:
        return state;
    }
};

export default CheckoutReducer;
