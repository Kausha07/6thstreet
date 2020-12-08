import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { CARD } from 'Component/CheckoutPayments/CheckoutPayments.config';
import { ADD_ADDRESS, ADDRESS_POPUP_ID } from 'Component/MyAccountAddressPopup/MyAccountAddressPopup.config';
import {
    CheckoutBillingContainer as SourceCheckoutBillingContainer,
    mapDispatchToProps as sourceMapDispatchToProps,
    mapStateToProps as sourceMapStateToProps
} from 'SourceComponent/CheckoutBilling/CheckoutBilling.container';
import CreditCardDispatcher from 'Store/CreditCard/CreditCard.dispatcher';
import { showNotification } from 'Store/Notification/Notification.action';
import { showPopup } from 'Store/Popup/Popup.action';
import BrowserDatabase from 'Util/BrowserDatabase';
import { FIVE_MINUTES_IN_SECONDS } from 'Util/Request/QueryDispatcher';

export const mapStateToProps = (state) => ({
    ...sourceMapStateToProps(state),
    processingRequest: state.CartReducer.processingRequest,
    processingPaymentSelectRequest: state.CartReducer.processingPaymentSelectRequest
});

export const mapDispatchToProps = (dispatch) => ({
    ...sourceMapDispatchToProps(dispatch),
    addNewCreditCard: (cardData) => CreditCardDispatcher.addNewCreditCard(dispatch, cardData),
    getCardType: (bin) => CreditCardDispatcher.getCardType(dispatch, bin),
    showSuccessMessage: (message) => dispatch(showNotification('success', message)),
    showPopup: (payload) => dispatch(showPopup(ADDRESS_POPUP_ID, payload))
});

export class CheckoutBillingContainer extends SourceCheckoutBillingContainer {
    static propTypes = {
        ...SourceCheckoutBillingContainer.propTypes,
        setTabbyWebUrl: PropTypes.func.isRequired,
        setPaymentCode: PropTypes.func.isRequired,
        showPopup: PropTypes.func.isRequired,
        setCheckoutCreditCardData: PropTypes.func.isRequired,
        processingRequest: PropTypes.bool.isRequired,
        processingPaymentSelectRequest: PropTypes.bool.isRequired
    };

    containerFunctions = {
        onBillingSuccess: this.onBillingSuccess.bind(this),
        onBillingError: this.onBillingError.bind(this),
        onAddressSelect: this.onAddressSelect.bind(this),
        onSameAsShippingChange: this.onSameAsShippingChange.bind(this),
        onPaymentMethodSelect: this.onPaymentMethodSelect.bind(this),
        showPopup: this.showPopup.bind(this),
        showCreateNewPopup: this.showCreateNewPopup.bind(this),
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

    showCreateNewPopup() {
        const { showPopup } = this.props;

        showPopup({
            action: ADD_ADDRESS,
            title: __('Add new address'),
            address: {}
        });
    }

    onBillingSuccess(fields, asyncData) {
        const paymentMethod = this._getPaymentData(asyncData);
        const { savePaymentInformation } = this.props;
        const address = this._getAddress(fields);
        const { code } = paymentMethod;

        if (code === CARD) {
            const {
                addNewCreditCard,
                getCardType,
                showErrorNotification,
                showSuccessMessage,
                setCheckoutCreditCardData
            } = this.props;

            const { number = '', expDate, cvv } = this.state;
            setCheckoutCreditCardData(number, expDate, cvv);

            getCardType(number.substr('0', '6')).then(
                (response) => {
                    if (response) {
                        const { requires_3ds, type } = response;

                        BrowserDatabase.setItem(type, 'CREDIT_CART_TYPE', FIVE_MINUTES_IN_SECONDS);
                        BrowserDatabase.setItem(requires_3ds, 'CREDIT_CART_3DS', FIVE_MINUTES_IN_SECONDS);
                    }
                }
            );

            addNewCreditCard({ number, expDate, cvv }).then(
                (response) => {
                    const { id, token } = response;

                    console.log('***', response);

                    if (id || token) {
                        BrowserDatabase.setItem(id ?? token, 'CREDIT_CART_TOKEN', FIVE_MINUTES_IN_SECONDS);
                        showSuccessMessage(__('Credit card successfully added'));

                        savePaymentInformation({
                            billing_address: address,
                            paymentMethod
                        });
                    } else if (Array.isArray(response)) {
                        const message = response[0];

                        if (typeof message === 'string') {
                            showErrorNotification(this.getCartError(message));
                        } else {
                            showErrorNotification(__('Something went wrong'));
                        }
                    }
                },
                this._handleError
            ).catch(() => {
                const { showErrorNotification } = this.props;

                showErrorNotification(__('Something went wrong'));
            });
        } else {
            savePaymentInformation({
                billing_address: address,
                paymentMethod
            });
        }
    }

    getCartError(message) {
        switch (message) {
        case 'card_number_invalid':
            return __('Card number is not valid');
        case 'card_expiry_month_invalid':
            return __('Card exp month is not valid');
        case 'card_expiry_year_invalid':
            return __('Card exp year is not valid');
        case 'cvv_invalid':
            return __('Card cvv is not valid');
        default:
            return __('Something went wrong');
        }
    }

    onPaymentMethodSelect(code) {
        const { setPaymentCode } = this.props;

        this.setState({ paymentMethod: code });
        setPaymentCode(code);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutBillingContainer);
