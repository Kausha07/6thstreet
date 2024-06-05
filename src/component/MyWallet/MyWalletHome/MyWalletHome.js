import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "Component/Loader";
import { isArabic } from "Util/App";
import { showNotification } from "Store/Notification/Notification.action";
import {
  getWalletBalance,
  getTransactionHistory,
} from "../../../util/API/endpoint/Wallet/Wallet.endpoint.js";
import {
  OrderPlaced,
  Cashback,
  Refund,
  RewardsExpired,
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
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import {
  EVENT_MOE_WALLET_BANNER_CLICK,
  MOE_USER_ATTR_PROMOTIONAL_BALANCE,
  MOE_USER_ATTR_TRANSACTIONAL_BALANCE,
  MOE_trackEvent,
  MOE_addUserAttribute,
} from "Util/Event";

import "./MyWalletHome.style.scss";

export default function MyWalletHome({ setCurrentScreen }) {
  const isMobileValue = isMobile.any() || isMobile.tablet();
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [balanceResponse, setBalanceResponse] = useState({});
  const [promotionalBalance, setPromotionalBalance] = useState(null);
  const [totalBalance, setTotalBalance] = useState(null);
  const [transactionalBalance, setTransactionalBalance] = useState(null);
  const [allTransactionHistory, setAllTransactionHistory] = useState(null);

  const isWalletBannerEnabled = useSelector(
    (state) => state.AppConfig.isWalletBannerEnabled
  );

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
        setBalanceResponse(responseBalance?.data);
        setPromotionalBalance(responseBalance?.data?.promotional_balance);
        setTotalBalance(responseBalance?.data?.total_balance);
        setTransactionalBalance(responseBalance?.data?.transaction_balance);

        MOE_addUserAttribute(
          MOE_USER_ATTR_PROMOTIONAL_BALANCE,
          responseBalance?.data?.promotional_balance
        );
        MOE_addUserAttribute(
          MOE_USER_ATTR_TRANSACTIONAL_BALANCE,
          responseBalance?.data?.transaction_balance
        );
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
    MOE_trackEvent(EVENT_MOE_WALLET_BANNER_CLICK, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      app6thstreet_platform: "Web",
    });
  }

  function extractNumberFromString(value) {
    if (value) return Number(value.replace(/٫/g, ".").replace(/[^0-9.]/g, ""));
    return 0;
  }

  return (
    <div className="">
      <div
        className={
          isMobileValue
            ? "WalletContainer WalletMobileContainer"
            : "WalletContainer"
        }
      >
        <div
          className={
            extractNumberFromString(totalBalance)
              ? "WalletMainTop"
              : "WalletMainTop ZeroBalance"
          }
        >
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
            <img src={WalletMainIcon} alt="wallet" />
          </div>
        </div>
        <div className="WalletMainTwo">
          <div className="WalletLink">
            <div className="LinkImgText">
              <div className="Icon">
                <img src={CashRefundIcon} alt="refund" />
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
              disabled={!balanceResponse?.my_cash_history_available}
            >
              {isBalanceLoading ? (
                <Loader isLoading={isBalanceLoading} />
              ) : (
                <div className="Amount">{transactionalBalance}</div>
              )}
              {balanceResponse?.my_cash_history_available && (
                <div className="RightIcon">
                  <img
                    src={isLanguageArabic ? GoBackIcon : GoRightIcon}
                    alt="go-back"
                  />
                </div>
              )}
            </button>
          </div>
          <div className="WalletLink">
            <div className="LinkImgText">
              <div className="Icon">
                <img src={MyRewardsIcon} alt="rewards" />
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
              disabled={!balanceResponse?.my_reward_history_available}
            >
              {isBalanceLoading ? (
                <Loader isLoading={isBalanceLoading} />
              ) : (
                <div className="Amount">{promotionalBalance}</div>
              )}
              {balanceResponse?.my_reward_history_available && (
                <div className="RightIcon">
                  <img
                    src={isLanguageArabic ? GoBackIcon : GoRightIcon}
                    alt="go-back"
                  />
                </div>
              )}
            </button>
          </div>
          {isWalletBannerEnabled && (
            <div className="ReferNEarnLink">
              <div className={isMobileValue ? "referIcon mobileReferIcon" : "referIcon"}>
                <img src={VoucherIcon} alt="voucher" />
              </div>
              <div>
                <div className={isMobileValue ? "Heading mobileHeading" : "Heading"}>{__("Shop now to earn rewards")}</div>
                <div className={isMobileValue ? "SubHeading mobileSubHeading": "SubHeading"}>
                  {__("Coupon")}
                  {" :"} {walletCashbackCoupon}
                  <span onClick={() => copyReferralCode()}>
                    <img className="CopyIcon" src={CopyIcon} alt="copy" />
                  </span>
                </div>
              </div>
            </div>
          )}
          {allTransactionHistory?.count > 0 && (
            <div className="TransactionHeading">
              <div className="Heading">{__("All Transaction")}</div>
              <button
                className="ViewAll"
                onClick={() => setCurrentScreen("all")}
              >
                {__("View all")}
              </button>
            </div>
          )}

          {allTransactionHistory?.history.map((transaction, index) => {
            return (
              <div key={index}>
                {(transaction.action == ACTION_PROMOTIONAL_CREDIT_ADMIN ||
                  transaction.action == ACTION_PROMOTIONAL_REWARD_14_DAYS ||
                  transaction.action == ACTION_PROMOTIONAL_REFUND) &&
                  transaction?.expires_at == null && (
                    <RewardsExpired transaction={transaction} />
                  )}
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
                  transaction.type == PROMOTIONAL_HISTORY_TYPE &&
                  transaction?.expires_at != null && (
                    <Refund transaction={transaction} text={"Reward"} />
                  )}

                {transaction.action == ACTION_PROMOTIONAL_REWARD_14_DAYS &&
                  transaction.type == PROMOTIONAL_HISTORY_TYPE &&
                  transaction?.expires_at != null && (
                    <Cashback transaction={transaction} />
                  )}
                {transaction.action == ACTION_PROMOTIONAL_REFUND &&
                  transaction.type === PROMOTIONAL_HISTORY_TYPE &&
                  transaction?.expires_at != null && (
                    <Refund transaction={transaction} text={"Refund"} />
                  )}
                <hr className="HoriRow" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
