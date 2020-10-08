/* eslint-disable react/prop-types */
/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import {
    CART, CART_EDITING, CUSTOMER_ACCOUNT, CUSTOMER_ACCOUNT_PAGE
} from 'Component/Header/Header.config';
import { CUSTOMER_ACCOUNT_OVERLAY_KEY } from 'Component/MyAccountOverlay/MyAccountOverlay.config';
import { CHECKOUT_URL } from 'Route/Checkout/Checkout.config';
import { MY_ACCOUNT_URL } from 'Route/MyAccount/MyAccount.config';
import MyAccountContainer from 'Route/MyAccount/MyAccount.container';
import { updateMeta } from 'Store/Meta/Meta.action';
import { changeNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { showNotification } from 'Store/Notification/Notification.action';
import { toggleOverlayByKey } from 'Store/Overlay/Overlay.action';
import {
    ADDRESS_BOOK,
    CLUB_APPAREL,
    DASHBOARD,
    MY_ORDERS,
    MY_WISHLIST,
    RETURN_ITEM
} from 'Type/Account';
import { HistoryType } from 'Type/Common';
import { TotalsType } from 'Type/MiniCart';
import { isSignedIn } from 'Util/Auth';
import history from 'Util/History';
import isMobile from 'Util/Mobile';
import { appendWithStoreCode } from 'Util/Url';

import CartPage from './CartPage.component';

export const BreadcrumbsDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Breadcrumbs/Breadcrumbs.dispatcher'
);

export const mapStateToProps = (state) => ({
    totals: state.CartReducer.cartTotals,
    headerState: state.NavigationReducer[TOP_NAVIGATION_TYPE].navigationState,
    guest_checkout: state.ConfigReducer.guest_checkout,
    isSignedIn: state.MyAccountReducer.isSignedIn
});

export const mapDispatchToProps = (dispatch) => ({
    changeHeaderState: (state) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    updateBreadcrumbs: (breadcrumbs) => BreadcrumbsDispatcher.then(
        ({ default: dispatcher }) => dispatcher.update(breadcrumbs, dispatch)
    ),
    showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    updateMeta: (meta) => dispatch(updateMeta(meta))
});

export class CartPageContainer extends PureComponent {
    static propTypes = {
        updateBreadcrumbs: PropTypes.func.isRequired,
        changeHeaderState: PropTypes.func.isRequired,
        showOverlay: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired,
        updateMeta: PropTypes.func.isRequired,
        guest_checkout: PropTypes.bool.isRequired,
        history: HistoryType.isRequired,
        totals: TotalsType.isRequired,
        tabMap: PropTypes.isRequired
    };

    state = { isEditing: false };

    tabMap = {
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

    containerFunctions = {
        onCheckoutButtonClick: this.onCheckoutButtonClick.bind(this),
        changeActiveTab: this.changeActiveTab.bind(this),
        onSignIn: this.onSignIn.bind(this)
    };

    constructor(props) {
        super(props);

        const {
            isSignedIn,
            updateMeta
        } = this.props;

        this.state = MyAccountContainer.navigateToSelectedTab(this.props) || {};

        if (!isSignedIn) {
            toggleOverlayByKey(CUSTOMER_ACCOUNT);
        }

        updateMeta({ title: __('My account') });

        this.onSignIn();
    }

    static getDerivedStateFromProps(props, state) {
        return MyAccountContainer.navigateToSelectedTab(props, state);
    }

    componentDidMount() {
        const { updateMeta } = this.props;

        updateMeta({ title: __('Cart') });

        this._updateBreadcrumbs();
        this._changeHeaderState();
    }

    componentDidUpdate(prevProps) {
        const {
            changeHeaderState,
            totals: { items_qty },
            headerState,
            headerState: { name }
        } = this.props;

        const {
            totals: { items_qty: prevItemsQty },
            headerState: { name: prevName }
        } = prevProps;

        if (name !== prevName) {
            if (name === CART) {
                this._changeHeaderState();
            }
        }

        if (items_qty !== prevItemsQty) {
            const title = `${ items_qty || '0' } Items`;
            changeHeaderState({
                ...headerState,
                title
            });
        }
    }

    changeActiveTab(activeTab) {
        const { history } = this.props;
        const { [activeTab]: { url } } = this.tabMap;
        history.push(`${ MY_ACCOUNT_URL }${ url }`);
    }

    onCheckoutButtonClick(e) {
        const {
            history,
            guest_checkout,
            showOverlay,
            showNotification
        } = this.props;

        // to prevent outside-click handler trigger
        e.nativeEvent.stopImmediatePropagation();

        if (guest_checkout) {
            history.push({
                pathname: appendWithStoreCode(CHECKOUT_URL)
            });

            return;
        }

        if (isSignedIn()) {
            history.push({
                pathname: appendWithStoreCode(CHECKOUT_URL)
            });

            return;
        }

        // fir notification whatever device that is
        showNotification('info', __('Please sign-in to complete checkout!'));

        if (isMobile.any()) { // for all mobile devices, simply switch route
            history.push({ pathname: appendWithStoreCode('/my-account') });
            return;
        }

        // for desktop, just open customer overlay
        showOverlay(CUSTOMER_ACCOUNT_OVERLAY_KEY);
    }

    _updateBreadcrumbs() {
        const { updateBreadcrumbs } = this.props;
        const { activeTab } = this.state;
        const { url, name } = this.tabMap[activeTab];

        updateBreadcrumbs([
            { url: `${ MY_ACCOUNT_URL }${ url }`, name },
            { name: __('My Account'), url: `${ MY_ACCOUNT_URL }/${ DASHBOARD }` }
        ]);
    }

    _changeHeaderState() {
        const { changeHeaderState, totals: { items_qty } } = this.props;
        const title = __('%s Items', items_qty || 0);

        changeHeaderState({
            name: CART,
            title,
            onEditClick: () => {
                this.setState({ isEditing: true });
                changeHeaderState({
                    name: CART_EDITING,
                    title,
                    onOkClick: () => this.setState({ isEditing: false }),
                    onCancelClick: () => this.setState({ isEditing: false })
                });
            },
            onCloseClick: () => {
                this.setState({ isEditing: false });
                history.goBack();
            }
        });
    }

    onSignIn() {
        const {
            changeHeaderState,
            history
        } = this.props;

        changeHeaderState({
            title: 'My account',
            name: CUSTOMER_ACCOUNT_PAGE,
            onBackClick: () => history.push('/')
        });
    }

    render() {
        return (
            <CartPage
              { ...this.props }
              { ...this.state }
              { ...this.containerFunctions }
              tabMap={ this.tabMap }
            />
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CartPageContainer);
