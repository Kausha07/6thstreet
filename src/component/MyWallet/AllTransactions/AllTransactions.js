import {
  OrderPlaced,
  Cashback,
  Refund,
} from "../HelperComponents/HelperComponents";
import { useState, useEffect } from "react";
import { getTransactionHistory } from "../../../util/API/endpoint/Wallet/Wallet.endpoint.js";
import {
  ACTION_TYPE_ORDER,
  ACTION_TYPE_RETURN,
  ACTION_TYPE_REWARD,
  ALL_HISTORY_TYPE,
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
