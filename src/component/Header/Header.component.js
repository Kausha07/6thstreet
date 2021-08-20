import PropTypes from "prop-types";
import { PureComponent } from "react";
import { withRouter } from "react-router";
import HeaderBottomBar from "Component/HeaderBottomBar";
import HeaderMainSection from "Component/HeaderMainSection";
import HeaderTopBar from "Component/HeaderTopBar";
import MobileBottomBar from "Component/MobileBottomBar";
import MobileMenuSidebar from "Component/MobileMenuSideBar/MobileMenuSidebar.component";
import { MOBILE_MENU_SIDEBAR_ID } from "Component/MobileMenuSideBar/MoblieMenuSideBar.config";
import OfflineNotice from "Component/OfflineNotice";
import isMobile from "Util/Mobile";
import { connect } from "react-redux";


import "./Header.style";

export const mapStateToProps = (state) => {
  return  {checkoutDetails: state.CartReducer.checkoutDetails}
};
export class Header extends PureComponent {
  static propTypes = {
    navigationState: PropTypes.shape({
      name: PropTypes.string,
    }).isRequired,
  };

  state = {
    newMenuGender: "",
    isMobile: isMobile.any() || isMobile.tablet(),
  };

  headerSections = [
    HeaderTopBar,
    HeaderMainSection,
    HeaderBottomBar,
    MobileBottomBar,
  ];

  getIsCheckout = () => {
    const { isMobile } = this.state;
    if (location.pathname.match(/checkout/)) {
      return isMobile ? true : !location.pathname.match(/success/);
    }
    return false;
  };

  shouldChatBeHidden() {
    const chatElem = document.getElementById("ori-chatbot-root");
    if (chatElem) {
      if (location.pathname.match(/checkout|cart/)) {
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
      checkoutDetails
    } = this.props;
    const { isMobile } = this.state;
    const isCheckout = this.getIsCheckout();
    this.shouldChatBeHidden();
    return (
      <>
        <header block="Header" mods={{ name }}>
          {isCheckout   && !checkoutDetails ?  null :isMobile && checkoutDetails ? null :  this.headerSections.map(this.renderSection)}
          <MobileMenuSidebar activeOverlay={MOBILE_MENU_SIDEBAR_ID} />
        </header>
        <OfflineNotice />
      </>
    );
  }
}

export default connect(mapStateToProps)(withRouter(Header));
