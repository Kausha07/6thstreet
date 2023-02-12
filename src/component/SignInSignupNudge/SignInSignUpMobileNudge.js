import { useState, useEffect } from "react";
import isMobile from "Util/Mobile";
import { isSignedIn } from "Util/Auth";
import MyAccountOverlay from "Component/MyAccountOverlay";

import "./SignInSignUpMobileNudge.style.scss";

export default function SignInSignUpMobileNudge() {
  const [nudgeTimer, setNudgeTimer] = useState(7);
  const [isNudgeVisible, setIsNudgeVisible] = useState(true);
  const [showSignInSignUpPopUp, setShowSignInSignUpPopUp] = useState(false);
  const [isRegisterScreen, setIsRegisterScreen] = useState(false);
  const [firstNudgeRender, setFirstNudgeRender] = useState(false);
  const [isOneDayCompleted, setIsOneDayCompleted] = useState(false);
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
  useEffect(() => {
    const lastNudgeShownTimeValue = localStorage.getItem("lastNudgeShownTime");
    if (!lastNudgeShownTimeValue) {
      setFirstNudgeRender(true);
    } else if (lastNudgeShownTimeValue < new Date()) {
      setIsOneDayCompleted(true);
    }
    if (!isSignedIn()) {
      localStorage.setItem("lastNudgeShownTime", new Date());
    }
  }, []);

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
      {isNudgeVisible &&
      isMobile.any() &&
      !isSignedIn() &&
      (firstNudgeRender || isOneDayCompleted) ? (
        <div className="mobile-nudge-container">
          <p className="nudge-heading">
            {__("Welcome to 6thstreet")}
            <span
              className="close-btn"
              onClick={() => setIsNudgeVisible(false)}
            >
              X
            </span>
          </p>
          <p className="nudge-content">
            {__("To know about our new arrivals & exclusive offers,")}
            <span
              className="underlined"
              onClick={() => {
                setIsNudgeVisible(false);
                setShowSignInSignUpPopUp(true);
              }}
            >
              {__("Sign in")}
            </span>
            {__("or")}{" "}
            <span
              className="underlined"
              onClick={() => {
                setIsRegisterScreen(true);
                setShowSignInSignUpPopUp(true);
                setIsNudgeVisible(false);
              }}
            >
              {__("create account")}
            </span>
          </p>
        </div>
      ) : null}
    </>
  );
}
