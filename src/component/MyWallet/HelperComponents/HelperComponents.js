import { isArabic } from "Util/App";
import CashRefundIcon from "../IconsAndImages/CashRefundIcon.svg";
import MyRewardsIcon from "../IconsAndImages/MyRewardsIcon.svg";
import OrderBagIcon from "../IconsAndImages/OrderBagIcon.svg";
import GoLeftIcon2 from "../IconsAndImages/GoLeftIcon2.svg";
import GoRightIcon2 from "../IconsAndImages/GoRightIcon2.svg";
import GoDownArrow from "../IconsAndImages/GoDownArrow.svg";
import GoUpArrow from "../IconsAndImages/GoUpArrow.svg";
import InfoIcon from "../IconsAndImages/InfoIcon.svg";
import CoinsIcon from "../IconsAndImages/CoinsIcon.svg";
import { useState, useEffect } from "react";
import Link from "Component/Link";
import { formatDate } from "../../../util/Common";
import ClickOutside from "Component/ClickOutside";
import { getNewOrderData } from "Util/API/endpoint/Checkout/Checkout.endpoint";
import "./HelperComponents.style.scss";

export function Cashback({ transaction }) {
  return (
    <>
      <div className="transactionPill">
        <div className="date">
          {formatDate(transaction?.created_at.slice(0, 10))}
        </div>
        <div className="WalletLink">
          <div className="LinkImgText">
            <div className="Icon">
              <img src={MyRewardsIcon} alt="rewards" />
            </div>
            <div>
              <div className="LinkHeading">{__("Cashback")}</div>
              {transaction?.order_increment_id && (
                <Link to={`/my-account/my-orders/${transaction.order_id}`}>
                  <div className="LinkSubHeading">
                    {__("Order")}#{transaction?.order_increment_id}
                  </div>
                </Link>
              )}
              <div className="LinkDetails">
                Expires: {formatDate(transaction?.expires_at.slice(0, 10))}
              </div>
            </div>
          </div>
          <div
            className={
              transaction?.balance?.[0] === "+"
                ? "AmountExchange Added"
                : "AmountExchange Deducted"
            }
          >
            {transaction?.balance}
          </div>
        </div>
      </div>
    </>
  );
}

export function RewardsExpired({ transaction }) {
  return (
    <>
      <div className="transactionPill">
        <div className="date">
          {formatDate(transaction?.created_at.slice(0, 10))}
        </div>
        <div className="WalletLink">
          <div className="LinkImgText">
            <div className="Icon">
              <img src={MyRewardsIcon} alt="rewards" />
            </div>
            <div>
              <div className="LinkHeading Expired">{__("Rewards Expired")}</div>
            </div>
          </div>
          <div className="AmountExchange Expired">{transaction?.balance}</div>
        </div>
      </div>
    </>
  );
}

export function Refund({ transaction, text }) {
  return (
    <>
      <div className="transactionPill">
        <div className="date">
          {formatDate(transaction?.created_at.slice(0, 10))}
        </div>
        <div className="WalletLink">
          <div className="LinkImgText">
            <div className="Icon">
              <img src={CashRefundIcon} alt="refund" />
            </div>
            <div>
              {text === "Reward" && (
                <div className="LinkHeading">{__("Reward")}</div>
              )}
              {text === "Refund" && (
                <div className="LinkHeading">{__("Refund")}</div>
              )}
              {text === "Updated" && (
                <div className="LinkHeading">{__("Updated")}</div>
              )}
              {text === "Referred" && (
                <div className="LinkHeading">{__("Referred")}</div>
              )}
              {text === "Revert" && (
                <div className="LinkHeading">{__("Revert")}</div>
              )}
              {transaction?.order_increment_id && (
                <Link to={`/my-account/my-orders/${transaction.order_id}`}>
                  <div className="LinkSubHeading">
                    {__("Order")}#{transaction?.order_increment_id}
                  </div>
                </Link>
              )}
              {transaction.expires_at && (
                <div className="LinkDetails">
                  {__("Expires")}:{" "}
                  {formatDate(transaction.expires_at.slice(0, 10))}
                </div>
              )}
            </div>
          </div>
          <div
            className={
              transaction?.balance?.[0] === "+"
                ? "AmountExchange Added"
                : "AmountExchange Deducted"
            }
          >
            {transaction.balance}
          </div>
        </div>
      </div>
    </>
  );
}

export function OrderPlaced({ transaction }) {
  return (
    <>
      <div className="transactionPill">
        <div className="date">
          {formatDate(transaction.created_at.slice(0, 10))}
        </div>
        <div className="WalletLink">
          <div className="LinkImgText">
            <div className="Icon">
              <img src={OrderBagIcon} alt="order" />
            </div>
            <div>
              <div className="LinkHeading">{__("Order placed")}</div>
              {transaction?.order_increment_id && (
                <Link to={`/my-account/my-orders/${transaction.order_id}`}>
                  <div className="LinkSubHeading">
                    {__("Order")}#{transaction?.order_increment_id}
                  </div>
                </Link>
              )}
            </div>
          </div>
          <div className="AmountExchange Deducted">{transaction.balance}</div>
        </div>
      </div>
    </>
  );
}

export function TransactionHeading({ setCurrentScreen, currentScreen }) {
  const isLanguageArabic = isArabic();
  return (
    <>
      <div className="TransactionHeading">
        <button className="BackBtn" onClick={() => setCurrentScreen("home")}>
          <img
            src={isLanguageArabic ? GoRightIcon2 : GoLeftIcon2}
            alt="goBack"
          />
        </button>
        <div className="Heading">{__("Your Transactions")}</div>
      </div>
      <div className="TransactionBtnsContainer">
        <button
          className={
            currentScreen === "all"
              ? "TransactionBtns TransactionBtnsActive"
              : "TransactionBtns"
          }
          onClick={() => setCurrentScreen("all")}
        >
          {__("All")}
        </button>
        <button
          className={
            currentScreen === "my-cash"
              ? "TransactionBtns TransactionBtnsActive"
              : "TransactionBtns"
          }
          onClick={() => setCurrentScreen("my-cash")}
        >
          {__("My Cash")}
        </button>
        <button
          className={
            currentScreen === "rewards"
              ? "TransactionBtns TransactionBtnsActive"
              : "TransactionBtns"
          }
          onClick={() => setCurrentScreen("rewards")}
        >
          {__("My Rewards")}
        </button>
      </div>
    </>
  );
}

export function ExpiringSoon({ expiry, balance }) {
  return (
    <>
      <div className="ExpiringSoonContainer">
        <div className="ExpiringSoon">
          <div className="InfoIcon">
            <img src={InfoIcon} alt="info" />
          </div>
          <div className="ExpiringText">
            {__("My Reward Balance of %s expires in", balance)}
            <span className="Days">
              {expiry} {__("Days")}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export function EarnedCashReward({ rewardEarned, orderID }) {
  const [rewardCreditEarned, setRewardCreditsEarned] = useState();
  useEffect(() => {
    async function getOrderDetails() {
      try {
        const responseData = await getNewOrderData(orderID);
        if (responseData?.data?.total_wallet_earned) {
          setRewardCreditsEarned(responseData?.data?.total_wallet_earned);
        }
      } catch (error) {}
    }
    if (rewardEarned === null && orderID) {
      getOrderDetails();
    } else {
      setRewardCreditsEarned(rewardEarned);
    }
  }, []);
  return (
    <>
      {rewardCreditEarned > 0 && rewardCreditEarned && (
        <div className="EarnedCash">
          <div className="CoinIcon">
            <img src={CoinsIcon} alt="coins" />
          </div>
          <div className="CashText">
            <div className="CashHeading">
              {__("You earned a cash of AED %s", rewardCreditEarned)}
            </div>
            <div className="CashDetails">
              __('(The cash will be credited in your wallet after the return
              window for this order closes)')
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function CollapsableComponent({ title, description }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <div className="CollapsableComponent">
        <div className="Heading">
          <div>{title}</div>
          <button onClick={() => setIsExpanded(!isExpanded)}>
            <img
              src={isExpanded ? GoUpArrow : GoDownArrow}
              alt="open-or-close"
            />
          </button>
        </div>
        {isExpanded && <div className="Content">{description}</div>}
      </div>
    </>
  );
}

export function EligibiltyPopup({ setIsVisible, percentage, amount }) {
  const isLanguageArabic = isArabic();
  return (
    <>
      <ClickOutside onClick={() => setIsVisible(false)}>
        <div>
          <div className={"nudge-container"}>
            <div className="nudge-content">
              {__("Elgible to use")}
              <span className="percentage">
                {" "}
                {percentage}
                {"%"}{" "}
              </span>
              {__("of the order value up to")}{" "}
              <span className="amount">{amount}</span>
            </div>
          </div>
        </div>
      </ClickOutside>
    </>
  );
}
