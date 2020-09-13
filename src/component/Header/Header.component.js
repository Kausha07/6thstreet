import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import HeaderBottomBar from 'Component/HeaderBottomBar';
import HeaderMainSection from 'Component/HeaderMainSection';
import HeaderTopBar from 'Component/HeaderTopBar';
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
        HeaderBottomBar
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
                </header>
                <OfflineNotice />
            </>
        );
    }
}

export default Header;
