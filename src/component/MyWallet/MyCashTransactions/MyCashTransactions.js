import {
  OrderPlaced,
  Refund,
  Cashback,
} from "../HelperComponents/HelperComponents";
import { useState, useEffect } from "react";
import { getTransactionHistory } from "../../../util/API/endpoint/Wallet/Wallet.endpoint.js";
import {
  TRANSACTIONAL_HISTORY_TYPE,
  ACTION_TRANSACTIONAL_BALANCE_UPDATED,
  ACTION_TRANSACTIONAL_REFERRAL_ADDED,
  ACTION_TRANSACTIONAL_ORDER,
  ACTION_TRANSACTIONAL_REFUND,
  ACTION_TRANSACTIONAL_PAYMENT_REVERT,
} from "./../MyWalletConfig/MyWalletConfig.js";
import "./MyCashTransactions.style.scss";

export default function MyCashTransactions() {
  const [isLoading, setIsLoading] = useState(false);
  const [myCashHistory, setMyCashHistory] = useState([]);

  const fetchRewardsPromotionalHistory = async () => {
    try {
      setIsLoading(true);
      //type can be eaither all/transactional/promotional
      const type = TRANSACTIONAL_HISTORY_TYPE;
      const page = 1;
      const limit = 10;
      const responseHistory = await getTransactionHistory(type, page, limit);
      if (responseHistory && responseHistory.success) {
        setMyCashHistory(responseHistory?.data?.history);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRewardsPromotionalHistory();
  }, []);

  return (
    <>
      {myCashHistory &&
        myCashHistory.map((transaction) => (
          <>
            {transaction.action == ACTION_TRANSACTIONAL_ORDER && (
              <OrderPlaced transaction={transaction} />
            )}
            {transaction.action == ACTION_TRANSACTIONAL_BALANCE_UPDATED && (
              <Refund transaction={transaction} text={"Updated"} />
            )}
            {transaction.action == ACTION_TRANSACTIONAL_PAYMENT_REVERT && (
              <Refund transaction={transaction} text={"Revert"} />
            )}
            {transaction.action == ACTION_TRANSACTIONAL_REFERRAL_ADDED && (
              <Refund transaction={transaction} text={"Referred"} />
            )}
            {transaction.action == ACTION_TRANSACTIONAL_REFUND && (
              <Refund transaction={transaction} text={"Refund"} />
            )}
            <hr className="HoriRow" />
          </>
        ))}
    </>
  );
}
