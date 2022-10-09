import ThirdPartyAPI from "../../provider/ThirdPartyAPI";

export const getPartyInfo = ({ storeId, isStaging = false }) =>
  ThirdPartyAPI.get(
    `https://liveshopping-api.bambuser.com/v1/channels/${storeId}`
  ) || {};
