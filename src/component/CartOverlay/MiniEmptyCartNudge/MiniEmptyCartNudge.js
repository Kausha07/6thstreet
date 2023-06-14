import { useState } from "react";

import { isSignedIn } from "Util/Auth";
import MyAccountOverlay from "Component/MyAccountOverlay";
import shopbag from "./icons/shopbag.gif";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { EVENT_LOGIN_CLICK, MOE_trackEvent } from "Util/Event";

import "./MiniEmptyCartNudge.style.scss";

export default function MiniEmptyCartNudge() {
  const [showSignInSignUpPopUp, setShowSignInSignUpPopUp] = useState(false);

  return !isSignedIn() ? (
    <>
      {showSignInSignUpPopUp && (
        <MyAccountOverlay
          closePopup={() => setShowSignInSignUpPopUp(false)}
          onSignIn={() => setShowSignInSignUpPopUp(false)}
          isPopup
        />
      )}
      <div className="empty-cart-nudge-container">
        <div className="content">
          <div className="gif">
            <img src={shopbag} alt="shop" />
          </div>
          <div className="content-text">
            <span
              className="btnsSignInRegister"
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
              {__("Login")}{" "}
            </span>
            {__("to 6thStreet & continue shopping for your favourite items.")}
          </div>
        </div>
      </div>
    </>
  ) : null;
}
