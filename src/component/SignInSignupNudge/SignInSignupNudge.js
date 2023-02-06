import { useState, useEffect } from "react";
import MyAccountOverlay from "Component/MyAccountOverlay";

import "./SignInSignupNudge.style.scss";

export default function SignInSignupNudge() {
  const [nudgeTimer, setNudgeTimer] = useState(7);
  const [isNudgeVisible, setIsNudgeVisible] = useState(true);
  const [showSignInSignUpPopUp, setShowSignInSignUpPopUp] = useState(false);
  const [isRegisterScreen, setIsRegisterScreen] = useState(false);

  let timer;
  useEffect(() => {
    timer = setTimeout(() => {
      setNudgeTimer(() => nudgeTimer - 1);
    }, 1000);
  });
  useEffect(() => {
    if (nudgeTimer === 0 || nudgeTimer < 0) {
      setIsNudgeVisible(false);
      clearInterval(timer);
    }
  });

  return (
    <>
      {showSignInSignUpPopUp && (
        <MyAccountOverlay
          closePopup={() => setShowSignInSignUpPopUp(false)}
          onSignIn={() => setShowSignInSignUpPopUp(false)}
          isPopup
          showRegisterScreen={isRegisterScreen}
        />
      )}
      {isNudgeVisible ? (
        <div>
          <div className="nudge-container">
            <div className="nudge-arrow-container">
              <div className="nudge-arrow">{/* this is nudge */}</div>
            </div>

            <div className="nudge-content">
              <button
                className="signin"
                onClick={() => {
                  setIsNudgeVisible(false);
                  setShowSignInSignUpPopUp(true);
                }}
              >
                {__("sign in")}
              </button>
              <div className="newCostomer">
                {__("New Customer?")}
                <span
                  className="register"
                  onClick={() => {
                    setIsRegisterScreen(true);
                    setShowSignInSignUpPopUp(true);
                    setIsNudgeVisible(false);
                  }}
                >
                  {__("Register")}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
