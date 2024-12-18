import { formatItems } from 'Util/API/endpoint/Wishlist/Wishlist.format';

import { SET_WISHLIST_ITEMS, SET_IS_ANIMATE } from './Wishlist.action';

export const getInitialState = () => ({
    isLoading: true,
    items: [],
    isAnimate: false,
});

export const WishlistReducer = (state = getInitialState(), action) => {
    const { type, items } = action;

    switch (type) {
    case SET_WISHLIST_ITEMS:
        return {
            ...state,
            isLoading: false,
            items: items.filter(({ product }) => !!product)
        };

    case SET_IS_ANIMATE:
        const { currentState } = action;
        return {
            ...state,
            isAnimate: currentState
        };

    default:
        return state;
    }
};

export default WishlistReducer;
