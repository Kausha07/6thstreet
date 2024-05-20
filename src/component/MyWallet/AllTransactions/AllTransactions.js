import Loader from "Component/Loader";
import { Oval } from "react-loader-spinner";
import {
  OrderPlaced,
  Cashback,
  Refund,
  RewardsExpired,
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
  const [isFirstFetchLoading, setIsFirstFetchLoading] = useState(true);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [isloaderShown, setIsLoaderShown] = useState(false);
  const [page, setPage] = useState(1);
  const [fetchMore, setfetchMore] = useState(true);
  const type = ALL_HISTORY_TYPE;
  const LIMIT = 10;

  useEffect(() => {
    const fetchMyCashHistory = async () => {
      try {
        //type can be eaither all/transactional/promotional
        if (
          allHistory?.length == 0 ||
          allHistory?.length != totalTransactions
        ) {
          console.log("test conditon ", allHistory?.length, totalTransactions);
          setIsLoading(true);
          setIsLoaderShown(true);
          const responseHistory = await getTransactionHistory(
            type,
            page,
            LIMIT
          );
          if (responseHistory && responseHistory.success) {
            setAllHistory((oldData) => [
              ...oldData,
              ...responseHistory?.data?.history,
            ]);

            setTotalTransactions(responseHistory?.data?.count);
            if (responseHistory?.data?.count > allHistory?.length) {
              setfetchMore(true);
            } else {
              setfetchMore(false);
            }

            if (isFirstFetchLoading) {
              setIsFirstFetchLoading(false);
            }
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
    // !isMobile ? 300 : 0;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;

    if (windowBottom + footerHeight >= docHeight && !isLoading && fetchMore) {
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
    //not being used currently as it was used for
    // function handleScroll1(event) {
    //   const { scrollTop, clientHeight, scrollHeight } = event.target;
    //   if (scrollHeight - scrollTop === clientHeight) {
    //     setPage((oldPage) => oldPage + 1);
    //   }
    // }
    // const element = document.getElementById("all-history");
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div id="all-history" className="HistoryContainer">
        <Loader isLoading={isloaderShown} />
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
          allHistory &&
          allHistory.map((transaction) => (
            <>
              {transaction.action == ACTION_PROMOTIONAL_CREDIT_ADMIN ||
                transaction.action == ACTION_PROMOTIONAL_REWARD_14_DAYS ||
                (transaction.action == ACTION_PROMOTIONAL_REFUND &&
                  transaction?.expires_at == null && (
                    <RewardsExpired transaction={transaction} />
                  ))}
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
                  <Refund transaction={transaction} text={"Refund"} />
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
                  <Cashback transaction={transaction} />
                )}

              {transaction.action == ACTION_PROMOTIONAL_REFUND &&
                transaction.type === PROMOTIONAL_HISTORY_TYPE &&
                transaction?.expires_at != null && (
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
