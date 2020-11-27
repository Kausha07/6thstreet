import { DETAILS_STEP, SHIPPING_STEP } from '@scandipwa/scandipwa/src/route/Checkout/Checkout.config';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { CARD } from 'Component/CheckoutPayments/CheckoutPayments.config';
import { CC_POPUP_ID } from 'Component/CreditCardPopup/CreditCardPopup.config';
import { AUTHORIZED_STATUS } from 'Route/Checkout/Checkout.config';
import { BILLING_STEP, PAYMENT_TOTALS } from 'SourceRoute/Checkout/Checkout.config';
import {
    CheckoutContainer as SourceCheckoutContainer,
    mapDispatchToProps as sourceMapDispatchToProps
} from 'SourceRoute/Checkout/Checkout.container';
import { setGender } from 'Store/AppState/AppState.action';
import {
    resetCart
} from 'Store/Cart/Cart.action';
// eslint-disable-next-line no-unused-vars
import CartDispatcher from 'Store/Cart/Cart.dispatcher';
import CheckoutDispatcher from 'Store/Checkout/Checkout.dispatcher';
import { updateMeta } from 'Store/Meta/Meta.action';
import { hideActiveOverlay } from 'Store/Overlay/Overlay.action';
import StoreCreditDispatcher from 'Store/StoreCredit/StoreCredit.dispatcher';
import { isSignedIn } from 'Util/Auth';
import BrowserDatabase from 'Util/BrowserDatabase';
import { checkProducts } from 'Util/Cart/Cart';
import history from 'Util/History';
import { ONE_MONTH_IN_SECONDS } from 'Util/Request/QueryDispatcher';

export const mapDispatchToProps = (dispatch) => ({
    ...sourceMapDispatchToProps(dispatch),
    estimateShipping: (address) => CheckoutDispatcher.estimateShipping(dispatch, address),
    saveAddressInformation: (address) => CheckoutDispatcher.saveAddressInformation(dispatch, address),
    createOrder: (code, additional_data) => CheckoutDispatcher.createOrder(dispatch, code, additional_data),
    verifyPayment: (paymentId) => CheckoutDispatcher.verifyPayment(dispatch, paymentId),
    getPaymentMethods: () => CheckoutDispatcher.getPaymentMethods(),
    sendVerificationCode: (phone) => CheckoutDispatcher.sendVerificationCode(dispatch, phone),
    getLastOrder: () => CheckoutDispatcher.getLastOrder(dispatch),
    hideActiveOverlay: () => dispatch(hideActiveOverlay()),
    updateStoreCredit: () => StoreCreditDispatcher.getStoreCredit(dispatch),
    setMeta: (meta) => dispatch(updateMeta(meta)),
    setGender: (gender) => dispatch(setGender(gender)),
    resetCart: () => dispatch(resetCart()),
    getCart: () => CartDispatcher.getCart(dispatch)
});
export const mapStateToProps = (state) => ({
    totals: state.CartReducer.cartTotals,
    processingRequest: state.CartReducer.processingRequest,
    customer: state.MyAccountReducer.customer,
    guest_checkout: state.ConfigReducer.guest_checkout,
    countries: state.ConfigReducer.countries,
    isSignedIn: state.MyAccountReducer.isSignedIn,
    activeOverlay: state.OverlayReducer.activeOverlay,
    cartId: state.CartReducer.cartId
});

export class CheckoutContainer extends SourceCheckoutContainer {
    static propTypes = {
        updateStoreCredit: PropTypes.func.isRequired,
        isSignedIn: PropTypes.bool.isRequired,
        setMeta: PropTypes.func.isRequired,
        setGender: PropTypes.func.isRequired,
        removeCartItems: PropTypes.func.isRequired,
        cartId: PropTypes.number.isRequired,
        updateTotals: PropTypes.func.isRequired
    };

    containerFunctions = {
        setLoading: this.setLoading.bind(this),
        setDetailsStep: this.setDetailsStep.bind(this),
        savePaymentInformation: this.savePaymentInformation.bind(this),
        saveAddressInformation: this.saveAddressInformation.bind(this),
        onShippingEstimationFieldsChange: this.onShippingEstimationFieldsChange.bind(this),
        onEmailChange: this.onEmailChange.bind(this),
        onCreateUserChange: this.onCreateUserChange.bind(this),
        onPasswordChange: this.onPasswordChange.bind(this),
        goBack: this.goBack.bind(this),
        resetCart: this.resetCart.bind(this)
    };

    constructor(props) {
        super(props);

        const {
            toggleBreadcrumbs,
            totals: {
                is_virtual
            },
            totals
        } = props;

        toggleBreadcrumbs(false);

        this.state = {
            isLoading: false,
            isDeliveryOptionsLoading: false,
            requestsSent: 0,
            paymentMethods: [],
            shippingMethods: [],
            shippingAddress: {},
            checkoutStep: is_virtual ? BILLING_STEP : SHIPPING_STEP,
            orderID: '',
            incrementID: '',
            threeDsUrl: '',
            paymentTotals: BrowserDatabase.getItem(PAYMENT_TOTALS) || {},
            email: '',
            isCreateUser: false,
            isGuestEmailSaved: false,
            isVerificationCodeSent: false,
            lastOrder: {},
            initialTotals: totals
        };
    }

    componentDidMount() {
        const { setMeta } = this.props;

        setMeta({ title: __('Checkout') });
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            history,
            showInfoNotification,
            showErrorNotification,
            guest_checkout = true,
            totals = {},
            totals: {
                items = [],
                total
            },
            updateStoreCredit
        } = this.props;

        const {
            checkoutStep
        } = this.state;

        const {
            checkoutStep: prevCheckoutStep
        } = prevState;

        if (Object.keys(totals).length !== 0) {
            this.updateInitTotals();
        }

        if (checkoutStep !== prevCheckoutStep) {
            updateStoreCredit();
        }

        if (items.length !== 0) {
            const mappedItems = checkProducts(items) || [];

            if (mappedItems.length !== 0) {
                history.push('/cart');
            }
        }

        if (Object.keys(totals).length && !items.length && checkoutStep !== DETAILS_STEP) {
            showInfoNotification(__('Please add at least one product to cart!'));
            history.push('/cart');
            return;
        }

        if (Object.keys(totals).length && total === 0 && checkoutStep !== DETAILS_STEP) {
            showErrorNotification(__('Your cart is invalid'));
            history.push('/');
        }

        // if guest checkout is disabled and user is not logged in => throw him to homepage
        if (!guest_checkout && !isSignedIn()) {
            history.push('/');
        }
    }

    updateInitTotals() {
        const { totals } = this.props;
        this.setState({ initialTotals: totals });
    }

    saveLastOrder(totals) {
        this.setState({ lastOrder: totals });
    }

    onShippingEstimationFieldsChange(address = {}) {
        const canEstimate = !Object.values(address).some((item) => item === undefined);

        if (!canEstimate) {
            return;
        }

        const { estimateShipping } = this.props;
        const Checkout = this;

        /* eslint-disable */
        delete address.region_id;
        Checkout.setState({ isLoading: true });
        estimateShipping({
            ...address,
            default_shipping: true
        }).then(
            (response) => {
                if (typeof response !== 'undefined') {
                    Checkout.setState({
                        shippingMethods: response.data,
                        isLoading: false
                    })
                }
                Checkout.setState({ isLoading: false });
            },
            this._handleError
        );
    }

    goBack() {
        const { checkoutStep } = this.state;

        if (checkoutStep === BILLING_STEP) {
            this.setState({
                isLoading: false,
                checkoutStep: SHIPPING_STEP
            });

            BrowserDatabase.deleteItem(PAYMENT_TOTALS);
        }

        history.goBack();
    }

    async saveAddressInformation(addressInformation) {
        const {
            saveAddressInformation
        } = this.props;
        const { shipping_address } = addressInformation;

        this.setState({
            isLoading: true,
            shippingAddress: shipping_address
        });

        saveAddressInformation(addressInformation).then(
            ({ data }) => {
                const { totals } = data;

                BrowserDatabase.setItem(
                    totals,
                    PAYMENT_TOTALS,
                    ONE_MONTH_IN_SECONDS
                );

                this.setState({
                    paymentTotals: totals
                });

                this.getPaymentMethods();
            },
            this._handleError
        );
    }

    async savePaymentInformation(paymentInformation) {
        this.setState({ isLoading: true });

        await this.savePaymentMethodAndPlaceOrder(paymentInformation)
    }

    async savePaymentMethodAndPlaceOrder(paymentInformation) {
        const { paymentMethod: { code, additional_data } } = paymentInformation;
        const { createOrder, customer: { email: customerEmail }, showErrorNotification } = this.props;
        const { shippingAddress: { email } } = this.state;

        const data = code === CARD
            ? {
                ...additional_data,
                source: {
                    type: 'token',
                    token: BrowserDatabase.getItem('CREDIT_CART_TOKEN')
                },
                customer: {
                    email: customerEmail ? customerEmail : email
                },
                '3ds': {
                    enabled: BrowserDatabase.getItem('CREDIT_CART_3DS')
                },
                metadata: {
                    udf1: typeof BrowserDatabase.getItem('CREDIT_CART_TYPE') === 'string'
                        ? BrowserDatabase.getItem('CREDIT_CART_TYPE')
                        : null
                }
            }
            : additional_data;

        try {
            createOrder(code, data).then(
                (response) => {
                    if (response && response.data) {
                        const { data } = response;

                        if (typeof data === 'object') {
                            const {
                                order_id,
                                success,
                                response_code,
                                increment_id,
                                id = '',
                                _links: {
                                    redirect: {
                                        href = ''
                                    } = {}
                                } = {}
                            } = data;

                            if (success || response_code === 200) {
                                if (code === CARD && href) {
                                    this.setState({ threeDsUrl: href, order_id, increment_id, id });
                                    setTimeout(
                                        () => this.processThreeDSWithTimeout(3),
                                        10000
                                    );
                                } else {
                                    this.setDetailsStep(order_id, increment_id);
                                    this.resetCart();
                                }
                            } else {
                                const { error } = data;

                                if (error && typeof error === 'string') {
                                    showErrorNotification(__(error));
                                    this.setState({ isLoading: false });
                                    this.resetCart();
                                }
                            }
                        }

                        if (typeof data === 'string') {
                            showErrorNotification(__(data));
                            this.setState({ isLoading: false });
                            this.resetCart();
                        }
                    }

                    if (response && typeof response === 'string') {
                        showErrorNotification(__(response));
                        this.setState({ isLoading: false });
                        this.resetCart();
                    }
                },
                this._handleError
            ).catch(() => {
                const { showErrorNotification } = this.props;
                this.setState({ isLoading: false });
                showErrorNotification(__('Something went wrong.'));
                this.resetCart();
            });
        } catch (e) {
            this._handleError(e);
        }
    }

    setDetailsStep(orderID, incrementID) {
        const {
            setNavigationState,
            sendVerificationCode,
            isSignedIn,
            customer
        } = this.props;

        const { shippingAddress } = this.state;

        if (isSignedIn) {
            if (customer.isVerified !== '0') {
                const { phone = '' } = customer;
                const code = phone.slice(1, 4);
                const mobile = phone.slice(4);

                sendVerificationCode({ mobile, code }).then(
                    (response) => {
                        this.setState({ isVerificationCodeSent: response.success });
                    },
                    this._handleError
                );
            }
        } else {
            const { phone = '' } = shippingAddress;
            const code = phone.slice(1, 4);
            const mobile = phone.slice(4);
            sendVerificationCode({ mobile, code }).then(
                (response) => {
                    this.setState({ isVerificationCodeSent: response.success });
                },
                this._handleError
            );
        }


        BrowserDatabase.deleteItem(PAYMENT_TOTALS);

        this.setState({
            isLoading: false,
            checkoutStep: DETAILS_STEP,
            orderID,
            incrementID
        });

        setNavigationState({
            name: DETAILS_STEP
        });
    }

    getPaymentMethods() {
        const { getPaymentMethods } = this.props;

        getPaymentMethods().then(
            ({ data = [] }) => {
                const availablePaymentMethods = data.reduce((acc, paymentMethod) => {
                    const { is_enabled } = paymentMethod;

                    if (is_enabled) {
                        acc.push(paymentMethod);
                    }

                    return acc;
                }, []);

                if (data) {
                    this.setState({
                        isLoading: false,
                        paymentMethods: availablePaymentMethods,
                        checkoutStep: BILLING_STEP
                    })
                }
            },
            this._handleError
        );
    }

    processThreeDS() {
        const { getLastOrder } = this.props;
        const { order_id, increment_id } = this.state;

        getLastOrder().then(
            (response) => {
                if (response) {
                    const { status } = response;

                    if (status === 'payment_success') {
                        this.setDetailsStep(order_id, increment_id);
                        this.resetCart();
                        this.setState({ CreditCardPaymentStatus: AUTHORIZED_STATUS });
                    }
                }
            }
        );
    }

    processThreeDSWithTimeout(counter) {
        const { CreditCardPaymentStatus, order_id, increment_id } = this.state;
        const { showErrorNotification, hideActiveOverlay, activeOverlay } = this.props;

        // Need to get payment data from CreditCard.
        // Could not get callback of CreditCard another way because CreditCard is iframe in iframe
        if (CreditCardPaymentStatus !== AUTHORIZED_STATUS && counter < 25 && activeOverlay === CC_POPUP_ID) {
            setTimeout(
                () => {
                    this.processThreeDS();
                    this.processThreeDSWithTimeout(counter + 1);
                },
                5000
            );
        }

        if (counter === 25) {
            showErrorNotification('Credit Card session timeout');
            hideActiveOverlay();
        }

        if ((counter === 25 || activeOverlay !== CC_POPUP_ID) && CreditCardPaymentStatus !== AUTHORIZED_STATUS) {
            this.setState({ isLoading: false, isFailed: true });
            this.setDetailsStep(order_id, increment_id);
            this.resetCart();
        }
    }

    resetCart() {
        const { 
            updateStoreCredit,
            resetCart,
            getCart
        } = this.props;

        resetCart();
        getCart();
        updateStoreCredit();
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutContainer);
