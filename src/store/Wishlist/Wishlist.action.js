export const SET_WISHLIST_ITEMS = 'SET_WISHLIST_ITEMS';
export const SET_IS_ANIMATE = 'SET_IS_ANIMATE';

export const setWishlistItems = (items) => ({
    type: SET_WISHLIST_ITEMS,
    items
});

export const setIsAnimate = (currentState) => ({
    type: SET_IS_ANIMATE,
    currentState
});
