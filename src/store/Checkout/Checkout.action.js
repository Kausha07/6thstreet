export const SET_SHIPPING = 'SET_SHIPPING';
export const SET_CART_TOTAL = "SET_CART_TOTAL";

export const setShipping = (shipping) => ({
    type: SET_SHIPPING,
    shipping
});

export const setCartTotal = (cartTotal) => ({
    type: SET_CART_TOTAL,
    cartTotal
});
