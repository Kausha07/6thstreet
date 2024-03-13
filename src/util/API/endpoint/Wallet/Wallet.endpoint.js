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

export const useRewards = () => MobileAPI.post("wallet/rewards?locale=en-ae");
