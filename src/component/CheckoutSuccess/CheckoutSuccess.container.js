/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { MyAccountDispatcher } from 'Component/CheckoutGuestForm/CheckoutGuestForm.container';
import {
    CUSTOMER_ACCOUNT, CUSTOMER_ACCOUNT_PAGE
} from 'Component/Header/Header.config';
import MyAccountContainer, { tabMap } from 'Route/MyAccount/MyAccount.container';
import ClubApparelDispatcher from 'Store/ClubApparel/ClubApparel.dispatcher';
import { updateMeta } from 'Store/Meta/Meta.action';
import { changeNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { showNotification } from 'Store/Notification/Notification.action';
import { toggleOverlayByKey } from 'Store/Overlay/Overlay.action';
import { customerType } from 'Type/Account';
import { HistoryType } from 'Type/Common';
import { TotalsType } from 'Type/MiniCart';

import CheckoutSuccess from './CheckoutSuccess.component';

export const BreadcrumbsDispatcher = import(
    'Store/Breadcrumbs/Breadcrumbs.dispatcher'
);

export const mapStateToProps = (state) => ({
    totals: state.CartReducer.cartTotals,
    headerState: state.NavigationReducer[TOP_NAVIGATION_TYPE].navigationState,
    guest_checkout: state.ConfigReducer.guest_checkout,
    customer: state.MyAccountReducer.customer,
    isSignedIn: state.MyAccountReducer.isSignedIn
});

export const mapDispatchToProps = (dispatch) => ({
    changeHeaderState: (state) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    updateBreadcrumbs: (breadcrumbs) => BreadcrumbsDispatcher.then(
        ({ default: dispatcher }) => dispatcher.update(breadcrumbs, dispatch)
    ),
    showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    updateMeta: (meta) => dispatch(updateMeta(meta)),
    getMember: (id) => ClubApparelDispatcher.getMember(dispatch, id),
    requestCustomerData: () => MyAccountDispatcher
        .then(({ default: dispatcher }) => dispatcher.requestCustomerData(dispatch))
});

export class CheckoutSuccessContainer extends PureComponent {
    static propTypes = {
        updateBreadcrumbs: PropTypes.func.isRequired,
        changeHeaderState: PropTypes.func.isRequired,
        showOverlay: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired,
        updateMeta: PropTypes.func.isRequired,
        guest_checkout: PropTypes.bool.isRequired,
        history: HistoryType.isRequired,
        totals: TotalsType.isRequired,
        tabMap: PropTypes.isRequired,
        customer: customerType,
        getMember: PropTypes.func.isRequired,
        isSignedIn: PropTypes.bool.isRequired,
        requestCustomerData: PropTypes.func.isRequired
    };

    static defaultProps = {
        customer: null
    };

    state = {
        isEditing: false,
        clubApparelMember: null
    };

    containerFunctions = {
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

        updateMeta({ title: __('Account') });

        this._updateBreadcrumbs();
    }

    containerProps = () => {
        const { clubApparelMember } = this.state;

        return {
            clubApparelMember
        };
    };

    _updateBreadcrumbs() {
        const { updateBreadcrumbs } = this.props;

        updateBreadcrumbs([
            { url: '', name: __('Account') },
            { name: __('Home'), url: '/' }
        ]);
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
            <CheckoutSuccess
              { ...this.props }
              { ...this.state }
              { ...this.containerFunctions }
              { ...this.containerProps() }
              tabMap={ tabMap }
            />
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CheckoutSuccessContainer);
