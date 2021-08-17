import MobileAPI from "../../provider/MobileAPI";

export const getCart = (cartId) => MobileAPI.get(`/carts2/${cartId}`) || {};
export const createCart = (cart_id) =>
  MobileAPI.post(`/carts2?cart_id=${cart_id}`) || {};

export const getCartTotals = (cartId) =>
  MobileAPI.get(`/carts2/${cartId}/totals`) || {};

export const addProductToCart = ({
  sku,
  configSKU,
  qty,
  optionId = null,
  optionValue = null,
  cartId,
  searchQueryId,
}) =>
  MobileAPI.post(
    `/carts2/${cartId}/items?csku=${configSKU}&searchQueryId=${searchQueryId}`,
    {
      quote_id: cartId,
      sku,
      qty,
      option_id: optionId,
      option_value: optionValue,
    }
  ) || {};

export const removeProductFromCart = ({ cartId, productId }) =>
  MobileAPI.delete(`/carts2/${cartId}/items/${productId}`) || {};

export const updateProductInCart = ({ cartId, productId, qty }) =>
  MobileAPI.put(`/carts2/${cartId}/items/${productId}`, {
    quote_id: cartId,
    qty,
  }) || {};

export const applyCouponCode = ({ cartId, couponCode }) =>
  MobileAPI.post(`/carts/${cartId}/coupons`, {
    coupon_code: couponCode,
  }) || {};

export const removeCouponCode = ({ cartId, couponCode }) =>
  MobileAPI.delete(`/carts/${cartId}/coupons`, {
    coupon_code: couponCode,
  }) || {};

export const removeCart = ({ cartId }) =>
  MobileAPI.delete(`/carts2/${cartId}`) || {};
