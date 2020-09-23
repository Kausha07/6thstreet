import PropTypes from 'prop-types';

import LocaleWizard from 'Route/LocaleWizard';
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
import { AFTER_ITEMS_TYPE, BEFORE_ITEMS_TYPE } from 'SourceComponent/Router/Router.config';

import './Router.style';

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
        isAppReady: PropTypes.bool.isRequired
    };

    state = {
        ...SourceRouter.state,
        isArabic: false
    };

    static getDerivedStateFromProps() {
        return {
            isArabic: JSON.parse(localStorage.getItem('APP_STATE_CACHE_KEY')).data.language === 'ar'
        };
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
