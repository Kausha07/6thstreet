import Loader from "Component/Loader";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { getCurrency } from "Util/App";
import MyWalletDispatcher from "Store/MyWallet/MyWallet.dispatcher";
import CrossIcon from "./../IconsAndImages/CrossIcon.svg";
import SelectIcon from "./../IconsAndImages/SelectIcon.svg";
import "./UseMyWallet.style.scss";

export const mapStateToProps = (state) => ({
  isLoading: state.MyWalletReducer.isLoading,
  myWallet: state.MyWalletReducer.myWallet,
  isWalletEnabled: state.AppConfig.isWalletV1Enabled,
});

export const mapDispatchToProps = (dispatch) => ({
  toggleMyWallet: (apply) => MyWalletDispatcher.toggleMyWallet(dispatch, apply),
  getReward: () => MyWalletDispatcher.getReward(dispatch),
});

export function UseMyWallet(props) {
  const [isWalletBalanceApplied, setIsWalletBalanceApplied] = useState(false);
  const [currencyCode, setCurrencyCode] = useState("");
  const {
    toggleMyWallet,
    getReward,
    eligibleAmount,
    myWallet,
    isLoading,
    isWalletEnabled,
  } = props;

  const handleCheckboxChange = () => {
    setIsWalletBalanceApplied(!isWalletBalanceApplied);
    toggleMyWallet(!isWalletBalanceApplied);
  };

  useEffect(() => {
    getReward();
    const currency = getCurrency();
    if (currency) {
      setCurrencyCode(currency);
    }
  }, []);

  return (
    <>
      {isWalletEnabled && (
        <div className="UseMyWallet">
          <Loader isLoading={isLoading} />
          <div>
            <div className="Heading">{__("My Rewards")}</div>
            <div className="SubHeading">
              {__("Eligible to use")}
              <span className="boldAmount">
                {" "}
                {currencyCode} {eligibleAmount}
              </span>{" "}
              {__("of")}{" "}
              <span className="boldAmount"> {myWallet?.current_balance}</span>
            </div>
          </div>
          <div>
            <div className="toggle-switch" onClick={handleCheckboxChange}>
              <div
                className={`switch ${isWalletBalanceApplied ? "on" : "off"}`}
              >
                <div className="toggle">
                  <img src={isWalletBalanceApplied ? SelectIcon : CrossIcon} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(UseMyWallet);
