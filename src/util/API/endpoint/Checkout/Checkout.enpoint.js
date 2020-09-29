import MobileAPI from '../../provider/MobileAPI';

// TODO is work with addresses part of the scope?
//  If is par t of scope, this should be part of separate API endpoint
// export const validateAddress ...

// eslint-disable-next-line import/prefer-default-export
export const estimateShippingMethods = ({ cartId, address }) => MobileAPI.post(
    `/carts2/${cartId}/estimate-shipping-methods`,
    {
        address
    }
) || {};

// export const estimateShippingMethods = (
//     {
//         address, cartId
//     }
// ) => MobileAPI.post(
//     `/carts2/${cartId}/estimate-shipping-methods`,
//     {
//         address
//     }
// ) || {};
