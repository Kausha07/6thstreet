/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import PropTypes from "prop-types";
import { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import CountrySwitcher from "Component/CountrySwitcher";
import LanguageSwitcher from "Component/LanguageSwitcher";
import Field from "SourceComponent/Field";
import Form from "SourceComponent/Form";
import Loader from "SourceComponent/Loader";
import Overlay from "SourceComponent/Overlay";
import PhoneCountryCodeField from "Component/PhoneCountryCodeField";
import { PHONE_CODES } from "Component/MyAccountAddressFieldForm/MyAccountAddressFieldForm.config";
import { COUNTRY_CODES_FOR_PHONE_VALIDATION } from "Component/MyAccountAddressForm/MyAccountAddressForm.config";
import { Close } from "Component/Icons";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Return,
  Shipping,
} from "Component/Icons";
import OrdersIcon from "./icons/cat-menu.svg";
import ReturnIcon from "./icons/return.svg";
import HeartIcon from "./icons/heart-regular.svg";
import { ThreeDots, Oval } from "react-loader-spinner";
import MyAccountAutoDetectOTP from "./MyAccountAutoDetectOTP";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import Link from "Component/Link";
import {
  deleteAuthorizationToken,
  deleteMobileAuthorizationToken,
} from "Util/Auth";
import BrowserDatabase from "Util/BrowserDatabase";
import {
  EVENT_LOGIN_CLICK,
  EVENT_REGISTER_CLICK,
  EVENT_GUEST_ORDERS_CLICK,
  EVENT_GUEST_RETURNS_CLICK,
  EVENT_RETURN_POLICY_CLICK,
  EVENT_SHIPPING_POLICY_CLICK,
  EVENT_FAQ_CLICK,
  EVENT_TYPE_USERNAME,
  EVENT_TYPE_PASSWORD,
  EVENT_FORGOT_PASSWORD_CLICK,
  EVENT_SIGN_IN_BUTTON_CLICK,
  EVENT_TYPE_PHONE_NUMBER,
  EVENT_TYPE_NAME,
  EVENT_TYPE_EMAIL_ID,
  EVENT_RESEND_OTP_CLICK,
  EVENT_OTP_VERIFY_WITH_EMAIL,
  EVENT_OTP_VERIFY_WITH_PHONE,
  EVENT_FORGOT_PASSWORD_SCREEN_VIEW,
} from "Util/Event";
import Image from "Component/Image";
import { CART_ID_CACHE_KEY } from "Store/MyAccount/MyAccount.dispatcher";
import {
  CUSTOMER_ACCOUNT_OVERLAY_KEY,
  STATE_CONFIRM_EMAIL,
  STATE_CREATE_ACCOUNT,
  STATE_FORGOT_PASSWORD,
  STATE_FORGOT_PASSWORD_SUCCESS,
  STATE_LOGGED_IN,
  STATE_SIGN_IN,
  ENABLE_OTP_LOGIN,
  STATE_INITIAL_LINKS,
  SSO_LOGIN_PROVIDERS,
  STATE_VERIFY_NUMBER,
  SECONDS_TO_RESEND_OTP,
} from "./MyAccountOverlay.config";
import "./MyAccountOverlay.style";

export class MyAccountOverlay extends PureComponent {
  constructor(props) {
    super(props);
    this.authRef = React.createRef();
    this.otpInput = React.createRef();
  }
  static propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    isOverlayVisible: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    state: PropTypes.oneOf([
      STATE_SIGN_IN,
      STATE_INITIAL_LINKS,
      STATE_FORGOT_PASSWORD,
      STATE_FORGOT_PASSWORD_SUCCESS,
      STATE_CREATE_ACCOUNT,
      STATE_LOGGED_IN,
      STATE_CONFIRM_EMAIL,
      STATE_VERIFY_NUMBER,
    ]).isRequired,
    onVisible: PropTypes.func.isRequired,
    onSignInSuccess: PropTypes.func.isRequired,
    onSignInAttempt: PropTypes.func.isRequired,
    onCreateAccountAttempt: PropTypes.func.isRequired,
    onCreateAccountSuccess: PropTypes.func.isRequired,
    onForgotPasswordSuccess: PropTypes.func.isRequired,
    onForgotPasswordAttempt: PropTypes.func.isRequired,
    onFormError: PropTypes.func.isRequired,
    handleForgotPassword: PropTypes.func.isRequired,
    handleSignIn: PropTypes.func.isRequired,
    handleCreateAccount: PropTypes.func.isRequired,
    onCreateAccountClick: PropTypes.func.isRequired,
    setRegisterFieldFalse: PropTypes.func,
    isCheckout: PropTypes.bool,
    registerField: PropTypes.bool,
    closePopup: PropTypes.func.isRequired,
    isHidden: PropTypes.bool,
    email: PropTypes.string,
  };

  static defaultProps = {
    isCheckout: false,
    registerField: false,
    setRegisterFieldFalse: null,
    isHidden: false,
    email: "",
  };

  state = {
    isPopup: false,
    gender: 3,
    isChecked: false,
    isArabic: isArabic(),
    isSignInValidated: false,
    isCreateValidated: false,
    isForgotValidated: false,
    isOTP: ENABLE_OTP_LOGIN,
    countryCode: PHONE_CODES[getCountryFromUrl()],
    focusedElement: false,
    otpTimer: SECONDS_TO_RESEND_OTP,
    isTimerEnabled: false,
    isVerifyEmailEnabled: false,
    isVerifyEmailViewState: false,
    failedRegistrationData: {},
    eventSent: false,
    otpAttempt: 1,
    registerDetailsEntered: false,
    emailFromCheckoutPage: null,
    phoneInSignin: null,
    currentPhoneCodeCountry: null,
    currentScreen: "",
    prevScreen: "",
  };

  componentDidMount() {
    if (isMobile.any()) {
      document.body.style.position = "fixed";
    }
    const { email, setCurrentOverlayState } = this.props;
    setCurrentOverlayState(this.props?.state);
    if (email) {
      this.setState({
        isOTP: false,
        emailFromCheckoutPage: email,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { setPrevScreenState, setCurrentOverlayState } = this.props;
    if (
      this.state.otpTimer === 0 &&
      this.state.isTimerEnabled &&
      this.timer != null
    ) {
      clearInterval(this.timer);
    }
    if (this.props.state === STATE_SIGN_IN) {
      clearInterval(this.timer);
      this.setState({
        isTimerEnabled: false,
        otpTimer: SECONDS_TO_RESEND_OTP,
      });
    }
    if (
      this.props.state === STATE_VERIFY_NUMBER &&
      !this.state.isTimerEnabled &&
      prevProps.isLoading == this.props.isLoading &&
      prevProps.state != this.props.state &&
      prevProps.customerLoginData != this.customerLoginData
    ) {
      this.OtpTimerFunction();
    }
    setCurrentOverlayState(this.props?.state);
    this.setState({ currentScreen: this.props?.state });
    if (prevProps.state !== this.props.state) {
      setPrevScreenState(prevProps.state);
      this.setState({ prevScreen: prevProps.state });
    }
  }

  OtpTimerFunction() {
    this.setState({
      otpTimer: SECONDS_TO_RESEND_OTP,
    });
    this.timer = setInterval(() => {
      this.setState({
        otpTimer: this.state.otpTimer - 1,
        isTimerEnabled: true,
      });
    }, 1000);
  }

  componentWillUnmount() {
    if (isMobile.any()) {
      document.body.style.position = "static";
    }
    if (this.timer != null && this.state.isTimerEnabled) {
      clearInterval(this.timer);
    }
  }

  renderMap = {
    [STATE_INITIAL_LINKS]: {
      render: () => this.renderInitialLinks(),
    },
    [STATE_SIGN_IN]: {
      render: () => this.renderSignIn(),
      title: __("Enter your Email or Phone number"),
    },
    [STATE_VERIFY_NUMBER]: {
      render: () => this.renderVerifyNumber(),
    },
    [STATE_FORGOT_PASSWORD]: {
      title: __("Forgot Password?"),
      render: () => this.renderForgotPassword(),
    },
    [STATE_FORGOT_PASSWORD_SUCCESS]: {
      render: () => this.renderForgotPasswordSuccess(),
    },
    [STATE_CREATE_ACCOUNT]: {
      render: () => this.renderCreateAccount(),
      title: __("Let's get personal"),
    },
    [STATE_LOGGED_IN]: {
      render: () => {},
    },
    [STATE_CONFIRM_EMAIL]: {
      render: () => this.renderConfirmEmail(),
      title: __("Confirm the email"),
    },
  };

  renderMyAccount() {
    const {
      state,
      handleSignIn,
      handleCreateAccount,
      onCreateAccountClick,
      setRegisterFieldFalse,
      registerField,
      sendEvents,
    } = this.props;
    const { render, title } = this.renderMap[state];
    const { isArabic } = this.state;
    const isSignIn = state === STATE_SIGN_IN;
    const isCreateAccount = state === STATE_CREATE_ACCOUNT;
    if (registerField) {
      onCreateAccountClick();
      setRegisterFieldFalse();
    }

    return (
      <div
        block="MyAccountOverlayV1"
        elem="ActionV1"
        mods={{
          state,
          MyAccountInitialLinks: state === STATE_INITIAL_LINKS && isArabic,
        }}
      >
        {state !== STATE_VERIFY_NUMBER && (
          <div className="MyAccountOverlayOuter">
            <div className="signInQuote">
              <h5>
                {__("Sign in for a")} <span>{__("personalised")} </span>
                {__("shopping experience")}
              </h5>
            </div>
          </div>
        )}
        <p
          block="MyAccountOverlayV1"
          elem="HeadingV1"
          mods={{ isArabic: isArabic }}
        >
          {title}
        </p>
        {render()}
        <div block="MyAccountOverlayV1" elem="Buttons">
          {isCreateAccount && (
            <div className="toggle-login-register">
              <span className="toggle-text">
                {__("I already have an account.")}
              </span>
              <button
                onClick={(e) => {
                  handleSignIn(e);
                  sendEvents(EVENT_LOGIN_CLICK);
                  this.setState({
                    failedRegistrationData: {},
                    countryCode: PHONE_CODES[getCountryFromUrl()],
                  });
                  if (this.state.emailFromCheckoutPage) {
                    this.setState({
                      emailFromCheckoutPage: null,
                    });
                  }
                }}
                className="register-login-btn"
              >
                {__("Login")}
              </button>
            </div>
          )}
          {isSignIn && (
            <div className="toggle-login-register">
              <span className="toggle-text">
                {__("Don't have an account.")}
              </span>
              {
                <button
                  onClick={(e) => {
                    handleCreateAccount(e);
                    sendEvents(EVENT_REGISTER_CLICK);
                    this.setState({
                      countryCode: PHONE_CODES[getCountryFromUrl()],
                    });
                  }}
                  className="register-login-btn"
                >
                  {__("Register")}
                </button>
              }
            </div>
          )}
        </div>
        {this.renderCloseBtn()}
      </div>
    );
  }

  onCloseClick = () => {
    this.setState({ isPopup: true });
  };

  closePopupOnClickOutside(e) {
    const { state, closePopup } = this.props;
    if (state === STATE_VERIFY_NUMBER || state === STATE_FORGOT_PASSWORD) {
      closePopup();
    } else {
      this.closePopup(e);
    }
  }

  closePopup(e) {
    const { state, handleSignIn, closePopup, handleCreateAccount } = this.props;
    const { isVerifyEmailEnabled } = this.state;
    if (state === STATE_FORGOT_PASSWORD) {
      handleSignIn(e);
    } else if (state === STATE_VERIFY_NUMBER) {
      this.setState({ isCreateValidated: false, isSignInValidated: false });
      if (isVerifyEmailEnabled) {
        handleSignIn(e);
      } else {
        handleCreateAccount(e);
      }
    } else {
      closePopup();
    }
  }
  renderCloseBtn() {
    const { isArabic } = this.state;
    const { state } = this.props;
    const hideCloseBtn =
      state !== STATE_VERIFY_NUMBER && state !== STATE_FORGOT_PASSWORD;
    return (
      <button
        block="MyAccountOverlayV1"
        elem="Close"
        mods={{ isArabic, hideCloseBtn }}
        onClick={this.closePopup.bind(this)}
      >
        {isArabic ? <ChevronRight /> : <ChevronLeft />}
      </button>
    );
  }

  renderConfirmEmail() {
    const { state, handleSignIn } = this.props;

    return (
      <article
        aria-labelledby="confirm-email-notice"
        block="MyAccountOverlayV1"
        elem="Additional"
        mods={{ state }}
      >
        <p id="confirm-email-notice">
          {/* eslint-disable-next-line max-len */}
          {__(
            "The email confirmation link has been sent to your email. Please confirm your account to proceed."
          )}
        </p>
        <button block="Button" onClick={handleSignIn}>
          {__("Got it")}
        </button>
      </article>
    );
  }

  onForgotChange = (invalidFields = []) => {
    this.setState({ isForgotValidated: invalidFields.length === 0 });
  };

  renderForgotPassword() {
    const {
      onForgotPasswordAttempt,
      onForgotPasswordSuccess,
      onFormError,
      isLoading,
      sendEvents,
    } = this.props;
    const { isForgotValidated, currentScreen, prevScreen } = this.state;
    this.setState({ isSignInValidated: false });
    if (
      currentScreen == STATE_FORGOT_PASSWORD &&
      prevScreen !== STATE_FORGOT_PASSWORD
    ) {
      sendEvents(EVENT_FORGOT_PASSWORD_SCREEN_VIEW);
    }

    return (
      <Form
        key="forgot-password"
        onSubmit={onForgotPasswordAttempt}
        onSubmitSuccess={onForgotPasswordSuccess}
        onSubmitError={onFormError}
        parentCallback={this.onForgotChange}
        isValidateOnChange
      >
        <p block="MyAccountOverlayV1" elem="ForgotPasswordSubheading">
          {__(
            "Enter the email associated with your account and we'll send instructions to reset your password."
          )}
        </p>
        <Field
          type="email"
          id="email"
          name="email"
          placeholder={`${__("EMAIL")}*`}
          autocomplete="email"
          validation={["notEmpty", "email"]}
          onFocus={() => sendEvents(EVENT_TYPE_EMAIL_ID)}
        />
        <div
          block="MyAccountOverlayV1"
          elem="Button"
          mods={{ isMargin: true, isForgotValidated }}
        >
          <button
            block="Button"
            type="submit"
            disabled={!isForgotValidated || isLoading}
            mix={{
              block: "MyAccountOverlayV1",
              elem: isLoading ? "LoadingButton" : "",
            }}
          >
            {!isLoading ? (
              __("SEND INSTRUCTIONS")
            ) : (
              <ThreeDots color="white" height={6} width={"100%"} />
            )}
          </button>
        </div>
      </Form>
    );
  }

  renderVerifyNumber() {
    const {
      customerRegisterData,
      OTPFieldChange,
      resendOTP,
      customerLoginData,
      isLoading,
      otpError,
      OtpErrorClear,
      updateOTP,
      OTP,
      sendOTPOnMailOrPhone,
      sendEvents,
    } = this.props;
    const {
      isArabic,
      isVerifyEmailEnabled,
      isVerifyEmailViewState,
      isCreateValidated,
      isSignInValidated,
    } = this.state;
    const isNumber = (evt) => {
      const invalidChars = ["-", "+", "e", "E", "."];
      const abc = evt.target.value;
      if (invalidChars.includes(evt.key)) {
        evt.preventDefault();
        return false;
      }
      if (abc.length > 4) {
        return evt.preventDefault();
      }
    };
    if (this.state.emailFromCheckoutPage) {
      this.setState({
        emailFromCheckoutPage: null,
      });
    }
    this.setState({ phoneInSignin: false });
    return (
      <div mix={{ block: "VerifyPhone", mods: { isArabic } }}>
        <MyAccountAutoDetectOTP updateOTP={updateOTP} />
        <div mix={{ block: "VerifyPhone", elem: "TextV1", mods: { isArabic } }}>
          <div block="VerifyPhone-TextV1" elem="TitleV1">
            {__("Enter Verification Code")}
          </div>
          <div block="VerifyPhone-TextV1" elem="Message">
            {__("Verification code has been sent to")}
          </div>
          <div block="VerifyPhone-TextV1" elem="PhoneV1">
            <button>
              {isLoading ? (
                <Oval
                  color="#333"
                  secondaryColor="#333"
                  height={20}
                  width={"100%"}
                  strokeWidth={3}
                  strokeWidthSecondary={3}
                />
              ) : isVerifyEmailEnabled ? (
                isVerifyEmailViewState ? (
                  customerLoginData?.email
                ) : (
                  customerLoginData?.phoneNumber
                )
              ) : (
                `${customerRegisterData?.contact_no}`
              )}
            </button>
          </div>
        </div>
        <div block="VerifyPhone" elem="CodeV1" mods={{ isArabic }}>
          <input
            type="number"
            placeholder="&#9679; &nbsp; &#9679; &nbsp; &#9679; &nbsp; &#9679; &nbsp; &#9679;"
            name="otp"
            disabled={isLoading}
            id="otp"
            onChange={(field) => OTPFieldChange(field, isVerifyEmailViewState)}
            onKeyPress={(e) => isNumber(e)}
            value={OTP}
            ref={this.otpInput}
          />
        </div>
        <div
          block="VerifyPhone"
          elem="ErrMessage"
          mods={{ isValidated: otpError.length !== 0 }}
        >
          {otpError === "Invalid OTP or OTP expired."
            ? __("Invalid OTP or OTP expired.")
            : otpError}
        </div>
        <div
          block="VerifyPhone"
          elem="OtpLoader"
          mods={{ isSubmitted: isLoading }}
        >
          <Oval
            color="#333"
            secondaryColor="#333"
            height={38}
            width={"100%"}
            strokeWidth={3}
            strokeWidthSecondary={3}
          />
        </div>
        <div block="VerifyPhone" elem="ResendCodeV1">
          {this.state.otpTimer > 0 && <span>0:{this.state.otpTimer} -</span>}
          <button
            onClick={() => {
              OtpErrorClear();
              this.setState({ otpTimer: SECONDS_TO_RESEND_OTP });
              resendOTP(isVerifyEmailViewState);
              this.OtpTimerFunction();
              this.otpInput.current.value = "";
              sendEvents(EVENT_RESEND_OTP_CLICK);
            }}
            className={this.state.otpTimer > 0 ? "disableBtn" : ""}
            disabled={this.state.otpTimer > 0}
          >
            {__("Resend Code")}
          </button>
        </div>
        {isVerifyEmailEnabled && (
          <div className="VerifyEmail">
            <span className="CodeIssueText">
              {__("Problems with verification code?")}
            </span>
            {!isVerifyEmailViewState ? (
              <button
                className={
                  this.state.otpTimer > 0
                    ? "disableBtn VerifyEmailBtn"
                    : "VerifyEmailBtn"
                }
                disabled={this.state.otpTimer > 0}
                onClick={() => {
                  this.OtpTimerFunction();
                  this.setState({ isVerifyEmailViewState: true });
                  sendOTPOnMailOrPhone(true);
                  this.otpInput.current.value = "";
                  OtpErrorClear();
                  sendEvents(EVENT_OTP_VERIFY_WITH_EMAIL);
                }}
              >
                {__("Verify with E-mail")}
              </button>
            ) : (
              <button
                className={
                  this.state.otpTimer > 0
                    ? "disableBtn VerifyEmailBtn"
                    : "VerifyEmailBtn"
                }
                disabled={this.state.otpTimer > 0}
                onClick={() => {
                  this.OtpTimerFunction();
                  this.setState({ isVerifyEmailViewState: false });
                  sendOTPOnMailOrPhone(false);
                  this.otpInput.current.value = "";
                  OtpErrorClear();
                  sendEvents(EVENT_OTP_VERIFY_WITH_PHONE);
                }}
              >
                {__("Verify with Phone")}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  renderForgotPasswordSuccess() {
    const { state, handleSignIn } = this.props;
    this.setState({ isForgotValidated: false });
    return (
      <article
        aria-labelledby="forgot-password-success"
        block="MyAccountOverlayV1"
        elem="Additional"
        mods={{ state }}
      >
        <p
          id="forgot-password-success"
          className="ForgotPasswordSuccessMessage"
        >
          {__(
            "If there is an account associated with the provided address you will receive an email with a link to reset your password"
          )}
        </p>
        <button block="Button" onClick={handleSignIn}>
          {__("Got it")}
        </button>
      </article>
    );
  }

  handleGenderChange = (e) => {
    this.setState({ gender: e.target.id });
  };

  handleCheckboxChange = () => {
    this.setState(({ isChecked }) => ({ isChecked: !isChecked }));
  };

  onCreateChange = (invalidFields = []) => {
    this.setState({ isCreateValidated: invalidFields.length === 0 });
  };

  IsUserRegisteredWithPhone(phoneNumber) {
    const { IsUserRegisteredBase } = this.props;
    const validMobileLength = this.getUserIdentifierCreateMaxLength();
    if (validMobileLength == phoneNumber.length) {
      const { countryCode } = this.state;
      const userName = `${countryCode}${phoneNumber}`;
      IsUserRegisteredBase(userName);
      this.setState({
        failedRegistrationData: { phoneWithoutCode: phoneNumber },
        isOTP: true,
      });
    }
  }

  IsUserRegisteredWithEmail(email) {
    const { IsUserRegisteredBase } = this.props;
    const isEmailInput = /\S+@\S+\.\S+/;
    if (isEmailInput.test(email)) {
      IsUserRegisteredBase(email);
      this.setState({
        failedRegistrationData: { email: email },
        isOTP: false,
      });
    }
  }

  renderCreateAccount() {
    const {
      onCreateAccountAttempt,
      onCreateAccountSuccess,
      isLoading,
      OtpErrorClear,
      customerLoginData,
      sendEvents,
    } = this.props;
    const { focusedElement } = this.state;
    const { gender, isChecked, isArabic, isCreateValidated, countryCode } =
      this.state;
    this.setState({
      isSignInValidated: false,
      isVerifyEmailEnabled: false,
      isVerifyEmailViewState: false,
    });
    OtpErrorClear();
    const countryLabel = getCountryFromUrl();
    const isNumber = (evt) => {
      const regex = /[a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
      const regexOnlyDigits = /^\d+$/;
      const invalidChars = ["-", "+", "e", "E", "."];
      if (invalidChars.includes(evt.key)) {
        evt.preventDefault();
        return false;
      }
      if (regex.test(evt.key)) {
        evt.preventDefault();
        return false;
      }
      if (!regexOnlyDigits.test(evt.key)) {
        evt.preventDefault();
        return false;
      }
    };
    return (
      <Form
        key="create-account"
        onSubmit={onCreateAccountAttempt}
        onSubmitSuccess={(fields) =>
          onCreateAccountSuccess(fields, countryCode)
        }
        onSubmitError={onCreateAccountAttempt}
        isValidateOnChange
        parentCallback={this.onCreateChange}
      >
        <span
          mix={{
            block: "MyAccountOverlayV1",
            elem: "RegisterSubHeading",
            mods: { isArabic },
          }}
        >
          {__("Register for a unique shopping experience")}
        </span>
        <div>
          <fieldset block="MyAccountOverlayV1" elem="PhoneNumber">
            <div
              block={
                focusedElement
                  ? "activeInput UserIdentifierFieldsContainerCreate"
                  : "UserIdentifierFieldsContainerCreate"
              }
              mods={{ isArabic: isArabic }}
            >
              <PhoneCountryCodeField
                label={countryLabel}
                onSelect={(value) =>
                  this.setState({
                    countryCode: value,
                  })
                }
              />
              <Field
                type="text"
                placeholder={__("PHONE NUMBER*")}
                id="phone"
                name="phone"
                autoComplete="off"
                maxLength={this.getUserIdentifierCreateMaxLength()}
                validation={[
                  "notEmpty",
                  "number",
                  this.getValidationForUserIdentifierCreate(),
                ]}
                onFocus={() => {
                  this.onFocus();
                  sendEvents(EVENT_TYPE_PHONE_NUMBER);
                }}
                onBlur={this.onBlur}
                onChange={this.IsUserRegisteredWithPhone.bind(this)}
                value={customerLoginData.phoneWithoutCode}
                onKeyPress={(e) => isNumber(e)}
              />
            </div>
          </fieldset>
          <fieldset block="MyAccountOverlayV1" elem="FullName">
            <Field
              type="text"
              placeholder={`${__("NAME")}*`}
              id="fullname"
              name="fullname"
              autoComplete="fullname"
              validation={[
                "notEmpty",
                "onlyCharacters",
              ]}
              onFocus={() => sendEvents(EVENT_TYPE_NAME)}
              maxLength= {40}
            />
          </fieldset>
          <fieldset block="MyAccountOverlayV1" elem="Gender">
            <div block="MyAccountOverlayV1" elem="Radio" mods={{ isArabic }}>
              <Field
                type="radio"
                id="1"
                label={__("Male")}
                name="gender"
                value={gender}
                onClick={this.handleGenderChange}
                defaultChecked={gender}
              />
              <Field
                type="radio"
                id="2"
                label={__("Female")}
                name="gender"
                value={gender}
                onClick={this.handleGenderChange}
                defaultChecked={gender}
              />
              <Field
                type="radio"
                id="3"
                label={__("Prefer not to say")}
                name="gender"
                value={gender}
                onClick={this.handleGenderChange}
                defaultChecked={gender}
              />
            </div>
          </fieldset>
          <fieldset block="MyAccountOverlayV1" elem="Legend">
            <Field
              type="text"
              placeholder={`${__("EMAIL")}*`}
              id="email"
              name="email"
              autoComplete="email"
              validation={["notEmpty", "email"]}
              onFocus={() => sendEvents(EVENT_TYPE_EMAIL_ID)}
            />
            <Field
              type="password"
              placeholder={`${__("PASSWORD")}*`}
              id="password"
              name="password"
              autoComplete="new-password"
              onFocus={() => sendEvents(EVENT_TYPE_PASSWORD)}
              validation={[
                "notEmpty",
                "password",
                "containNumber",
                "containCapitalize",
              ]}
            />
          </fieldset>
          <div
            block="MyAccountOverlayV1"
            elem="Button"
            mods={{ isCreateAccountButton: true, isCreateValidated }}
          >
            <button
              block="Button"
              type="submit"
              disabled={!isCreateValidated || isLoading}
              mix={{
                block: "MyAccountOverlayV1",
                elem: isLoading ? "LoadingButton" : "",
              }}
            >
              {!isLoading ? (
                __("Create Account")
              ) : (
                <ThreeDots color="white" height={6} width={"100%"} />
              )}
            </button>
          </div>
        </div>
      </Form>
    );
  }

  onSignInChange = (invalidFields = []) => {
    const { isOTP } = this.state;
    if (!isOTP) {
      this.setState({ isSignInValidated: invalidFields.length === 0 });
    }
    return;
  };

  setUserIdentifierType(value) {
    const { countryCode } = this.state;
    if (!ENABLE_OTP_LOGIN) {
      return;
    }

    this.setState({
      phoneInSignin: value,
    });

    const customerCountry = Object.keys(PHONE_CODES).find(
      (key) => PHONE_CODES[key] === countryCode
    );

    const validPhoneLength = COUNTRY_CODES_FOR_PHONE_VALIDATION[customerCountry]
      ? "9"
      : "8";

    const regex = /[a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;

    if (!!!value.length) {
      this.setState({
        isOTP: true,
      });
      return;
    }

    if (regex.test(value)) {
      this.setState({
        isOTP: false,
      });
    } else {
      this.setState({
        isOTP: true,
      });
      if (validPhoneLength == value.length) {
        this.setState({
          isSignInValidated: true,
        });
      } else {
        this.setState({
          isSignInValidated: false,
        });
      }
    }
  }

  getValidationForUserIdentifierCreate() {
    const { countryCode } = this.state;
    const customerCountry = Object.keys(PHONE_CODES).find(
      (key) => PHONE_CODES[key] === countryCode
    );

    return COUNTRY_CODES_FOR_PHONE_VALIDATION[customerCountry]
      ? "telephoneAE"
      : "telephone";
  }

  getValidationForUserIdentifier() {
    const { isOTP } = this.state;
    if (!ENABLE_OTP_LOGIN || !isOTP) {
      return "email";
    }

    const { countryCode } = this.state;
    const customerCountry = Object.keys(PHONE_CODES).find(
      (key) => PHONE_CODES[key] === countryCode
    );

    return COUNTRY_CODES_FOR_PHONE_VALIDATION[customerCountry]
      ? "telephoneAE"
      : "telephone";
  }

  getValidationForPassword() {
    const { isOTP } = this.state;
    if (!ENABLE_OTP_LOGIN || !isOTP) {
      return ["noempty", "password"];
    }

    return [];
  }

  getUserIdentifierCreateMaxLength() {
    const { countryCode } = this.state;

    const customerCountry = Object.keys(PHONE_CODES).find(
      (key) => PHONE_CODES[key] === countryCode
    );
    return COUNTRY_CODES_FOR_PHONE_VALIDATION[customerCountry] ? "9" : "8";
  }

  renderInitialLinks() {
    const { updateAccountViewState, sendEvents } = this.props;
    const { isArabic } = this.state;
    return (
      <ul block="logInScreenLinks">
        <h3 className="heading">{__("MY ACCOUNT")}</h3>
        <li block="MyAccountTabButtons">
          <button
            className="btn"
            onClick={() => {
              updateAccountViewState(STATE_SIGN_IN);
              sendEvents(EVENT_LOGIN_CLICK);
            }}
          >
            {__("Login")}
          </button>
          <button
            className="btn register-btn"
            onClick={() => {
              updateAccountViewState(STATE_CREATE_ACCOUNT);
              sendEvents(EVENT_REGISTER_CLICK);
            }}
          >
            {__("Register")}
          </button>
        </li>
        <div>
          <li
            className="MyAccountTabListItem hover-list-item"
            onClick={() => {
              updateAccountViewState(STATE_SIGN_IN, "RedirectToMyOrders");
              sendEvents(EVENT_GUEST_ORDERS_CLICK);
            }}
          >
            <a className="list-item-link">
              <div className="item-pill">
                <Image
                  lazyLoad={true}
                  src={OrdersIcon}
                  className="options-icon"
                />
                <span className="link-text">{__("My Orders")}</span>
              </div>
              <div className="icon-forward">
                {isArabic ? <ChevronLeft /> : <ChevronRight />}
              </div>
            </a>
          </li>
          <li
            className="MyAccountTabListItem"
            onClick={() => {
              updateAccountViewState(STATE_SIGN_IN, "RedirectToMyReturns");
              sendEvents(EVENT_GUEST_RETURNS_CLICK);
            }}
          >
            <a className="list-item-link">
              <div className="item-pill">
                <Image
                  lazyLoad={true}
                  src={ReturnIcon}
                  className="options-icon"
                />
                <span className="link-text">{__("Return/Exchange")}</span>
              </div>
              <div className="icon-forward">
                {isArabic ? <ChevronLeft /> : <ChevronRight />}
              </div>
            </a>
          </li>
          <li
            className="MyAccountTabListItem hover-list-item"
            onClick={() => {
              updateAccountViewState(STATE_SIGN_IN, "RedirectToMyWishlist");
            }}
          >
            <a className="list-item-link">
              <div className="item-pill">
                <Image
                  lazyLoad={true}
                  src={HeartIcon}
                  className="options-icon"
                />
                <span className="link-text">{__("My Wishlist")}</span>
              </div>
              <div className="icon-forward">
                {isArabic ? <ChevronLeft /> : <ChevronRight />}
              </div>
            </a>
          </li>
        </div>
        <li block="MyAccountTabListItem">
          <Link
            className="list-item-link"
            to="/return-information"
            onClick={() => {
              this.closePopup.bind(this);
              sendEvents(EVENT_RETURN_POLICY_CLICK);
            }}
          >
            <div className="item-pill">
              <div className="options-icon">
                <Return width={25} />
              </div>
              <span className="link-text">{__("Return Policy")}</span>
            </div>
            <div className="icon-forward">
              {isArabic ? <ChevronLeft /> : <ChevronRight />}
            </div>
          </Link>
        </li>
        <li block="MyAccountTabListItem">
          <Link
            className="list-item-link"
            to="/shipping-policy"
            onClick={() => {
              this.closePopup.bind(this);
              sendEvents(EVENT_SHIPPING_POLICY_CLICK);
            }}
          >
            <div className="item-pill">
              <div className="options-icon">
                <Shipping width={25} />
              </div>
              <span className="link-text">{__("Free delivery")}</span>
            </div>
            <div className="icon-forward">
              {isArabic ? <ChevronLeft /> : <ChevronRight />}
            </div>
          </Link>
        </li>
        <li block="MyAccountTabListItem">
          <Link
            className="list-item-link"
            to="/faq"
            onClick={() => {
              this.closePopup.bind(this);
              sendEvents(EVENT_FAQ_CLICK);
            }}
          >
            <div className="item-pill">
              <Info width={25} />
              <span className="link-text">{__("FAQs")}</span>
            </div>
            <div className="icon-forward">
              {isArabic ? <ChevronLeft /> : <ChevronRight />}
            </div>
          </Link>
        </li>
      </ul>
    );
  }
  onFocus = () => this.setState({ focusedElement: true });

  onBlur = () => this.setState({ focusedElement: false });
  renderSignIn() {
    const {
      email,
      onSignInAttempt,
      onSignInSuccess,
      onSignInOption,
      isLoading,
      onFormError,
      handleForgotPassword,
      sendEvents,
    } = this.props;
    const {
      isArabic,
      isSignInValidated,
      isOTP,
      countryCode,
      focusedElement,
      failedRegistrationData,
    } = this.state;
    if (failedRegistrationData && failedRegistrationData.phoneWithoutCode) {
      const validMobileLength = this.getUserIdentifierCreateMaxLength();
      if (validMobileLength == failedRegistrationData.phoneWithoutCode.length) {
        this.setState({
          isSignInValidated: true,
        });
      }
    }
    this.setState({
      isCreateValidated: false,
      isForgotValidated: false,
      isVerifyEmailEnabled: true,
      isVerifyEmailViewState: false,
    });
    const countryLabel = getCountryFromUrl();
    return (
      <Form
        key="sign-in"
        onSubmit={onSignInAttempt}
        onSubmitSuccess={(fields) => onSignInOption(isOTP, fields, countryCode)}
        onSubmitError={onFormError}
        isValidateOnChange
        parentCallback={this.onSignInChange}
      >
        <fieldset block="MyAccountOverlayV1" elem="Legend">
          <div
            block={
              focusedElement && isOTP && ENABLE_OTP_LOGIN
                ? "UserIdentifierFieldsContainer isActivePhoneInputClass"
                : "UserIdentifierFieldsContainer"
            }
            mods={{
              isOTP: isOTP && ENABLE_OTP_LOGIN,
              isArabic: isOTP && isArabic,
            }}
          >
            {isOTP && ENABLE_OTP_LOGIN && (
              <PhoneCountryCodeField
                label={countryLabel}
                onSelect={(value) => {
                  this.setState({
                    countryCode: value,
                  });
                  const customerCountry = Object.keys(PHONE_CODES).find(
                    (key) => PHONE_CODES[key] === value
                  );
                  const validMobileLength = COUNTRY_CODES_FOR_PHONE_VALIDATION[
                    customerCountry
                  ]
                    ? "9"
                    : "8";
                  this.setState({
                    currentPhoneCodeCountry: customerCountry,
                  });
                  validMobileLength == this.state.phoneInSignin?.length
                    ? this.setState({
                        isSignInValidated: true,
                      })
                    : this.setState({
                        isSignInValidated: false,
                      });
                }}
                countryCode={countryCode}
                currentPhoneCodeCountry={this.state.currentPhoneCodeCountry}
              />
            )}
            <Field
              type={ENABLE_OTP_LOGIN && isOTP ? "text" : "email"}
              placeholder={`${
                ENABLE_OTP_LOGIN ? __("EMAIL OR PHONE") : __("EMAIL ADDRESS")
              }*`}
              id="email"
              name="email"
              value={
                failedRegistrationData.phoneWithoutCode
                  ? failedRegistrationData.phoneWithoutCode
                  : this.state.emailFromCheckoutPage
              }
              autocomplete={ENABLE_OTP_LOGIN && isOTP ? "off" : "on"}
              maxLength={40}
              validation={["notEmpty", this.getValidationForUserIdentifier()]}
              onChange={this.setUserIdentifierType.bind(this)}
              onFocus={() => {
                this.onFocus();
                sendEvents(EVENT_TYPE_USERNAME);
              }}
              onBlur={this.onBlur}
              onPaste={() => {
                this.onSignInChange();
              }}
              className={focusedElement && !isOTP ? "activeInput" : ""}
            />
          </div>
          {(!isOTP || !ENABLE_OTP_LOGIN) && (
            <>
              <Field
                type="password"
                placeholder={`${__("PASSWORD")}*`}
                id="password"
                name="password"
                autocomplete="current-password"
                onFocus={() => sendEvents(EVENT_TYPE_PASSWORD)}
                validation={this.getValidationForPassword()}
                mix={{
                  block: "Password",
                  mods: {
                    isOTP,
                  },
                }}
              />
            </>
          )}
        </fieldset>
        {(!isOTP || !ENABLE_OTP_LOGIN) && (
          <button
            type="button"
            block="MyAccountOverlayV1"
            elem="Button"
            mods={{ likeLink: true }}
            mix={{
              block: "MyAccountOverlayV1",
              elem: "Button",
              mods: { isArabic },
            }}
            onClick={(e) => {
              sendEvents(EVENT_FORGOT_PASSWORD_CLICK);
              handleForgotPassword(e);
            }}
          >
            {__("Forgot password?")}
          </button>
        )}
        <div
          block="MyAccountOverlayV1"
          elem="Button"
          mix={{
            block: "MyAccountOverlayV1",
            elem: "Login",
          }}
          mods={{ isSignIn: true, isSignInValidated }}
        >
          <button
            block="Button"
            disabled={!isSignInValidated || isLoading}
            mix={{
              block: "MyAccountOverlayV1",
              elem: isLoading ? "LoadingButton" : "",
            }}
            onClick={() => sendEvents(EVENT_SIGN_IN_BUTTON_CLICK)}
          >
            {!isLoading ? (
              __("Sign In")
            ) : (
              <ThreeDots color="white" height={6} width={"100%"} />
            )}
          </button>
        </div>
      </Form>
    );
  }

  renderChangeStore() {
    if (isMobile.any()) {
      return (
        <div block="MyAccountOverlayV1" elem="StoreSwitcher">
          <LanguageSwitcher />
          <CountrySwitcher />
        </div>
      );
    }

    return null;
  }

  render() {
    const { isLoading, onVisible, state, isCheckout, isHidden } = this.props;
    const { isPopup, isArabic } = this.state;
    return (
      <div block="HeaderAccount" elem="PopUp" mods={{ isHidden }}>
        <button
          onClick={this.closePopupOnClickOutside.bind(this)}
          block="MyAccountOverlayV1"
          elem="btnOutsidePopUpClose"
        >
          {/* closes modal on clicking outside the modal - btn text hidden*/}
        </button>
        <Overlay
          id={CUSTOMER_ACCOUNT_OVERLAY_KEY}
          mix={{
            block: "MyAccountOverlayV1",
            mods: { isPopup, isArabic },
          }}
          onVisible={onVisible}
          isStatic={!isCheckout && !!isMobile.any()}
        >
          {this.renderMyAccount()}
        </Overlay>
      </div>
    );
  }
}

export default withRouter(MyAccountOverlay);
