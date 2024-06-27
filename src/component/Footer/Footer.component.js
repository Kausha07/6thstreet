import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { connect } from "react-redux";
import CmsBlock from 'Component/CmsBlock';
import FooterBottom from 'Component/FooterBottom';
import FooterMain from 'Component/FooterMain';
import FooterMiddle from 'Component/FooterMiddle';
import FooterMobile from 'Component/FooterMobile';
import isMobile from 'Util/Mobile';
import { getCountryFromUrl } from "Util/Url";

import './Footer.style';

export const mapStateToProps = (state) => {
    return {
      checkoutDetails: state.CartReducer.checkoutDetails,
      isClubApparelEnabled: state.AppConfig.isClubApparelEnabled,
      config: state.AppConfig.config,
    };
  };

export class Footer extends PureComponent {
    static propTypes = {
        isVisibleOnMobile: PropTypes.bool,
        isClubApparelEnabled: PropTypes.bool,
    };

    static defaultProps = {
        isVisibleOnMobile: false
    };

    state = {
        isCheckout: false,
        isFooterAccountOpen: false,
        isMobile: isMobile.any() || isMobile.tablet(),
        hidefooter:false
    };

    static getDerivedStateFromProps() {
        let isCheckoutState
        let hideFooterState
        if(location.pathname.match(/checkout/)) {
            isCheckoutState= true
        } else {
            isCheckoutState= false
        };

        if(location.pathname.match(/cart/)) {
            hideFooterState= true
        } else {
            hideFooterState= false
        };

        return {
            isCheckout: isCheckoutState,
            hidefooter:hideFooterState
        }
    }

    handleFooterIsAccountOpen = () => {
        const { isFooterAccountOpen } = this.state;
        this.setState({ isFooterAccountOpen: !isFooterAccountOpen });
    };

    renderSections() {
        const { footer_content: { footer_cms } = {} } = window.contentConfiguration;

        const { isCheckout , isMobile, hidefooter} = this.state;

        const {
          checkoutDetails,
          isClubApparelEnabled,
          config: { countries = {} },
        } = this.props;
        const countryCode = getCountryFromUrl();
        const isTamaraEnable = countries[countryCode]?.isTamaraEnable || false;
        const tabbyRange = countries[countryCode]?.tabby_range || {};
        const isTabbyEnable = tabbyRange.min || tabbyRange.max ? true : false;

        if (footer_cms) {
            return <CmsBlock identifier={ footer_cms } />;
        }

        if (isCheckout  && !checkoutDetails) {
                return <FooterMiddle />;
        }

        if((checkoutDetails && isMobile)
        ||  (hidefooter && isMobile)
        ){
            return null
        }

        if(location.pathname === "/event-calendar") {
            return null
        }

        return (
            <>
                <FooterMain />
                <FooterMiddle
                  handleFooterIsAccountOpen={ this.handleFooterIsAccountOpen }
                />
                <FooterBottom 
                    isClubApparelEnabled={isClubApparelEnabled} 
                    isTamaraEnable={isTamaraEnable}
                    isTabbyEnable={isTabbyEnable}
                />
                <FooterMobile isClubApparelEnabled={isClubApparelEnabled}/>
            </>
        );
    }

    render() {
        const { isVisibleOnMobile } = this.props;
        const { isFooterAccountOpen } = this.state;

        if (!isVisibleOnMobile && (isMobile.any() || isMobile.tablet())) {
            return null;
        }

        if (isVisibleOnMobile && (!isMobile.any() && !isMobile.tablet())) {
            return null;
        }

        return (
            <footer block="Footer" mods={ { isFooterAccountOpen } } aria-label="Footer">
                { this.renderSections() }
            </footer>
        );
    }
}

export default connect(mapStateToProps)(withRouter(Footer));
