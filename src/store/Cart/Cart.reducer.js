import { isSignedIn, ONE_HOUR } from 'Util/Auth';
import BrowserDatabase from 'Util/BrowserDatabase';

import {
    REMOVE_CART_ITEM,
    REMOVE_CART_ITEMS,
    SET_CART_ID,
    SET_CART_TOTALS,
    UPDATE_CART_ITEM,
    UPDATE_TOTALS
} from './Cart.action';

export const CART_ID_CACHE_KEY = 'CART_ID_CACHE_KEY';

export const CART_ITEMS_CACHE_KEY = 'CART_ITEMS_CACHE_KEY';

export const getInitialState = () => ({
    cartId: BrowserDatabase.getItem(CART_ID_CACHE_KEY),
    // TODO set initial data to empty cart structure???
    cartTotals: {},
    isLoading: true,
    cartItems: BrowserDatabase.getItem(CART_ITEMS_CACHE_KEY) || []
});

const updateCartItem = (cartItems, newItem) => {
    const newItemIndex = cartItems.findIndex((x) => x.sku === newItem.sku);

    if (newItemIndex > -1) {
        cartItems.splice(newItemIndex, 1, newItem);
    } else {
        cartItems.push(newItem);
    }

    return cartItems;
};

const removeCartItem = (cartItems, itemToRemove) => {
    const itemToRemoveIndex = cartItems.findIndex((x) => x.item_id === itemToRemove.item_id);

    if (itemToRemoveIndex > -1) {
        cartItems.splice(itemToRemoveIndex, 1);
    }

    return cartItems;
};

export const CartReducer = (state = getInitialState(), action) => {
    const {
        type, cartId, cartItem, cartTotals
    } = action;
    const { cartItems } = state;
    const ONE_DAY_IN_SECONDS = 86400;
    const item = { ...cartItem };
    const totals = { ...cartTotals };
    const expireTime = isSignedIn() ? ONE_HOUR : ONE_DAY_IN_SECONDS;

    switch (type) {
    case SET_CART_ID:
        BrowserDatabase.setItem(
            cartId,
            CART_ID_CACHE_KEY,
            expireTime
        );

        return {
            ...state,
            cartId
        };

    case SET_CART_TOTALS:
        return {
            ...state,
            cartTotals: {
                ...cartTotals,
                items: cartItems,
                subtotal_incl_tax: totals.subtotal || 0,
                quote_currency_code: totals.currency_code
            },
            currency: totals.currency_code,
            isLoading: false
        };

    case UPDATE_CART_ITEM:
        const formattedCartItem = {
            customizable_options: [],
            bundle_options: [],
            item_id: item.item_id,
            product: {
                name: item.name,
                type_id: item.product_type,
                configurable_options: {},
                parent: {},
                thumbnail: {
                    url: item.thumbnail_url
                },
                url: item.url,
                variants: []
            },
            row_total: item.itemPrice || 0,
            sku: item.sku,
            qty: item.qty,
            color: item.color,
            optionValue: item.optionValue,
            thumbnail_url: item.thumbnail_url,
            basePrice: item.basePrice,
            brand_name: item.brand_name,
            currency: totals.currency,
            full_item_info: item
        };

        const updatedCartItems = updateCartItem(cartItems, formattedCartItem);

        BrowserDatabase.setItem(
            updatedCartItems,
            CART_ITEMS_CACHE_KEY,
            expireTime
        );

        return {
            ...state,
            cartItems: updatedCartItems
        };

    case REMOVE_CART_ITEM:
        const reducedCartItems = removeCartItem(cartItems, cartItem);

        BrowserDatabase.setItem(
            reducedCartItems,
            CART_ITEMS_CACHE_KEY,
            expireTime
        );

        return {
            ...state,
            cartItems: reducedCartItems
        };

    case REMOVE_CART_ITEMS:
        BrowserDatabase.setItem(
            [],
            CART_ITEMS_CACHE_KEY,
            expireTime
        );

        return {
            ...state,
            cartItems: []
        };

    case UPDATE_TOTALS:
    default:
        return state;
    }
};

export default CartReducer;
