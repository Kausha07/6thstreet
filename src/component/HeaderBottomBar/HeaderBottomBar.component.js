import { Fragment } from 'react';

import CountrySwitcher from 'Component/CountrySwitcher/CountrySwitcher.container';
import facebook from 'Component/FooterMain/icons/facebook.png';
import instagram from 'Component/FooterMain/icons/instagram.png';
import HeaderAccount from 'Component/HeaderAccount';
import HeaderMenu from 'Component/HeaderMenu';
import HeaderSearch from 'Component/HeaderSearch';
import LanguageSwitcher from 'Component/LanguageSwitcher/LanguageSwitcher.container';
import Link from 'Component/Link';
import NavigationAbstract from 'Component/NavigationAbstract/NavigationAbstract.component';
import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';
import { isArabic } from 'Util/App';

import './HeaderBottomBar.style';

class HeaderBottomBar extends NavigationAbstract {
    state = {
        isArabic: isArabic()
    };

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

    linksMap = [{
        title: 'About',
        items: [
            {
                name: 'About 6TH STREET',
                href: 'https://www.appareluae.com/6th-street/'
            },
            {
                name: 'Consumer Rights',
                href: 'https://www.consumerrights.ae/en/Pages/default.aspx'
            },
            {
                name: 'Disclaimer',
                href: '/disclaimer'
            },
            {
                name: 'Careers',
                href: '/careers'
            }
        ]
    },
    {
        title: 'Download The App',
        items: [
            {
                id_app: 'App1',
                app_store: 'https://static.6media.me/static/version1600320971/frontend/6SNEW/6snew/en_US/images/apple-store-badge.svg',
                app_onclick: 'https://apps.apple.com/ro/app/6thstreet-com/id1370217070',
                id_google: 'Google1',
                google_play: 'https://static.6media.me/static/version1600320042/frontend/6SNEW/6snew/en_US/images/google-play-badge.svg',
                google_onclick: 'https://play.google.com/store/apps/details?id=com.apparel.app6thstreet',
                header: 'Follow The Latest Trends',
                id_facebook: 'Facebook1',
                facebook_href: 'https://www.facebook.com/shop6thstreet/',
                id_insta: 'Insta1',
                insta_href: 'https://www.instagram.com/shop6thstreet/'
            }
        ]
    }
    ];

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

    renderAppContent() {
        return (
            this.linksMap
                .filter((column) => column.title === 'Download The App')
                .map((column) => (
                    <div block="FooterMain" key={ column.title }>
                        <div block="FooterMain" elem="Nav">
                            { column.items.map((items) => (
                                <Fragment key="last_main_footer_column">
                                    <div block="FooterMain" elem="WrapperSecond">
                                        <div block="FooterMain" elem="SocialIcon">
                                            <Link
                                              to={ items.facebook_href }
                                              key={ items.id_facebook }
                                            >
                                                <img src={ facebook } alt="facebook icon" />
                                            </Link>
                                        </div>
                                        &nbsp;&nbsp;&nbsp;
                                        <div block="FooterMain" elem="SocialIcon">
                                            <Link
                                              to={ items.insta_href }
                                              key={ items.id_insta }
                                            >
                                                <img src={ instagram } alt="instagram icon" />
                                            </Link>
                                        </div>
                                    </div>
                                    <HeaderAccount />
                                    <h4>{ column.title }</h4>
                                    <div block="FooterMain" elem="WrapperFirst">
                                        <Link
                                          to={ items.app_onclick }
                                          key={ items.id_app }
                                        >
                                            <img src={ items.app_store } alt="app store download" />
                                        </Link>
                                        &nbsp;
                                        <Link
                                          to={ items.app_onclick }
                                          key={ items.id_google }
                                        >
                                            <img src={ items.google_play } alt="google play download" />
                                        </Link>
                                    </div>
                                </Fragment>
                            )) }
                        </div>
                    </div>
                ))
        );
    }

    renderAboutSection() {
        return (
            this.linksMap
                .filter((column) => column.title === 'About')
                .map((column) => (
                    <div block="FooterMain" elem="Column" key={ column.title }>
                        <div block="FooterMain" elem="Nav" key={ column.title }>
                            <ul key={ column.title }>
                                { column.items.map((items) => (
                                    <li key={ items.name }>
                                        <Link
                                          block="FooterMain"
                                          elem="Link"
                                          to={ items.href }
                                        >
                                            { items.name }
                                        </Link>
                                    </li>
                                )) }
                            </ul>
                        </div>
                    </div>
                ))
        );
    }

    renderStoreSwitcher() {
        return (
            <div block="FooterMiddle" elem="StoreSwitcher">
                <Fragment key="store-switcher">
                    <LanguageSwitcher />
                    <CountrySwitcher />
                </Fragment>
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
                    { this.renderAppContent() }
                    { this.renderAboutSection() }
                    { this.renderStoreSwitcher() }
                </div>
            </div>
        );
    }
}

export default HeaderBottomBar;
