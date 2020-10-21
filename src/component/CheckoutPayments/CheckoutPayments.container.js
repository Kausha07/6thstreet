import { connect } from 'react-redux';

import {
    CheckoutPaymentsContainer as SourceCheckoutPaymentsContainer,
    mapDispatchToProps as SourceMapDispatchToProps
} from 'SourceComponent/CheckoutPayments/CheckoutPayments.container';
import CheckoutDispatcher from 'Store/Checkout/Checkout.dispatcher';

export const mapDispatchToProps = (dispatch) => ({
    ...SourceMapDispatchToProps,
    selectPaymentMethod: (code) => CheckoutDispatcher.selectPaymentMethod(dispatch, code)
});

export class CheckoutPaymentsContainer extends SourceCheckoutPaymentsContainer {
    selectPaymentMethod({ code }) {
        const {
            onPaymentMethodSelect,
            setOrderButtonEnableStatus,
            selectPaymentMethod
        } = this.props;

        this.setState({
            selectedPaymentCode: code
        });

        onPaymentMethodSelect(code);
        setOrderButtonEnableStatus(true);
        selectPaymentMethod(code);
    }
}

export default connect(null, mapDispatchToProps)(CheckoutPaymentsContainer);
