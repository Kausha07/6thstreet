import MobileAPI from '../../provider/MobileAPI';

// eslint-disable-next-line import/prefer-default-export
export const getProductStock = (configSku) => MobileAPI.get(
    `/product/${configSku}/stock`
) || {};

export const sendNotifyMeEmail = (data) => MobileAPI.post(
    `/product-alert`,
    data
) || {};

export const isClickAndCollectAvailable = ({brandName, sku}) =>
  MobileAPI.get(`/clicktocollect/is-available?brandName=${brandName}&sku=${sku}`) || {};


export const getClickAndCollectStores = ({brandName, sku, latitude, longitude}) =>
  MobileAPI.get(`/clicktocollect/stores?brandName=${brandName}&sku=${sku}&latitude=${23.4241}&longitude=${53.8478}`) || {};

export const getStoreAddress = (storeNo) =>
  MobileAPI.get(`/clicktocollect/stores/${storeNo}/address`) || {};