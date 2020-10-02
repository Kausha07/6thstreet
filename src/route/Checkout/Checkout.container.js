import { connect } from 'react-redux';

import {
    CheckoutContainer as SourceCheckoutContainer,
    mapDispatchToProps as sourceMapDispatchToProps,
    mapStateToProps
} from 'SourceRoute/Checkout/Checkout.container';
import CheckoutDispatcher from 'Store/Checkout/Checkout.dispatcher';
import { updateMeta } from 'Store/Meta/Meta.action';
import { isSignedIn } from 'Util/Auth';

export const mapDispatchToProps = (dispatch) => ({
    ...sourceMapDispatchToProps(dispatch),
    estimateShipping: (address) => CheckoutDispatcher.estimateShipping(dispatch, address)
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

        estimateShipping({
            default_shipping: true,
            ...address
        });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutContainer);
