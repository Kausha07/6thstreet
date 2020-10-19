export const SET_CART_ID = 'SET_CART_ID';
export const SET_CART_TOTALS = 'SET_CART_TOTALS';
export const UPDATE_CART_ITEM = 'UPDATE_CART_ITEM';
export const REMOVE_CART_ITEM = 'REMOVE_CART_ITEM';
export const UPDATE_TOTALS = 'UPDATE_TOTALS';

export const setCartId = (cartId) => ({
    type: SET_CART_ID,
    cartId
});

export const setCartTotals = (cartTotals) => ({
    type: SET_CART_TOTALS,
    cartTotals
});

export const updateCartItem = (cartItem, color, optionValue, discount, brand_name, thumbnail_url, url) => ({
    type: UPDATE_CART_ITEM,
    cartItem: {
        ...cartItem,
        color,
        optionValue,
        discount,
        brand_name,
        thumbnail_url,
        url
    }
});

export const removeCartItem = (cartItem) => ({
    type: REMOVE_CART_ITEM,
    cartItem
});

export const updateTotals = (cartData) => ({
    type: UPDATE_TOTALS,
    cartData
});
