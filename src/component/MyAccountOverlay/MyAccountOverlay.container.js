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

import {
  CUSTOMER_ACCOUNT_OVERLAY_KEY,
  STATE_CONFIRM_EMAIL,
  STATE_CREATE_ACCOUNT,
  STATE_FORGOT_PASSWORD,
  STATE_FORGOT_PASSWORD_SUCCESS,
  STATE_LOGGED_IN,
  STATE_SIGN_IN,
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
  createAccount: (options) =>
    MyAccountDispatcher.then(({ default: dispatcher }) =>
      dispatcher.createAccount(options, dispatch)
    ),
  signIn: (options) =>
    MyAccountDispatcher.then(({ default: dispatcher }) =>
      dispatcher.signIn(options, dispatch)
    ),
  showNotification: (type, message) =>
    dispatch(showNotification(type, message)),
  showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
  setHeaderState: (headerState) =>
    dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, headerState)),
  goToPreviousHeaderState: () =>
    dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE)),
});

export class MyAccountOverlayContainer extends PureComponent {
  static propTypes = {
    forgotPassword: PropTypes.func.isRequired,
    signIn: PropTypes.func.isRequired,
    isPasswordForgotSend: PropTypes.bool.isRequired,
    isSignedIn: PropTypes.bool.isRequired,
    showNotification: PropTypes.func.isRequired,
    createAccount: PropTypes.func.isRequired,
    isPopup: PropTypes.bool.isRequired,
    showOverlay: PropTypes.func.isRequired,
    setHeaderState: PropTypes.func.isRequired,
    onSignIn: PropTypes.func,
    goToPreviousHeaderState: PropTypes.func,
    isCheckout: PropTypes.bool,
    hideActiveOverlay: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
  };

  static defaultProps = {
    isCheckout: false,
    onSignIn: () => {},
    goToPreviousHeaderState: () => {},
  };

  containerFunctions = {
    onSignInSuccess: this.onSignInSuccess.bind(this),
    onSignInAttempt: this.onSignInAttempt.bind(this),
    onCreateAccountAttempt: this.onCreateAccountAttempt.bind(this),
    onCreateAccountSuccess: this.onCreateAccountSuccess.bind(this),
    onForgotPasswordSuccess: this.onForgotPasswordSuccess.bind(this),
    onForgotPasswordAttempt: this.onForgotPasswordAttempt.bind(this),
    onFormError: this.onFormError.bind(this),
    handleForgotPassword: this.handleForgotPassword.bind(this),
    handleSignIn: this.handleSignIn.bind(this),
    handleCreateAccount: this.handleCreateAccount.bind(this),
    onCreateAccountClick: this.onCreateAccountClick.bind(this),
    onVisible: this.onVisible.bind(this),
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
    const { showOverlay, setHeaderState, isPasswordForgotSend } = props;

    const {
      location: { pathname, state: { isForgotPassword } = {} },
    } = history;

    const state = {
      state: STATE_SIGN_IN,
      // eslint-disable-next-line react/no-unused-state
      isPasswordForgotSend,
      isLoading: false,
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

  onSignInAttempt() {
    this.setState({ isLoading: true });
  }

  onCreateAccountAttempt(_, invalidFields) {
    this.setState({ isLoading: !invalidFields });
  }

  onCreateAccountSuccess(fields) {
    const { createAccount } = this.props;

    const { password, email, fullname, privacyPolicy, gender } = fields;

    const [firstname, ...rest] = fullname?.split(" ");
    const customerData = {
      customer: {
        firstname,
        lastname: rest?.join(" ") || "",
        email,
        is_subscribed: privacyPolicy,
        gender,
      },
      password,
    };

    createAccount(customerData).then((code) => {
      // if user needs confirmation
      if (code === 2) {
        this.setState({ state: STATE_CONFIRM_EMAIL });
      }

      if (code === 1) {
        this.onSignInSuccess({ email, password });
      }

      this.stopLoading();
    }, this.stopLoading);
  }

  onForgotPasswordSuccess(fields) {
    const { forgotPassword } = this.props;

    forgotPassword(fields).then(() => {
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
