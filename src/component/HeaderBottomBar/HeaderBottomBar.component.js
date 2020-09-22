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
        return (
            <HeaderMenu
              key="menu"
            />
        );
    }

    renderSearch() {
        return (
            <div
              block="HeaderSearch"
              elem="Container"
            >
                <HeaderSearch
                  key="search"
                />
            </div>
        );
    }

    render() {
        return (
            <div block="HeaderBottomBar">
                <div
                  block="HeaderBottomBar"
                  elem="Content"
                >
                    { this.renderNavigationState() }
                </div>
            </div>
        );
    }
}

export default HeaderBottomBar;
