import MobileAPI from '../../provider/MobileAPI';

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

export const updateTamaraPayment = ( paymentID, order_id, paymentStatus ) => MobileAPI.put(
    `/tamara/payments/${paymentID}`,
    {
        order_id: order_id,
        payment_status: paymentStatus,
    }
) || {};
