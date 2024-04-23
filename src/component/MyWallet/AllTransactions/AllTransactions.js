import {
  OrderPlaced,
  Cashback,
  Refund,
} from "../HelperComponents/HelperComponents";
import { useState, useEffect } from "react";
import { getTransactionHistory } from "../../../util/API/endpoint/Wallet/Wallet.endpoint.js";
import {
  ALL_HISTORY_TYPE,
  PROMOTIONAL_HISTORY_TYPE,
  TRANSACTIONAL_HISTORY_TYPE,
  ACTION_PROMOTIONAL_CREDIT_ADMIN,
  ACTION_PROMOTIONAL_ORDER,
  ACTION_PROMOTIONAL_REWARD_14_DAYS,
  ACTION_PROMOTIONAL_REFUND,
  ACTION_TRANSACTIONAL_BALANCE_UPDATED,
  ACTION_TRANSACTIONAL_REFERRAL_ADDED,
  ACTION_TRANSACTIONAL_ORDER,
  ACTION_TRANSACTIONAL_REFUND,
  ACTION_TRANSACTIONAL_PAYMENT_REVERT,
} from "./../MyWalletConfig/MyWalletConfig.js";
import "./AllTransactions.style.scss";

export default function AllTransactions() {
  const [isLoading, setIsLoading] = useState(false);
  const [allHistory, setAllHistory] = useState([]);

  const fetchRewardsTransactionHistory = async () => {
    try {
      setIsLoading(true);
      //type can be eaither all/transactional/promotional
      const type = ALL_HISTORY_TYPE;
      const page = 1;
      const limit = 10;
      const responseHistory = await getTransactionHistory(type, page, limit);
      if (responseHistory && responseHistory.success) {
        setAllHistory(responseHistory?.data?.history);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRewardsTransactionHistory();
  }, []);
  return (
    <>
      <div> AllTransactions</div>

      {allHistory &&
        allHistory.map((transaction) => (
          <>
            {transaction.action == ACTION_TRANSACTIONAL_ORDER &&
              transaction.type === TRANSACTIONAL_HISTORY_TYPE && (
                <OrderPlaced transaction={transaction} />
              )}
            {transaction.action == ACTION_TRANSACTIONAL_BALANCE_UPDATED &&
              transaction.type === TRANSACTIONAL_HISTORY_TYPE && (
                <Refund transaction={transaction} text={"Updated"} />
              )}
            {transaction.action == ACTION_TRANSACTIONAL_PAYMENT_REVERT &&
              transaction.type === TRANSACTIONAL_HISTORY_TYPE && (
                <Refund transaction={transaction} text={"Revert"} />
              )}
            {transaction.action == ACTION_TRANSACTIONAL_REFERRAL_ADDED &&
              transaction.type === TRANSACTIONAL_HISTORY_TYPE && (
                <Refund transaction={transaction} text={"Referred"} />
              )}
            {transaction.action == ACTION_TRANSACTIONAL_REFUND &&
              transaction.type === TRANSACTIONAL_HISTORY_TYPE && (
                <Refund transaction={transaction} text={"Refund"} />
              )}

            {transaction.action == ACTION_PROMOTIONAL_ORDER &&
              transaction.type === PROMOTIONAL_HISTORY_TYPE && (
                <OrderPlaced transaction={transaction} />
              )}

            {transaction.action == ACTION_PROMOTIONAL_CREDIT_ADMIN &&
              transaction.type == PROMOTIONAL_HISTORY_TYPE && (
                <Refund transaction={transaction} text={"Reward"} />
              )}

            {transaction.action == ACTION_PROMOTIONAL_REWARD_14_DAYS &&
              transaction.type == PROMOTIONAL_HISTORY_TYPE && (
                <Refund transaction={transaction} text={"Reward"} />
              )}

            {transaction.action == ACTION_PROMOTIONAL_REFUND &&
              transaction.type === PROMOTIONAL_HISTORY_TYPE && (
                <Refund transaction={transaction} text={"Refund"} />
              )}
            {/* <hr className="HoriRow" /> */}
          </>
        ))}
    </>
  );
}
