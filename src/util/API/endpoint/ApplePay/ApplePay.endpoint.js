import ApplePay from 'Util/API/provider/ApplePay';

// eslint-disable-next-line import/prefer-default-export
export const validateApplePay = (url, data) => ApplePay.post(
    url,
    data
) || {};
