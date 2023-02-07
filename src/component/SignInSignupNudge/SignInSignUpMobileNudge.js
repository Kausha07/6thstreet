import { useState, useEffect } from "react";
import isMobile from "Util/Mobile";
import MyAccountOverlay from "Component/MyAccountOverlay";

import "./SignInSignUpMobileNudge.style.scss";

export default function SignInSignUpMobileNudge() {
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
      {isNudgeVisible && isMobile.any() ? (
        <div className="mobile-nudge-container">
          <p className="nudge-heading">
            Welcome to 6thstreet
            <span
              className="close-btn"
              onClick={() => setIsNudgeVisible(false)}
            >
              X
            </span>
          </p>
          <p className="nudge-content">
            To know about our new arrivals & exclusive offers,{" "}
            <span
              className="underlined"
              onClick={() => {
                setIsNudgeVisible(false);
                setShowSignInSignUpPopUp(true);
              }}
            >
              Sign in
            </span>
            or{" "}
            <span
              className="underlined"
              onClick={() => {
                setIsRegisterScreen(true);
                setShowSignInSignUpPopUp(true);
                setIsNudgeVisible(false);
              }}
            >
              create account
            </span>
          </p>
        </div>
      ) : null}
      ;
    </>
  );
}
