import { Oval } from "react-loader-spinner";
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
  const [isFirstFetchLoading, setIsFirstFetchLoading] = useState(true);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [page, setPage] = useState(1);
  const type = TRANSACTIONAL_HISTORY_TYPE;
  const LIMIT = 10;

  useEffect(() => {
    const fetchMyCashHistory = async () => {
      try {
        //type can be eaither all/transactional/promotional
        if (
          myCashHistory?.length == 0 ||
          myCashHistory?.length < totalTransactions
        ) {
          setIsLoading(true);
          const responseHistory = await getTransactionHistory(
            type,
            page,
            LIMIT
          );
          if (responseHistory && responseHistory.success) {
            setMyCashHistory((oldData) => [
              ...oldData,
              ...responseHistory?.data?.history,
            ]);

            setTotalTransactions(responseHistory?.data?.count);
            if (isFirstFetchLoading) {
              setIsFirstFetchLoading(false);
            }
            setIsLoading(false);
          }
        }
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchMyCashHistory();
  }, [page]);

  // Handle scroll inside mycash history container
  useEffect(() => {
    // function handleScroll(event) {
    //   const { scrollTop, clientHeight, scrollHeight } = event.target;

    //   if (scrollHeight - scrollTop === clientHeight) {
    //     setPage((oldPage) => oldPage + 1);
    //   }
    // }

    // const element = document.getElementById("mycash-history");
    // window.addEventListener("scroll", handleScroll);

    return () => {
      // element.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div id="mycash-history" className="HistoryContainer">
        {isFirstFetchLoading ? (
          <div className="LoaderClass">
            <Oval
              color="#333"
              secondaryColor="#333"
              height={50}
              width={"100%"}
              strokeWidth={3}
              strokeWidthSecondary={3}
            />
          </div>
        ) : (
          myCashHistory &&
          myCashHistory.map((transaction) => (
            <>
              {transaction.action == ACTION_TRANSACTIONAL_ORDER && (
                <OrderPlaced transaction={transaction} />
              )}
              {transaction.action == ACTION_TRANSACTIONAL_BALANCE_UPDATED && (
                <Refund transaction={transaction} text={"Updated"} />
              )}
              {transaction.action == ACTION_TRANSACTIONAL_PAYMENT_REVERT && (
                <Refund transaction={transaction} text={"Refund"} />
              )}
              {transaction.action == ACTION_TRANSACTIONAL_REFERRAL_ADDED && (
                <Refund transaction={transaction} text={"Referred"} />
              )}
              {transaction.action == ACTION_TRANSACTIONAL_REFUND && (
                <Refund transaction={transaction} text={"Refund"} />
              )}
              <hr className="HoriRow" />
            </>
          ))
        )}
      </div>
    </>
  );
}
