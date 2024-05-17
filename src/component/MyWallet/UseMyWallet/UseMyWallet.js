import Loader from "Component/Loader";
import { getStore } from "Store";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { getCurrency } from "Util/App";
import { getLanguageFromUrl } from "Util/Url";
import MyWalletDispatcher from "Store/MyWallet/MyWallet.dispatcher";
import CartDispatcher from "Store/Cart/Cart.dispatcher";
import CrossIcon from "./../IconsAndImages/CrossIcon.svg";
import SelectIcon from "./../IconsAndImages/SelectIcon.svg";
import { EligibiltyPopup } from "../HelperComponents/HelperComponents.js";
import { showNotification } from "Store/Notification/Notification.action";
import {
  applyRewards,
  removeReward,
} from "Util/API/endpoint/Wallet/Wallet.endpoint";
import "./UseMyWallet.style.scss";

export const mapStateToProps = (state) => ({
  isLoading: state.MyWalletReducer.isLoading,
  myWallet: state.MyWalletReducer.myWallet,
  isWalletEnabled: state.AppConfig.isWalletV1Enabled,
});

export const mapDispatchToProps = (dispatch) => ({
  toggleMyWallet: (apply) => MyWalletDispatcher.toggleMyWallet(dispatch, apply),
  getReward: () => MyWalletDispatcher.getReward(dispatch),
  showNotification: (type, message) =>
    dispatch(showNotification(type, message)),
  updateTotals: (cartId) => CartDispatcher.getCartTotals(dispatch, cartId),
});

export function UseMyWallet(props) {
  const [isWalletBalanceApplied, setIsWalletBalanceApplied] = useState(false);
  const [currencyCode, setCurrencyCode] = useState("");
  const [isEligiblityPopUpVisible, setIsEligiblityPopUpVisible] =
    useState(false);
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);

  const {
    getReward,
    eligibleAmount,
    myWallet,
    isLoading,
    isWalletEnabled,
    updateTotals,
    showNotification,
  } = props;

  const countryCode = getLanguageFromUrl().toUpperCase();

  const handleCheckboxChange = async () => {
    setIsLoadingLocal(true);
    const {
      Cart: { cartId },
    } = getStore().getState();

    try {
      if (!isWalletBalanceApplied) {
        const response = await applyRewards(cartId);
        if (response?.data?.success) {
          setIsWalletBalanceApplied(true);
          showNotification("success", __("My Rewards are applied!"));
        }
      } else {
        const response = await removeReward(cartId);
        if (response?.data?.success) {
          setIsWalletBalanceApplied(false);
          showNotification("success", __("My Rewards are removed!"));
        }
      }

      updateTotals(cartId);
      getReward();
      setIsLoadingLocal(false);
    } catch (error) {
      setIsLoadingLocal(false);
      showNotification(
        "error",
        __("There was an error, please try again later.")
      );
    }
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
      {isWalletEnabled && eligibleAmount > 0 && (
        <div className="UseMyWallet">
          <Loader isLoading={isLoading || isLoadingLocal} />
          <div>
            <div className="Heading">{__("My Rewards")}</div>
            <div
              className="SubHeading"
              onClick={() =>
                setIsEligiblityPopUpVisible(!isEligiblityPopUpVisible)
              }
            >
              {__("Eligible to use")}
              <span className="boldAmount">
                {" "}
                {currencyCode} {eligibleAmount}
              </span>{" "}
              {__("of")}{" "}
              <span className="boldAmount"> {myWallet?.current_balance}</span>
            </div>
            {isEligiblityPopUpVisible && (
              <EligibiltyPopup
                setIsVisible={setIsEligiblityPopUpVisible}
                percentage={myWallet?.redeem_limit_percentage}
                amount={myWallet?.max_redeemable_amount}
              />
            )}
            <div className="expiring">
              {myWallet?.expiring_amount} {__("is expiring in")}{" "}
              {myWallet?.expires_within_days} days
            </div>
          </div>
          <div>
            <div className="toggle-switch" onClick={handleCheckboxChange}>
              <div
                className={`switch ${isWalletBalanceApplied ? "on" : "off"}`}
              >
                <div
                  className={
                    countryCode == "AR" ? "toggle toggleAr" : "toggle toggleEn"
                  }
                >
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
