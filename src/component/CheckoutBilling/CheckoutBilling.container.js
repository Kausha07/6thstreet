import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { CARD } from 'Component/CheckoutPayments/CheckoutPayments.config';
import {
    CheckoutBillingContainer as SourceCheckoutBillingContainer,
    mapDispatchToProps as sourceMapDispatchToProps,
    mapStateToProps
} from 'SourceComponent/CheckoutBilling/CheckoutBilling.container';
import CreditCardDispatcher from 'Store/CreditCard/CreditCard.dispatcher';
import { showNotification } from 'Store/Notification/Notification.action';
import BrowserDatabase from 'Util/BrowserDatabase';
import { FIVE_MINUTES_IN_SECONDS } from 'Util/Request/QueryDispatcher';

export const mapDispatchToProps = (dispatch) => ({
    ...sourceMapDispatchToProps(dispatch),
    addNewCreditCard: (cardData) => CreditCardDispatcher.addNewCreditCard(dispatch, cardData),
    showSuccessMessage: (message) => dispatch(showNotification('success', message))
});

export class CheckoutBillingContainer extends SourceCheckoutBillingContainer {
    static propTypes = {
        ...SourceCheckoutBillingContainer.propTypes,
        setTabbyWebUrl: PropTypes.func.isRequired,
        setPaymentCode: PropTypes.func.isRequired,
        setCheckoutCreditCardData: PropTypes.func.isRequired
    };

    containerFunctions = {
        onBillingSuccess: this.onBillingSuccess.bind(this),
        onBillingError: this.onBillingError.bind(this),
        onAddressSelect: this.onAddressSelect.bind(this),
        onSameAsShippingChange: this.onSameAsShippingChange.bind(this),
        onPaymentMethodSelect: this.onPaymentMethodSelect.bind(this),
        showPopup: this.showPopup.bind(this),
        setCreditCardData: this.setCreditCardData.bind(this)
    };

    setCreditCardData(data) {
        const { number, expDate, cvv } = data;

        if (number) {
            this.setState({ number });
        }

        if (expDate) {
            this.setState({ expDate });
        }

        if (cvv) {
            this.setState({ cvv });
        }
    }

    onBillingSuccess(fields, asyncData) {
        const paymentMethod = this._getPaymentData(asyncData);
        const { savePaymentInformation } = this.props;
        const address = this._getAddress(fields);
        const { code } = paymentMethod;

        if (code === CARD) {
            const {
                addNewCreditCard,
                showErrorNotification,
                showSuccessMessage,
                setCheckoutCreditCardData
            } = this.props;

            const { number, expDate, cvv } = this.state;
            setCheckoutCreditCardData(number, expDate, cvv);

            addNewCreditCard({ number, expDate, cvv }).then(
                (response) => {
                    const { id, errors } = response;

                    if (id) {
                        BrowserDatabase.setItem(id, 'CREDIT_CART_TOKEN', FIVE_MINUTES_IN_SECONDS);
                        showSuccessMessage(__('Credit card successfully added'));

                        savePaymentInformation({
                            billing_address: address,
                            paymentMethod
                        });
                    } else if (errors) {
                        showErrorNotification(__(errors[0]));
                    } else {
                        showErrorNotification(__('Something went wrong'));
                    }
                },
                this._handleError
            );
        } else {
            savePaymentInformation({
                billing_address: address,
                paymentMethod
            });
        }
    }

    onPaymentMethodSelect(code) {
        const { setPaymentCode } = this.props;

        this.setState({ paymentMethod: code });
        setPaymentCode(code);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutBillingContainer);
