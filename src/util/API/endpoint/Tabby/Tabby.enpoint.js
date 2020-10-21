import MobileAPI from '../../provider/MobileAPI';

export const getInstallmentForValue = (price) => MobileAPI.get(
    `/tabby/installments/${price}`
) || {};

export const createSession = (data) => MobileAPI.post(
    '/tabby/payments',
    data
) || {};

export const verifyPayment = (paymentID) => MobileAPI.get(
    `/tabby/installments/${paymentID}`
) || {};

export const updateTabbyPayment = ({ paymentID, order_id }) => MobileAPI.put(
    `/tabby/payments/${paymentID}`,
    order_id
) || {};
