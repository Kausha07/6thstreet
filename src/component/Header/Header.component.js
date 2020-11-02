import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { withRouter } from 'react-router';

import HeaderBottomBar from 'Component/HeaderBottomBar';
import HeaderLogo from 'Component/HeaderLogo';
import HeaderMainSection from 'Component/HeaderMainSection';
import HeaderTopBar from 'Component/HeaderTopBar';
import MobileBottomBar from 'Component/MobileBottomBar';
import MobileMenuSidebar from 'Component/MobileMenuSideBar/MobileMenuSidebar.component';
import { MOBILE_MENU_SIDEBAR_ID } from 'Component/MobileMenuSideBar/MoblieMenuSideBar.config';
import OfflineNotice from 'Component/OfflineNotice';
import { isArabic } from 'Util/App';
import isMobile from 'Util/Mobile';

import './Header.style';

export class Header extends PureComponent {
    static propTypes = {
        navigationState: PropTypes.shape({
            name: PropTypes.string
        }).isRequired
    };

    state = {
        isArabic: isArabic(),
        isMobile: isMobile.any() || isMobile.tablet()
    };

    headerSections = [
        HeaderTopBar,
        HeaderMainSection,
        HeaderBottomBar,
        MobileBottomBar
    ];

    getIsCheckout = () => {
        if (location.pathname.match(/checkout/)) {
            if (location.pathname.match(/success/)) {
                return false;
            }

            return true;
        }

        return false;
    };

    renderSection = (Component, i) => {
        const { navigationState } = this.props;

        return (
            <Component
              key={ i }
              navigationState={ navigationState }
            />
        );
    };

    renderBackToShoppingButton() {
        const { isArabic } = this.state;

        return (
            <>
                <a href="/">
                    <div
                      block="CheckoutHeader"
                      elem="BackToShoppingMobile"
                      mods={ { isArabic } }
                    >
                        <button block="BackMobileButton">
                            { ' ' }
                        </button>
                    </div>
                </a>
                <a href="/">
                    <div
                      block="CheckoutHeader"
                      elem="BackToShoppingDesktop"
                      mods={ { isArabic } }
                    >
                        <button
                          block="button secondary medium"
                        >
                            { __('Back to shopping') }
                        </button>
                    </div>
                </a>
            </>
        );
    }

    renderSecureShippingLabel() {
        const { isArabic } = this.state;

        return (
            <div
              block="CheckoutHeader"
              elem="SecureShipping"
              mods={ { isArabic } }
            >
                <span
                  block="CheckoutHeader"
                  elem="SecureShippingLabel"
                >
                    { __('Secure checkout') }
                </span>
            </div>
        );
    }

    renderCheckoutHeder() {
        const { isMobile } = this.state;
        if (isMobile) {
            return this.renderBackToShoppingButton();
        }

        return (
            <div block="CheckoutHeader">
                { this.renderBackToShoppingButton() }
                <HeaderLogo
                  key="logo"
                />
                { this.renderSecureShippingLabel() }
            </div>
        );
    }

    render() {
        const { navigationState: { name } } = this.props;
        const isCheckout = this.getIsCheckout();
        return (
            <>
                <header block="Header" mods={ { name } }>
                    { isCheckout
                        ? this.renderCheckoutHeder()
                        : this.headerSections.map(this.renderSection) }
                    <MobileMenuSidebar activeOverlay={ MOBILE_MENU_SIDEBAR_ID } />
                </header>
                <OfflineNotice />
            </>
        );
    }
}

export default withRouter(Header);
