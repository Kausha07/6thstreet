import { useState } from "react";

import { useSelector } from "react-redux";
import { isSignedIn } from "Util/Auth";
import MyAccountOverlay from "Component/MyAccountOverlay";
import ShoppingGif from "../icons/shopping-bag.gif";
import closeIcon from "../icons/close-black.png";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { EVENT_LOGIN_CLICK, MOE_trackEvent } from "Util/Event";

import "./CartNudge.style.scss";

export default function CartNudge() {
  const [isNudgeVisible, setIsNudgeVisible] = useState(true);
  const [showSignInSignUpPopUp, setShowSignInSignUpPopUp] = useState(false);

  const isSignInCartNudgeEnabled = useSelector(
    (state) => state.AppConfig.isSignInCartNudgeEnabled
  );

  return isNudgeVisible && !isSignedIn() && isSignInCartNudgeEnabled ? (
    <>
      {showSignInSignUpPopUp && (
        <MyAccountOverlay
          closePopup={() => setShowSignInSignUpPopUp(false)}
          onSignIn={() => setShowSignInSignUpPopUp(false)}
          isPopup
        />
      )}
      <div className="cart-nudge-container">
        <div className="content-close">
          <div className="gif">
            <img src={ShoppingGif} alt="shop" />
          </div>
          <p className="content">
            {__("Login to 6thStreet to synchronize your shopping bag.")}
            <span
              className="signin"
              onClick={() => {
                setShowSignInSignUpPopUp(true);
                MOE_trackEvent(EVENT_LOGIN_CLICK, {
                  country: getCountryFromUrl().toUpperCase(),
                  language: getLanguageFromUrl().toUpperCase(),
                  app6thstreet_platform: "Web",
                  screenName: "cart_nudge",
                });
              }}
            >
              {__("Sign in")}
            </span>
          </p>
        </div>
        <div className="close" onClick={() => setIsNudgeVisible(false)}>
          <img src={closeIcon} alt="close" />
        </div>
      </div>
    </>
  ) : null;
}
