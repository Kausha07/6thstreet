/* eslint-disable react/forbid-dom-props */
/* eslint-disable react/no-string-refs */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { PureComponent } from 'react';

import FooterCustomerSupport from 'Component/FooterCustomerSupport';
import Link from 'Component/Link';

import './FooterMain.style';

class FooterMain extends PureComponent {
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
            },
            {
                name: 'Press',
                href: '/press'
            }
        ]
    },
    {
        title: 'Customer Service',
        items: [
            {
                name: 'Shipping Information',
                href: 'https://www.appareluae.com/6th-street/'
            },
            {
                name: 'Returns Information',
                href: 'www.consumerrights.ae/en/Pages/default.aspx'
            },
            {
                name: 'Order Tracking',
                href: 'https://track.fetchr.us/'
            },
            {
                name: "FAQ's",
                href: '/faq'
            },
            {
                name: 'Feedback',
                href: '/contact'
            }
        ]
    },
    {
        title: 'Download The App',
        items: [
            {
                app_store: 'https://static.6media.me/static/version1600320971/frontend/6SNEW/6snew/en_US/images/apple-store-badge.svg',
                app_onclick: 'https://apps.apple.com/ro/app/6thstreet-com/id1370217070',
                google_play: 'https://static.6media.me/static/version1600320042/frontend/6SNEW/6snew/en_US/images/google-play-badge.svg',
                google_onclick: 'https://play.google.com/store/apps/details?id=com.apparel.app6thstreet',
                header: 'Follow The Latest Trends',
                facebook_href: 'https://www.facebook.com/shop6thstreet/',
                insta_href: 'https://www.instagram.com/shop6thstreet/'
            }
        ]
    }
    ];

    renderFirstTwoCloumns() {
        return (
            this.linksMap
                .filter((column) => column.title === 'About' || column.title === 'Customer Service')
                .map((column) => (
                    <div block="FooterMain" elem="Column">
                    <h4>{ column.title }</h4>
                    <div block="FooterMain" elem="Nav">
                    <ul>
                    { column.items.map((items) => (
                    <li>
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

    renderAppColumn() {
        return (
            this.linksMap
                .filter((column) => column.title === 'Download The App')
                .map((column) => (
                    <div block="FooterMain" elem="Column">
                    <h4>{ column.title }</h4>
                    <div block="FooterMain" elem="Nav">
                    { column.items.map((items) => (
                        <>
                        <div block="FooterMain" elem="WrapperFirst">
                            <Link
                              to={ items.app_onclick }
                            >
                                <img src={ items.app_store } alt="app store download" />
                            </Link>
                            &nbsp;&nbsp;
                            <Link
                              to={ items.app_onclick }
                            >
                                <img src={ items.google_play } alt="google play download" />
                            </Link>
                        </div>
                            <h4>{ items.header }</h4>
                            <div block="FooterMain" elem="WrapperSecond">
                                <div block="FooterMain" elem="SocialIcon">
                                    <Link
                                      to={ items.facebook_href }
                                    >
                                    <i />
                                    </Link>
                                </div>
                                <div block="FooterMain" elem="SocialIcon">
                                    &nbsp;
                                    <Link
                                      to={ items.insta_href }
                                    >
                                    <i />
                                    </Link>
                                </div>
                            </div>
                        </>
                    )) }
                    </div>
                    </div>
                ))
        );
    }

    render() {
        return (
            <div block="FooterMain">
                <div block="FooterMain" elem="Layout">
                { this.renderFirstTwoCloumns() }
                    <FooterCustomerSupport />
                { this.renderAppColumn() }
                </div>
            </div>
        );
    }
}

export default FooterMain;
