import Loader from "Component/Loader";
import { OrderPlaced, Refund } from "../HelperComponents/HelperComponents";
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
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [page, setPage] = useState(1);
  const [isloaderShown, setIsLoaderShown] = useState(false);
  const type = TRANSACTIONAL_HISTORY_TYPE;
  const LIMIT = 10;

  useEffect(() => {
    const fetchMyCashHistory = async () => {
      try {
        //type can be eaither all/transactional/promotional
        if (
          myCashHistory?.length == 0 ||
          myCashHistory?.length != totalTransactions
        ) {
          setIsLoading(true);
          setIsLoaderShown(true);
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
            setIsLoading(false);
            setIsLoaderShown(false);
          }
        }
      } catch (error) {
        setIsLoading(false);
        setIsLoaderShown(false);
      }
    };
    fetchMyCashHistory();
  }, [page]);

  function handleScroll() {
    const windowHeight =
      "innerHeight" in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const { body } = document;
    const html = document.documentElement;
    const footerHeight = 300;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;

    if (windowBottom + footerHeight >= docHeight && !isLoading) {
      setIsLoading(true);
    }
  }

  useEffect(() => {
    if (isLoading) {
      setPage((oldPage) => oldPage + 1);
    }
  }, [isLoading]);

  // Handle scroll inside mycash history container
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div id="mycash-history" className="HistoryContainer">
        <Loader isLoading={isloaderShown} />
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
          ))}
      </div>
    </>
  );
}
