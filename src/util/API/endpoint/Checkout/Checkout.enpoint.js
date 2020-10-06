import MobileAPI from '../../provider/MobileAPI';

export const validateShippingAddress = ({ address }) => MobileAPI.post(
    '/validate-address',
    address
) || {};

export const estimateShippingMethods = ({ cartId, address }) => MobileAPI.post(
    `/carts2/${cartId}/estimate-shipping-methods`,
    {
        address
    }
) || {};

export const saveShippingInformation = ({ cartId, data }) => MobileAPI.post(
    `/carts2/${cartId}/shipping-information`,
    data
) || {};

export const selectPaymentMethod = ({ cartId, data }) => MobileAPI.put(
    `/carts2/${cartId}/selected-payment-method`,
    data
) || {};

export const createOrder = ({ data }) => MobileAPI.post(
    '/create-order2',
    data
) || {};
