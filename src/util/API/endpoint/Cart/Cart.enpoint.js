import MobileAPI from '../../provider/MobileAPI';

export const getCartItems = (cartId) => MobileAPI.get(`/carts2/${cartId}`) || {};

export const createCart = () => MobileAPI.post('/carts2') || {};

export const getCartTotals = (cartId) => MobileAPI.get(`/carts2/${cartId}/totals`) || {};

export const addProductToCart = (
    {
        sku, qty, optionId = null, optionValue = null, cartId
    }
) => MobileAPI.post(
    `/carts2/${cartId}/items`,
    {
        quote_id: cartId,
        sku,
        qty,
        option_id: optionId,
        option_value: optionValue
    }
) || {};

export const removeProductFromCart = ({ cartId, productId }) => MobileAPI.delete(
    `/carts2/${cartId}/items/${productId}`
) || {};

export const updateProductInCart = ({ cartId, productId, qty }) => MobileAPI.put(
    `/carts2/${cartId}/items/${productId}`,
    {
        quote_id: cartId,
        qty
    }
) || {};

export const applyCouponCode = ({ cartId, couponCode }) => MobileAPI.post(
    `/carts2/${cartId}/coupons`,
    {
        coupon_code: couponCode
    }
) || {};

export const removeCouponCode = ({ cartId, couponCode }) => MobileAPI.delete(
    `/carts2/${cartId}/coupons`,
    {
        coupon_code: couponCode
    }
) || {};
