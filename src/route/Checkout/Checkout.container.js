import { connect } from 'react-redux';

import { BILLING_STEP, PAYMENT_TOTALS } from 'SourceRoute/Checkout/Checkout.config';
import {
    CheckoutContainer as SourceCheckoutContainer,
    mapDispatchToProps as sourceMapDispatchToProps,
    mapStateToProps
} from 'SourceRoute/Checkout/Checkout.container';
import CheckoutDispatcher from 'Store/Checkout/Checkout.dispatcher';
import { updateMeta } from 'Store/Meta/Meta.action';
import { isSignedIn } from 'Util/Auth';
import BrowserDatabase from 'Util/BrowserDatabase';
import { ONE_MONTH_IN_SECONDS } from 'Util/Request/QueryDispatcher';

export const mapDispatchToProps = (dispatch) => ({
    ...sourceMapDispatchToProps(dispatch),
    estimateShipping: (address) => CheckoutDispatcher.estimateShipping(dispatch, address),
    saveAddressInformation: (address) => CheckoutDispatcher.saveAddressInformation(dispatch, address)
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
            default_shipping: true,
            ...address
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
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutContainer);
