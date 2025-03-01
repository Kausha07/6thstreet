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
  STATE_MENU,
} from "./MyAccountOverlay.config";
import Event, {
  EVENT_GTM_NEW_AUTHENTICATION,
  EVENT_LOGIN,
  EVENT_GTM_LOGIN_SUCCESS,
  EVENT_LOGIN_FAILED,
  EVENT_REGISTER,
  EVENT_REGISTER_FAILED,
  EVENT_VERIFICATION_CODE_SCREEN_VIEW,
  EVENT_OTP_VERIFY,
  EVENT_OTP_VERIFY_FAILED,
  EVENT_RESET_YOUR_PASSWORD_SUCCESS,
  EVENT_RESET_YOUR_PASSWORD_FAILED,
  EVENT_FORGOT_PASSWORD_SUCCESS_SCREEN_VIEW,
  EVENT_ACCOUNT_TAB_ICON,
  MOE_AddFirstName,
  MOE_addLastName,
  MOE_addEmail,
  MOE_addMobile,
  MOE_AddUniqueID,
} from "Util/Event";
import { setVueTrendingBrandsBannerActive } from "Store/MyAccount/MyAccount.action";

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
  setVueTrendingBrandsBannerActive: (isActive) =>  dispatch(setVueTrendingBrandsBannerActive(isActive)),
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
    onCreateAccount: PropTypes.func,
  };

  static defaultProps = {
    isCheckout: false,
    onSignIn: () => {},
    goToPreviousHeaderState: () => {},
    closePopup: () => {},
    onCreateAccount: () => {},
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
    sendEvents: this.sendEvents.bind(this),
    setPrevScreenState: this.setPrevScreenState.bind(this),
    setCurrentOverlayState: this.setCurrentOverlayState.bind(this),
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
      this.props.setVueTrendingBrandsBannerActive(true);
      hideActiveOverlay();
      if (isCheckout) {
        goToPreviousHeaderState();
      }
    }
  }
  redirectOrGetState = (props) => {
    const {
      showOverlay,
      setHeaderState,
      isPasswordForgotSend,
      showMyAccountMenuPopUp,
      showRegisterScreen,
    } = props;

    const {
      location: { pathname, state: { isForgotPassword } = {} },
    } = history;

    let getDeviceState;
    if (showMyAccountMenuPopUp) {
      getDeviceState = STATE_INITIAL_LINKS;
    } else if (showRegisterScreen) {
      getDeviceState = STATE_CREATE_ACCOUNT;
    } else {
      getDeviceState = STATE_SIGN_IN;
    }

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
      shouldRedirectToMyWishlist: false,
      otpAttempt: 1,
      prevOverlayState: "",
      currentOverlayState: "",
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

  setPrevScreenState(screen) {
    this.setState({
      prevOverlayState: screen,
    });
  }
  setCurrentOverlayState(screen) {
    this.setState({
      currentOverlayState: screen,
    });
  }

  getPageType() {
    const { urlRewrite, currentRouteName } = window;

    if (currentRouteName === "url-rewrite") {
      if (typeof urlRewrite === "undefined") {
        return "";
      }

      if (urlRewrite.notFound) {
        return "notfound";
      }

      return (urlRewrite.type || "").toLowerCase();
    }

    return (currentRouteName || "").toLowerCase();
  }

  sendEvents(event, data = {}) {
    const { prevOverlayState, currentOverlayState, customerRegisterData } =
      this.state;
    const screenName =
      currentOverlayState == STATE_INITIAL_LINKS
        ? STATE_MENU
        : currentOverlayState;
    const prevScreenName =
      event == EVENT_ACCOUNT_TAB_ICON
        ? this.getPageType()
        : prevOverlayState == STATE_INITIAL_LINKS
        ? STATE_MENU
        : prevOverlayState
        ? prevOverlayState
        : this.getPageType();
    const eventData = {
      name: event,
      screen: screenName || "",
      prevScreen: prevScreenName,
      ...(data?.failed_reason && { failed_reason: data?.failed_reason }),
      ...(data?.mode && { login_mode: data?.mode }),
      ...(data?.email && { email: data?.email }),
      ...(data?.gender && { gender: data?.gender }),
      ...(data?.phone && { phone: data?.phone }),
    };
    Event.dispatch(EVENT_GTM_NEW_AUTHENTICATION, eventData);
  }

  async onSignInSuccess(fields) {
    const { signIn, showNotification, onSignIn } = this.props;
    try {
      await signIn(fields);
      onSignIn();
      const eventAdditionalData = { mode: "Email", };
      this.sendEvents(EVENT_GTM_LOGIN_SUCCESS, eventAdditionalData);
      this.checkForOrder();
    } catch (e) {
      this.setState({ isLoading: false });
      showNotification("error", e.message);
      const eventAdditionalData = { failed_reason: e.message, mode: "Email" };
      this.sendEvents(EVENT_LOGIN_FAILED, eventAdditionalData);
    }
  }

  checkForOrder() {
    const orderId = BrowserDatabase.getItem("ORDER_ID") || null;
    const { shouldRedirectToMyOrders, shouldRedirectToMyReturns, shouldRedirectToMyWishlist } = this.state;
    const { redirectToMyOrdersPage } = this.props;
    if (shouldRedirectToMyOrders || redirectToMyOrdersPage) {
      history.push(`/my-account/my-orders`);
    }
    if (shouldRedirectToMyReturns) {
      history.push(`/my-account/return-item`);
    }
    if(shouldRedirectToMyWishlist){
      history.push(`/my-account/my-wishlist`);
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
        this.sendEvents(EVENT_VERIFICATION_CODE_SCREEN_VIEW);
      } else {
        if (code && code === "AUT-04" && error && typeof error === "string") {
          const eventAdditionalData = { failed_reason: error, mode: "Phone" };
          if (error == "Account with phone number does not exist") {
            showError(__("Account with phone number does not exist"));
          } else {
            showError(__(error));
          }
          this.sendEvents(EVENT_LOGIN_FAILED, eventAdditionalData);
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
    const { prevOverlayState } = this.state;
    const inputValue = field.target.value;
    try {
      const { createAccountNew, loginAccount, onCreateAccount } = this.props;
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
          this.sendEvents(EVENT_OTP_VERIFY);
          if (Object.entries(customerRegisterData)?.length) {
            const eventAdditionalData = {
              email: customerRegisterData?.email
                ? customerRegisterData?.email
                : "",
              gender:
                customerRegisterData?.gender == "1"
                  ? "Male"
                  : customerRegisterData?.gender == "2"
                  ? "Female"
                  : "Prefer Not to say",
              phone: customerRegisterData?.contact_no
                ? customerRegisterData?.contact_no
                : "",
            };
            if (customerRegisterData?.name) {
              const firstName =
                customerRegisterData.name.indexOf(" ") > 0
                  ? customerRegisterData.name.substr(
                      0,
                      customerRegisterData.name.indexOf(" ")
                    )
                  : customerRegisterData.name;
              const lastName =
                customerRegisterData?.name.indexOf(" ") > 0
                  ? customerRegisterData?.name.substr(
                      customerRegisterData?.name.indexOf(" ") + 1
                    )
                  : "";
              if (firstName) {
                MOE_AddFirstName(firstName);
              }
              if (lastName) {
                MOE_addLastName(lastName);
              }
            }
            if (customerRegisterData?.contact_no) {
              MOE_addMobile(customerRegisterData.contact_no);
            }
            if (customerRegisterData?.email) {
              MOE_addEmail(customerRegisterData?.email?.toLowerCase());
              MOE_AddUniqueID(customerRegisterData?.email?.toLowerCase());
            }
            this.sendEvents(EVENT_REGISTER, eventAdditionalData);
          }
          if (Object.entries(customerLoginData)?.length) {
            const eventAdditionalData = { mode: "Phone", };
            this.sendEvents(EVENT_GTM_LOGIN_SUCCESS, eventAdditionalData);
          }
          try {
            await signInOTP(response);
            this.checkForOrder();
            onCreateAccount();
          } catch (e) {
            const eventAdditionalData = { failed_reason: e, mode: "Phone" };
            if (
              Object.entries(customerRegisterData)?.length &&
              prevOverlayState !== STATE_SIGN_IN
            ) {
              this.sendEvents(EVENT_REGISTER_FAILED, eventAdditionalData);
            }
            if (
              Object.entries(customerLoginData)?.length &&
              prevOverlayState !== STATE_CREATE_ACCOUNT
            ) {
              this.sendEvents(EVENT_LOGIN_FAILED, eventAdditionalData);
            }
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
          const eventAdditionalData = { failed_reason: response, mode: "Phone" };
          this.sendEvents(EVENT_OTP_VERIFY_FAILED, eventAdditionalData);
          if (
            Object.entries(customerRegisterData)?.length &&
            prevOverlayState !== STATE_SIGN_IN
          ) {
            this.sendEvents(EVENT_REGISTER_FAILED, eventAdditionalData);
          }
          if (
            Object.entries(customerLoginData)?.length &&
            prevOverlayState !== STATE_CREATE_ACCOUNT
          ) {
            this.sendEvents(EVENT_LOGIN_FAILED, eventAdditionalData);
          }
        }
        this.setState({ isLoading: false });
      }
    } catch (err) {
      const { otpAttempt, customerLoginData, customerRegisterData } =
        this.state;
      const eventAdditionalData = { failed_reason: err, mode: "Phone" };
      this.sendEvents(EVENT_OTP_VERIFY_FAILED, eventAdditionalData);
      this.setState({ isLoading: false, otpAttempt: otpAttempt + 1 });
      if (
        Object.entries(customerRegisterData)?.length &&
        prevOverlayState !== STATE_SIGN_IN
      ) {
        this.sendEvents(EVENT_REGISTER_FAILED, eventAdditionalData);
      }
      if (
        Object.entries(customerLoginData)?.length &&
        prevOverlayState !== STATE_CREATE_ACCOUNT
      ) {
        this.sendEvents(EVENT_LOGIN_FAILED, eventAdditionalData);
      }
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
        const eventAdditionalData = {
          failed_reason: "Account with same email already exist",
        };
        this.sendEvents(EVENT_REGISTER_FAILED, eventAdditionalData);
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
          this.sendEvents(EVENT_VERIFICATION_CODE_SCREEN_VIEW);
        } else {
          if (error === "Account with same phone number already exist") {
            this.updateAccountViewState(STATE_SIGN_IN);
          }
          const eventAdditionalData = { failed_reason: error };
          showError(error);
          this.sendEvents(EVENT_REGISTER_FAILED, eventAdditionalData);
        }
      }
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
      console.error("error while sending OTP", error);
    }
  }

  onForgotPasswordSuccess(fields) {
    const { forgotPassword, showNotification, sendEvents } = this.props;

    forgotPassword(fields).then((res) => {
      if (typeof res === "string") {
        const eventAdditionalData = { failed_reason: res };
        showNotification("error", __(res));
        this.stopLoading();
        this.sendEvents(EVENT_RESET_YOUR_PASSWORD_FAILED, eventAdditionalData);
        return;
      }
      this.sendEvents(EVENT_RESET_YOUR_PASSWORD_SUCCESS);
      this.setState({ state: STATE_FORGOT_PASSWORD_SUCCESS });
      this.stopLoading();
      this.sendEvents(EVENT_FORGOT_PASSWORD_SUCCESS_SCREEN_VIEW);
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
    if (redirectTo && redirectTo === "RedirectToMyWishlist") {
      this.setState({
        shouldRedirectToMyWishlist: true,
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
