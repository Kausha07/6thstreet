import PropTypes from "prop-types";
import { Fragment } from "react";
import { withRouter } from "react-router";

import CountrySwitcher from "Component/CountrySwitcher";
import InlineCustomerSupport from "Component/InlineCustomerSupport";
import LanguageSwitcher from "Component/LanguageSwitcher";
import NavigationAbstract from "Component/NavigationAbstract/NavigationAbstract.component";
import { DEFAULT_STATE_NAME } from "Component/NavigationAbstract/NavigationAbstract.config";
import isMobile from "Util/Mobile";

import "./HeaderTopBar.style";

class HeaderTopBar extends NavigationAbstract {
  static propTypes = {
    location: PropTypes.object.isRequired,
  };

  stateMap = {
    [DEFAULT_STATE_NAME]: {
      support: true,
      cms: true,
      store: true,
    },
  };

  state = {
    isOnMobile: false,
    pageYOffset: 0,
    isHidden: false,
  };

  renderMap = {
    support: this.renderCustomerSupport.bind(this),
    cms: this.renderCmsBlock.bind(this),
    store: this.renderStoreSwitcher.bind(this),
  };

  static getDerivedStateFromProps(props) {
    const { location } = props;

    return location.pathname !== "/" && isMobile.any()
      ? {
          isOnMobile: true,
        }
      : {
          isOnMobile: false,
        };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const { pageYOffset } = this.state;

    this.setState({
      isHidden: window.pageYOffset > pageYOffset,
      pageYOffset: window.pageYOffset,
    });
  };

  renderCmsBlock() {
    // TODO: find out what is this, render here
    return (
      <div key="cms" block="HeaderTopBar" elem="CmsBlock">
        {__("ALL PRICES ARE INCLUSIVE OF VAT")}
      </div>
    );
  }

  renderCustomerSupport() {
    return <InlineCustomerSupport key="support" {...this.props} />;
  }

  renderStoreSwitcher() {
    return (
      <Fragment key="store-switcher">
        <div block="Switcher">
          <LanguageSwitcher />
          <CountrySwitcher />
        </div>
      </Fragment>
    );
  }

  isHidden = () => {
    const { location: { pathname } } = this.props;
    if( isMobile.any() &&
        !(
          pathname === "/" || pathname === "" ||
          pathname === "/women.html" || pathname === "/men.html" || pathname === "/kids.html" || pathname === "/home.html" ||
          pathname.includes("catalogsearch")
        )
      ) {
      return true;
    }
    return false
  }

  render() {
    return (
      <div block="HeaderTopBar" mods={{ isHidden: this.isHidden() }}>
        <div block="HeaderTopBar" elem="ContentWrapper">
          {this.renderNavigationState()}
        </div>
      </div>
    );
  }
}

export default withRouter(HeaderTopBar);
