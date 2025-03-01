import MobileAPI from "../../provider/MobileAPI";

export const getCart = (cartId, params) =>
  MobileAPI.get(
    `/carts2/${cartId}?city=${params?.city}&area=${params?.area}&address_type=${params?.address_type}`
  ) || {};
export const createCart = (cart_id) =>
  MobileAPI.post(`/carts2?cart_id=${cart_id}`) || {};

export const getCartTotals = (cartId) =>
  MobileAPI.get(`/carts2/${cartId}/totals`) || {};

export const addProductToCart = ({
  sku,
  configSKU,
  qty,
  selectedClickAndCollectStore,
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
      ctc_store_no: selectedClickAndCollectStore,
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

export const getCoupon = (cartId) => MobileAPI.get(`/promo/info?quote_id=${cartId}`) || {};


export const applyCouponCode = ({ cartId, couponCode }) =>
  MobileAPI.post(`/carts/${cartId}/coupons`, {
    coupon_code: couponCode,
  }) || {};

export const removeCouponCode = ({
  cartId,
  couponCode,
  isSiteWide = false,
  is_guest,
}) =>
  MobileAPI.delete(
    `/carts/${cartId}/coupons?sitewide_remove=${isSiteWide}&is_guest=${is_guest}`,
    {
      coupon_code: couponCode,
    }
  ) || {};

export const removeCart = ({ cartId }) =>
  MobileAPI.delete(`/carts2/${cartId}`) || {};

export const removeBulk = (cartId, items=[]) => 
  MobileAPI.post(`/carts2/${cartId}/items/remove/bulk`, {
    items: items
  }) || {}

export const siteWideCouponUpdate = ({ quoteId, flag, is_guest }) =>
  MobileAPI.post(`/sitewide-coupon`, {
    quoteId: quoteId,
    flag: flag,
    is_guest: is_guest,
  }) || {};
