import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    CheckoutPaymentsContainer as SourceCheckoutPaymentsContainer,
    mapDispatchToProps as SourceMapDispatchToProps
} from 'SourceComponent/CheckoutPayments/CheckoutPayments.container';
import { getStore } from 'Store';
import CartDispatcher from 'Store/Cart/Cart.dispatcher';
import CheckoutDispatcher from 'Store/Checkout/Checkout.dispatcher';

export const mapDispatchToProps = (dispatch) => ({
    ...SourceMapDispatchToProps,
    selectPaymentMethod: (billingData) => CheckoutDispatcher.selectPaymentMethod(dispatch, billingData),
    updateTotals: (cartId) => CartDispatcher.getCartTotals(dispatch, cartId)
});

export class CheckoutPaymentsContainer extends SourceCheckoutPaymentsContainer {
    static propTypes = {
        ...SourceCheckoutPaymentsContainer.propTypes,
        setTabbyWebUrl: PropTypes.func.isRequired,
        setCreditCardData: PropTypes.func.isRequired
    };

    selectPaymentMethod({ m_code: code }) {
        const { Cart: { cartId } } = getStore().getState();

        const {
            onPaymentMethodSelect,
            setOrderButtonEnableStatus,
            selectPaymentMethod,
            billingAddress,
            setTabbyWebUrl,
            updateTotals
        } = this.props;

        this.setState({
            selectedPaymentCode: code
        });

        onPaymentMethodSelect(code);
        setOrderButtonEnableStatus(true);
        updateTotals(cartId);
        selectPaymentMethod({ code, billingAddress }).then(
            (response) => {
                if (response.configuration) {
                    const {
                        configuration: {
                            available_products: {
                                installments, pay_later
                            }
                        },
                        payment: {
                            id
                        }
                    } = response;

                    if (installments || pay_later) {
                        setTabbyWebUrl(
                            code === 'tabby_installments'
                                ? installments[0].web_url
                                : pay_later[0].web_url,
                            id
                        );
                    }
                }
            },
            this._handleError
        );
    }
}

export default connect(null, mapDispatchToProps)(CheckoutPaymentsContainer);
