import HeaderBottomBar from "Component/HeaderBottomBar";
import HeaderMainSection from "Component/HeaderMainSection";
import HeaderTopBar from "Component/HeaderTopBar";
import MobileBottomBar from "Component/MobileBottomBar";
import MobileMenuSidebar from "Component/MobileMenuSideBar/MobileMenuSidebar.component";
import { MOBILE_MENU_SIDEBAR_ID } from "Component/MobileMenuSideBar/MoblieMenuSideBar.config";
import OfflineNotice from "Component/OfflineNotice";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { matchPath, withRouter } from "react-router";
import {
  TYPE_ACCOUNT,
  TYPE_BRAND,
  TYPE_CART,
  TYPE_HOME,
  TYPE_PRODUCT,
} from "Route/UrlRewrites/UrlRewrites.config";
import PDPDispatcher from "Store/PDP/PDP.dispatcher";
import isMobile from "Util/Mobile";
import "./Header.style";

export const mapStateToProps = (state) => {
  return {
    checkoutDetails: state.CartReducer.checkoutDetails,
  };
};

export const mapDispatchToProps = (dispatch) => ({
  resetProduct: () => PDPDispatcher.resetProduct({}, dispatch),
});
export class Header extends PureComponent {
  static propTypes = {
    navigationState: PropTypes.shape({
      name: PropTypes.string,
    }).isRequired,
  };

  state = {
    newMenuGender: "",
    isMobile: isMobile.any() || isMobile.tablet(),
    delay: 150,
    type: null,
  };

  componentDidMount() {
    const { delay } = this.state;
    this.timer = setInterval(this.tick, delay);
  }

  componentDidUpdate(prevProps, prevState) {
    const { delay, type } = this.state;
    const { resetProduct } = this.props;
    if (prevProps !== delay) {
      clearInterval(this.timer);
      this.timer = setInterval(this.tick, delay);
    }
    if (prevState.type !== type && type !== TYPE_PRODUCT) {
      resetProduct();
    }
  }

  componentWillUnmount() {
    this.timer = null;
  }

  tick = () => {
    this.setState({
      type: this.getPageType(),
    });
  };

  getPageType() {
    if (location.pathname === "/" || location.pathname === "") {
      return TYPE_HOME;
    }
    if (matchPath(location.pathname, "/brands")) {
      return TYPE_BRAND;
    }
    if (matchPath(location.pathname, "/my-account")) {
      return TYPE_ACCOUNT;
    }
    if (matchPath(location.pathname, "/cart")) {
      return TYPE_CART;
    }

    return window.pageType;
  }

  headerSections = [
    HeaderTopBar,
    HeaderMainSection,
    HeaderBottomBar,
    MobileBottomBar,
  ];
  headerSectionsTwo = [HeaderTopBar, HeaderMainSection, HeaderBottomBar];

  getIsCheckout = () => {
    const { isMobile } = this.state;
    if (location.pathname.match(/checkout/)) {
      return isMobile ? true : !location.pathname.match(/success/);
    }
    return false;
  };

  isPDP() {
    const { type } = this.state;
    return TYPE_PRODUCT === type;
  }

  getHideHeaderFooter = () => {
    const { isMobile } = this.state;
    if (!isMobile) {
      return false;
    }
    const result = this.isPDP() || location.pathname.match(/cart/);
    return result;
  };
  shouldChatBeHidden() {
    const chatElem = document.getElementById("ori-chatbot-root");
    if (chatElem) {
      if (
        location.pathname.match(/checkout|cart/) ||
        (isMobile && location.pathname.match(/faq|return-information/))
      ) {
        chatElem.classList.add("hidden");
      } else {
        chatElem.classList.remove("hidden");
      }
    }
  }

  renderSection = (Component, i) => {
    const { navigationState } = this.props;
    const { newMenuGender } = this.state;
    const { pathname = "" } = window.location;

    return (
      <Component
        key={i}
        navigationState={navigationState}
        changeMenuGender={this.changeMenuGender}
        newMenuGender={newMenuGender}
        pathname={pathname}
      />
    );
  };

  changeMenuGender = (gender) => {
    this.setState({ newMenuGender: gender });
  };

  render() {
    const {
      navigationState: { name },
      checkoutDetails,
    } = this.props;
    const { isMobile } = this.state;
    const isCheckout = this.getIsCheckout();
    const hideHeaderFooter = this.getHideHeaderFooter();
    this.shouldChatBeHidden();
    return (
      <>
        <header block="Header" mods={{ name }}>
          {isCheckout && !checkoutDetails
            ? null
            : isMobile && checkoutDetails
            ? null
            : isMobile && location.pathname.match(/faq|return-information/)
            ? null
            : hideHeaderFooter
            ? this.headerSectionsTwo.map(this.renderSection)
            : this.headerSections.map(this.renderSection)}
          <MobileMenuSidebar activeOverlay={MOBILE_MENU_SIDEBAR_ID} />
        </header>
        <OfflineNotice />
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
