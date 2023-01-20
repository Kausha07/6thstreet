/* eslint-disable max-len */
import ClickOutside from "Component/ClickOutside";
import MyAccountOverlay from "Component/MyAccountOverlay";
import MyAccountSignedInOverlay from "Component/MyAccountSignedInOverlay";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { customerType } from "Type/Account";
import { isArabic } from "Util/App";
import history from "Util/History";
import isMobile from "Util/Mobile";
import { SMS_LINK } from "./HeaderAccount.config";
import "./HeaderAccount.style";
import Event, {
  EVENT_GTM_NEW_AUTHENTICATION,
  EVENT_ACCOUNT_TAB_ICON,
  EVENT_GTM_ACCOUNT_TAB_CLICK,
  EVENT_GTM_AUTHENTICATION,
  EVENT_SIGN_IN_SCREEN_VIEWED,
} from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";

class HeaderAccount extends PureComponent {
  static propTypes = {
    isBottomBar: PropTypes.bool.isRequired,
    isAccount: PropTypes.bool.isRequired,
    isSignedIn: PropTypes.bool.isRequired,
    customer: customerType,
    isMobile: PropTypes.bool,
    isFooter: PropTypes.bool.isRequired,
    handleFooterIsAccountOpen: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isMobile: false,
    customer: null,
  };

  _isArabic = isArabic();

  state = {
    showPopup: false,
    showPopupSignedIn: false,
  };

  componentDidMount() {
    this.orderRedirect();
  }

  orderRedirect() {
    const { pathname = "" } = window.location;
    const { isSignedIn } = this.props;
    const orderId = pathname.split(SMS_LINK)[1] || null;

    if (orderId && pathname.includes(SMS_LINK) && isSignedIn) {
      history.push(`/my-account/my-orders/${orderId}`);
    }

    if (
      orderId &&
      pathname.includes(SMS_LINK) &&
      !isSignedIn &&
      !isMobile.any()
    ) {
      history.push("/");
      localStorage.setItem("ORDER_ID", orderId);
      this.showMyAccountPopup();
    }
  }

  closePopup = () => {
    this.setState({ showPopup: false, showPopupSignedIn: false });
    this.handleFooterPopup();
  };

  showMyAccountPopup = () => {
    const { isSignedIn } = this.props;
    this.setState({ showPopup: true, showPopupSignedIn: isSignedIn });
    this.handleFooterPopup();
  };

  handleFooterPopup = () => {
    const { handleFooterIsAccountOpen, isFooter } = this.props;
    if (isFooter) {
      handleFooterIsAccountOpen();
    }
  };

  onSignIn = () => {
    this.closePopup();
  };

  renderMyAccountPopup() {
    const { isSignedIn, showMySignInPopUp } = this.props;
    const { showPopup, showPopupSignedIn } = this.state;

    if (!showPopup) {
      return null;
    }

    if (isSignedIn && showPopupSignedIn) {
      return (
        <ClickOutside onClick={this.closePopup}>
          <div>
            <MyAccountSignedInOverlay onHide={this.closePopup} />
          </div>
        </ClickOutside>
      );
    }
    if (showMySignInPopUp) {
      return (
        <MyAccountOverlay
          closePopup={this.closePopup}
          onSignIn={this.onSignIn}
          isPopup
        />
      );
    }
    return (
      <MyAccountOverlay
        showMyAccountMenuPopUp={true}
        closePopup={this.closePopup}
        onSignIn={this.onSignIn}
        isPopup
      />
    );
  }

  sendMoeEvents(event) {
    const {newSignUpEnabled} = this.props;
    if (event !== EVENT_ACCOUNT_TAB_ICON && !newSignUpEnabled){
      Moengage.track_event(event, {
        country: getCountryFromUrl().toUpperCase(),
        language: getLanguageFromUrl().toUpperCase(),
        app6thstreet_platform: "Web",
      });
    }
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

  renderAccountButton() {
    const { isSignedIn, customer, isBottomBar, isFooter, newSignUpEnabled } =
      this.props;

    if (isBottomBar) {
      return;
    }

    const accountButtonText =
      isSignedIn && customer && customer.firstname && customer.lastname
        ? `${customer.firstname} ${customer.lastname}`
        : __("Login/Register");
    const sendGTMEvent = () => {
      if (newSignUpEnabled) {
        const eventData = {
          name: EVENT_ACCOUNT_TAB_ICON,
          screen: isFooter ? "Footer" : this.getPageType(),
        };
        Event.dispatch(EVENT_GTM_NEW_AUTHENTICATION, eventData);
      } else {
        if (isFooter) {
          const popupEventData = {
            name: EVENT_SIGN_IN_SCREEN_VIEWED,
            category: "user_login",
            action: EVENT_SIGN_IN_SCREEN_VIEWED,
            popupSource: "Footer Menu",
          };
          Event.dispatch(EVENT_GTM_AUTHENTICATION, popupEventData);
        } else {
          const eventData = {
            name: EVENT_GTM_ACCOUNT_TAB_CLICK,
            category: "top_navigation_menu",
            action: EVENT_GTM_ACCOUNT_TAB_CLICK,
          };
          Event.dispatch(EVENT_GTM_AUTHENTICATION, eventData);
          const popupEventData = {
            name: EVENT_SIGN_IN_SCREEN_VIEWED,
            category: "user_login",
            action: EVENT_SIGN_IN_SCREEN_VIEWED,
            popupSource: "Account Icon",
          };
          Event.dispatch(EVENT_GTM_AUTHENTICATION, popupEventData);
        }
      }
    };
    return (
      <div block="HeaderAccount" elem="ButtonWrapper">
        <button
          block="HeaderAccount"
          elem="Button"
          mods={{ isArabic: this._isArabic, isFooter }}
          onClick={() => {
            isFooter && isSignedIn
              ? this.redirectToAccount()
              : this.showMyAccountPopup(),
              this.sendMoeEvents(EVENT_ACCOUNT_TAB_ICON);
            sendGTMEvent();
          }}
        >
          <label htmlFor="Account">
            <span>{accountButtonText}</span>
          </label>
        </button>
        {this.renderMyAccountPopup()}
      </div>
    );
  }

  redirectToAccount() {
    window.location = "/my-account";
  }

  render() {
    const { isBottomBar, isAccount, isMobile } = this.props;

    return (
      <div
        block="HeaderAccount"
        mods={{ isBottomBar }}
        mix={{
          block: "HeaderAccount",
          mods: { isAccount },
          mix: {
            block: "HeaderAccount",
            mods: { isMobile },
          },
        }}
        role="button"
        aria-label="header-account-icon"
      >
        {this.renderAccountButton()}
      </div>
    );
  }
}

export default HeaderAccount;
