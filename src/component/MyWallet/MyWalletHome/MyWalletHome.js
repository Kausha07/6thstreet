import { useState, useEffect } from "react";
import {
  getWalletBalance,
  getTransactionHistory,
  getRewardsDetails,
} from "../../../util/API/endpoint/Wallet/Wallet.endpoint.js";
import {
  OrderPlaced,
  Cashback,
  Refund,
} from "../HelperComponents/HelperComponents.js";
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
import referralIcon from "./../IconsAndImages/referralIcon.svg";
import MyRewardsIcon from "./../IconsAndImages/MyRewardsIcon.svg";
import OrderBagIcon from "./../IconsAndImages/OrderBagIcon.svg";
import CashRefundIcon from "./../IconsAndImages/CashRefundIcon.svg";
import WalletIcon from "./../IconsAndImages/WalletIcon.svg";
import test4 from "./../IconsAndImages/test4.svg";
import GoRightIcon from "./../IconsAndImages/GoRightIcon.svg";
import WalletMainIcon from "./../IconsAndImages/WalletMainIcon.svg";
import isMobile from "Util/Mobile";

import "./MyWalletHome.style.scss";

export default function MyWalletHome({ setCurrentScreen }) {
  const isMobileValue = isMobile.any() || isMobile.tablet();
  const [isLoading, setIsLoading] = useState(false);
  const [promotionalBalance, setPromotionalBalance] = useState(null);
  const [totalBalance, setTotalBalance] = useState(null);
  const [transactionalBalance, setTransactionalBalance] = useState(null);
  const [allTransactionHistory, setAllTransactionHistory] = useState(null);

  const fetchWalletBalance = async () => {
    try {
      setIsLoading(true);
      const responseBalance = await getWalletBalance();
      if (responseBalance && responseBalance.success) {
        setPromotionalBalance(responseBalance?.data?.promotional_balance);
        setTotalBalance(responseBalance?.data?.total_balance);
        setTransactionalBalance(responseBalance?.data?.transaction_balance);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const fetchTransactionHistory = async () => {
    try {
      setIsLoading(true);
      //type can be eaither all/transactional/promotional
      const type = ALL_HISTORY_TYPE;
      const page = 1;
      const limit = 3;
      const responseHistory = await getTransactionHistory(type, page, limit);
      if (responseHistory && responseHistory.success) {
        setAllTransactionHistory(responseHistory?.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  // useEffect(() => {
  //   getRewardsDetails();
  // }, []);

  return (
    <div className="">
      <div
        className={
          isMobileValue
            ? "WalletContainer WalletMobileContainer"
            : "WalletContainer"
        }
      >
        <div className="WalletMainTop">
          <div className="SlantBackground"></div>
          <div className="TotalBalance">
            <div className="Heading">{__("Total Available Balance")}</div>
            <div className="Amount">{totalBalance}</div>
          </div>
          <div className="WalletIcon">
            <img src={WalletMainIcon} />
          </div>
        </div>
        <div className="WalletMainTwo">
          <div className="WalletLink">
            <div className="LinkImgText">
              <div className="Icon">
                <img src={CashRefundIcon} />
              </div>
              <div>
                <div className="MyCash">{__("My cash")}</div>
                <div className="SubHeading">
                  {__("Earned from return/cancel order")}
                </div>
              </div>
            </div>
            <button
              className="GoTo"
              onClick={() => setCurrentScreen("my-cash")}
            >
              <div className="Amount">{transactionalBalance}</div>
              <div className="RightIcon">
                <img src={GoRightIcon} />
              </div>
            </button>
          </div>
          <div className="WalletLink">
            <div className="LinkImgText">
              <div className="Icon">
                <img src={MyRewardsIcon} />
              </div>
              <div>
                <div className="MyCash">{__("My Rewards")}</div>
                <div className="SubHeading">
                  {__("Earned from promotional offer")}
                </div>
              </div>
            </div>
            <button
              className="GoTo"
              onClick={() => setCurrentScreen("rewards")}
            >
              <div className="Amount">{promotionalBalance}</div>
              <div className="RightIcon">
                <img src={GoRightIcon} />
              </div>
            </button>
          </div>
          <div className="ReferNEarnLink">
            <div className="referIcon">
              <img src={referralIcon} />
            </div>
            <div>
              <div className="Heading">{__("Refer and Earn")}</div>
              <div className="SubHeading">
                {__("Refer to your friends and get cash today")}
                {/* <span className="GoRight">
                  <img src={GoRightIcon} />
                </span> */}
              </div>
            </div>
          </div>
          <div className="TransactionHeading">
            <div className="Heading">{__("All Transaction")}</div>
            <button className="ViewAll" onClick={() => setCurrentScreen("all")}>
              {__("View all")}
            </button>
          </div>

          {allTransactionHistory?.history.map((transaction) => {
            return (
              <>
                {console.log("test inside all transaction", transaction)}
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
                <hr className="HoriRow" />
              </>
            );
          })}
        </div>
      </div>
      <div>
        <div>FAQs</div>
      </div>
    </div>
  );
}

// {allTransactionHistory?.history.map((transaction) => {
//   return (
//     <>
//       {transaction.action == ACTION_TYPE_ORDER && (
//         <>
//           <div className="transactionPill">
//             <div className="date">{transaction.created_at}</div>
//             <div className="WalletLink">
//               <div className="LinkImgText">
//                 <div className="Icon">
//                   <img src={OrderBagIcon} />
//                 </div>
//                 <div>
//                   <div className="LinkHeading">Order placed</div>
//                   <div className="LinkSubHeading">
//                     Order#{transaction.order_id}
//                   </div>
//                   {/* <div className="LinkDetails">
//                     My Cash: -AED70, My Rewards:-AED30
//                   </div> */}
//                 </div>
//               </div>
//               <div className="AmountExchange Deducted">
//                 {transaction.balance}
//               </div>
//             </div>
//           </div>
//           <hr className="HoriRow" />
//         </>
//       )}
//       {transaction.action == ACTION_TYPE_RETURN && (
//         <>
//           <div className="transactionPill">
//             <div className="date">{transaction.created_at}</div>
//             <div className="WalletLink">
//               <div className="LinkImgText">
//                 <div className="Icon">
//                   <img src={CashRefundIcon} />
//                 </div>
//                 <div>
//                   <div className="LinkHeading">Refund</div>
//                   {/* <div className="LinkSubHeading">
//                     Expires: {transaction.expires_at}
//                   </div> */}
//                 </div>
//               </div>
//               <div className="AmountExchange Added">
//                 {transaction.balance}
//               </div>
//             </div>
//           </div>
//           <hr className="HoriRow" />
//         </>
//       )}
//       {transaction.action == ACTION_TYPE_REWARD && (
//         <>
//           <div className="transactionPill">
//             <div className="date">{transaction.created_at}</div>
//             <div className="WalletLink">
//               <div className="LinkImgText">
//                 <div className="Icon">
//                   <img src={CashRefundIcon} />
//                 </div>
//                 <div>
//                   <div className="LinkHeading">Reward</div>
//                   <div className="LinkSubHeading">
//                     Expires: {transaction.expires_at}
//                   </div>
//                 </div>
//               </div>
//               <div className="AmountExchange Added">
//                 {transaction.balance}
//               </div>
//             </div>
//           </div>
//           <hr className="HoriRow" />
//         </>
//       )}
//     </>
//   );
// })}
