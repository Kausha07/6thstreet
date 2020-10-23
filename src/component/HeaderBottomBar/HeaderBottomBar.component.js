import HeaderMenu from 'Component/HeaderMenu';
import HeaderSearch from 'Component/HeaderSearch';
import NavigationAbstract from 'Component/NavigationAbstract/NavigationAbstract.component';
import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';
import { isArabic } from 'Util/App';
import isMobile from 'Util/Mobile';

import './HeaderBottomBar.style';

class HeaderBottomBar extends NavigationAbstract {
    state = {
        isArabic: isArabic()
    };

    stateMap = {
        [DEFAULT_STATE_NAME]: {
            menu: true
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
        const { isArabic } = this.state;
        if (!isMobile.any() || !isMobile.tablet()) {
            console.log('isDesktop');
            return (
                <div
                  mix={ {
                      block: 'HeaderSearch',
                      elem: 'Container',
                      mods: { isArabic }
                  } }
                >
                    <HeaderSearch
                      key="search"
                      isMobile
                    />
                </div>
            );
        }

        return (null);
    }

    render() {
        const { isArabic } = this.state;

        return (
            <div
              mix={ { block: 'HeaderBottomBar', mods: { isArabic } } }
            >
                <div
                  mix={ { block: 'HeaderBottomBar', elem: 'Content', mods: { isArabic } } }
                >
                    { this.renderNavigationState() }
                </div>
            </div>
        );
    }
}

export default HeaderBottomBar;
