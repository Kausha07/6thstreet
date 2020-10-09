import { getStore } from 'Store';
import {
    removeCartItem,
    setCartId,
    setCartTotals,
    updateCartItem
} from 'Store/Cart/Cart.action';
import { showNotification } from 'Store/Notification/Notification.action';
import {
    addProductToCart,
    applyCouponCode,
    createCart,
    getCartTotals,
    removeCouponCode,
    removeProductFromCart,
    updateProductInCart
} from 'Util/API/endpoint/Cart/Cart.enpoint';
import Logger from 'Util/Logger';

export const GUEST_QUOTE_ID = 'guest_quote_id';

export class CartDispatcher {
    async getCart(dispatch) {
        const { Cart: { cartId } } = getStore().getState();

        if (!cartId) {
            try {
                const { data: cartId = null } = await createCart();
                if (!cartId) {
                    dispatch(
                        showNotification(
                            'error',
                            __('There was an error creating your cart, please refresh the page in a little while')
                        )
                    );

                    return;
                }
                dispatch(setCartId(cartId));
            } catch (e) {
                Logger.log(e);
            }
        }

        await this.getCartTotals(dispatch, cartId);
    }

    async getCartTotals(dispatch, cartId) {
        try {
            const { data } = await getCartTotals(cartId);

            dispatch(setCartTotals(data));
        } catch (e) {
            Logger.log(e);
        }
    }

    async addProductToCart(dispatch, productData, color, optionValue, discount = null, brand_name, thumbnail_url) {
        const { Cart: { cartId } } = getStore().getState();

        try {
            const { data } = await addProductToCart({ ...productData, cartId });

            dispatch(updateCartItem(data, color, optionValue, discount, brand_name, thumbnail_url));
        } catch (e) {
            Logger.log(e);
            if (e) {
                const err = false;
                dispatch(
                    showNotification(
                        'error',
                        __('There was an error')
                    )
                );

                return err;
            }
        }

        await this.getCartTotals(dispatch, cartId);
        return null;
    }

    async removeProductFromCart(dispatch, productId) {
        const { Cart: { cartId } } = getStore().getState();

        try {
            const { data } = await removeProductFromCart({ cartId, productId });

            // if 'data' in response was not true there was some error
            // catch will process that
            if (data) {
                dispatch(removeCartItem({ item_id: productId }));
            }
        } catch (e) {
            Logger.log(e);
        }

        await this.getCartTotals(dispatch, cartId);
    }

    async updateProductInCart(dispatch, productId, qty, color, optionValue, thumbnail_url) {
        const { Cart: { cartId } } = getStore().getState();

        try {
            const { data } = await updateProductInCart({ cartId, productId, qty });
            dispatch(updateCartItem(data, color, optionValue, thumbnail_url));
        } catch (e) {
            Logger.log(e);
        }

        await this.getCartTotals(dispatch, cartId);
    }

    async applyCouponCode(dispatch, couponCode) {
        const { Cart: { cartId } } = getStore().getState();

        try {
            await applyCouponCode({ cartId, couponCode });
        } catch (e) {
            Logger.log(e);
        }

        await this.getCartTotals(dispatch, cartId);
    }

    async removeCouponCode(dispatch, couponCode) {
        const { Cart: { cartId } } = getStore().getState();

        try {
            await removeCouponCode({ cartId, couponCode });
        } catch (e) {
            Logger.log(e);
        }

        await this.getCartTotals(dispatch, cartId);
    }
}

export default new CartDispatcher();
