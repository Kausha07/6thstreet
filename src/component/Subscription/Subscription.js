import { useState } from "react";
import { isArabic } from "Util/App";
import { useDispatch } from "react-redux";
import { showNotification } from "Store/Notification/Notification.action";
import { subscribeToNewsletter } from "./../../../src/util/API/endpoint/MyAccount/MyAccount.enpoint";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { EVENT_EMAIL_FOOTER_SUCCESS_CLICK } from "Util/Event";
import InfoIcon from "./ImagesAndIcons/info.svg";
import SendAnimation from "./ImagesAndIcons/SendAnimation.json";
import lottie from "lottie-web";

import "./Subscription.style.scss";

export default function Subscription() {
  const [emailValidated, setEmailValidated] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [showSubmitText, setShowSubmitText] = useState(true);
  const [email, setEmail] = useState("");
  const isArabicValue = isArabic();
  const isEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const emailInputChange = (email) => {
    setEmail(email);
    if (!isEmail(email)) {
      setEmailValidated(false);
      setIsSubmitDisabled(true);
    } else if (isEmail(email)) {
      setEmailValidated(true);
      setIsSubmitDisabled(false);
    }
  };

  const dispatch = useDispatch();

  function showSubmitAnimation() {
    setShowSubmitText(false);
    lottie.loadAnimation({
      container: document.querySelector("#submit-subscription"),
      animationData: SendAnimation,
      loop: false,
    });
  }

  const HandleSubscription = async (dispatch) => {
    try {
      setIsSubmitDisabled(true);
      const response = await subscribeToNewsletter({ email: email });

      if (
        response &&
        response.success &&
        response.data &&
        response.data.message
      ) {
        if (typeof response.data.message === "string") {
          const messageString = response.data.message;
          dispatch(showNotification("success", messageString));
          Moengage.track_event(EVENT_EMAIL_FOOTER_SUCCESS_CLICK, {
            country: getCountryFromUrl().toUpperCase(),
            language: getLanguageFromUrl().toUpperCase(),
            app6thstreet_platform: "Web",
            email: email || "",
          });
          showSubmitAnimation();
        }
      } else if (response && !response.success && response.data) {
        if (typeof response.data === "string") {
          dispatch(showNotification("error", response.data));
        }
      }
      setIsSubmitDisabled(false);
    } catch (error) {
      if (typeof error === "string") {
        dispatch(showNotification("error", error));
      } else {
        dispatch(showNotification("error", "some error occurred"));
      }
    }
  };

  return (
    <div>
      <div
        className={
          isArabicValue
            ? "subscriptionContainer arabicStyleContainer"
            : "subscriptionContainer"
        }
      >
        <div className="subscriptionText">
          {__(
            "Sign up & be the first to know about product arrivals & exclusive offers"
          )}
        </div>
        <div className="formContainer">
          <div className="emailContainer">
            <input
              className={
                isArabicValue ? "emailInput arabicStyleInput" : "emailInput"
              }
              placeholder={__("ENTER YOUR EMAIL")}
              type="email"
              onChange={(e) => {
                lottie.destroy();
                setShowSubmitText(true);
                emailInputChange(e.target.value);
              }}
            />
            {!!!emailValidated && email.length ? (
              <span className="errorMsg">
                <img className="infoIcon" src={InfoIcon} alt="info" />
                {__("Please fill in a valid email address")}
              </span>
            ) : null}
          </div>
          <button
            className={isSubmitDisabled? "submitBtn disabledBtn" : "submitBtn"}
            onClick={() => {
              HandleSubscription(dispatch);
            }}
            disabled={isSubmitDisabled}
            id="submit-subscription"
          >
            {showSubmitText && __("Submit")}
          </button>
        </div>
      </div>
    </div>
  );
}
