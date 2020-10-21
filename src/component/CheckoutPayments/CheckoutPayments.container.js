import { connect } from 'react-redux';

import {
    CheckoutPaymentsContainer as SourceCheckoutPaymentsContainer,
    mapDispatchToProps as SourceMapDispatchToProps
} from 'SourceComponent/CheckoutPayments/CheckoutPayments.container';
import CheckoutDispatcher from 'Store/Checkout/Checkout.dispatcher';

export const mapDispatchToProps = (dispatch) => ({
    ...SourceMapDispatchToProps,
    selectPaymentMethod: (billingData) => CheckoutDispatcher.selectPaymentMethod(dispatch, billingData)
});

export class CheckoutPaymentsContainer extends SourceCheckoutPaymentsContainer {
    selectPaymentMethod({ m_code: code }) {
        const {
            onPaymentMethodSelect,
            setOrderButtonEnableStatus,
            selectPaymentMethod,
            billingAddress
        } = this.props;

        this.setState({
            selectedPaymentCode: code
        });
        onPaymentMethodSelect(code);
        setOrderButtonEnableStatus(true);
        selectPaymentMethod({ code, billingAddress }).then(
            (response) => {
                if (response.configuration) {
                    const { configuration: { available_products: { installments, pay_later } } } = response;

                    this.setState({
                        tabby_url: code === 'tabby_installments'
                            ? installments[0].web_url
                            : pay_later[0].web_url
                    });
                }
            },
            this._handleError
        );
    }
}

export default connect(null, mapDispatchToProps)(CheckoutPaymentsContainer);
