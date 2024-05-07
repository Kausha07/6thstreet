import CashRefundIcon from "../IconsAndImages/CashRefundIcon.svg";
import OrderBagIcon from "../IconsAndImages/OrderBagIcon.svg";
import GoBackIcon from "../IconsAndImages/GoBackIcon.svg";
import GoDownArrow from "../IconsAndImages/GoDownArrow.svg";
import GoUpArrow from "../IconsAndImages/GoUpArrow.svg";
import InfoIcon from "../IconsAndImages/InfoIcon.svg";
import CoinsIcon from "../IconsAndImages/CoinsIcon.svg";
import { useState } from "react";
import Link from "Component/Link";
import { formatDate } from "../../../util/Common";

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
              <img src={CashRefundIcon} />
            </div>
            <div>
              <div className="LinkHeading">Cashback</div>
              {transaction?.order_increment_id && (
                <Link to={`/my-account/my-orders/${transaction.order_id}`}>
                  <div className="LinkSubHeading">
                    Order#{transaction?.order_increment_id}
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
              <img src={CashRefundIcon} />
            </div>
            <div>
              <div className="LinkHeading">{text}</div>
              {transaction?.order_increment_id && (
                <Link to={`/my-account/my-orders/${transaction.order_id}`}>
                  <div className="LinkSubHeading">
                    Order#{transaction?.order_increment_id}
                  </div>
                </Link>
              )}
              {transaction.expires_at && (
                <div className="LinkDetails">
                  Expires: {formatDate(transaction.expires_at.slice(0, 10))}
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
              <img src={OrderBagIcon} />
            </div>
            <div>
              <div className="LinkHeading">Order placed</div>
              {transaction?.order_increment_id && (
                <Link to={`/my-account/my-orders/${transaction.order_id}`}>
                  <div className="LinkSubHeading">
                    Order#{transaction?.order_increment_id}
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
  return (
    <>
      <div className="TransactionHeading">
        <button className="BackBtn" onClick={() => setCurrentScreen("home")}>
          <img src={GoBackIcon} />
        </button>
        <div className="Heading">Your Transactions</div>
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
          All
        </button>
        <button
          className={
            currentScreen === "my-cash"
              ? "TransactionBtns TransactionBtnsActive"
              : "TransactionBtns"
          }
          onClick={() => setCurrentScreen("my-cash")}
        >
          My Cash
        </button>
        <button
          className={
            currentScreen === "rewards"
              ? "TransactionBtns TransactionBtnsActive"
              : "TransactionBtns"
          }
          onClick={() => setCurrentScreen("rewards")}
        >
          My Rewards
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
            <img src={InfoIcon} />
          </div>
          <div className="ExpiringText">
            My Cash Balance of {balance} expires in
            <span className="Days">{expiry} Days</span>
          </div>
        </div>
      </div>
    </>
  );
}

export function EarnedCashReward({ rewardEarned }) {
  return (
    <>
      {rewardEarned > 0 && rewardEarned && (
        <div className="EarnedCash">
          <div className="CoinIcon">
            <img src={CoinsIcon} />
          </div>
          <div className="CashText">
            <div className="CashHeading">
              You earned a cash of AED {rewardEarned}
            </div>
            <div className="CashDetails">
              (The cash will be credited in your wallet after the return window
              for this order closes)
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
            <img src={isExpanded ? GoUpArrow : GoDownArrow} />
          </button>
        </div>
        {isExpanded && <div className="Content">{description}</div>}
      </div>
    </>
  );
}
