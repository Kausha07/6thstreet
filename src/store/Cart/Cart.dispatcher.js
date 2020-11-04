import { getStore } from 'Store';
import {
    removeCartItem,
    removeCartItems,
    setCartId,
    setCartTotals,
    updateCartItem
} from 'Store/Cart/Cart.action';
import { showNotification } from 'Store/Notification/Notification.action';
import {
    addProductToCart,
    applyCouponCode,
    createCart,
    getCart,
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
                const { data: requestedCartId = null } = await createCart();

                if (!requestedCartId) {
                    dispatch(
                        showNotification(
                            'error',
                            __('There was an error creating your cart, please refresh the page in a little while')
                        )
                    );

                    return;
                }

                dispatch(setCartId(requestedCartId));
                await this.getCartTotals(dispatch, requestedCartId);
            } catch (e) {
                Logger.log(e);
            }
        } else {
            await this.getCartTotals(dispatch, cartId);
        }
    }

    async setCartItems(dispatch, data) {
        try {
            const {
                items = []
            } = data || {};

            if (items.length) {
                dispatch(removeCartItems());

                items.map((item) => {
                    const {
                        thumbnail,
                        color,
                        size_value: optionValue,
                        brand_name: brandName,
                        price,
                        original_price: basePrice,
                        id
                    } = item;

                    return dispatch(updateCartItem(
                        { ...item, item_id: id },
                        color,
                        optionValue,
                        basePrice,
                        brandName,
                        thumbnail,
                        '',
                        price
                    ));
                });
            }
        } catch (e) {
            Logger.log(e);
        }
    }

    async getCartTotals(dispatch, cartId) {
        try {
            const {
                data
            } = await getCart(cartId);

            await this.setCartItems(dispatch, data);
            dispatch(setCartTotals(data));
        } catch (e) {
            Logger.log(e);
        }
    }

    async addProductToCart(
        dispatch,
        productData,
        color,
        optionValue,
        basePrice = null,
        brand_name,
        thumbnail_url,
        url,
        itemPrice
    ) {
        const { Cart: { cartId } } = getStore().getState();

        try {
            const { data } = await addProductToCart({ ...productData, cartId });
            dispatch(updateCartItem(
                data,
                color,
                optionValue,
                basePrice,
                brand_name,
                thumbnail_url,
                url,
                itemPrice
            ));
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

    async updateProductInCart(
        dispatch,
        productId,
        qty,
        color,
        optionValue,
        basePrice = null,
        brand_name,
        thumbnail_url,
        url,
        itemPrice
    ) {
        const { Cart: { cartId } } = getStore().getState();

        try {
            const { data } = await updateProductInCart({ cartId, productId, qty });
            dispatch(updateCartItem(
                data,
                color,
                optionValue,
                basePrice,
                brand_name,
                thumbnail_url,
                url,
                itemPrice
            ));
        } catch (e) {
            Logger.log(e);
        }

        await this.getCartTotals(dispatch, cartId);
    }

    async applyCouponCode(dispatch, couponCode) {
        const { Cart: { cartId } } = getStore().getState();

        try {
            await applyCouponCode({ cartId, couponCode });
            await this.getCartTotals(dispatch, cartId);

            dispatch(showNotification('success', __('Coupon was applied!')));
        } catch (e) {
            dispatch(showNotification('error', __('The coupon code isn\'t valid. Verify the code and try again.')));

            Logger.log(e);
        }
    }

    async removeCouponCode(dispatch, couponCode) {
        const { Cart: { cartId } } = getStore().getState();

        try {
            await removeCouponCode({ cartId, couponCode });
            await this.getCartTotals(dispatch, cartId);

            dispatch(showNotification('success', __('Coupon was removed!')));
        } catch (e) {
            dispatch(showNotification('error', __('The coupon code isn\'t valid. Verify the code and try again.')));

            Logger.log(e);
        }
    }
}

export default new CartDispatcher();
