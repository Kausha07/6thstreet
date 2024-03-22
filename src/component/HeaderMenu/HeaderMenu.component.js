import PropTypes from "prop-types";
import { PureComponent } from "react";
import { withRouter } from "react-router";
import { EVENT_MOE_CATEGORIES_TAB_ICON, MOE_trackEvent } from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import Menu from "Component/Menu";
import { MOBILE_MENU_SIDEBAR_ID } from "Component/MobileMenuSideBar/MoblieMenuSideBar.config";
import browserHistory from "Util/History";
import categorySVG from "Component/MobileBottomBar/icons/categories.svg";
import categoryActiveSVG from "Component/MobileBottomBar/icons/categories-active.svg";
import isMobile from "Util/Mobile";
import { isMsiteMegaMenuRoute } from "Component/MobileMegaMenu/Utils/MobileMegaMenu.helper";

import "./HeaderMenu.style";

class HeaderMenu extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    toggleOverlayByKey: PropTypes.func.isRequired,
    newMenuGender: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    activeOverlay: PropTypes.string.isRequired,
    setGender: PropTypes.func.isRequired,
    is_msite_megamenu_enabled:PropTypes.bool,
  };

  state = {
    expanded: false,
  };

  renderMap = {
    renderCategoriesButton: this.renderCategoriesButton.bind(this),
  };

  static getDerivedStateFromProps(props) {
    const {
      location: { pathname },
      gender,
      activeOverlay,
    } = props;

    return {
      expanded:
        (pathname.includes(`/${gender}.html`) &&
        activeOverlay === MOBILE_MENU_SIDEBAR_ID) || isMsiteMegaMenuRoute(),
    };
  }

  onCategoriesClick = () => {
    const { toggleOverlayByKey, gender, setGender, setLastTapItemOnHome, is_msite_megamenu_enabled, setMobileMegaMenuPageOpenFlag } =
      this.props;

    if (gender === "home_beauty_women" || gender === "influencer") {
      setGender("women");
    }
    MOE_trackEvent(EVENT_MOE_CATEGORIES_TAB_ICON, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      app6thstreet_platform: "Web",
    });
    this.setState(({ expanded }) => ({ expanded: !expanded }));
    toggleOverlayByKey(MOBILE_MENU_SIDEBAR_ID);
    setLastTapItemOnHome("");

    if(is_msite_megamenu_enabled && isMobile.any()) {
      browserHistory.push("/megamenu");
      setMobileMegaMenuPageOpenFlag("megamenu");
    }else {
      if (gender !== "all") {
        browserHistory.push(
          `/${
              gender === "home_beauty_women" || gender === "influencer"
                ? "women"
                : gender
          }.html`
          );
      }
    };
    }

  renderMenu() {
    const { newMenuGender, setMobileMegaMenuPageOpenFlag, mobileMegaMenuPageOpenFlag = "" } = this.props;

    return <Menu newMenuGender={newMenuGender} setMobileMegaMenuPageOpenFlag={setMobileMegaMenuPageOpenFlag} mobileMegaMenuPageOpenFlag={mobileMegaMenuPageOpenFlag}/>;
  }

  renderCategoriesButton() {
    const { expanded } = this.state;

    return (
      <button
        mix={{
          block: "HeaderMenu",
          elem: "Button",
          mods: { isExpanded: expanded },
        }}
        onClick={this.onCategoriesClick}
      >
        <div className={`nav-bar-item-button ${expanded ? 'selected' : ''} `}>
          <img className="nav-bar-item-icon"
            src={expanded
              ? categoryActiveSVG
              : categorySVG}
            alt="Wishlist" width={24} height={24} />
          <div className={`nav-bar-item-label ${expanded ? 'selected' : ''}`}>
            {__("Categories")}</div>
        </div>
        {!this.props.isMobileBottomBar && (
          <label htmlFor="Categories">{__("Categories")}</label>
        )}
      </button>
    );
  }

  render() {

    return (
      <div block="HeaderMenu">
        {this.renderCategoriesButton()}
        {this.renderMenu()}
      </div>
    );
  }
}

export default withRouter(HeaderMenu);
