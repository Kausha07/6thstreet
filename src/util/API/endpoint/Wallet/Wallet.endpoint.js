import MobileAPI from "../../provider/MobileAPI";
import CDN from "Util/API/provider/CDN";

export const getWalletBalance = () =>
  MobileAPI.get("wallet/getavailablebalance");

export const getTransactionHistory = (type, page, limit) => {
  return MobileAPI.get(
    `wallet/transactionhistory?type=${type}&page=${page}&limit=${limit}`
  );
};

export const getRewardsDetails = () =>
  MobileAPI.get("wallet/rewards?locale=en-ae");

export const applyRewards = (cartId) =>
  MobileAPI.post("wallet/rewards?locale=en-ae", { cartId });

export const removeReward = (cartId) =>
  MobileAPI.delete(`wallet/rewards?locale=en-ae&cartId=${cartId}`);

export const getReward = () => MobileAPI.get("wallet/rewards?locale=en-ae");

export const getFAQsJson = () => {
  const configFile = "faq.json";
  const directory = process.env.REACT_APP_REMOTE_CONFIG_DIR;
  return CDN.get(`config_staging/faq.json`);
};
