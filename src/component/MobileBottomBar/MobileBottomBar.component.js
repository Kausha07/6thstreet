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
import { setIsMobileTabActive } from "Store/MyAccount/MyAccount.action";
import { TYPE_PRODUCT } from "Route/UrlRewrites/UrlRewrites.config";
import history from "Util/History";
import isMobile from "Util/Mobile";

import "./MobileBottomBar.style.scss";

export const mapStateToProps = (state) => ({
  isSignedIn: state.MyAccountReducer.isSignedIn,
});

export const mapDispatchToProps = (dispatch) => ({
  setMobileTabActive: (value) => dispatch(setIsMobileTabActive(value)),
});

class MobileBottomBar extends NavigationAbstract {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    setIsMobileTabActive: PropTypes.func,
    isSignedIn: PropTypes.bool.isRequired,
    newMenuGender: PropTypes.string,
  };

  static defaultProps = {
    setIsMobileTabActive: () => {},
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

  renderAccountPopUp = () => {
    const { isPopup } = this.state;
    const popUpElement = (
      <MyAccountOverlay isPopup={isPopup} closePopup={this.closePopup} />
    );

    this.setState({ accountPopUp: popUpElement });
    return popUpElement;
  };

  routeChangeAccount = () => {
    const { history, setMobileTabActive } = this.props;

    setMobileTabActive(false);
    this.closePopup();

    return history.push("/my-account");
  };

  routeChangeWishlist = () => {
    const { history, setMobileTabActive } = this.props;

    setMobileTabActive(true);
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
        onClick={this.routeChangeHome}
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
      return history.push("/brands");
    }

    this.setState({
      isBrand: window.location.pathname === "/brands" && !isCategoryMenu,
    });

    return (
      <button
        onClick={this.routeChangeBrand}
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
          onClick={onClickHandle}
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

  renderAccount() {
    const { isBottomBar, isAccount, accountPopUp } = this.state;
    const { location, isSignedIn } = this.props;

    this.setState({ isAccount: location.pathname === "/my-account" });

    const onClickHandle = !isSignedIn
      ? this.renderAccountPopUp
      : this.routeChangeAccount;

    return (
      <div key="account">
        <button
          onClick={onClickHandle}
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
    
    if(!isMobile.any()){
      return null
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
