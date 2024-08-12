import {
    SET_SHIPPING,
    SET_CART_TOTAL,
    SET_IS_ADDRESS_SELECTED,
    SET_SHIPMENT,
    SET_CHECKOUT_LOADER,
    SET_PROCESS_ADDRESS_CHANGE,
} from './Checkout.action';

export const getInitialState = () => ({
    shipping: {},
    cartTotal: 0,
    isAddressSelected: false,
    shipment: {},
    checkoutLoader: false,
    processAddressChange: false,
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

    case SET_SHIPMENT:
        const { shipment } = action;
        return {
            ...state,
            shipment,
        }

    case SET_CHECKOUT_LOADER:
        const { currState } = action;

        return {
            ...state,
            checkoutLoader : currState,
        };

    case SET_PROCESS_ADDRESS_CHANGE:
        const { currAddState } = action;

        return {
            ...state,
            processAddressChange : currAddState
        }

    default:
        return state;
    }
};

export default CheckoutReducer;
