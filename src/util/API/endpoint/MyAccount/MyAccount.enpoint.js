import MagentoAPI from 'Util/API/provider/MagentoAPI';
import MobileAPI from 'Util/API/provider/MobileAPI';

/**
 * Authorize user for mobile API
 *
 * @param data object in a format of { username, password, cart_id }
 * @returns {*|{}}
 */
// eslint-disable-next-line import/prefer-default-export
export const getMobileApiAuthorizationToken = (data) => MobileAPI.post('/login', data) || {};

export const resetPassword = (email) => MobileAPI.post(
    '/buyers/password_reset',
    email
) || {};

export const sendOTP = ({ phone, flag }) => MobileAPI.post(
    '/otp/send',
    { mobile: phone, flag }
) || {};

export const sendOTPViaEmail = ({ mobile, flag }) => MobileAPI.post(
    '/email/send-otp',
    {
        mobile: mobile,
        flag: flag,
    }
)

export const userStatus = (userName) => MobileAPI.get(
    `/login/${userName}`
)

export const resetPasswordWithToken = (data) => MagentoAPI.post(
    '/customers/resetPassword',
    data
) || {};

export const updateCustomerData = (data) => MobileAPI.put(
    '/customers',
    data
) || {};

export const getOrders = (limit, offset = 0) => MobileAPI.get(
    `/orders?offset=${offset}&limit=${limit}`,
) || {};

export const subscribeToNewsletter = (email) => MobileAPI.post('/newsletter/subscribe', email);

export const getStarRating = (data) => MobileAPI.post(
    '/product-rating',
    data
) || {};

export const updateStarRating = (data) => MobileAPI.post(
    '/product-rating/save',
    data
) || {};
export const deleteStarRating = (simpleSKU, configSKU, incrementId) => MobileAPI.delete(
    `/product-rating/${simpleSKU}?order_id=${incrementId}&config_sku=${configSKU}`
) || {};

export const expressServicable = (data) =>
    MobileAPI.post("/express-serviceable", data) || {};
