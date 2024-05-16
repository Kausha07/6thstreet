import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "Component/Loader";
import { isArabic } from "Util/App";
import { showNotification } from "Store/Notification/Notification.action";
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
import MyRewardsIcon from "./../IconsAndImages/MyRewardsIcon.svg";
import CashRefundIcon from "./../IconsAndImages/CashRefundIcon.svg";
import VoucherIcon from "./../IconsAndImages/VoucherIcon.svg";
import CopyIcon from "./../IconsAndImages/CopyIcon.svg";
import GoRightIcon from "./../IconsAndImages/GoRightIcon.svg";
import GoBackIcon from "./../IconsAndImages/GoBackIcon.svg";
import WalletMainIcon from "./../IconsAndImages/WalletMainIcon.svg";
import isMobile from "Util/Mobile";

import "./MyWalletHome.style.scss";

export default function MyWalletHome({ setCurrentScreen }) {
  const isMobileValue = isMobile.any() || isMobile.tablet();
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [promotionalBalance, setPromotionalBalance] = useState(null);
  const [totalBalance, setTotalBalance] = useState(null);
  const [transactionalBalance, setTransactionalBalance] = useState(null);
  const [allTransactionHistory, setAllTransactionHistory] = useState(null);

  const isLanguageArabic = isArabic();
  const walletCashbackCoupon = useSelector(
    (state) => state.AppConfig.walletCashbackCoupon
  );
  const dispatch = useDispatch();

  const fetchWalletBalance = async () => {
    try {
      setIsBalanceLoading(true);
      const responseBalance = await getWalletBalance();
      if (responseBalance && responseBalance.success) {
        setPromotionalBalance(responseBalance?.data?.promotional_balance);
        setTotalBalance(responseBalance?.data?.total_balance);
        setTransactionalBalance(responseBalance?.data?.transaction_balance);
        setIsBalanceLoading(false);
      }
    } catch (error) {
      setIsBalanceLoading(false);
    }
  };

  const fetchTransactionHistory = async () => {
    try {
      setIsHistoryLoading(true);
      //type can be eaither all/transactional/promotional
      const type = ALL_HISTORY_TYPE;
      const page = 1;
      const limit = 3;
      const responseHistory = await getTransactionHistory(type, page, limit);
      if (responseHistory && responseHistory.success) {
        setAllTransactionHistory(responseHistory?.data);
        setIsHistoryLoading(false);
      }
    } catch (error) {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  function copyReferralCode() {
    dispatch(showNotification("success", __("Coupon copied to clipboard")));
    navigator.clipboard.writeText(walletCashbackCoupon);
  }

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
            {isBalanceLoading ? (
              <Loader isLoading={isBalanceLoading} />
            ) : (
              <div className="Amount">{totalBalance}</div>
            )}
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
                <div className="MyCash">{__("My Cash")}</div>
                <div className="SubHeading">
                  {__("Earned from return/cancel order")}
                </div>
              </div>
            </div>
            <button
              className="GoTo"
              onClick={() => setCurrentScreen("my-cash")}
            >
              {isBalanceLoading ? (
                <Loader isLoading={isBalanceLoading} />
              ) : (
                <div className="Amount">{transactionalBalance}</div>
              )}
              <div className="RightIcon">
                <img src={isLanguageArabic ? GoBackIcon : GoRightIcon} />
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
              {isBalanceLoading ? (
                <Loader isLoading={isBalanceLoading} />
              ) : (
                <div className="Amount">{promotionalBalance}</div>
              )}

              <div className="RightIcon">
                <img src={isLanguageArabic ? GoBackIcon : GoRightIcon} />
              </div>
            </button>
          </div>
          <div className="ReferNEarnLink">
            <div className="referIcon">
              <img src={VoucherIcon} />
            </div>
            <div>
              <div className="Heading">{__("Shop now to earn rewards")}</div>
              <div className="SubHeading">
                {__("Coupon: ")} {walletCashbackCoupon}
                <span onClick={() => copyReferralCode()}>
                  <img className="CopyIcon" src={CopyIcon} alt="copy" />
                </span>
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
                  transaction.type === PROMOTIONAL_HISTORY_TYPE && (
                    <Refund transaction={transaction} text={"Refund"} />
                  )}
                <hr className="HoriRow" />
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}
