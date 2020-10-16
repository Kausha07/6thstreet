import PropTypes from 'prop-types';
import { PureComponent } from 'react';

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

    headerSections = [
        HeaderTopBar,
        HeaderMainSection,
        HeaderBottomBar,
        MobileBottomBar
    ];

    renderSection = (Component, i) => {
        const { navigationState } = this.props;

        return (
            <Component
              key={ i }
              navigationState={ navigationState }
            />
        );
    };

    render() {
        const { navigationState: { name } } = this.props;
        return (
            <>
                <header block="Header" mods={ { name } }>
                    { this.headerSections.map(this.renderSection) }
                    <MobileMenuSidebar activeOverlay={ MOBILE_MENU_SIDEBAR_ID } />
                </header>
                <OfflineNotice />
            </>
        );
    }
}

export default Header;
