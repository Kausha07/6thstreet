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
import { CART_ID_CACHE_KEY } from "Store/MyAccount/MyAccount.dispatcher";

import {
  CUSTOMER_ACCOUNT,
  CUSTOMER_SUB_ACCOUNT,
} from "Component/Header/Header.config";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import {
  changeNavigationState,
  goToPreviousNavigationState,
} from "Store/Navigation/Navigation.action";
import { TOP_NAVIGATION_TYPE } from "Store/Navigation/Navigation.reducer";
import { showNotification } from "Store/Notification/Notification.action";
import {
  hideActiveOverlay,
  toggleOverlayByKey,
} from "Store/Overlay/Overlay.action";
import BrowserDatabase from "Util/BrowserDatabase";
import history from "Util/History";
import isMobile from "Util/Mobile";
import MyAccountOverlay from "./MyAccountOverlay.component";
import browserHistory from "Util/History";
import { isArabic } from "Util/App";
import {
  sendOTP,
  sendOTPViaEmail,
  userStatus,
} from "Util/API/endpoint/MyAccount/MyAccount.enpoint";
import {
  CUSTOMER_ACCOUNT_OVERLAY_KEY,
  STATE_CONFIRM_EMAIL,
  STATE_CREATE_ACCOUNT,
  STATE_FORGOT_PASSWORD,
  STATE_FORGOT_PASSWORD_SUCCESS,
  STATE_LOGGED_IN,
  STATE_SIGN_IN,
  STATE_VERIFY_NUMBER,
  STATE_INITIAL_LINKS,
} from "./MyAccountOverlay.config";

export const MyAccountDispatcher = import(
  /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
  "Store/MyAccount/MyAccount.dispatcher"
);

export const mapStateToProps = (state) => ({
  isSignedIn: state.MyAccountReducer.isSignedIn,
  customer: state.MyAccountReducer.customer,
  isPasswordForgotSend: state.MyAccountReducer.isPasswordForgotSend,
  isOverlayVisible: state.OverlayReducer.activeOverlay === CUSTOMER_ACCOUNT,
  language: state.AppState.language,
});

export const mapDispatchToProps = (dispatch) => ({
  hideActiveOverlay: () => dispatch(hideActiveOverlay()),
  forgotPassword: (options) =>
    MyAccountDispatcher.then(({ default: dispatcher }) =>
      dispatcher.forgotPassword(dispatch, options)
    ),
  createAccountNew: (options) =>
    MyAccountDispatcher.then(({ default: dispatcher }) =>
      dispatcher.createAccountNew(options, dispatch)
    ),
  loginAccount: (options) =>
    MyAccountDispatcher.then(({ default: dispatcher }) =>
      dispatcher.loginAccount(options, dispatch)
    ),
  signIn: (options) =>
    MyAccountDispatcher.then(({ default: dispatcher }) =>
      dispatcher.signIn(options, dispatch)
    ),
  signInOTP: (options) =>
    MyAccountDispatcher.then(({ default: dispatcher }) =>
      dispatcher.signInOTP(options, dispatch)
    ),
  showNotification: (type, message) =>
    dispatch(showNotification(type, message)),
  showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
  setHeaderState: (headerState) =>
    dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, headerState)),
  goToPreviousHeaderState: () =>
    dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE)),
  showError: (message) => dispatch(showNotification("error", message)),
});

export class MyAccountOverlayContainer extends PureComponent {
  static propTypes = {
    forgotPassword: PropTypes.func.isRequired,
    signIn: PropTypes.func.isRequired,
    signInOTP: PropTypes.func.isRequired,
    isPasswordForgotSend: PropTypes.bool.isRequired,
    isSignedIn: PropTypes.bool.isRequired,
    showNotification: PropTypes.func.isRequired,
    createAccountNew: PropTypes.func.isRequired,
    isPopup: PropTypes.bool.isRequired,
    showOverlay: PropTypes.func.isRequired,
    setHeaderState: PropTypes.func.isRequired,
    onSignIn: PropTypes.func,
    goToPreviousHeaderState: PropTypes.func,
    isCheckout: PropTypes.bool,
    hideActiveOverlay: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    closePopup: PropTypes.func,
  };

  static defaultProps = {
    isCheckout: false,
    onSignIn: () => {},
    goToPreviousHeaderState: () => {},
    closePopup: () => {},
  };

  containerFunctions = {
    onSignInSuccess: this.onSignInSuccess.bind(this),
    onSignInAttempt: this.onSignInAttempt.bind(this),
    onSignInOption: this.onSignInOption.bind(this),
    onCreateAccountAttempt: this.onCreateAccountAttempt.bind(this),
    OTPFieldChange: this.OTPFieldChange.bind(this),
    resendOTP: this.resendOTP.bind(this),
    onCreateAccountSuccess: this.onCreateAccountSuccess.bind(this),
    onForgotPasswordSuccess: this.onForgotPasswordSuccess.bind(this),
    onForgotPasswordAttempt: this.onForgotPasswordAttempt.bind(this),
    onFormError: this.onFormError.bind(this),
    handleForgotPassword: this.handleForgotPassword.bind(this),
    handleSignIn: this.handleSignIn.bind(this),
    handleCreateAccount: this.handleCreateAccount.bind(this),
    onCreateAccountClick: this.onCreateAccountClick.bind(this),
    onVisible: this.onVisible.bind(this),
    OtpErrorClear: this.OtpErrorClear.bind(this),
    updateAccountViewState: this.updateAccountViewState.bind(this),
    updateOTP: this.updateOTP.bind(this),
    sendOTPOnMailOrPhone: this.sendOTPOnMailOrPhone.bind(this),
    IsUserRegisteredBase: this.IsUserRegisteredBase.bind(this),
  };

  constructor(props) {
    super(props);

    this.state = this.redirectOrGetState(props);
  }

  static getDerivedStateFromProps(props, state) {
    const { isSignedIn, isPasswordForgotSend, showNotification, isPopup } =
      props;

    const {
      isPasswordForgotSend: currentIsPasswordForgotSend,
      state: myAccountState,
    } = state;

    const {
      location: { pathname, state: { isForgotPassword } = {} },
    } = history;

    const stateToBeUpdated = {};

    if (!isMobile.any()) {
      if (!isPopup && !isSignedIn) {
        if (pathname !== "/forgot-password" && !isForgotPassword) {
          stateToBeUpdated.state = STATE_SIGN_IN;
        }
      } else if (!isPopup && isSignedIn) {
        stateToBeUpdated.state = STATE_LOGGED_IN;
      }
    }

    if (myAccountState !== STATE_LOGGED_IN && isSignedIn) {
      stateToBeUpdated.isLoading = false;
      showNotification("success", __("You are successfully logged in!"));
      stateToBeUpdated.state = STATE_LOGGED_IN;
    }

    if (myAccountState === STATE_LOGGED_IN && !isSignedIn) {
      stateToBeUpdated.state = STATE_SIGN_IN;
      showNotification("success", __("You are successfully logged out!"));
    }

    if (isPasswordForgotSend !== currentIsPasswordForgotSend) {
      stateToBeUpdated.isLoading = false;
      stateToBeUpdated.isPasswordForgotSend = isPasswordForgotSend;
      // eslint-disable-next-line max-len
      showNotification(
        "success",
        __(
          "If there is an account associated with the provided address you will receive an email with a link to reset your password."
        )
      );
      stateToBeUpdated.state = STATE_SIGN_IN;
    }

    return Object.keys(stateToBeUpdated).length ? stateToBeUpdated : null;
  }
  handleBackBtn() {
    const { closePopup } = this.props;
    const getCurrentState = this.state.state;
    const { location } = browserHistory;
    if (isMobile.any()) {
      browserHistory.push(`${location.pathname}${location.search}`);
      window.onpopstate = () => {
        if (getCurrentState == "initialLinks") {
          closePopup();
        } else if (getCurrentState == "createAccount" || "signIn") {
          this.setState({ state: "initialLinks" });
        } else {
          return;
        }
      };
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { isSignedIn: prevIsSignedIn } = prevProps;
    const { state: oldMyAccountState } = prevState;
    const { state: newMyAccountState } = this.state;
    const {
      isSignedIn,
      hideActiveOverlay,
      isCheckout,
      goToPreviousHeaderState,
    } = this.props;

    if (oldMyAccountState === newMyAccountState) {
      return;
    }

    if (isSignedIn !== prevIsSignedIn) {
      hideActiveOverlay();
      if (isCheckout) {
        goToPreviousHeaderState();
      }
    }
  }
  redirectOrGetState = (props) => {
    const { showOverlay, setHeaderState, isPasswordForgotSend, showMyAccountMenuPopUp } = props;

    const {
      location: { pathname, state: { isForgotPassword } = {} },
    } = history;

    const getDeviceState = showMyAccountMenuPopUp
      ? STATE_INITIAL_LINKS 
      : STATE_SIGN_IN;

    const state = {
      state: getDeviceState,
      // eslint-disable-next-line react/no-unused-state
      isPasswordForgotSend,
      isLoading: false,
      customerRegisterData: {},
      customerLoginData: {},
      otpError: "",
      OTP: undefined,
      shouldRedirectToMyOrders: false,
      shouldRedirectToMyReturns: false,
      otpAttempt: 1,
    };

    // if customer got here from forgot-password
    if (pathname !== "/forgot-password" && !isForgotPassword) {
      return state;
    }

    state.state = STATE_FORGOT_PASSWORD;

    setHeaderState({
      name: CUSTOMER_SUB_ACCOUNT,
      title: "Forgot password",
      onBackClick: (e) => {
        history.push({ pathname: "/my-account" });
        this.handleSignIn(e);
      },
    });

    if (isMobile.any()) {
      history.push({
        pathname: "/my-account",
        state: { isForgotPassword: true },
      });
      return state;
    }

    showOverlay(CUSTOMER_ACCOUNT_OVERLAY_KEY);

    return state;
  };

  async onSignInSuccess(fields) {
    const { signIn, showNotification, onSignIn } = this.props;
    try {
      await signIn(fields);
      onSignIn();
      this.checkForOrder();
    } catch (e) {
      this.setState({ isLoading: false });
      showNotification("error", e.message);
    }
  }

  checkForOrder() {
    const orderId = BrowserDatabase.getItem("ORDER_ID") || null;
    const { shouldRedirectToMyOrders, shouldRedirectToMyReturns } = this.state;
    if (shouldRedirectToMyOrders) {
      history.push(`/my-account/my-orders`);
    }
    if (shouldRedirectToMyReturns) {
      history.push(`/my-account/return-item`);
    }

    if (orderId) {
      localStorage.removeItem("ORDER_ID");
      history.push(`/my-account/my-orders/${orderId}`);
    }
  }

  onVisible() {
    const { setHeaderState, isCheckout } = this.props;

    if (isMobile.any() && !isCheckout) {
      setHeaderState({ name: CUSTOMER_ACCOUNT, title: __("Sign in") });
    }
  }

  onSignInOption(isOTP, fields, countryCode) {
    if (!isOTP) {
      return this.onSignInSuccess(fields);
    } else {
      this.sendOTP(countryCode, fields);
    }
  }

  async sendOTP(countryCode, fields) {
    const { email } = fields;
    const phoneNumber = `${countryCode}${email}`;
    const { showError } = this.props;
    try {
      const { success, error, code } = await sendOTP({
        phone: phoneNumber,
        flag: "login",
      });
      if (success) {
        this.setState({
          customerLoginData: { phoneNumber: phoneNumber },
          state: STATE_VERIFY_NUMBER,
        });
      } else {
        if (code && code === "AUT-04" && error && typeof error === "string") {
          if (error == "Account with phone number does not exist") {
            showError(__("Account with phone number does not exist"));
          } else {
            showError(__(error));
          }
        }
      }
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
      console.error("error while sending OTP", error);
    }
  }

  async sendOTPOnMailOrPhone(shouldLoginWithOtpOnEmail) {
    const { customerLoginData } = this.state;
    const { showNotification } = this.props;
    try {
      let response;
      this.setState({ isLoading: true });
      if (shouldLoginWithOtpOnEmail) {
        response = await sendOTPViaEmail({
          mobile: customerLoginData.phoneNumber,
          flag: "login",
        });
        this.setState({
          customerLoginData: {
            ...this.state.customerLoginData,
            email: response.email_id,
          },
        });
      } else {
        response = await sendOTP({
          phone: customerLoginData.phoneNumber,
          flag: "login",
        });
      }
      if (
        response.code &&
        response.code === "AUT-04" &&
        response.error &&
        typeof response.error === "string"
      ) {
        this.updateAccountViewState(STATE_CREATE_ACCOUNT);
        showError(__(error));
      }
      if (response.success) {
        showNotification("success", __("OTP sent successfully"));
      }
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
      console.error("error while sending OTP", error);
    }
  }

  onSignInAttempt() {
    this.setState({ isLoading: true, otpError: "" });
  }

  async OTPFieldChange(field, isVerifyEmailViewState) {
    this.setState({ otpError: "" });
    const inputValue = field.target.value;
    try {
      const { createAccountNew, loginAccount } = this.props;
      const { customerLoginData, customerRegisterData, otpAttempt } =
        this.state;
      if (
        inputValue?.length === 5 &&
        (Object.entries(customerRegisterData)?.length ||
          Object.entries(customerLoginData)?.length)
      ) {
        this.setState({ isLoading: true });
        let response;
        let payload;
        if (Object.entries(customerRegisterData)?.length) {
          payload = { ...customerRegisterData, otp: inputValue };
          response = await createAccountNew(payload);
        } else if (!isVerifyEmailViewState) {
          payload = {
            username: customerLoginData.phoneNumber,
            password: inputValue,
            is_phone: true,
            cart_id: BrowserDatabase.getItem(CART_ID_CACHE_KEY),
          };
          response = await loginAccount(payload);
        } else {
          payload = {
            username: customerLoginData.email,
            password: inputValue,
            email_otp: true,
            cart_id: BrowserDatabase.getItem(CART_ID_CACHE_KEY),
          };
          response = await loginAccount(payload);
        }
        const { success } = response;
        if (success) {
          const { signInOTP, showNotification } = this.props;
          try {
            await signInOTP(response);
            this.checkForOrder();
          } catch (e) {
            this.setState({ isLoading: false });
            showNotification("error", e.message);
          }
          this.setState({
            isLoading: false,
            customerRegisterData: {},
            customerLoginData: {},
          });
        }
        if (typeof response === "string") {
          this.setState({
            otpError: response,
            otpAttempt: otpAttempt + 1,
          });
        }
        this.setState({ isLoading: false });
      }
    } catch (err) {
      const { otpAttempt } = this.state;
      this.setState({ isLoading: false, otpAttempt: otpAttempt + 1 });
      console.error("Error while creating customer", err);
    }
  }

  onCreateAccountAttempt(_, invalidFields) {
    this.setState({ isLoading: !invalidFields });
  }

  async resendOTP(isVerifyEmailViewState) {
    const { customerLoginData, customerRegisterData } = this.state;
    const { showNotification } = this.props;
    this.setState({ isLoading: true });
    try {
      if (Object.entries(customerRegisterData)?.length) {
        const { contact_no } = customerRegisterData;
        const { success, error } = await sendOTP({
          phone: contact_no,
          flag: "register",
        });
        if (success) {
          showNotification("success", __("OTP sent successfully"));
        } else if (error) {
          showNotification("error", error);
        }
      } else if (Object.entries(customerLoginData)?.length) {
        const { phoneNumber } = customerLoginData;
        let response;
        if (isVerifyEmailViewState) {
          response = await sendOTPViaEmail({
            mobile: phoneNumber,
            flag: "login",
          });
        } else {
          response = await sendOTP({
            phone: phoneNumber,
            flag: "login",
          });
        }
        const { success, error } = response;
        if (success) {
          showNotification("success", __("OTP sent successfully"));
        } else if (error) {
          showNotification("error", error);
        }
      }
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
      console.error("error while resend otp", error);
    }
  }

  async onCreateAccountSuccess(fields, countryCode) {
    const { showError } = this.props;

    const { password, email, fullname, gender, phone } = fields;
    const phoneNumber = `${countryCode}${phone}`;
    const customerData = {
      name: fullname.trim(),
      gender,
      email,
      password,
      contact_no: phoneNumber,
    };
    try {
      const response = await userStatus(email);
      if (response && response.data && response.data.has_account) {
        isArabic()
          ? showError(__("Account with %s already exist", email))
          : showError(__(`Account with ${email} already exist`));
      } else {
        const { success, error } = await sendOTP({
          phone: phoneNumber,
          flag: "register",
        });
        if (success) {
          this.setState({
            customerRegisterData: customerData,
            state: STATE_VERIFY_NUMBER,
          });
        } else {
          if (error === "Account with same phone number already exist") {
            this.updateAccountViewState(STATE_SIGN_IN);
          }
          showError(error);
        }
      }
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
      console.error("error while sending OTP", error);
    }
  }

  onForgotPasswordSuccess(fields) {
    const { forgotPassword, showNotification } = this.props;

    forgotPassword(fields).then((res) => {
      if (typeof res === "string") {
        showNotification("error", __(res));
        this.stopLoading();
        return;
      }
      this.setState({ state: STATE_FORGOT_PASSWORD_SUCCESS });
      this.stopLoading();
    }, this.stopLoading);
  }

  onForgotPasswordAttempt() {
    this.setState({ isLoading: true });
  }

  onFormError() {
    this.setState({ isLoading: false });
  }

  stopLoading = () => this.setState({ isLoading: false });

  stopLoadingAndHideOverlay = () => {
    const { hideActiveOverlay } = this.props;
    this.stopLoading();
    hideActiveOverlay();
  };

  handleForgotPassword(e) {
    const { setHeaderState } = this.props;
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    this.setState({ state: STATE_FORGOT_PASSWORD });

    setHeaderState({
      name: CUSTOMER_SUB_ACCOUNT,
      title: __("Forgot password"),
      onBackClick: () => this.handleSignIn(e),
    });
  }

  handleSignIn(e) {
    const { setHeaderState } = this.props;
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    this.setState({ state: STATE_SIGN_IN });

    setHeaderState({
      name: CUSTOMER_ACCOUNT,
      title: __("Sign in"),
    });
  }

  handleCreateAccount(e) {
    const { setHeaderState } = this.props;
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    this.setState({ state: STATE_CREATE_ACCOUNT });

    setHeaderState({
      name: CUSTOMER_SUB_ACCOUNT,
      title: __("Create account"),
      onBackClick: () => this.handleSignIn(e),
    });
  }

  onCreateAccountClick() {
    const { setHeaderState } = this.props;

    this.setState({ state: STATE_CREATE_ACCOUNT });

    setHeaderState({
      name: CUSTOMER_SUB_ACCOUNT,
      title: __("Create account"),
    });
  }

  OtpErrorClear() {
    this.setState({ otpError: "" });
  }

  updateAccountViewState(viewState, redirectTo) {
    this.setState({ state: viewState });
    if (redirectTo && redirectTo === "RedirectToMyOrders") {
      this.setState({
        shouldRedirectToMyOrders: true,
      });
    }
    if (redirectTo && redirectTo === "RedirectToMyReturns") {
      this.setState({
        shouldRedirectToMyReturns: true,
      });
    }
  }

  updateOTP(otp) {
    this.setState({ OTP: otp });
  }

  async IsUserRegisteredBase(userName) {
    const { showError } = this.props;
    try {
      const response = await userStatus(userName);
      if (response && response.data && response.data.has_account) {
        this.updateAccountViewState(STATE_SIGN_IN);
        isArabic()
          ? showError(__("Account with %s already exist", userName))
          : showError(__(`Account with ${userName} already exist`));
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    this.handleBackBtn();
    const { state } = this.state;
    const { hideActiveOverlay } = this.props;
    if (state === "loggedIn") {
      hideActiveOverlay();

      return null;
    }

    return (
      <MyAccountOverlay
        {...this.props}
        {...this.state}
        {...this.containerFunctions}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyAccountOverlayContainer);
