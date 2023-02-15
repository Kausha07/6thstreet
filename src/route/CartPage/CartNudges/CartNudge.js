import { useState } from "react";

import { isSignedIn } from "Util/Auth";
import MyAccountOverlay from "Component/MyAccountOverlay";
import ShoppingGif from "../icons/shopping-bag.gif";
import closeIcon from "../icons/close-black.png";

import "./CartNudge.style.scss";

export default function CartNudge() {
  const [isNudgeVisible, setIsNudgeVisible] = useState(true);
  const [showSignInSignUpPopUp, setShowSignInSignUpPopUp] = useState(false);

  return isNudgeVisible && !isSignedIn() ? (
    <>
      {showSignInSignUpPopUp && (
        <MyAccountOverlay
          closePopup={() => setShowSignInSignUpPopUp(false)}
          onSignIn={() => setShowSignInSignUpPopUp(false)}
          isPopup
        />
      )}
      <div className="cart-nudge-container">
        <div className="gif">
          <img src={ShoppingGif} alt="shop" />
        </div>
        <div>
          <p className="content">
            {__("Login to 6thStreet app to synchronize your shopping bag.")}
            <span
              className="signin"
              onClick={() => setShowSignInSignUpPopUp(true)}
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
