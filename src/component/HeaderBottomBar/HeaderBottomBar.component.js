import HeaderMenu from 'Component/HeaderMenu';
import HeaderSearch from 'Component/HeaderSearch';
import NavigationAbstract from 'Component/NavigationAbstract/NavigationAbstract.component';
import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';

import './HeaderBottomBar.style';

class HeaderBottomBar extends NavigationAbstract {
    stateMap = {
        [DEFAULT_STATE_NAME]: {
            menu: true,
            search: true
        }
    };

    renderMap = {
        menu: this.renderMenu.bind(this),
        search: this.renderSearch.bind(this)
    };

    renderMenu() {
        return <HeaderMenu />;
    }

    renderSearch() {
        return <HeaderSearch />;
    }

    render() {
        return (
            <div block="HeaderBottomBar">
                { this.renderNavigationState() }
            </div>
        );
    }
}

export default HeaderBottomBar;
