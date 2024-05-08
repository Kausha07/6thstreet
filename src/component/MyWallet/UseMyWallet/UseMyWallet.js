import Field from "Component/Field";
import Loader from "Component/Loader";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import MyWalletDispatcher from "Store/MyWallet/MyWallet.dispatcher";
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
  const {
    toggleMyWallet,
    getReward,
    eligibleAmount,
    myWallet,
    isLoading,
    isWalletEnabled,
  } = props;
  const checkboxId = "My_wallet_applied";
  const handleCheckboxChange = () => {
    toggleMyWallet(!isWalletBalanceApplied);
    setIsWalletBalanceApplied(() => !isWalletBalanceApplied);
  };

  useEffect(() => {
    getReward();
  }, []);

  return (
    <>
      {isWalletEnabled && (
        <div className="UseMyWallet">
          <Loader isLoading={isLoading} />
          <div>
            <div className="Heading">{__("My Rewards")}</div>
            <div className="SubHeading">
              {__("Eligible to use")}{" "}
              <span className="boldAmount"> {eligibleAmount} </span> {__("of")}
              <span className="boldAmount"> {myWallet?.current_balance}</span>
            </div>
          </div>
          <div>
            <Field
              block="StoreCredit"
              elem="Toggle"
              type="toggle"
              id={checkboxId}
              name={checkboxId}
              value={checkboxId}
              checked={isWalletBalanceApplied}
              onClick={handleCheckboxChange}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(UseMyWallet);
