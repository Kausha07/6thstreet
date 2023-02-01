/* eslint-disable eqeqeq */
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import HeaderAccount from "Component/HeaderAccount";
import { SMS_LINK } from "Component/HeaderAccount/HeaderAccount.config";
import HeaderMenu from "Component/HeaderMenu";
import HeaderWishlist from "Component/HeaderWishlist";
import MyAccountOverlay from "Component/MyAccountOverlay";
import NavigationAbstract from "Component/NavigationAbstract/NavigationAbstract.component";
import {
  setIsMobileTabActive,
  setIsCurrentTabActive,
} from "Store/MyAccount/MyAccount.action";
import { TYPE_PRODUCT } from "Util/Common/config";
import history from "Util/History";
import isMobile from "Util/Mobile";
import Event, {
  EVENT_MOE_HOME_TAB_ICON,
  EVENT_MOE_BRANDS_TAB_ICON,
  EVENT_MOE_WISHLIST_TAB_ICON,
  EVENT_ACCOUNT_TAB_ICON,
  EVENT_GTM_ACCOUNT_TAB_CLICK,
  EVENT_GTM_AUTHENTICATION,
  EVENT_SIGN_IN_SCREEN_VIEWED,
  EVENT_GTM_NEW_AUTHENTICATION,
  EVENT_WISHLIST_ICON_CLICK,
  MOE_trackEvent
} from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";

import "./MobileBottomBar.style.scss";


export const mapStateToProps = (state) => ({
  isSignedIn: state.MyAccountReducer.isSignedIn,
  newSignUpEnabled: state.AppConfig.newSigninSignupVersionEnabled,
});

export const mapDispatchToProps = (dispatch) => ({
  setMobileTabActive: (value) => dispatch(setIsMobileTabActive(value)),
  setCurrentTabActive: (value) => dispatch(setIsCurrentTabActive(value)),
});

class MobileBottomBar extends NavigationAbstract {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    setIsMobileTabActive: PropTypes.func,
    isSignedIn: PropTypes.bool.isRequired,
    newMenuGender: PropTypes.string,
    setIsCurrentTabActive: PropTypes.func,
    newSignUpEnabled: PropTypes.bool,
  };

  static defaultProps = {
    setIsMobileTabActive: () => {},
    setIsCurrentTabActive: () => {},
    newMenuGender: "women",
  };

  state = {
    isHome: false,
    redirectHome: false,
    redirectBrand: false,
    isBrand: false,
    isBottomBar: true,
    isWishlist: false,
    isAccount: false,
    isPopup: true,
    accountPopUp: "",
    isRoundedIphone: this.isRoundedIphoneScreen() ?? false,
    isIPhoneNavigationHidden: false,
    pageYOffset: window.innerHeight,
  };

  renderMap = {
    home: this.renderHome.bind(this),
    menu: this.renderMenu.bind(this),
    brand: this.renderBrand.bind(this),
    wishlist: this.renderWishlist.bind(this),
    account: this.renderAccount.bind(this),
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleResize);
    this.orderRedirect();
  }

  closePopup = () => {
    this.setState({ accountPopUp: "" });
  };

  isPDP = () => {
    return window.pageType === TYPE_PRODUCT;
  };

  handleResize = () => {
    const { pageYOffset, isRoundedIphone } = this.state;
    this.setState({
      isIPhoneNavigationHidden:
        isRoundedIphone && window.pageYOffset > pageYOffset,
      pageYOffset: window.pageYOffset,
    });
  };

  orderRedirect() {
    const { isSignedIn, pathname } = this.props;
    const orderId = pathname.split(SMS_LINK)[1] || null;

    if (
      orderId &&
      pathname.includes(SMS_LINK) &&
      !isSignedIn &&
      isMobile.any()
    ) {
      history.push("/");
      localStorage.setItem("ORDER_ID", orderId);
      this.renderAccountPopUp();
    }
  }

  routeChangeHome = () => {
    this.setState({
      redirectHome: true,
    });
  };

  routeChangeBrand = () => {
    this.setState({
      redirectBrand: true,
      isCategoryMenu: false,
    });
  };

  renderAccountMenuPopUp = () => {
    const { isPopup } = this.state;
    const popUpElement = (
      <MyAccountOverlay showMyAccountMenuPopUp={true} isPopup={isPopup} closePopup={this.closePopup} />
    );

    this.setState({ accountPopUp: popUpElement });
    return popUpElement;
  }

  renderAccountPopUp = () => {
    const { isPopup } = this.state;
    const popUpElement = (
      <MyAccountOverlay isPopup={isPopup} closePopup={this.closePopup} />
    );

    this.setState({ accountPopUp: popUpElement });
    return popUpElement;
  };

  routeChangeAccount = () => {
    const { history, setMobileTabActive, setCurrentTabActive } = this.props;

    setMobileTabActive(false);
    setCurrentTabActive(false);
    this.closePopup();

    return history.push("/my-account");
  };

  routeChangeWishlist = () => {
    const { history, setMobileTabActive, setCurrentTabActive } = this.props;

    setMobileTabActive(true);
    setCurrentTabActive(true);
    this.closePopup();

    return history.push("/my-account/my-wishlist");
  };

  routeChangeLogin = () => {
    this.setState({ redirectLogin: true });
  };

  isRoundedIphoneScreen() {
    return (
      window.navigator.userAgent.match(/iPhone/) && window.outerHeight > "800"
    );
  }

  sendMoeEvents(event) {
    const {newSignUpEnabled} = this.props;
    if (event == EVENT_MOE_WISHLIST_TAB_ICON && newSignUpEnabled){
      const eventData = {
        name: EVENT_WISHLIST_ICON_CLICK,
        screen: this.getPageType() || "",
      };
      Event.dispatch(EVENT_GTM_NEW_AUTHENTICATION, eventData);
    }else{
      MOE_trackEvent(event, {
        country: getCountryFromUrl().toUpperCase(),
        language: getLanguageFromUrl().toUpperCase(),
        app6thstreet_platform: "Web",
      });
    }
  }
  sendPopupEvent(source) {
    const popupEventData = {
      name: EVENT_SIGN_IN_SCREEN_VIEWED,
      category: "user_login",
      action: EVENT_SIGN_IN_SCREEN_VIEWED,
      popupSource: source,
    };
    Event.dispatch(EVENT_GTM_AUTHENTICATION, popupEventData);
  }
  renderHome() {
    const { history } = this.props;
    const { isHome, redirectHome, isCategoryMenu } = this.state;

    if (redirectHome) {
      this.setState({ redirectHome: false });
      return history.push("/");
    }

    this.setState({
      isHome: window.location.pathname === "/" && !isCategoryMenu,
    });

    return (
      <button
        onClick={() => {
          this.routeChangeHome();
          this.sendMoeEvents(EVENT_MOE_HOME_TAB_ICON);
        }}
        key="homeButton"
        block="MobileBottomBar"
        elem="HomeAndBrand"
        mods={{ isHomeButton: true }}
        mix={{
          block: "MobileBottomBar",
          elem: "HomeAndBrand",
          mods: { isActive: isHome },
        }}
      >
        {/* <label htmlFor="Home">{__("Home")}</label> */}
      </button>
    );
  }

  renderBrand() {
    const { history } = this.props;
    const { isBrand, redirectBrand, isCategoryMenu } = this.state;

    if (redirectBrand) {
      this.setState({ redirectBrand: false });
      return history.push("/shop-by-brands");
    }

    this.setState({
      isBrand:
        window.location.pathname === "/shop-by-brands" && !isCategoryMenu,
    });

    return (
      <button
        onClick={() => {
          this.routeChangeBrand();
          this.sendMoeEvents(EVENT_MOE_BRANDS_TAB_ICON);
        }}
        key="brandButton"
        block="MobileBottomBar"
        elem="HomeAndBrand"
        mods={{ isBrandButton: true }}
        mix={{
          block: "MobileBottomBar",
          elem: "HomeAndBrand",
          mods: { isActive: isBrand },
        }}
      >
        {/* <label htmlFor="Home">{__("Brands")}</label> */}
      </button>
    );
  }

  renderMenu() {
    const { newMenuGender } = this.props;

    return (
      <HeaderMenu
        key="menu"
        newMenuGender={newMenuGender}
        isMobileBottomBar={true}
      />
    );
  }

  renderWishlist() {
    const { isBottomBar, isWishlist, isCategoryMenu } = this.state;

    const { isSignedIn } = this.props;

    const popup_source = "Wishlist";
    this.setState({
      isWishlist:
        location.pathname === "/my-account/my-wishlist" && !isCategoryMenu,
    });

    const onClickHandle = !isSignedIn
      ? this.renderAccountPopUp
      : this.routeChangeWishlist;

    return (
      <div key="wishlist">
        <div
          onClick={() => {
            onClickHandle();
            this.sendMoeEvents(EVENT_MOE_WISHLIST_TAB_ICON);
            {
              !isSignedIn ? this.sendPopupEvent(popup_source) : null;
            }
          }}
          key="wishlistButton"
          block="MobileBottomBar"
          elem="WishListAndAccount"
          mods={{ isActive: isWishlist }}
        >
          <HeaderWishlist
            isWishlist={isWishlist}
            isBottomBar={isBottomBar}
            key="wishlist"
          />
        </div>
      </div>
    );
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

  renderAccount() {
    const { isBottomBar, isAccount, accountPopUp } = this.state;
    const { location, isSignedIn, newSignUpEnabled } = this.props;
    const popup_source = "Account Icon";

    this.setState({ isAccount: location.pathname === "/my-account" });

    const onClickHandle = !isSignedIn
      ? this.renderAccountMenuPopUp
      : this.routeChangeAccount;

    const sendGTMEvent = () => {
      if (newSignUpEnabled) {
        const eventData = {
          name: EVENT_ACCOUNT_TAB_ICON,
          screen: this.getPageType() || "",
        };
        Event.dispatch(EVENT_GTM_NEW_AUTHENTICATION, eventData);
      } else {
        const eventData = {
          name: EVENT_GTM_ACCOUNT_TAB_CLICK,
          category: "top_navigation_menu",
          action: EVENT_GTM_ACCOUNT_TAB_CLICK,
        };
        Event.dispatch(EVENT_GTM_AUTHENTICATION, eventData);
        if (!isSignedIn) {
          this.sendPopupEvent(popup_source);
        }
      }
    };
    return (
      <div key="account">
        <button
          onClick={() => {
            onClickHandle();
            this.sendMoeEvents(EVENT_ACCOUNT_TAB_ICON);
            sendGTMEvent();
          }}
          key="accountButton"
          block="MobileBottomBar"
          elem="WishListAndAccount"
        >
          <HeaderAccount
            isAccount={isAccount}
            isBottomBar={isBottomBar}
            key="account"
          />
        </button>
        {accountPopUp}
      </div>
    );
  }

  render() {
    const { isIPhoneNavigationHidden } = this.state;

    // Commenting it for not hiding bottom bar after coming from pdp(PWA-907)

    // if(this.isPDP()){
    //     return null;
    // }

    if (!isMobile.any()) {
      return null;
    }
    return (
      <div
        block="MobileBottomBar"
        id="mobileBottomBar"
        mods={{ isIPhoneNavigationHidden }}
      >
        {this.renderNavigationState()}
      </div>
    );
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MobileBottomBar)
);
