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

    renderLocaleWizard() {
        return (
            <LocaleWizard />
        );
    }

    renderDefaultRouterContent() {
        const { isAppReady } = this.props;

        if (isAppReady) {
            return super.renderDefaultRouterContent();
        }

        return this.renderLocaleWizard();
    }
}

export default Router;
