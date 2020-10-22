import CheckoutAPI from '../../provider/CheckoutAPI';

// eslint-disable-next-line import/prefer-default-export
export const addNewCreditCard = (data) => CheckoutAPI.post(
    '/tokens/card',
    data
) || {};
