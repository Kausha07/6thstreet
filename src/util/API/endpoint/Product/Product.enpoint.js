import MobileAPI from '../../provider/MobileAPI';

// eslint-disable-next-line import/prefer-default-export
export const getProductStock = (configSku) => MobileAPI.get(
    `/product/${configSku}/stock`
) || {};

export const sendNotifyMeEmail = (data) => MobileAPI.post(
    `/product-alert`,
    data
) || {};
