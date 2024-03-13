import MobileAPI from "../../provider/MobileAPI";

export const getWalletBalance = () =>
  MobileAPI.get("wallet/getavailablebalance");

export const getTransactionHistory = () =>
  MobileAPI.get("wallet/transactionhistory?type=1&page=1&limit=1");

// export const getRewardsDetails = () =>
//   MobileAPI.get("wallet/checkout/get-rewards?locale=en-ae");
