import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { CARD } from 'Component/CheckoutPayments/CheckoutPayments.config';
import { BILLING_STEP, PAYMENT_TOTALS } from 'SourceRoute/Checkout/Checkout.config';
import {
    CheckoutContainer as SourceCheckoutContainer,
    mapDispatchToProps as sourceMapDispatchToProps
} from 'SourceRoute/Checkout/Checkout.container';
import { setCartId } from 'Store/Cart/Cart.action';
import CartDispatcher from 'Store/Cart/Cart.dispatcher';
import { CART_ITEMS_CACHE_KEY } from 'Store/Cart/Cart.reducer';
import CheckoutDispatcher from 'Store/Checkout/Checkout.dispatcher';
import { updateMeta } from 'Store/Meta/Meta.action';
import { hideActiveOverlay } from 'Store/Overlay/Overlay.action';
import StoreCreditDispatcher from 'Store/StoreCredit/StoreCredit.dispatcher';
import { isSignedIn } from 'Util/Auth';
import BrowserDatabase from 'Util/BrowserDatabase';
import { ONE_MONTH_IN_SECONDS } from 'Util/Request/QueryDispatcher';

export const mapDispatchToProps = (dispatch) => ({
    ...sourceMapDispatchToProps(dispatch),
    estimateShipping: (address) => CheckoutDispatcher.estimateShipping(dispatch, address),
    saveAddressInformation: (address) => CheckoutDispatcher.saveAddressInformation(dispatch, address),
    createOrder: (code, additional_data) => CheckoutDispatcher.createOrder(dispatch, code, additional_data),
    getTabbyInstallment: (price) => CheckoutDispatcher.getTabbyInstallment(dispatch, price),
    verifyPayment: (paymentId) => CheckoutDispatcher.verifyPayment(dispatch, paymentId),
    getPaymentMethods: () => CheckoutDispatcher.getPaymentMethods(),
    setCartId: (cartId) => dispatch(setCartId(cartId)),
    createEmptyCart: () => CartDispatcher.getCart(dispatch),
    hideActiveOverlay: () => dispatch(hideActiveOverlay()),
    updateStoreCredit: () => StoreCreditDispatcher.getStoreCredit(dispatch),
    setMeta: (meta) => dispatch(updateMeta(meta))
});
export const mapStateToProps = (state) => ({
    totals: state.CartReducer.cartTotals,
    customer: state.MyAccountReducer.customer,
    guest_checkout: state.ConfigReducer.guest_checkout,
    countries: state.ConfigReducer.countries,
    isSignedIn: state.MyAccountReducer.isSignedIn,
    activeOverlay: state.OverlayReducer.activeOverlay
});

export class CheckoutContainer extends SourceCheckoutContainer {
    static propTypes = {
        updateStoreCredit: PropTypes.func.isRequired,
        isSignedIn: PropTypes.bool.isRequired,
        setMeta: PropTypes.func.isRequired
    };

    state = {
        ...this.state,
        isLoading: false
    };

    componentDidMount() {
        const { setMeta } = this.props;

        setMeta({ title: __('Checkout') });
    }

    componentDidUpdate() {
        const {
            history,
            showInfoNotification,
            guest_checkout = true,
            totals,
            totals: {
                items = []
            }
        } = this.props;

        if (Object.keys(totals).length && !items.length) {
            showInfoNotification(__('Please add at least one product to cart!'));
            history.push('/cart');
        }

        // if guest checkout is disabled and user is not logged in => throw him to homepage
        if (!guest_checkout && !isSignedIn()) {
            history.push('/');
        }
    }

    onShippingEstimationFieldsChange(address) {
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

    async saveAddressInformation(addressInformation) {
        const {
            getPaymentMethods,
            saveAddressInformation,
            getTabbyInstallment,
            totals: {
                total: totalPrice
            }
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
            },
            this._handleError
        );

        getPaymentMethods().then(
            ({ data }) => {
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

        getTabbyInstallment(totalPrice).then(
            (response) => {
                if (response) {
                    const { paymentMethods } = this.state;
                    const { message, value } = response;

                    if (message && value) {
                        const updatedPaymentMethods = paymentMethods.reduce((acc, paymentMethod) => {
                            const { m_code } = paymentMethod;

                            if (m_code !== 'tabby_installments') {
                                acc.push(paymentMethod)
                            } else {
                                const { options } = paymentMethod;

                                acc.push(
                                    {
                                        ...paymentMethod,
                                        options: {
                                            ...options,
                                            promo_message: message,
                                            value
                                        }
                                    }
                                )
                            }

                            return acc;
                        }, []);

                        this.setState({ paymentMethods: updatedPaymentMethods });
                    }
                }
            },
            this._handleError
        ).catch(() => {});
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
                    enable: true
                },
                metadata: {
                    udf1: null
                }
            }
            : additional_data;

        try {
            createOrder(code, data).then(
                (response) => {
                    if (response && response.data) {
                        const { data } = response;

                        if (typeof data === 'object') {
                            const { order_id, success, response_code } = data;

                            if (success || response_code === 200) {
                                this.setDetailsStep(order_id);
                                this.resetCart();
                            }
                        }

                        if (typeof data === 'string') {
                            showErrorNotification(__(data));
                            this.setState({ isLoading: false });
                        }
                    }
                },
                this._handleError
            ).catch(() => {
                const { showErrorNotification } = this.props;
                this.setState({ isLoading: false });
                showErrorNotification(__('Something went wrong.'));
            });
        } catch (e) {
            this._handleError(e);
        }
    }

    resetCart() {
        const { setCartId, createEmptyCart, updateStoreCredit } = this.props;

        BrowserDatabase.deleteItem(CART_ITEMS_CACHE_KEY);
        setCartId('');
        createEmptyCart();
        updateStoreCredit();
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutContainer);
