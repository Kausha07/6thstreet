import ThirdPartyAPI from "../../provider/ThirdPartyAPI";

export const getLiveParty = ({ broadcastId }) =>
  ThirdPartyAPI.get(
    `https://api.spockee.io/rest/v2/broadcast?broadcastId=${broadcastId}`
  ) || {};

export const getUpcomingParty = ({ storeId, isStaging = false }) =>
  ThirdPartyAPI.get(
    `https://api.spockee.io/rest/v2/broadcast/upcoming?storeId=${storeId}&isStaging=${isStaging}`
  ) || {};

export const getArchivedParty = ({ storeId, isStaging = false }) =>
  ThirdPartyAPI.get(
    `https://api.spockee.io/rest/v2/broadcast/archived?storeId=${storeId}&isStaging=${isStaging}`
  ) || {};
