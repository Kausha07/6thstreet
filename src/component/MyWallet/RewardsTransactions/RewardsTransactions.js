import { Oval } from "react-loader-spinner";
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
  TRANSACTIONAL_HISTORY_TYPE,
  PROMOTIONAL_HISTORY_TYPE,
} from "./../MyWalletConfig/MyWalletConfig.js";
import "./RewardsTransactions.style.scss";

export default function RewardsTransactions() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstFetchLoading, setIsFirstFetchLoading] = useState(true);
  const [isFurtherFetchLoading, setIsFurtherFetchLoading] = useState(false);
  const [rewardHistory, setRewardHistory] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [nextBalanceExpiry, setNextBalanceExpiry] = useState(null);
  const [expiringAmount, setExpiringAmount] = useState(null);

  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);

  const type = PROMOTIONAL_HISTORY_TYPE;
  const LIMIT = 10;

  useEffect(() => {
    const fetchRewardsHistory = async () => {
      try {
        //type can be eaither all/transactional/promotional
        if (
          rewardHistory?.length == 0 ||
          rewardHistory?.length < totalTransactions
        ) {
          setIsLoading(true);
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

    fetchRewardsHistory();
  }, [page]);

  // Handle scroll inside rewards history container
  useEffect(() => {
    // function handleScroll(event) {
    //   const { scrollTop, clientHeight, scrollHeight } = event.target;

    //   if (scrollHeight - scrollTop === clientHeight) {
    //     setPage((oldPage) => oldPage + 1);
    //   }
    // }

    const element = document.getElementById("reward-history");
    // element.addEventListener("scroll", handleScroll);

    if (isLoading || !hasMore) {
      return;
    }
    return () => {
      // element.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div id="reward-history" className="HistoryContainer">
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
          <div>
            <ExpiringSoon expiry={nextBalanceExpiry} balance={expiringAmount} />
            {rewardHistory.map((transaction) => (
              <>
               {transaction.action == ACTION_PROMOTIONAL_CREDIT_ADMIN || 
              transaction.action == ACTION_PROMOTIONAL_REWARD_14_DAYS || 
              transaction.action == ACTION_PROMOTIONAL_REFUND && transaction?.expires_at == null && (
                  <RewardsExpired transaction={transaction} />
                )}
                {transaction.action == ACTION_PROMOTIONAL_ORDER && (
                  <OrderPlaced transaction={transaction} />
                )}

                {transaction.action == ACTION_PROMOTIONAL_REWARD_14_DAYS && (
                  <Cashback transaction={transaction} />
                )}

                {transaction.action == ACTION_PROMOTIONAL_CREDIT_ADMIN && (
                  <Refund transaction={transaction} text={"Reward"} />
                )}

                {transaction.action == ACTION_PROMOTIONAL_REFUND &&  transaction?.expires_at != null &&(
                  <Refund transaction={transaction} text={"Refund"} />
                )}
                <hr className="HoriRow" />
              </>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
