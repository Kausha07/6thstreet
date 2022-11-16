import { useState } from "react";
import { isArabic } from "Util/App";
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
          <button className="submitBtn">{__("Submit")}</button>
        </div>
      </div>
    </div>
  );
}
