import PropTypes from 'prop-types';
import { lazy } from 'react';
import { Route } from 'react-router-dom';

import LocaleWizard from 'Route/LocaleWizard';
import UrlRewrites from 'Route/UrlRewrites';
import {
    CartPage,
    Checkout,
    CmsPage,
    ConfirmAccountPage,
    HomePage,
    MenuPage,
    MyAccount,
    PasswordChangePage,
    Router as SourceRouter,
    SearchPage,
    WishlistShared,
    withStoreRegex
} from 'SourceComponent/Router/Router.component';
import { AFTER_ITEMS_TYPE, BEFORE_ITEMS_TYPE, SWITCH_ITEMS_TYPE } from 'SourceComponent/Router/Router.config';
import { getCountryFromUrl, getLanguageFromUrl } from 'Util/Url';

import './Router.style';

export const BrandsPage = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "brands" */ 'Route/Brands'));

export {
    CartPage,
    Checkout,
    CmsPage,
    HomePage,
    MyAccount,
    PasswordChangePage,
    SearchPage,
    ConfirmAccountPage,
    MenuPage,
    WishlistShared,
    withStoreRegex
};

export class Router extends SourceRouter {
    static propTypes = {
        ...SourceRouter.propTypes,
        isAppReady: PropTypes.bool.isRequired,
        setLanguage: PropTypes.func.isRequired,
        setCountry: PropTypes.func.isRequired
    };

    state = {
        ...SourceRouter.state,
        isArabic: false,
        homepageUrl: '/(|men.html|women.html|kids.html)/'
    };

    [SWITCH_ITEMS_TYPE] = [
        {
            component: <Route path={ withStoreRegex(this.state.homepageUrl) } exact component={ HomePage } />,
            position: 10
        },
        {
            component: <Route path={ withStoreRegex('/page') } component={ CmsPage } />,
            position: 40
        },
        {
            component: <Route path={ withStoreRegex('/cart') } exact component={ CartPage } />,
            position: 50
        },
        {
            component: <Route path={ withStoreRegex('/checkout/:step?') } component={ Checkout } />,
            position: 55
        },
        {
            component: <Route path={ withStoreRegex('/:account*/createPassword/') } component={ PasswordChangePage } />,
            position: 60
        },
        {
            component: <Route path={ withStoreRegex('/:account*/confirm') } component={ ConfirmAccountPage } />,
            position: 65
        },
        {
            component: <Route path={ withStoreRegex('/my-account/:tab?') } component={ MyAccount } />,
            position: 70
        },
        {
            component: <Route path={ withStoreRegex('/forgot-password') } component={ MyAccount } />,
            position: 71
        },
        {
            component: <Route path={ withStoreRegex('/brands') } component={ BrandsPage } />,
            position: 90
        },
        {
            component: <Route path={ withStoreRegex('/catalogsearch/result') } component={ SearchPage } />,
            position: 90
        },
        {
            component: <Route component={ UrlRewrites } />,
            position: 1000
        }
    ];

    static getDerivedStateFromProps() {
        const appStateCacheKey = JSON.parse(localStorage.getItem('APP_STATE_CACHE_KEY'));

        return {
            isArabic: appStateCacheKey && appStateCacheKey.data.language === 'ar'
        };
    }

    componentDidMount() {
        const { setCountry, setLanguage } = this.props;
        const country = getCountryFromUrl();
        const language = getLanguageFromUrl();

        if (country) {
            setCountry(country);
        }

        if (language) {
            setLanguage(language);
        }
    }

    renderLocaleWizard() {
        return (
            <LocaleWizard />
        );
    }

    renderContent() {
        const { isArabic } = this.state;

        return (
            <div block="PageWrapper" mods={ { isArabic } }>
                { this.renderItemsOfType(BEFORE_ITEMS_TYPE) }
                { this.renderMainItems() }
                { this.renderItemsOfType(AFTER_ITEMS_TYPE) }
            </div>
        );
    }

    renderDefaultRouterContent() {
        const { isAppReady } = this.props;

        if (isAppReady) {
            return this.renderContent();
        }

        return this.renderLocaleWizard();
    }
}

export default Router;
