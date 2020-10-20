import MobileAPI from '../../provider/MobileAPI';

// eslint-disable-next-line import/prefer-default-export
export const addNewCreditCard = (data) => MobileAPI.post(
    '/tokens/card',
    data
) || {};
