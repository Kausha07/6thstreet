import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { TABBY_ISTALLMENTS, TABBY_PAY_LATER } from 'Component/CheckoutPayments/CheckoutPayments.config';
import { BILLING_STEP } from 'Route/Checkout/Checkout.config';
import {
    CheckoutPaymentsContainer as SourceCheckoutPaymentsContainer,
    mapDispatchToProps as SourceMapDispatchToProps
} from 'SourceComponent/CheckoutPayments/CheckoutPayments.container';
import { getStore } from 'Store';
import CartDispatcher from 'Store/Cart/Cart.dispatcher';
import CheckoutDispatcher from 'Store/Checkout/Checkout.dispatcher';
import { showNotification } from 'Store/Notification/Notification.action';
import { TotalsType } from 'Type/MiniCart';

import { CARD } from './CheckoutPayments.config';

export const mapStateToProps = (state) => ({
    totals: state.CartReducer.cartTotals
});

export const mapDispatchToProps = (dispatch) => ({
    ...SourceMapDispatchToProps,
    selectPaymentMethod: (code) => CheckoutDispatcher.selectPaymentMethod(dispatch, code),
    createTabbySession: (code) => CheckoutDispatcher.createTabbySession(dispatch, code),
    updateTotals: (cartId) => CartDispatcher.getCartTotals(dispatch, cartId),
    showError: (message) => dispatch(showNotification('error', message))
});

export class CheckoutPaymentsContainer extends SourceCheckoutPaymentsContainer {
    static propTypes = {
        ...SourceCheckoutPaymentsContainer.propTypes,
        setTabbyWebUrl: PropTypes.func.isRequired,
        setCreditCardData: PropTypes.func.isRequired,
        totals: TotalsType.isRequired
    };

    state = {
        isTabbyInstallmentAvailable: false,
        isTabbyPayLaterAvailable: false,
        isLoading: false
    };

    componentDidMount() {
        const { createTabbySession } = this.props;
        const {
            billingAddress,
            setTabbyWebUrl
        } = this.props;

        this.selectPaymentMethod({ m_code: CARD });

        if (window.formPortalCollector) {
            window.formPortalCollector.subscribe(BILLING_STEP, this.collectAdditionalData, 'CheckoutPaymentsContainer');
        }

        createTabbySession(billingAddress).then(
            (response) => {
                if (response && response.configuration) {
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
                        if (installments) {
                            setTabbyWebUrl(
                                installments[0].web_url,
                                id,
                                TABBY_ISTALLMENTS
                            );

                            // this variable actually is used in the component
                            // eslint-disable-next-line quote-props
                            this.setState({ 'isTabbyInstallmentAvailable': true });
                        }

                        if (pay_later) {
                            setTabbyWebUrl(
                                pay_later[0].web_url,
                                id,
                                TABBY_PAY_LATER
                            );

                            // this variable actually is used in the component
                            // eslint-disable-next-line quote-props
                            this.setState({ 'isTabbyPayLaterAvailable': true });
                        }
                    }
                }
            },
            this._handleError
        ).catch(() => {});
    }

    async selectPaymentMethod(item) {
        const { m_code: code } = item;
        const { Cart: { cartId } } = getStore().getState();

        const {
            onPaymentMethodSelect,
            setOrderButtonEnableStatus,
            selectPaymentMethod,
            updateTotals
        } = this.props;

        this.setState({
            selectedPaymentCode: code,
            isLoading: true
        });

        onPaymentMethodSelect(code);
        setOrderButtonEnableStatus(true);
        await selectPaymentMethod(code).catch(() => {
            const { showError } = this.props;

            showError(__('Something went wrong'));
        });
        this.setState({ isLoading: false });
        await updateTotals(cartId);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutPaymentsContainer);
