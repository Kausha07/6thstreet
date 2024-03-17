import {
  OrderPlaced,
  Refund,
  Cashback,
} from "../HelperComponents/HelperComponents";
import { useState, useEffect } from "react";
import { getTransactionHistory } from "../../../util/API/endpoint/Wallet/Wallet.endpoint.js";
import {
  ACTION_TYPE_ORDER,
  ACTION_TYPE_RETURN,
  ACTION_TYPE_REWARD,
  PROMOTIONAL_HISTORY_TYPE,
} from "./../MyWalletConfig/MyWalletConfig.js";
import "./MyCashTransactions.style.scss";

export default function MyCashTransactions() {
  const [isLoading, setIsLoading] = useState(false);
  const [myCashHistory, setMyCashHistory] = useState([]);

  const fetchRewardsPromotionalHistory = async () => {
    try {
      setIsLoading(true);
      //type can be eaither all/transactional/promotional
      const type = PROMOTIONAL_HISTORY_TYPE;
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
      <div> MyCashTransactions</div>
      {myCashHistory &&
        myCashHistory.map((transaction) => (
          <>
            {transaction.action == ACTION_TYPE_ORDER && (
              <OrderPlaced transaction={transaction} />
            )}
            {/* {transaction.action == ACTION_TYPE_RETURN && (
          <OrderPlaced transaction={transaction} />
        )} */}
            {transaction.action == ACTION_TYPE_REWARD && (
              <Cashback transaction={transaction} />
            )}

            {transaction.action == ACTION_TYPE_RETURN && (
              <Refund transaction={transaction} />
            )}
            {/* <OrderPlaced transaction={transaction} /> */}
            <hr className="HoriRow" />
          </>
        ))}
    </>
  );
}
