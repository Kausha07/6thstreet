import MobileAPI from "../../provider/MobileAPI";

export const getWalletBalance = () =>
  MobileAPI.get("wallet/getavailablebalance");

export const getTransactionHistory = (type, page, limit) => {
  return MobileAPI.get(
    `wallet/transactionhistory?type=${type}&page=${page}&limit=${limit}`
  );
};

export const getRewardsDetails = () =>
  MobileAPI.get("wallet/rewards?locale=en-ae");

export const applyRewards = (cartId) => MobileAPI.post("wallet/rewards?locale=en-ae", 
  { cartId });

export const removeReward = (cartId) => MobileAPI.delete(`wallet/rewards?locale=en-ae&cartId=${cartId}`);

export const getReward = () => MobileAPI.get('wallet/rewards?locale=en-ae');
