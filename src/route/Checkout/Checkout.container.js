import { connect } from 'react-redux';

import { CARD } from 'Component/CheckoutPayments/CheckoutPayments.config';
import { BILLING_STEP, PAYMENT_TOTALS } from 'SourceRoute/Checkout/Checkout.config';
import {
    CheckoutContainer as SourceCheckoutContainer,
    mapDispatchToProps as sourceMapDispatchToProps,
    mapStateToProps
} from 'SourceRoute/Checkout/Checkout.container';
import { setCartId } from 'Store/Cart/Cart.action';
import CartDispatcher from 'Store/Cart/Cart.dispatcher';
import { CART_ITEMS_CACHE_KEY } from 'Store/Cart/Cart.reducer';
import CheckoutDispatcher from 'Store/Checkout/Checkout.dispatcher';
import { updateMeta } from 'Store/Meta/Meta.action';
import { isSignedIn } from 'Util/Auth';
import BrowserDatabase from 'Util/BrowserDatabase';
import { ONE_MONTH_IN_SECONDS } from 'Util/Request/QueryDispatcher';

export const mapDispatchToProps = (dispatch) => ({
    ...sourceMapDispatchToProps(dispatch),
    estimateShipping: (address) => CheckoutDispatcher.estimateShipping(dispatch, address),
    saveAddressInformation: (address) => CheckoutDispatcher.saveAddressInformation(dispatch, address),
    createOrder: (code, additional_data) => CheckoutDispatcher.createOrder(dispatch, code, additional_data),
    setCartId: (cartId) => dispatch(setCartId(cartId)),
    createEmptyCart: () => CartDispatcher.getCart(dispatch)
});

export class CheckoutContainer extends SourceCheckoutContainer {
    componentDidMount() {
        updateMeta({ title: __('Checkout') });
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

        estimateShipping({
            ...address,
            default_shipping: true
        }).then(
            (response) => {
                if (typeof response !== 'undefined') {
                    Checkout.setState({
                        shippingMethods: response.data
                    })
                }
            },
            this._handleError
        );
    }

    async saveAddressInformation(addressInformation) {
        const { saveAddressInformation } = this.props;
        const { shipping_address } = addressInformation;

        this.setState({
            isLoading: true,
            shippingAddress: shipping_address
        });

        saveAddressInformation(addressInformation).then(
            ({ data }) => {
                const { payment_methods, totals } = data;

                BrowserDatabase.setItem(
                    totals,
                    PAYMENT_TOTALS,
                    ONE_MONTH_IN_SECONDS
                );

                this.setState({
                    isLoading: false,
                    paymentMethods: payment_methods,
                    checkoutStep: BILLING_STEP,
                    paymentTotals: totals
                });
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
        const { createOrder } = this.props;
        const { shippingAddress: { email } } = this.state;

        const data = code === CARD
            ? {
                ...additional_data,
                source: {
                    type: 'token',
                    token: BrowserDatabase.getItem('CREDIT_CART_TOKEN')
                },
                customer: {
                    email: email
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
                ({ data }) => {
                    const { order_id, success, response_code } = data;

                    if (success || response_code === 200) {
                        this.setDetailsStep(order_id);
                        this.resetCart();
                    }
                },
                this._handleError
            );
        } catch (e) {
            this._handleError(e);
        }
    }

    resetCart() {
        const { setCartId, createEmptyCart } = this.props;

        BrowserDatabase.deleteItem(CART_ITEMS_CACHE_KEY);
        setCartId('');
        createEmptyCart();
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutContainer);
