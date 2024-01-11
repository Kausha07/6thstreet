import MobileAPI from '../../provider/MobileAPI';
import MagentoAPI from 'Util/API/provider/MagentoAPI';

export const getInstallmentForTamara = (price) => MobileAPI.get(
    `/tamara/installments/${price}`
) || {};

export const createSessionTamara = (data) => MobileAPI.post(
    '/tamara/payments',
    data
) || {};

export const verifyTamaraPayment = (paymentID) => MobileAPI.get(
    `/tamara/payments/${paymentID}`
) || {};

// for now we are using MagentoAPI - once proxy start working will remove magento 
export const updateTamaraPayment = ( paymentID, order_id ) => MagentoAPI.put(
    `/tamara/payments/${paymentID}`,
    {
        order_id: order_id
    }
) || {};

// export const updateTamaraPayment = ( paymentID, order_id ) => MobileAPI.put(
//     `/tamara/payments/${paymentID}`,
//     {
//         order_id: order_id
//     }
// ) || {};
