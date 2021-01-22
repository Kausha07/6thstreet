import CheckoutAPI from '../../provider/CheckoutAPI';

// eslint-disable-next-line import/prefer-default-export
export const addNewCreditCard = (data) => CheckoutAPI.post(
    process.env.REACT_APP_CHECKOUT_COM_API_IS_LIVE === 'true' ? '/tokens' : '/tokens/card',
    data
) || {};
