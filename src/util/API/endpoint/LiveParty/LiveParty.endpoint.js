import MobileAPI from "src/util/API/provider/MobileAPI";

export const getPartyInfo = ({ storeId }) =>
  MobileAPI.get(`bambuser/data/${storeId}`) || {};

export const getProductInfo = ({ id }) => 
  MobileAPI.get(`bambuser/products/${id}`) || {};
