import { useState } from "react";
import { isArabic } from "Util/App";
import { useDispatch } from "react-redux";
import { showNotification } from "Store/Notification/Notification.action";
import { subscribeToNewsletter } from "./../../../src/util/API/endpoint/MyAccount/MyAccount.enpoint";

import "./Subscription.style.scss";

export default function Subscription() {
  const [emailValidated, setEmailValidated] = useState(false);
  const [email, setEmail] = useState("");
  const isArabicValue = isArabic();
  const isEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const emailInputChange = (email) => {
    setEmail(email);
    if (!isEmail(email)) {
      setEmailValidated(false);
    } else if (isEmail(email)) {
      setEmailValidated(true);
    }
  };

  const dispatch = useDispatch();

  const HandleSubscription = async (dispatch) => {
    try {
      const response = await subscribeToNewsletter({ email: email });

      if (
        response &&
        response.status &&
        response.data &&
        response.data.message
      ) {
        if (typeof response.data.message === "string") {
          const messageString = response.data.message;
          dispatch(showNotification("success", messageString));
        }
      }
      if (response && !response.status && response.data) {
        if (typeof response.data.message === "string") {
          dispatch(showNotification("success", response.data));
        }
      }
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
              onChange={(e) => emailInputChange(e.target.value)}
            />
            {!!!emailValidated && email.length ? (
              <span className="errorMsg">
                {__("Please fill in a valid email address")}
              </span>
            ) : null}
          </div>
          <button
            className="submitBtn"
            onClick={() => HandleSubscription(dispatch)}
          >
            {__("Submit")}
          </button>
        </div>
      </div>
    </div>
  );
}
