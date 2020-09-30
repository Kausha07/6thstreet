import FooterMain from 'Component/FooterMain';
import FooterMiddle from 'Component/FooterMiddle';
import HeaderMenu from 'Component/HeaderMenu';
import HeaderSearch from 'Component/HeaderSearch';
import NavigationAbstract from 'Component/NavigationAbstract/NavigationAbstract.component';
import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';

import './HeaderBottomBar.style';

class HeaderBottomBar extends NavigationAbstract {
    constructor() {
        super();
        this.state = {
            isArabic: false
        };
    }

    static getDerivedStateFromProps() {
        return ({
            isArabic: JSON.parse(localStorage.getItem('APP_STATE_CACHE_KEY')).data.language === 'ar'
        });
    }

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
        const { isArabic } = this.state;

        return (
            <div
              mix={ { block: 'HeaderSearch', elem: 'Container', mods: { isArabic } } }
            >
                <HeaderSearch
                  key="search"
                />
            </div>
        );
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
                    <FooterMain />
                    <FooterMiddle />
                </div>
            </div>
        );
    }
}

export default HeaderBottomBar;
