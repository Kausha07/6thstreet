import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    CheckoutPaymentsContainer as SourceCheckoutPaymentsContainer,
    mapDispatchToProps as SourceMapDispatchToProps
} from 'SourceComponent/CheckoutPayments/CheckoutPayments.container';
import CheckoutDispatcher from 'Store/Checkout/Checkout.dispatcher';
import { TotalsType } from 'Type/MiniCart';

export const CartDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Cart/Cart.dispatcher'
);

export const mapStateToProps = (state) => ({
    cartId: state.Cart.cartId,
    totals: state.Cart.cartTotals
});

export const mapDispatchToProps = (dispatch) => ({
    ...SourceMapDispatchToProps,
    selectPaymentMethod: (billingData) => CheckoutDispatcher.selectPaymentMethod(dispatch, billingData),
    getTotals: (cartId) => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.getCartTotals(dispatch, cartId)
    )
});

export class CheckoutPaymentsContainer extends SourceCheckoutPaymentsContainer {
    static propTypes = {
        ...SourceCheckoutPaymentsContainer.propTypes,
        setTabbyWebUrl: PropTypes.func.isRequired,
        setCreditCardData: PropTypes.func.isRequired,
        cartId: PropTypes.number.isRequired,
        totals: TotalsType.isRequired
    };

    getUpdatedTotals() {
        const { getTotals, cartId } = this.props;
        getTotals(cartId);
    }

    selectPaymentMethod({ m_code: code }) {
        const {
            onPaymentMethodSelect,
            setOrderButtonEnableStatus,
            selectPaymentMethod,
            billingAddress,
            setTabbyWebUrl
        } = this.props;

        this.setState({
            selectedPaymentCode: code
        });

        this.getUpdatedTotals();

        onPaymentMethodSelect(code);
        setOrderButtonEnableStatus(true);
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

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutPaymentsContainer);
