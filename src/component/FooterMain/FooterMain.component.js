/* eslint-disable react/forbid-dom-props */
/* eslint-disable react/no-string-refs */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { PureComponent } from 'react';

import FooterCustomerSupport from 'Component/FooterCustomerSupport';

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
                href: 'www.consumerrights.ae/en/Pages/default.aspx'
            },
            {
                name: 'Disclaimer',
                href: ''
            },
            {
                name: 'Careers',
                href: ''
            },
            {
                name: 'Press',
                href: ''
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
                href: ''
            },
            {
                name: "FAQ's",
                href: ''
            },
            {
                name: 'Feedback',
                href: ''
            }
        ]
    },
    {
        title: 'Customer Support',
        items: [
            {
                text: 'We are available all days from:',
                time: '9am - 9pm',
                phone_icon: '',
                number: '',
                email_icon: 'customercare@6thstreet.com',
                email: 'customercare@6thstreet.com',
                email_href: 'mailto:customercare@6thstreet.com'
            }
        ]
    },
    {
        title: 'Download The App',
        items: [
            {
                app_store: 'https://static.6media.me/static/version1600320971/frontend/6SNEW/6snew/en_US/images/apple-store-badge.svg',
                app_onclick: '',
                google_play: 'https://static.6media.me/static/version1600320042/frontend/6SNEW/6snew/en_US/images/google-play-badge.svg',
                google_onclick: '',
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
                    { column.items.map((items) => <li><a href={ items.href }>{ items.name }</a></li>) }
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
                            <img src={ items.app_store } alt="app store download" />
                            &nbsp;&nbsp;
                            <img src={ items.google_play } alt="google play download" />
                        </div>
                            <h4>{ items.header }</h4>
                            <div block="FooterMain" elem="WrapperSecond">
                                <a
                                  block="FooterMain"
                                  elem="SocialIcon"
                                  href="fdhgf"
                                >
                                    <i className="fa fa-facebook-f" />
                                </a>
                                &nbsp;
                                <a block="FooterMain" elem="SocialIcon" href="ghjh"><i /></a>
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
