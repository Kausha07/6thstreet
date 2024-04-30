import CashRefundIcon from "../IconsAndImages/CashRefundIcon.svg";
import OrderBagIcon from "../IconsAndImages/OrderBagIcon.svg";
import GoBackIcon from "../IconsAndImages/GoBackIcon.svg";
import GoDownArrow from "../IconsAndImages/GoDownArrow.svg";
import InfoIcon from "../IconsAndImages/InfoIcon.svg";
import CoinsIcon from "../IconsAndImages/CoinsIcon.svg";
import { useState } from "react";

import "./HelperComponents.style.scss";

export function Cashback({ transaction }) {
  return (
    <>
      <div className="transactionPill">
        <div className="date">{transaction?.created_at.slice(0,10)}</div>
        <div className="WalletLink">
          <div className="LinkImgText">
            <div className="Icon">
              <img src={CashRefundIcon} />
            </div>
            <div>
              <div className="LinkHeading">Cashback</div>
              {transaction?.order_id && (
                <div className="LinkSubHeading">
                  Order#{transaction?.order_id}
                </div>
              )}

              <div className="LinkDetails">
                Expires: {transaction?.expires_at.slice(0,10)}
              </div>
            </div>
          </div>
          <div className= {transaction?.balance?.[0]==='+'? "AmountExchange Added": "AmountExchange Deducted"} >{transaction?.balance}</div>
        </div>
      </div>
    </>
  );
}

export function Refund({ transaction, text }) {
  return (
    <>
      <div className="transactionPill">
        <div className="date">{transaction?.created_at.slice(0,10)}</div>
        <div className="WalletLink">
          <div className="LinkImgText">
            <div className="Icon">
              <img src={CashRefundIcon} />
            </div>
            <div>
              <div className="LinkHeading">{text}</div>
              {transaction.expires_at && (
                <div className="LinkDetails">
                  Expires: {transaction.expires_at.slice(0,10)}
                </div>
              )}
            </div>
          </div>
          <div className={transaction?.balance?.[0]==='+'? "AmountExchange Added": "AmountExchange Deducted"}>{transaction.balance}</div>
        </div>
      </div>
    </>
  );
}

export function OrderPlaced({ transaction }) {
  // console.log("test transaction", transaction);
  return (
    <>
      <div className="transactionPill">
        <div className="date">{transaction.created_at.slice(0,10)}</div>
        <div className="WalletLink">
          <div className="LinkImgText">
            <div className="Icon">
              <img src={OrderBagIcon} />
            </div>
            <div>
              <div className="LinkHeading">Order placed</div>
              <div className="LinkSubHeading">Order#502814663</div>
              {/* <div className="LinkDetails">
                My Cash: -AED70, My Rewards:-AED30
              </div> */}
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
          Rewards
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

export function CollapsableComponent() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <div className="CollapsableComponent">
        <div className="Heading">
          <div>What is Wallet?</div>
          <button onClick={() => setIsExpanded(!isExpanded)}>
            <img src={GoDownArrow} />
          </button>
        </div>
        {isExpanded && (
          <div>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </div>
        )}
      </div>
    </>
  );
}
