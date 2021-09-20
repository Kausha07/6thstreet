import { Fragment, PureComponent } from 'react';

import FooterCustomerSupport from 'Component/FooterCustomerSupport';
import Link from 'Component/Link';
import { isArabic } from 'Util/App';

import facebook from './icons/facebook.png';
import instagram from './icons/instagram.png';
import Image from "Component/Image";

import './FooterMain.style';

class FooterMain extends PureComponent {

    state = {
        isArabic: isArabic()
    };



    linksMap = [{
        title: __('About'),
        items: [
            {
                name: __('About 6THStreet'),
                href: 'https://www.appareluae.com/6th-street/'
            },
            {
                name: __('Consumer Rights'),
                href: 'https://www.consumerrights.ae/en/Pages/default.aspx'
            },
            {
                name: __('Disclaimer'),
                href: '/disclaimer'
            },
            {
                name: __('Privacy Policy'),
                href: '/privacy-policy'
            }
        ]
    },
    {
        title: __('Customer Service'),
        items: [
            {
                name: __('Shipping Information'),
                href: '/shipping-policy'
            },
            {
                name: __('Returns Information'),
                href: '/return-information'
            },
            {
                name: __('Order Tracking'),
                href: 'https://track.fetchr.us/'
            },
            {
                name: __("FAQ's"),
                href: '/faq'
            },
            {
                name: __('Feedback'),
                href: '/feedback'
            }
        ]
    },
    {
        title: __('Download The App'),
        items: [
            {
                id_app: 'App1',
                app_store: 'https://static.6media.me/static/version1600320971/frontend/6SNEW/6snew/en_US/images/apple-store-badge.svg',
                app_onclick: 'https://apps.apple.com/ro/app/6thstreet-com/id1370217070',
                id_google: 'Google1',
                google_play: 'https://static.6media.me/static/version1600320042/frontend/6SNEW/6snew/en_US/images/google-play-badge.svg',
                google_onclick: 'https://play.google.com/store/apps/details?id=com.apparel.app6thstreet',
                id_gallery: 'Gallery1',
                app_gallery: 'https://6thstreetmobileapp-eu-c.s3.eu-central-1.amazonaws.com/resources/20190121/en-ae/d/icon_huaweiappgallery.svg',
                gallery_onclick: 'https://appgallery.huawei.com/#/app/C102324663',
                header: __('Follow the latest trends'),
                id_facebook: 'Facebook1',
                facebook_href: 'https://www.facebook.com/shop6thstreet/',
                id_insta: 'Insta1',
                insta_href: 'https://www.instagram.com/shop6thstreet/'
            }
        ]
    }
    ];

    renderFirstTwoCloumns() {
        return (
            this.linksMap
                .filter((column) => column.title === __('About') || column.title === __('Customer Service'))
                .map((column) => (
                    <div block="FooterMain" elem="Column" key={ column.title }>
                    <h4>{ column.title }</h4>
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

    renderAppColumn() {
        return (
            this.linksMap
                .filter((column) => column.title === __('Download The App'))
                .map((column) => (
                    <div block="FooterMain" elem="LastColumn" key={ column.title }>
                        <h4>{ column.title }</h4>
                        <div block="FooterMain" elem="Nav">
                            { column.items.map((items) => (
                                <Fragment key="last_main_footer_column">
                                <div block="FooterMain" elem="WrapperFirst">
                                    <Link
                                      to={ items.app_onclick }
                                      key={ items.id_app }
                                    >
                                        <img src={ items.app_store } alt="app store download" />
                                    </Link>
                                    <br />
                                    <Link
                                      to={ items.google_onclick }
                                      key={ items.id_google }
                                    >
                                        <img src={ items.google_play } alt="google play download" />
                                    </Link>
                                    <br />
                                    <Link
                                      to={ items.gallery_onclick }
                                      key={ items.id_gallery }
                                    >
                                        <img src={ items.app_gallery } alt="app gallery download" />
                                    </Link>
                                </div>
                                <h4>{ items.header }</h4>
                                <div block="FooterMain" elem="WrapperSecond">
                                    <div block="FooterMain" elem="SocialIcon">
                                        <Link
                                          to={ items.facebook_href }
                                          key={ items.id_facebook }
                                        >
                                            <img src={ facebook } alt="facebook icon" />
                                        </Link>
                                    </div>
                                    <span />
                                    <div block="FooterMain" elem="SocialIcon">
                                        <Link
                                          to={ items.insta_href }
                                          key={ items.id_insta }
                                        >
                                            <img src={ instagram } alt="instagram icon" />
                                        </Link>
                                    </div>
                                </div>
                                </Fragment>
                            )) }
                        </div>
                    </div>
                ))
        );
    }

    render() {
        const { isArabic } = this.state;
        return (
            <div block="FooterMain">
                <div block="FooterMain" elem="Layout" mods={{isArabic}}>
                    { this.renderFirstTwoCloumns() }
                        <FooterCustomerSupport />
                    { this.renderAppColumn() }
                </div>
            </div>
        );
    }
}

export default FooterMain;
