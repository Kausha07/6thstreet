import { useState, useEffect } from "react";
import { isSignedIn } from "Util/Auth";
import { isArabic } from "Util/App";
import MyAccountOverlay from "Component/MyAccountOverlay";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import {
  EVENT_LOGIN_NUDGE_CLICK,
  EVENT_REGISTER_NUDGE_CLICK,
  MOE_trackEvent,
} from "Util/Event";

import "./SignInSignupNudge.style.scss";

export default function SignInSignupNudge() {
  const [nudgeTimer, setNudgeTimer] = useState(15);
  const [isNudgeVisible, setIsNudgeVisible] = useState(true);
  const [showSignInSignUpPopUp, setShowSignInSignUpPopUp] = useState(false);
  const [isRegisterScreen, setIsRegisterScreen] = useState(false);

  let timer;
  const isArabicValue = isArabic();
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
      {isNudgeVisible &&
      !isSignedIn() &&
      (window.location.pathname == "/" ||
        window.location.pathname == "/women.html" ||
        window.location.pathname == "/men.html" ||
        window.location.pathname == "/kids.html" ||
        window.location.pathname == "/home.html") ? (
        <div>
          <div
            className={
              isArabicValue
                ? "nudge-container arabic-alignment"
                : "nudge-container"
            }
          >
            <div className="nudge-content">
              <button
                className="signin"
                onClick={() => {
                  setIsNudgeVisible(false);
                  setShowSignInSignUpPopUp(true);
                  setIsRegisterScreen(false);
                  MOE_trackEvent(EVENT_LOGIN_NUDGE_CLICK, {
                    country: getCountryFromUrl().toUpperCase(),
                    language: getLanguageFromUrl().toUpperCase(),
                    app6thstreet_platform: "Web",
                  });
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
                    MOE_trackEvent(EVENT_REGISTER_NUDGE_CLICK, {
                      country: getCountryFromUrl().toUpperCase(),
                      language: getLanguageFromUrl().toUpperCase(),
                      app6thstreet_platform: "Web",
                    });
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
