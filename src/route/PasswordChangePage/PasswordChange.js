import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { isArabic } from "Util/App";
import Link from "Component/Link";
import {
  mapDispatchToProps as sourceMapDispatchToProps,
  mapStateToProps,
} from "SourceRoute/PasswordChangePage/PasswordChangePage.container";
import MyAccountDispatcher from "Store/MyAccount/MyAccount.dispatcher";
import { getQueryParam } from "Util/Url";
import ContentWrapper from "Component/ContentWrapper";
import Field from "Component/Field";
import Form from "Component/Form";
import Loader from "Component/Loader";
import successTick from "./IconsAndImages/successTick.png";
import errorCross from "./IconsAndImages/errorCross.png";
import PasswordChangeSuccessPage from "./PasswordChangeSuccessPage";
import "./PasswordChange.style.scss";

export const mapDispatchToProps = (dispatch) => ({
  ...sourceMapDispatchToProps(dispatch),
  resetPassword: (data) => MyAccountDispatcher.resetPassword(data),
});

export function PasswordChange(props) {
  const { onPasswordAttempt, onError } = props;
  const [isLoading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState(null);
  const [repeatPassword, setRepeatPassword] = useState(null);
  const [isAtleastOneCapital, setIsAtleastOneCapital] = useState(false);
  const [isAtleastOneDigit, setIsatleastOneDigit] = useState(false);
  const [isSavePasswordDisabled, setIsSavePasswordDisabled] = useState(true);
  const [isPasswordSuccessfull, setIsPasswordSuccessfull] = useState(false);
  const AtleastOneCapitalRegex = /[A-Z][A-Z]*/;
  const AtleastOneDigitRegex = /\d/;
  const PasswordLengthRequired = 8;
  const isArabicStyle = isArabic();

  useEffect(() => {
    if (
      isAtleastOneCapital &&
      isAtleastOneDigit &&
      newPassword?.length >= PasswordLengthRequired &&
      newPassword === repeatPassword
    ) {
      setIsSavePasswordDisabled(false);
    } else {
      setIsSavePasswordDisabled(true);
    }
  }, [newPassword, repeatPassword]);

  function onNewPasswordChange(password) {
    if (AtleastOneCapitalRegex.test(password)) {
      setIsAtleastOneCapital(true);
    } else if (!AtleastOneCapitalRegex.test(password)) {
      setIsAtleastOneCapital(false);
    }
    if (AtleastOneDigitRegex.test(password)) {
      setIsatleastOneDigit(true);
    } else if (!AtleastOneDigitRegex.test(password)) {
      setIsatleastOneDigit(false);
    }
    if (newPassword === null || password.length === 0) {
      setIsatleastOneDigit(false);
      setIsAtleastOneCapital(false);
    }
    setNewPassword(password);
  }

  function onPasswordSuccess(fields) {
    const { resetPassword, location, showNotification } = props;
    const { passwordReset: password } = fields;
    const token = getQueryParam("token", location);
    setLoading(true);
    resetPassword({ newPassword: password, resetToken: token }).then(
      (response) => {
        switch (typeof response) {
          case "string":
            showNotification("error", __(response));

            break;
          case "boolean":
            showNotification(
              "success",
              __("Password has been successfully updated!")
            );
            setIsPasswordSuccessfull(true);

            break;
          default:
            showNotification("error", __("Something Went Wrong"));

            break;
        }
        setLoading(false);
      }
    );
  }

  return isPasswordSuccessfull ? (
    <>
      <PasswordChangeSuccessPage />
    </>
  ) : (
    <>
      <main
        block="PasswordChangePageV1"
        aria-label={__("Password Change Page")}
      >
        <ContentWrapper
          mix={{ block: "PasswordChangePageV1" }}
          wrapperMix={{
            block: "PasswordChangePageV1",
            elem: "Wrapper",
            mods: { isArabicStyle },
          }}
          label={__("Password Change Actions")}
        >
          <Loader isLoading={isLoading} />
          <h1>{__("Reset Password")}</h1>
          <p>
            {__(
              `You have requested to change your password. If you didn't initiated this process, please contact our customer service.`
            )}
          </p>
          <Form
            key="reset-password"
            onSubmit={onPasswordAttempt}
            onSubmitSuccess={onPasswordSuccess}
            onSubmitError={onError}
          >
            <Field
              type="password"
              placeholder={__("New password")}
              id="passwordReset"
              name="passwordReset"
              autocomplete="new-password"
              validation={["notEmpty", "password"]}
              value={newPassword}
              onChange={(password) => onNewPasswordChange(password)}
            />
            <Field
              type="password"
              placeholder={__("Repeat password")}
              id="passwordResetConfirm"
              name="passwordResetConfirm"
              autocomplete="new-password"
              validation={["notEmpty", "password"]}
              value={repeatPassword}
              onChange={(password) => setRepeatPassword(password)}
            />
            <div className="error-msgs">
              <div className="msg">
                <span className="msgs-icon">
                  <img
                    src={isAtleastOneCapital ? successTick : errorCross}
                    alt="error"
                  />
                </span>
                <span className={!isAtleastOneCapital ? "error" : "succuss"}>
                  {__("At least one uppercase letter")}
                </span>
              </div>
              <div className="msg">
                <span className="msgs-icon">
                  <img
                    src={isAtleastOneDigit ? successTick : errorCross}
                    alt="error"
                  />
                </span>
                <span className={!isAtleastOneDigit ? "error" : "succuss"}>
                  {__("At least one digit")}
                </span>
              </div>
              <div className="msg">
                <span className="msgs-icon">
                  <img
                    src={
                      newPassword &&
                      newPassword.length >= PasswordLengthRequired
                        ? successTick
                        : errorCross
                    }
                    alt="error"
                  />
                </span>
                <span
                  className={
                    newPassword && newPassword.length >= PasswordLengthRequired
                      ? "succuss"
                      : "error"
                  }
                >
                  {__("At least 8 character in length")}
                </span>
              </div>
            </div>
            {/* commenting the below code as it has to released in next release as enhancement */}
            {/* <div>
              <p className="terms-conditions">
                {__("By resetting your password you agree with our")}
                <Link to={`/disclaimer`}>
                  <span className="underlined">{__("Terms & Conditions")}</span>
                </Link>
                {__("and")}
                <Link to={`/privacy-policy`}>
                  <span className="underlined">{__("Privacy Policy")}</span>
                </Link>
              </p>
            </div> */}
            <div className="save-btn">
              <button
                type="submit"
                className={isSavePasswordDisabled ? "disabled-btn" : ""}
                disabled={isSavePasswordDisabled || isLoading}
              >
                {__("Save")}
              </button>
            </div>
          </Form>
        </ContentWrapper>
      </main>
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordChange);
