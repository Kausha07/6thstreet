/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import {
    CUSTOMER_ACCOUNT_PAGE
} from 'Component/Header/Header.config';
import { PHONE_CODES } from 'Component/MyAccountAddressForm/MyAccountAddressForm.config';
import { MY_ACCOUNT_URL } from 'Route/MyAccount/MyAccount.config';
import MyAccountContainer, { tabMap } from 'Route/MyAccount/MyAccount.container';
import CheckoutDispatcher from 'Store/Checkout/Checkout.dispatcher';
import ClubApparelDispatcher from 'Store/ClubApparel/ClubApparel.dispatcher';
import { updateMeta } from 'Store/Meta/Meta.action';
import MyAccountDispatcher from 'Store/MyAccount/MyAccount.dispatcher';
import { changeNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { showNotification } from 'Store/Notification/Notification.action';
import { toggleOverlayByKey } from 'Store/Overlay/Overlay.action';
import { customerType } from 'Type/Account';
import { TotalsType } from 'Type/MiniCart';
import history from 'Util/History';
import isMobile from 'Util/Mobile';

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
    sendVerificationCode: (phone) => CheckoutDispatcher.sendVerificationCode(dispatch, phone),
    verifyUserPhone: (code) => CheckoutDispatcher.verifyUserPhone(dispatch, code),
    updateCustomer: (customer) => MyAccountDispatcher.updateCustomerData(dispatch, customer),
    requestCustomerData: () => MyAccountDispatcher
        .then(({ default: dispatcher }) => dispatcher.requestCustomerData(dispatch))
});

export class CheckoutSuccessContainer extends PureComponent {
    static propTypes = {
        orderID: PropTypes.number.isRequired,
        incrementID: PropTypes.number.isRequired,
        updateBreadcrumbs: PropTypes.func.isRequired,
        changeHeaderState: PropTypes.func.isRequired,
        showOverlay: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired,
        updateMeta: PropTypes.func.isRequired,
        shippingAddress: PropTypes.object.isRequired,
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
        clubApparelMember: null,
        phone: '',
        isPhoneVerified: false,
        isChangePhonePopupOpen: false,
        isMobileVerification: false
    };

    containerFunctions = {
        onSignIn: this.onSignIn.bind(this),
        changeActiveTab: this.changeActiveTab.bind(this),
        onVerifySuccess: this.onVerifySuccess.bind(this),
        onResendCode: this.onResendCode.bind(this),
        changePhone: this.changePhone.bind(this),
        toggleChangePhonePopup: this.toggleChangePhonePopup.bind(this)
    };

    constructor(props) {
        super(props);

        const {
            updateMeta
        } = this.props;

        this.state = MyAccountContainer.navigateToSelectedTab(this.props) || {};

        /*
        if (!isSignedIn) {
            toggleOverlayByKey(CUSTOMER_ACCOUNT);
        }
        */

        updateMeta({ title: __('My account') });

        this.onSignIn();
    }

    static getDerivedStateFromProps(props, state) {
        return MyAccountContainer.navigateToSelectedTab(props, state);
    }

    componentDidMount() {
        const {
            updateMeta,
            customer,
            isSignedIn
        } = this.props;

        this.setPhone();

        const testCustomerVerified = '0';

        if (!(isSignedIn && customer.isVerified === testCustomerVerified) && isMobile.any()) {
            this.setState({ isMobileVerification: true });
        }

        updateMeta({ title: __('Account') });

        this._updateBreadcrumbs();
    }

    componentDidUpdate() {
        this.setPhone();
    }

    containerProps = () => {
        const {
            clubApparelMember,
            isPhoneVerified,
            isChangePhonePopupOpen,
            phone,
            isMobileVerification
        } = this.state;

        return {
            clubApparelMember,
            isPhoneVerified,
            isChangePhonePopupOpen,
            phone,
            isMobileVerification
        };
    };

    toggleChangePhonePopup() {
        const { isChangePhonePopupOpen } = this.state;
        this.setState({ isChangePhonePopupOpen: !isChangePhonePopupOpen });
    }

    changePhone(fields) {
        const {
            isSignedIn,
            updateCustomer,
            customer: oldCustomerData,
            shippingAddress
        } = this.props;
        const { newPhone } = fields;

        if (isSignedIn) {
            updateCustomer({
                ...oldCustomerData,
                phone: PHONE_CODES[shippingAddress.country_id] + newPhone
            }).then(
                (response) => {
                    if (!response.error) {
                        this.onResendCode();
                        this.toggleChangePhonePopup();
                    } else {
                        showNotification('error', __('Please enter valid phone number'));
                    }
                },
                this._handleError
            );
        } else {
            // TODO: implement logic for guest
        }
    }

    setPhone() {
        const {
            isSignedIn,
            customer,
            shippingAddress
        } = this.props;

        if (isSignedIn) {
            this.setState({ phone: customer.phone });
        } else {
            this.setState({ phone: shippingAddress.phone });
        }
    }

    onVerifySuccess(fields) {
        const {
            verifyUserPhone,
            isSignedIn,
            orderID,
            showNotification
        } = this.props;

        const { phone } = this.state;
        if (phone) {
            const countryCodeLastChar = 4;
            const countryCode = phone.slice(1, countryCodeLastChar);
            const mobile = phone.slice(countryCodeLastChar);
            const { otp } = fields;
            if (isSignedIn) {
                verifyUserPhone({ mobile, country_code: countryCode, otp }).then(
                    (response) => {
                        if (response.success) {
                            this.setState({ isPhoneVerified: true });
                            showNotification('success', __('Phone was successfully verified'));
                            this.setState({ isMobileVerification: false });
                        } else {
                            showNotification('error', __('Wrong Verification Code. Please re-enter'));
                        }
                    },
                    this._handleError
                );
            } else {
                verifyUserPhone({
                    mobile,
                    country_code: countryCode,
                    otp,
                    order_id: orderID
                }).then(
                    (response) => {
                        if (response.success) {
                            this.setState({ isPhoneVerified: true });
                            this.setState({ isMobileVerification: false });
                        } else {
                            showNotification('error', __('Verification failed. Please enter valid verification code'));
                        }
                    },
                    this._handleError
                );
            }
        }
    }

    onResendCode() {
        const { sendVerificationCode, showNotification } = this.props;
        const { phone } = this.state;
        const countryCodeLastChar = 4;
        const countryCode = phone.slice(1, countryCodeLastChar);
        const mobile = phone.slice(countryCodeLastChar);
        sendVerificationCode({ mobile, countryCode }).then(
            (response) => {
                if (!response.error) {
                    showNotification('success', __('Verification code was successfully re-sent'));
                } else {
                    showNotification('info', __('Please wait %s before re-sending the request', response.data.timeout));
                }
            },
            this._handleError
        );
    }

    changeActiveTab(activeTab) {
        const { [activeTab]: { url } } = tabMap;
        history.push(`${ MY_ACCOUNT_URL }${ url }`);
    }

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
