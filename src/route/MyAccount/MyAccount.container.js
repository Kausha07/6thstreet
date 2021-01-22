import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import StoreCredit from 'Component/StoreCredit';
import {
    BreadcrumbsDispatcher,
    mapDispatchToProps as sourceMapDispatchToProps,
    mapStateToProps as sourceMapStateToProps,
    MyAccountContainer as SourceMyAccountContainer,
    MyAccountDispatcher
} from 'SourceRoute/MyAccount/MyAccount.container';
import { updateMeta } from 'Store/Meta/Meta.action';
import { setIsMobileTabActive } from 'Store/MyAccount/MyAccount.action';
import StoreCreditDispatcher from 'Store/StoreCredit/StoreCredit.dispatcher';
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
    MyAccountDispatcher
};

export const mapStateToProps = (state) => ({
    ...sourceMapStateToProps(state),
    mobileTabActive: state.MyAccountReducer.mobileTabActive
});

export const mapDispatchToProps = (dispatch) => ({
    ...sourceMapDispatchToProps(dispatch),
    setMobileTabActive: (value) => dispatch(setIsMobileTabActive(value)),
    setMeta: (meta) => dispatch(updateMeta(meta)),
    updateStoreCredit: () => StoreCreditDispatcher.getStoreCredit(dispatch)
});

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
        name: __('Return an item'),
        alternateName: __('Cancel an item')
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
    static propTypes = {
        ...SourceMyAccountContainer.propTypes,
        mobileTabActive: PropTypes.bool.isRequired,
        setMobileTabActive: PropTypes.func.isRequired,
        setMeta: PropTypes.func.isRequired,
        updateStoreCredit: PropTypes.func.isRequired
    };

    tabMap = tabMap;

    componentDidMount() {
        const { setMeta, updateStoreCredit } = this.props;

        updateStoreCredit();
        setMeta({ title: __('My Account') });
    }

    updateBreadcrumbs() {
        const { updateBreadcrumbs } = this.props;
        const { activeTab } = this.state;
        const { url, name, alternativePageName } = tabMap[activeTab];

        updateBreadcrumbs([
            { url: `${ MY_ACCOUNT_URL }${ url }`, name: alternativePageName || name },
            { name: __('My Account'), url: `${ MY_ACCOUNT_URL }/${ DASHBOARD }` },
            { name: __('Home'), url: '/' }
        ]);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountContainer);
