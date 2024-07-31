export const SET_SHIPPING = 'SET_SHIPPING';
export const SET_CART_TOTAL = "SET_CART_TOTAL";
export const SET_IS_ADDRESS_SELECTED = "SET_IS_ADDRESS_SELECTED";
export const SET_SHIPMENT = "SET_SHIPMENT";
export const SET_CHECKOUT_LOADER = "SET_CHECKOUT_LOADER";

export const setShipping = (shipping) => ({
    type: SET_SHIPPING,
    shipping
});

export const setCartTotal = (cartTotal) => ({
    type: SET_CART_TOTAL,
    cartTotal
});

export const setIsAddressSelected = (isAddress) => ({
    type: SET_IS_ADDRESS_SELECTED,
    isAddress,
});

export const setShipment = (shipment) => ({
    type: SET_SHIPMENT,
    shipment
});

export const setCheckoutLoader = (currState) => ({
    type: SET_CHECKOUT_LOADER,
    currState
});
