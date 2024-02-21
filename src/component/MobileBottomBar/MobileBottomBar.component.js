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
import { TYPE_PRODUCT } from "Route/UrlRewrites/UrlRewrites.config";
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
  EVENT_MOE_CUSTOM_TAB_ICON,
  MOE_trackEvent
} from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { customerType } from "Type/Account";
import homeSVG from "./icons/home.svg";
import homeActiveSVG from "./icons/home-active.svg";
import brandSVG from "./icons/brand.svg";
import brandActiveSVG from "./icons/brand-active.svg";
import wishlistSVG from "./icons/favorites.svg";
import wishlistActiveSVG from "./icons/favorites-active.svg";
import accountSVG from "./icons/account.svg";
import accountActiveSVG from "./icons/account-active.svg";
import "./MobileBottomBar.style.scss";


export const mapStateToProps = (state) => ({
  isSignedIn: state.MyAccountReducer.isSignedIn,
  newSignUpEnabled: state.AppConfig.newSigninSignupVersionEnabled,
  customer: state.MyAccountReducer.customer,
  IsVipCustomerEnabled: state.AppConfig.isVIPEnabled,
  bottomNavConfig: state.AppConfig.config.bottomNavigationConfig,
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
    customer: customerType.isRequired,
    IsVipCustomerEnabled: PropTypes.bool,
  };

  static defaultProps = {
    setIsMobileTabActive: () => { },
    setIsCurrentTabActive: () => { },
    newMenuGender: "women",
  };

  state = {
    isHome: false,
    redirectHome: false,
    redirectBrand: false,
    redirectCenterOption: false,
    isBrand: false,
    isCustomOption: false,
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
    centerOption: this.renderCenterOption.bind(this),
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

  routeChangeCustomOption = () => {
    this.setState({
      redirectCenterOption: true,
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
    const { newSignUpEnabled, isSignedIn } = this.props;
    if (event == EVENT_MOE_WISHLIST_TAB_ICON && newSignUpEnabled) {
      const eventData = {
        name: EVENT_WISHLIST_ICON_CLICK,
        screen: this.getPageType() || "",
      };
      Event.dispatch(EVENT_GTM_NEW_AUTHENTICATION, eventData);
    } else {
      MOE_trackEvent(event, {
        country: getCountryFromUrl().toUpperCase(),
        language: getLanguageFromUrl().toUpperCase(),
        isLoggedIn: isSignedIn,
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
      <div className={`nav-bar-item`} >
        <button
          onClick={() => {
            this.routeChangeHome();
            this.sendMoeEvents(EVENT_MOE_HOME_TAB_ICON);
          }}
          key="homeButton"
          elem="HomeAndBrand"
          className={`nav-bar-item-button ${isHome ? 'selected' : ''}`}>
          <img className="nav-bar-item-icon"
            src={isHome
              ? homeActiveSVG
              : homeSVG}
            alt="Home" width={24} height={24} />
          <div className={`nav-bar-item-label ${isHome ? 'selected' : ''}`}>
            {__('Home')}</div>
        </button>
      </div>
    );
  }

  renderCenterOption() {
    const { history, bottomNavConfig } = this.props;
    const { isBrand,
      redirectBrand,
      isCategoryMenu,
      redirectCenterOption,
      isCustomOption } = this.state;
    const language = getLanguageFromUrl();
    const country = getCountryFromUrl().toLowerCase();
    if (bottomNavConfig[country]?.redirect_brand) {
      if (redirectBrand) {
        this.setState({ redirectBrand: false });
        return history.push("/shop-by-brands");
      }
      this.setState({
        isBrand:
          window.location.pathname === "/shop-by-brands" && !isCategoryMenu,
      });
      return (
        <div className="nav-bar-item" >
          <button
            onClick={() => {
              this.routeChangeBrand();
              this.sendMoeEvents(EVENT_MOE_BRANDS_TAB_ICON);
            }}
            key="brandButton"
            elem="HomeAndBrand"
            className={`nav-bar-item-button ${isBrand ? 'selected' : ''}`}>
            <img className="nav-bar-item-icon"
              src={isBrand
                ? brandActiveSVG
                : brandSVG}
              alt="Brands" width={24} height={24} />
            <div className={`nav-bar-item-label ${isBrand ? 'selected' : ''}`}>
              {__('Brands')}</div>
          </button>
        </div>
      );
    } else {
      if (redirectCenterOption) {
        this.setState({ redirectCenterOption: false });
        return history.push(language == 'en'
          ? `/store/${bottomNavConfig?.[country]?.alternateLink_en}`
          : `/store/${bottomNavConfig?.[country]?.alternateLink_ar}`);
      }
      this.setState({
        isCustomOption:
          window.location.pathname === (language == 'en'
            ? `/store/${bottomNavConfig?.[country]?.alternateLink_en}`
            : `/store/${bottomNavConfig?.[country]?.alternateLink_ar}`) && !isCategoryMenu,
      });
      return (
        <div className="nav-bar-item" >
          <button
            onClick={() => {
              this.routeChangeCustomOption();
              this.sendMoeEvents(EVENT_MOE_CUSTOM_TAB_ICON);
            }}
            key="customButton"
            elem="HomeAndBrand"
            className={`nav-bar-item-button ${isCustomOption ? 'selected' : ''}`}>
            <img className="nav-bar-item-icon"
              src={isCustomOption
                ? bottomNavConfig[country].selectedIcon
                : bottomNavConfig[country].icon}
              alt={bottomNavConfig[country].label} width={24} height={24} />
            <div className={`nav-bar-item-label ${isCustomOption ? 'selected' : ''}`}>
              {language == 'en' ? bottomNavConfig[country].label_en : bottomNavConfig[country].label_ar}</div>
          </button>
        </div>
      );
    }
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
      <div key="wishlist" className="nav-bar-item">
        <button
          onClick={() => {
            onClickHandle();
            this.sendMoeEvents(EVENT_MOE_WISHLIST_TAB_ICON);
            {
              !isSignedIn ? this.sendPopupEvent(popup_source) : null;
            }
          }}
          key="wishlistButton"
          elem="WishListAndAccount"
          className={`nav-bar-item-button  ${isWishlist ? 'selected' : ''}`}>
          <img className="nav-bar-item-icon"
            src={isWishlist
              ? wishlistActiveSVG
              : wishlistSVG}
            alt="Wishlist" width={24} height={24} />
          <div className={`nav-bar-item-label ${isWishlist ? 'selected' : ''}`}>
            {__('WishList')}</div>
          <HeaderWishlist
            isWishlist={isWishlist}
            isBottomBar={isBottomBar}
            key="wishlist"
          />
        </button>
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
    const { location, isSignedIn, newSignUpEnabled, customer, IsVipCustomerEnabled } = this.props;
    const popup_source = "Account Icon";

    this.setState({ isAccount: location.pathname === "/my-account" });

    const isVip = isSignedIn && customer && customer?.vipCustomer && IsVipCustomerEnabled || false;
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
      <div key="account" className={`nav-bar-item`}>
        <button
          onClick={() => {
            onClickHandle();
            this.sendMoeEvents(EVENT_ACCOUNT_TAB_ICON);
            sendGTMEvent();
          }}
          key="accountButton"
          elem="WishListAndAccount"
          mods={{ isVip }}
          className={`nav-bar-item-button ${isAccount ? 'selected' : ''}`}>
          <img className="nav-bar-item-icon"
            src={isAccount
              ? accountActiveSVG
              : accountSVG}
            alt="Wishlist" width={24} height={24} />
          <div className={`nav-bar-item-label ${isAccount ? 'selected' : ''}`}>
            {__('Account')}</div>
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
