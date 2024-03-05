import CashRefundIcon from "../IconsAndImages/CashRefundIcon.svg";
import OrderBagIcon from "../IconsAndImages/OrderBagIcon.svg";
import GoBackIcon from "../IconsAndImages/GoBackIcon.svg";
import GoDownArrow from "../IconsAndImages/GoDownArrow.svg";
import InfoIcon from "../IconsAndImages/InfoIcon.svg";
import CoinsIcon from "../IconsAndImages/CoinsIcon.svg";
import { useState } from "react";

import "./HelperComponents.style.scss";

export function Cashback() {
  return (
    <>
      <div className="transactionPill">
        <div className="date">24 Jan 2024</div>
        <div className="WalletLink">
          <div className="LinkImgText">
            <div className="Icon">
              <img src={CashRefundIcon} />
            </div>
            <div>
              <div className="LinkHeading">Cashback</div>
              <div className="LinkSubHeading">Order#502814663</div>
              <div className="LinkDetails">Expires: 25 JAN 2025</div>
            </div>
          </div>
          <div className="AmountExchange Added">+AED 100</div>
        </div>
      </div>
    </>
  );
}

export function Refund() {
  return (
    <>
      <div className="transactionPill">
        <div className="date">24 Jan 2024</div>
        <div className="WalletLink">
          <div className="LinkImgText">
            <div className="Icon">
              <img src={CashRefundIcon} />
            </div>
            <div>
              <div className="LinkHeading">Refund</div>
              <div className="LinkDetails">Expires: 25 JAN 2025</div>
            </div>
          </div>
          <div className="AmountExchange Added">+AED 100</div>
        </div>
      </div>
    </>
  );
}

export function OrderPlaced() {
  return (
    <>
      <div className="transactionPill">
        <div className="date">24 Jan 2024</div>
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
          <div className="AmountExchange Deducted">-AED 100</div>
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

export function ExpiringSoon() {
  return (
    <>
      <div className="ExpiringSoonContainer">
        <div className="ExpiringSoon">
          <div>{/* <img src={InfoIcon} /> */}</div>
          <div className="ExpiringText">
            My Cash Balance of AED 30 expires in
            <span className="Days">2 Days </span>
          </div>
        </div>
      </div>
    </>
  );
}

export function EarnedCashReward() {
  return (
    <>
      <div className="EarnedCash">
        <div className="CoinIcon">
          <img src={CoinsIcon} />
        </div>

        <div className="CashText">
          <div className="CashHeading">You earned a cash of AED 3</div>
          <div className="CashDetails">
            (The cash will be credited in your wallet after the return window
            for this order closes)
          </div>
        </div>
      </div>
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
          <button onClick={() => setIsExpanded(true)}>
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
