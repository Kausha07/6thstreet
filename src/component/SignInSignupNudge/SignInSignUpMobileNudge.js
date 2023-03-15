import { useState, useEffect, useRef } from "react";
import isMobile from "Util/Mobile";
import { isSignedIn } from "Util/Auth";
import { isArabic } from "Util/App";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import {
  EVENT_ACCOUNT_TOOLTIP_CLOSE_BUTTON_CLICK,
  EVENT_LOGIN_NUDGE_CLICK,
  EVENT_REGISTER_NUDGE_CLICK,
  MOE_trackEvent,
} from "Util/Event";
import MyAccountOverlay from "Component/MyAccountOverlay";
import NudgeCross from "./ImagesAndIcons/nudgeCross.svg";

import "./SignInSignUpMobileNudge.style.scss";

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
    //can be optimized further by wrapping handeler in useCallback
  }, [ref, handler]);
}

export default function SignInSignUpMobileNudge() {
  const [nudgeTimer, setNudgeTimer] = useState(15);
  const [isNudgeVisible, setIsNudgeVisible] = useState(true);
  const [showSignInSignUpPopUp, setShowSignInSignUpPopUp] = useState(false);
  const [isRegisterScreen, setIsRegisterScreen] = useState(false);
  const [firstNudgeRender, setFirstNudgeRender] = useState(false);
  const [isOneDayCompleted, setIsOneDayCompleted] = useState(false);
  let timer;
  const isArabicValue = isArabic();
  const mobileNudgeRef = useRef();
  const miliSecsInADay = 86400000;

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
    } else if (Date.now() - lastNudgeShownTimeValue >= miliSecsInADay) {
      setIsOneDayCompleted(true);
    }
  }, []);

  useOnClickOutside(mobileNudgeRef, () => setIsNudgeVisible(false));

  const closeNudge = () => {
    localStorage.setItem("lastNudgeShownTime", Date.now());
    setIsNudgeVisible(false);
    MOE_trackEvent(EVENT_ACCOUNT_TOOLTIP_CLOSE_BUTTON_CLICK, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      app6thstreet_platform: "mSite Web",
    });
  };
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
      (window.location.pathname == "/" ||
        window.location.pathname == "/women.html" ||
        window.location.pathname == "/men.html" ||
        window.location.pathname == "/kids.html" ||
        window.location.pathname == "/home.html") &&
      (firstNudgeRender || isOneDayCompleted) ? (
        <div
          className={
            isArabicValue
              ? "mobile-nudge-container invert-text"
              : "mobile-nudge-container"
          }
          ref={mobileNudgeRef}
        >
          <div className="content-container">
            <p className="nudge-heading">
              {__("Welcome to 6thstreet")}
              <span
                className={
                  isArabicValue ? "close-btn invert-cross" : "close-btn"
                }
                onClick={closeNudge}
              >
                <img onClick={closeNudge} src={NudgeCross} alt="close" />
              </span>
            </p>
            <p className="nudge-content">
              {__("To know about our new arrivals & exclusive offers,")}
              <span
                className="underlined"
                onClick={() => {
                  setIsNudgeVisible(false);
                  setShowSignInSignUpPopUp(true);
                  MOE_trackEvent(EVENT_LOGIN_NUDGE_CLICK, {
                    country: getCountryFromUrl().toUpperCase(),
                    language: getLanguageFromUrl().toUpperCase(),
                    app6thstreet_platform: "mSite Web",
                  });
                }}
              >
                {__("Sign in")}
              </span>
              {__("or")}
              <span
                className="underlined"
                onClick={() => {
                  setIsRegisterScreen(true);
                  setShowSignInSignUpPopUp(true);
                  setIsNudgeVisible(false);
                  MOE_trackEvent(EVENT_REGISTER_NUDGE_CLICK, {
                    country: getCountryFromUrl().toUpperCase(),
                    language: getLanguageFromUrl().toUpperCase(),
                    app6thstreet_platform: "mSite Web",
                  });
                }}
              >
                {__("Register")}
              </span>
            </p>
          </div>
          <div className="nudge-arrow-container">
            <div
              className={
                isArabicValue ? "nudge-arrow invert-arrow" : "nudge-arrow"
              }
            >
              {/* this is nudge */}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
