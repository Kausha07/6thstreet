import PropTypes from "prop-types";
import { Fragment } from "react";
import { withRouter } from "react-router";
import { getCountryFromUrl } from "Util/Url/Url";
import CountrySwitcher from "Component/CountrySwitcher";
import InlineCustomerSupport from "Component/InlineCustomerSupport";
import LanguageSwitcher from "Component/LanguageSwitcher";
import NavigationAbstract from "Component/NavigationAbstract/NavigationAbstract.component";
import { DEFAULT_STATE_NAME } from "Component/NavigationAbstract/NavigationAbstract.config";
import isMobile from "Util/Mobile";
import { isArabic } from "Util/App";
import { connect } from "react-redux";

import "./HeaderTopBar.style";

const settings = {
  loop: true,
  autoplay: true,
  axis: "vertical",
  items: 1,
  edgePadding: 10,
  autoHeight: true,
  autoplayTimeout: 3000,
  speed: 1000,
};

export const mapStateToProps = (state) => ({
  config: state.AppConfig.config,
  country: state.AppState.country,
  isClubApparelEnabled: state.AppConfig.isClubApparelEnabled,
})
class HeaderTopBar extends NavigationAbstract {
  static propTypes = {
    location: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    country: PropTypes.string.isRequired,
    isClubApparelEnabled: PropTypes.bool,
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
    isArabic: isArabic(),
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

  renderShippingInfo() {
    if(this.props.country && this.props.config && this.props.config.countries) {
    let country_name = getCountryFromUrl();
    const { isArabic } = this.state;
    const {
      config: { countries },
      country,
    } = this.props;
    let free_return_amount = 200;
    if( countries[country] && countries[country].free_return_amount){
      free_return_amount = countries[country].free_return_amount;
    }
    let txt_common = __("FREE SHIPPING OVER");
    let txt_diff = {
        AE: __(
          "AED"
        ),
        SA: __(
          "SAR"
        ),
        KW: __(
          "KWD"
        ),
        QA: __(
          "QAR"
        ),
        OM: __(
          "OMR"
        ),
        BH: __(
          "BHD"
        ),
      };
  
    return (
      <>
        {
            isArabic ? (
                `${txt_common} ${free_return_amount} ${txt_diff[country_name]}`
            ) : (
                `${txt_common} ${txt_diff[country_name]} ${free_return_amount}`
            )
          }
      </>
    )
    }
  }

  renderCmsBlock() {
    // TODO: find out what is this, render here
    let country = getCountryFromUrl();
    const {
      config: { countries },
    } = this.props;
    const isFreeDelivery = countries[country]?.free_delivery

    return (
      <div className="customVerticalSlider" key="cms-block">
        <div className="carouselItemInner">
          <div block="HeaderTopBar" elem="CmsBlock">
            {__("1200+ GLOBAL BRANDS")}
          </div>
          <div block="HeaderTopBar" elem="CmsBlock">
           {__("%s DAY FREE RETURNS", countries[country]?.return_duration )}
          </div>
          {this.props?.isClubApparelEnabled && (
            <div block="HeaderTopBar" elem="CmsBlock">
              {__("CLUB APPAREL REWARDS")}
            </div>
          )}
          {isFreeDelivery ? (country ? (
            <div block="HeaderTopBar" elem="CmsBlock">
              {this.renderShippingInfo()}
            </div>
          ) : (
            null
          )) : (null)}
          {getCountryFromUrl() === "QA" ? (
            <div block="HeaderTopBar" elem="CmsBlock">
              {__("CASH ON RECEIVING")}
            </div>
          ) : (
            <div block="HeaderTopBar" elem="CmsBlock">
              {__("CASH ON DELIVERY")}
            </div>
          )}

          <div block="HeaderTopBar" elem="CmsBlock">
            {__("ALL PRICES ARE INCLUSIVE OF VAT")}
          </div>
        </div>
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
    const {
      location: { pathname },
    } = this.props;
    if (
      isMobile.any() &&
      !(
        pathname === "/" ||
        pathname === "" ||
        pathname === "/women.html" ||
        pathname === "/men.html" ||
        pathname === "/kids.html" ||
        pathname === "/home.html" ||
        pathname.includes("catalogsearch")
      )
    ) {
      return true;
    }
    return false;
  };

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

export default withRouter(connect(mapStateToProps)(HeaderTopBar));
