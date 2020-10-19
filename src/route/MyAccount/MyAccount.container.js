import { connect } from 'react-redux';

import StoreCredit from 'Component/StoreCredit';
import {
    BreadcrumbsDispatcher,
    mapDispatchToProps,
    mapStateToProps,
    MyAccountContainer as SourceMyAccountContainer,
    MyAccountDispatcher
} from 'SourceRoute/MyAccount/MyAccount.container';
import {
    ADDRESS_BOOK,
    CLUB_APPAREL,
    DASHBOARD,
    MY_ORDERS,
    MY_WISHLIST,
    RETURN_ITEM,
    STORE_CREDIT
} from 'Type/Account';

import { MY_ACCOUNT_URL } from './MyAccount.config';

export {
    BreadcrumbsDispatcher,
    MyAccountDispatcher,
    mapStateToProps,
    mapDispatchToProps
};

export const tabMap = {
    [STORE_CREDIT]: {
        url: '/storecredit/info',
        name: (<StoreCredit />),
        alternativePageName: __('Balance'),
        linkClassName: 'StoreCreditLink'
    },
    [CLUB_APPAREL]: {
        url: '/club-apparel',
        name: __('Club Apparel Loyalty')
    },
    [DASHBOARD]: {
        url: '/dashboard',
        name: __('My Account')
    },
    [MY_ORDERS]: {
        url: '/my-orders',
        name: __('Order history')
    },
    [RETURN_ITEM]: {
        url: '/return-item',
        name: __('Return an item')
    },
    [MY_WISHLIST]: {
        url: '/my-wishlist',
        name: __('My wishlist')
    },
    [ADDRESS_BOOK]: {
        url: '/address-book',
        name: __('Delivery addresses')
    }
};

export class MyAccountContainer extends SourceMyAccountContainer {
    tabMap = tabMap;

    updateBreadcrumbs() {
        const { updateBreadcrumbs } = this.props;
        const { activeTab } = this.state;
        const { url, name, alternativePageName } = tabMap[activeTab];

        updateBreadcrumbs([
            { url: `${ MY_ACCOUNT_URL }${ url }`, name: alternativePageName || name },
            { name: __('My Account'), url: `${ MY_ACCOUNT_URL }/${ DASHBOARD }` }
        ]);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountContainer);
