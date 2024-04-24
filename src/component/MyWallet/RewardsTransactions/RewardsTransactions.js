import {
  OrderPlaced,
  Cashback,
  Refund,
  ExpiringSoon,
} from "../HelperComponents/HelperComponents";
import { useState, useEffect } from "react";
import { getTransactionHistory } from "../../../util/API/endpoint/Wallet/Wallet.endpoint.js";
import {
  ACTION_PROMOTIONAL_CREDIT_ADMIN,
  ACTION_PROMOTIONAL_ORDER,
  ACTION_PROMOTIONAL_REWARD_14_DAYS,
  ACTION_PROMOTIONAL_REFUND,
  TRANSACTIONAL_HISTORY_TYPE,
  PROMOTIONAL_HISTORY_TYPE,
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
      const type = PROMOTIONAL_HISTORY_TYPE;
      const page = 1;
      const limit = 10;
      const responseHistory = await getTransactionHistory(type, page, limit);
      if (responseHistory && responseHistory.success) {
        console.log("test responseHistory", responseHistory);
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
      {isLoading ? (
        <span>Loading....</span>
      ) : (
        <ExpiringSoon expiry={nextBalanceExpiry} balance={expiringAmount} />
      )}
      {rewardHistory.map((transaction) => (
        <>
          {transaction.action == ACTION_PROMOTIONAL_ORDER && (
            <OrderPlaced transaction={transaction} />
          )}

          {transaction.action == ACTION_PROMOTIONAL_REWARD_14_DAYS ||
            (transaction.action == ACTION_PROMOTIONAL_CREDIT_ADMIN && (
              <Refund transaction={transaction} text={"Reward"} />
            ))}

          {transaction.action == ACTION_PROMOTIONAL_REFUND && (
            <Refund transaction={transaction} text={"Refund"} />
          )}
          <hr className="HoriRow" />
        </>
      ))}
    </>
  );
}
