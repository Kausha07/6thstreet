import PropTypes from 'prop-types';
import { PureComponent } from 'react';

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
        newMenuGender: ''
    };

    headerSections = [
        HeaderTopBar,
        HeaderMainSection,
        HeaderBottomBar,
        MobileBottomBar
    ];

    renderSection = (Component, i) => {
        const { navigationState } = this.props;
        const { newMenuGender } = this.state;

        return (
            <Component
              key={ i }
              navigationState={ navigationState }
              changeMenuGender={ this.changeMenuGender }
              newMenuGender={ newMenuGender }
            />
        );
    };

    renderBackToShoppingButton() {
        const { isArabic } = this.state;

        if (isMobile.any() || isMobile.tablet()) {
            return (
                <a href="/">
                <div
                  block="CheckoutHeader"
                  elem="BackToShopping"
                  mods={ { isArabic } }
                >
                    <button block="BackMobileButton">
                        { ' ' }
                    </button>
                </div>
                </a>
            );
        }

        return (
            <a href="/">
                <div
                  block="CheckoutHeader"
                  elem="BackToShopping"
                  mods={ { isArabic } }
                >
                    <button
                      block="button secondary medium"
                    >
                        { __('Back to shopping') }
                    </button>
                </div>
            </a>
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
        if (isMobile.any() || isMobile.tablet()) {
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

    changeMenuGender = (gender) => {
        this.setState({ newMenuGender: gender });
    };

    render() {
        const { navigationState: { name } } = this.props;

        return (
            <>
                <header block="Header" mods={ { name } }>
                    { location.pathname.match(/checkout/)
                        ? this.renderCheckoutHeder()
                        : this.headerSections.map(this.renderSection) }
                    <MobileMenuSidebar activeOverlay={ MOBILE_MENU_SIDEBAR_ID } />
                </header>
                <OfflineNotice />
            </>
        );
    }
}

export default Header;
