import { useState, useEffect } from "react";
import {
  getWalletBalance,
  getTransactionHistory,
  getRewardsDetails,
} from "../../../util/API/endpoint/Wallet/Wallet.endpoint.js";
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
  const [transactionBalance, setTransactionBalance] = useState(null);

  const fetchWalletBalance = async () => {
    try {
      setIsLoading(true);
      const responseBalance = await getWalletBalance();
      if (responseBalance && responseBalance.success) {
        setPromotionalBalance(responseBalance?.data?.promotional_balance);
        setTotalBalance(responseBalance?.data?.total_balance);
        setTransactionBalance(responseBalance?.data?.transaction_balance);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  // useEffect(() => {
  //   getTransactionHistory();
  // }, []);

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
              <div className="Amount">{promotionalBalance}</div>
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
              <div className="Amount">{transactionBalance}</div>
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
                  <div className="LinkDetails">
                    My Cash: -AED70, My Rewards:-AED30
                  </div>
                </div>
              </div>
              <div className="AmountExchange Deducted">-AED 100</div>
            </div>
          </div>
          <hr className="HoriRow" />
          <div className="transactionPill">
            <div className="date">24 Jan 2024</div>
            <div className="WalletLink">
              <div className="LinkImgText">
                <div className="Icon">
                  <img src={CashRefundIcon} />
                </div>
                <div>
                  <div className="LinkHeading">Refund</div>
                  <div className="LinkSubHeading">Expires: 25 JAN 2025</div>
                </div>
              </div>
              <div className="AmountExchange Added">+AED 100</div>
            </div>
          </div>
          <hr className="HoriRow" />
          <div className="transactionPill">
            <div className="date">24 Jan 2024</div>
            <div className="WalletLink">
              <div className="LinkImgText">
                <div className="Icon">
                  <img src={CashRefundIcon} />
                </div>
                <div>
                  <div className="LinkHeading">Refund</div>
                  <div className="LinkSubHeading">Expires: 1 JAN 2025</div>
                </div>
              </div>
              <div className="AmountExchange Added">+AED 100</div>
            </div>
          </div>
          {/* <div className="transactionPill">
            <div className="date">24 Jan 2024</div>
            <div className="WalletLink">
              <div className="LinkImgText">
                <div>
                  <img src={CashRefundIcon} />
                </div>
                <div>
                  <div>Order placed</div>
                  <div>Order#502814663</div>
                  <div>Earned from return/cancel order</div>
                </div>
              </div>
              <div className="AmountExchange Deducted">-AED 100</div>
            </div>
          </div> */}
        </div>
      </div>
      <div>
        <div>FAQs</div>
      </div>
    </div>
  );
}
