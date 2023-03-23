import { useState } from "react";

import { isSignedIn } from "Util/Auth";
import MyAccountOverlay from "Component/MyAccountOverlay";
import shopbag from "./icons/shopbag.gif";

import "./MiniEmptyCartNudge.style.scss";

export default function MiniEmptyCartNudge() {
  const [showSignInSignUpPopUp, setShowSignInSignUpPopUp] = useState(false);
  const [isRegisterScreen, setIsRegisterScreen] = useState(false);

  return !isSignedIn() ? (
    <>
      {showSignInSignUpPopUp && (
        <MyAccountOverlay
          closePopup={() => setShowSignInSignUpPopUp(false)}
          onSignIn={() => setShowSignInSignUpPopUp(false)}
          isPopup
          showRegisterScreen={isRegisterScreen}
        />
      )}
      <div className="empty-cart-nudge-container">
        <div className="content">
          <div className="gif">
            <img src={shopbag} alt="shop" />
          </div>
          <div className="content-text">
            {__(
              "Login to 6thStreet & continue shopping for your favourite items."
            )}
            <div>
              <button
                onClick={() => {
                  setShowSignInSignUpPopUp(true);
                  setIsRegisterScreen(false);
                }}
                className="btnsSignInRegister"
              >
                {__("Sign in")}
              </button>{" "}
              {__("or")}{" "}
              <button
                onClick={() => {
                  setShowSignInSignUpPopUp(true);
                  setIsRegisterScreen(true);
                }}
                className="btnsSignInRegister"
              >
                {__("Register")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;
}
