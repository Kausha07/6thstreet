import {
  OrderPlaced,
  Cashback,
  Refund,
  ExpiringSoon,
} from "../HelperComponents/HelperComponents";
import { useState, useEffect } from "react";
import { getTransactionHistory } from "../../../util/API/endpoint/Wallet/Wallet.endpoint.js";
import {
  ACTION_TYPE_ORDER,
  ACTION_TYPE_RETURN,
  ACTION_TYPE_REWARD,
  TRANSACTION_HISTORY_TYPE,
} from "./../MyWalletConfig/MyWalletConfig.js";
import "./RewardsTransactions.style.scss";

export default function RewardsTransactions() {
  const [isLoading, setIsLoading] = useState(false);
  const [rewardHistory, setRewardHistory] = useState([]);
  const [nextBalanceExpiry, setNexBalanceExpiry] = useState(null);
  const [expiringAmount, setExpiringAmount] = useState(null);

  const fetchRewardsRewardHistory = async () => {
    try {
      setIsLoading(true);
      //type can be eaither all/transactional/promotional
      const type = TRANSACTION_HISTORY_TYPE;
      const page = 1;
      const limit = 10;
      const responseHistory = await getTransactionHistory(type, page, limit);
      if (responseHistory && responseHistory.success) {
        setRewardHistory(responseHistory?.data?.history);
        setNexBalanceExpiry(responseHistory?.data?.expires_within_days);
        setExpiringAmount(responseHistory?.data?.expiring_amount);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRewardsRewardHistory();
  }, []);

  return (
    <>
      <div> RewardsTransactions</div>
      {isLoading ? (
        <span>Loading....</span>
      ) : (
        <ExpiringSoon expiry={nextBalanceExpiry} balance={expiringAmount} />
      )}
      {rewardHistory.map((transaction) => (
        <>
          {transaction.action == ACTION_TYPE_ORDER && (
            <OrderPlaced transaction={transaction} />
          )}
          {transaction.action == ACTION_TYPE_REWARD && (
            <Cashback transaction={transaction} />
          )}
          {transaction.action == ACTION_TYPE_RETURN && (
            <Refund transaction={transaction} />
          )}
          <hr className="HoriRow" />
        </>
      ))}
    </>
  );
}
