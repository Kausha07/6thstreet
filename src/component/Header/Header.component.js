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
  TYPE_NOTFOUND,
} from "Route/UrlRewrites/UrlRewrites.config";
import PDPDispatcher from "Store/PDP/PDP.dispatcher";
import isMobile from "Util/Mobile";
import "./Header.style";

import Config from "../../route/LiveExperience/LiveExperience.config";
import { getBambuserChannelID } from "../../util/Common/index";
import VueIntegrationQueries from "Query/vueIntegration.query";
import LivePartyDispatcher from "Store/LiveParty/LiveParty.dispatcher";

export const mapStateToProps = (state) => {
  return { checkoutDetails: state.CartReducer.checkoutDetails,
    isLive : state.LiveParty.isLive,
    is_live_party_enabled: state.AppConfig.is_live_party_enabled,};
  
};
export const mapDispatchToProps = (dispatch) => ({
  resetProduct: () => PDPDispatcher.resetProduct({}, dispatch),
  showPDPSearch: (displaySearch) =>
    PDPDispatcher.setPDPShowSearch({ displaySearch }, dispatch),
    requestLiveShoppingInfo : (options) =>
    LivePartyDispatcher.requestLiveShoppingInfo(options, dispatch),
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

  requestLiveShoppingInfo() {
    const locale = VueIntegrationQueries.getLocaleFromUrl();
    const [lang, country] = locale && locale.split("-");
    const { requestLiveShoppingInfo } = this.props;
    Config.storeId = getBambuserChannelID(country);
    if(requestLiveShoppingInfo) {
      requestLiveShoppingInfo({
      storeId: Config.storeId,
      isStaging: process.env.REACT_APP_SPOCKEE_STAGING,
    });
    }
  }

  renderFAB = () => {
    (function (d, t, i, w) {
      window.__bfwId = w;
      if (d.getElementById(i) && window.__bfwInit) return window.__bfwInit();
      if (d.getElementById(i)) return;
      var s,
        ss = d.getElementsByTagName(t)[0];
      s = d.createElement(t);
      s.id = i;
      s.src = "https://lcx-widgets.bambuser.com/embed.js";
      ss.parentNode.insertBefore(s, ss);
    })(
      document,
      "script",
      "bambuser-liveshopping-widget",
      "cSgglVM5Uu6haazakKgm"
    );
  };

  componentDidMount() {
    const { delay } = this.state;
    const { isLive, is_live_party_enabled } = this.props;
    this.timer = setInterval(this.tick, delay);
    if(is_live_party_enabled )
    {
      this.requestLiveShoppingInfo();
    }  
  }

  componentDidUpdate(prevProps, prevState) {
    // const { delay, type,isMobile } = this.state;
    // if (prevState !== delay) {
    //   clearInterval(this.timer);
    //   this.timer = setInterval(this.tick, delay);
    // }
    // if(isMobile) {
    //   const { resetProduct, showPDPSearch } = this.props;
    //   if (prevState.type !== type && type !== TYPE_PRODUCT) {
    //     resetProduct();
    //     showPDPSearch(false);
    //   }
    // }

    const { isLive, is_live_party_enabled } = this.props;
    const Exceptionalpath = ["/cart", "/checkout"];

    if(Exceptionalpath.includes(location.pathname))
    {
      const chatElem = document.querySelector("[data-widget-id='cSgglVM5Uu6haazakKgm']")
      if(chatElem)
      {
        chatElem.remove();
      }
      return; 
    }
    
    if ((isLive !== prevProps.isLive || prevProps.location.pathname !== this.props.location.pathname) && is_live_party_enabled){
      this.renderFAB();
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
    if (matchPath(location.pathname, "/shop-by-brands")) {
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
        (isMobile &&
          location.pathname.match(
            /faq|shipping-policy|return-information|private-sales|reward-points|about-apparel-group|try-again-later|liked-products/
          ))
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

  renderHeaderSections() {
    const { checkoutDetails } = this.props;
    const isCheckout = this.getIsCheckout();
    const hideHeaderFooter = this.getHideHeaderFooter();
    const { isMobile } = this.state;

    if (isCheckout && !checkoutDetails) {
      return null;
    }

    if (isMobile && checkoutDetails) {
      return null;
    }

    if (hideHeaderFooter) {
      return this.headerSectionsTwo.map(this.renderSection);
    }

    return this.headerSections.map(this.renderSection);
  }

  render() {
    const {
      navigationState: { name },
    } = this.props;
    const { isMobile } = this.state;

    this.shouldChatBeHidden();

    return (
      <>
        <header block="Header" mods={{ name }} id="headerTop">
          {isMobile &&
          location.pathname.match(
            /faq|shipping-policy|return-information|private-sales|reward-points|about-apparel-group|try-again-later|liked-products/
          )
            ? null
            : this.renderHeaderSections()}
          <MobileMenuSidebar activeOverlay={MOBILE_MENU_SIDEBAR_ID} />
        </header>
        <OfflineNotice />
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));

