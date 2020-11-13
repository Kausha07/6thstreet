import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { withRouter } from 'react-router';

import HeaderBottomBar from 'Component/HeaderBottomBar';
import HeaderMainSection from 'Component/HeaderMainSection';
import HeaderTopBar from 'Component/HeaderTopBar';
import MobileBottomBar from 'Component/MobileBottomBar';
import MobileMenuSidebar from 'Component/MobileMenuSideBar/MobileMenuSidebar.component';
import { MOBILE_MENU_SIDEBAR_ID } from 'Component/MobileMenuSideBar/MoblieMenuSideBar.config';
import OfflineNotice from 'Component/OfflineNotice';

import './Header.style';

export class Header extends PureComponent {
    static propTypes = {
        navigationState: PropTypes.shape({
            name: PropTypes.string
        }).isRequired
    };

    state = {
        newMenuGender: ''
    };

    headerSections = [
        HeaderTopBar,
        HeaderMainSection,
        HeaderBottomBar,
        MobileBottomBar
    ];

    getIsCheckout = () => {
        if (location.pathname.match(/checkout/)) {
            return !location.pathname.match(/success/);
        }

        return false;
    };

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

    changeMenuGender = (gender) => {
        this.setState({ newMenuGender: gender });
    };

    render() {
        const { navigationState: { name } } = this.props;
        const isCheckout = this.getIsCheckout();
        return (
            <>
                <header block="Header" mods={ { name } }>
                    { isCheckout
                        ? null
                        : this.headerSections.map(this.renderSection) }
                    <MobileMenuSidebar activeOverlay={ MOBILE_MENU_SIDEBAR_ID } />
                </header>
                <OfflineNotice />
            </>
        );
    }
}

export default withRouter(Header);
