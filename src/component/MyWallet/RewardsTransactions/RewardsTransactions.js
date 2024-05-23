import Loader from "Component/Loader";
import {
  OrderPlaced,
  Cashback,
  Refund,
  ExpiringSoon,
  RewardsExpired,
} from "../HelperComponents/HelperComponents";
import { useState, useEffect } from "react";
import { getTransactionHistory } from "../../../util/API/endpoint/Wallet/Wallet.endpoint.js";
import {
  ACTION_PROMOTIONAL_CREDIT_ADMIN,
  ACTION_PROMOTIONAL_ORDER,
  ACTION_PROMOTIONAL_REWARD_14_DAYS,
  ACTION_PROMOTIONAL_REFUND,
  PROMOTIONAL_HISTORY_TYPE,
} from "./../MyWalletConfig/MyWalletConfig.js";
import "./RewardsTransactions.style.scss";

export default function RewardsTransactions() {
  const [isLoading, setIsLoading] = useState(false);
  const [rewardHistory, setRewardHistory] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [nextBalanceExpiry, setNextBalanceExpiry] = useState(null);
  const [expiringAmount, setExpiringAmount] = useState(null);
  const [isloaderShown, setIsLoaderShown] = useState(false);
  const [page, setPage] = useState(1);

  const type = PROMOTIONAL_HISTORY_TYPE;
  const LIMIT = 10;

  useEffect(() => {
    const fetchRewardsHistory = async () => {
      try {
        //type can be eaither all/transactional/promotional
        if (
          rewardHistory?.length == 0 ||
          rewardHistory?.length != totalTransactions
        ) {
          setIsLoading(true);
          setIsLoaderShown(true);
          const responseHistory = await getTransactionHistory(
            type,
            page,
            LIMIT
          );
          if (responseHistory && responseHistory.success) {
            setRewardHistory((oldData) => [
              ...oldData,
              ...responseHistory?.data?.history,
            ]);
            if (nextBalanceExpiry == null) {
              setNextBalanceExpiry(responseHistory?.data?.expires_within_days);
            }
            if (expiringAmount == null) {
              setExpiringAmount(responseHistory?.data?.expiring_amount);
            }
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

    fetchRewardsHistory();
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

  // Handle scroll inside rewards history container
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div id="reward-history" className="HistoryContainer">
        <Loader isLoading={isloaderShown} />
        <div>
          <ExpiringSoon expiry={nextBalanceExpiry} balance={expiringAmount} />
          {rewardHistory.map((transaction, index) => (
            <div key={index}>
              {transaction.action == ACTION_PROMOTIONAL_CREDIT_ADMIN ||
                transaction.action == ACTION_PROMOTIONAL_REWARD_14_DAYS ||
                (transaction.action == ACTION_PROMOTIONAL_REFUND &&
                  transaction?.expires_at == null && (
                    <RewardsExpired transaction={transaction} />
                  ))}
              {transaction.action == ACTION_PROMOTIONAL_ORDER && (
                <OrderPlaced transaction={transaction} />
              )}

              {transaction.action == ACTION_PROMOTIONAL_REWARD_14_DAYS && (
                <Cashback transaction={transaction} />
              )}

              {transaction.action == ACTION_PROMOTIONAL_CREDIT_ADMIN && (
                <Refund transaction={transaction} text={"Reward"} />
              )}

              {transaction.action == ACTION_PROMOTIONAL_REFUND &&
                transaction?.expires_at != null && (
                  <Refund transaction={transaction} text={"Refund"} />
                )}
              <hr className="HoriRow" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
