/* eslint-disable no-param-reassign */
/* eslint-disable new-cap */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { CHECKOUT_APPLE_PAY } from 'Component/CheckoutPayments/CheckoutPayments.config';
import CheckoutComQuery from 'Query/CheckoutCom.query';
import CartDispatcher from 'Store/Cart/Cart.dispatcher';
import { showNotification } from 'Store/Notification/Notification.action';
import { customerType } from 'Type/Account';
import { TotalsType } from 'Type/MiniCart';
import { tokenize } from 'Util/API/endpoint/ApplePay/ApplePay.enpoint';
import { isSignedIn } from 'Util/Auth';
import Logger from 'Util/Logger';
import { fetchMutation, fetchQuery } from 'Util/Request';

import CheckoutComApplePay from './CheckoutComApplePay.component';

export const mapStateToProps = (state) => ({
    cartTotals: state.CartReducer.cartTotals,
    default_title: state.ConfigReducer.default_title,
    customer: state.MyAccountReducer.customer
});

export const mapDispatchToProps = (dispatch) => ({
    showError: (message) => dispatch(showNotification('error', message))
});

class CheckoutComApplePayContainer extends PureComponent {
    /**
     * Props
     * @type {*}
     */
    static propTypes = {
        billingAddress: PropTypes.object.isRequired,
        merchant_id: PropTypes.string,
        showError: PropTypes.func.isRequired,
        validateApplePay: PropTypes.func,
        placeOrder: PropTypes.func,
        supported_networks: PropTypes.arrayOf(PropTypes.string).isRequired,
        cartTotals: TotalsType.isRequired,
        default_title: PropTypes.string,
        customer: customerType
    };

    static defaultProps = {
        customer: null,
        default_title: '6th Street',
        merchant_id: '',
        validateApplePay: () => {},
        placeOrder: () => {}
    };

    /**
     * Container methods that should be available on component
     * @type {*}
     */
    containerMethods = {
        requestConfig: this.requestConfig.bind(this),
        launchPaymentMethod: this.launchPaymentMethod.bind(this),
        handleApplePayButtonClick: this.handleApplePayButtonClick.bind(this)
    };

    /**
     * Constructor
     * @param props
     * @param context
     */
    constructor(props, context) {
        super(props, context);

        this.state = {
            isApplePayAvailable: !!window.ApplePaySession,
            applePayDisabled: true,
            isLoading: true,
            merchant_id: null,
            supported_networks: null
        };
    }

    /**
     * Get quest quote id
     * @returns {string}
     * @private
     */
    _getGuestQuoteId = () => (isSignedIn() ? '' : CartDispatcher._getGuestQuoteId());

    /**
     * Load configuration
     * @return {Promise<Request>}
     */
    requestConfig() {
        const promise = fetchQuery(CheckoutComQuery.getApplePayConfigQuery());

        promise.then(
            ({ storeConfig: { checkout_com: { apple_pay } } }) => {
                this.setState({
                    isLoading: false,
                    ...apple_pay
                });
            },
            () => this.setState({ isLoading: false })
        );

        return promise;
    }

    /**
     * Launch payment method
     */
    launchPaymentMethod() {
        const { showError } = this.props;
        const { isApplePayAvailable, merchant_id } = this.state;

        if (!isApplePayAvailable) {
            const missingApplePayMessage = 'Apple Pay is not available for this browser.';

            showError(__(missingApplePayMessage));
            Logger.log(missingApplePayMessage);

            return;
        }

        new Promise((resolve) => {
            resolve(window.ApplePaySession.canMakePaymentsWithActiveCard(merchant_id));
        }).then((canMakePayments) => {
            if (canMakePayments) {
                this.setState({ applePayDisabled: false });
            } else {
                const missingApplePayMessage = 'Apple Pay is available but not currently active.';

                showError(__(missingApplePayMessage));
                Logger.log(missingApplePayMessage);
            }
        }).catch((error) => {
            showError(__('Something went wrong!'));
            Logger.log(error);
        });
    }

    /**
     * Handle apple pay click
     */
    handleApplePayButtonClick() {
        const {
            cartTotals: {
                total,
                quote_currency_code
            },
            default_title,
            billingAddress: {
                country_id: countryCode
            }
        } = this.props;
        const paymentRequest = {
            countryCode,
            currencyCode: quote_currency_code,
            supportedNetworks: this._getSupportedNetworks(),
            merchantCapabilities: this._getMerchantCapabilities(),
            total: { label: default_title, amount: total }
        };
        const applePaySession = new window.ApplePaySession(1, paymentRequest);

        this._addApplePayEvents(applePaySession);

        applePaySession.begin();
    }

    /**
     * Add apple pay button events
     * @param applePaySession
     */
    _addApplePayEvents = (applePaySession) => {
        const {
            billingAddress: { email },
            cartTotals: { total: grand_total },
            customer: { email: customerEmail },
            showError,
            default_title,
            placeOrder
        } = this.props;

        applePaySession.onvalidatemerchant = (event) => {
            const promise = this._performValidation(event.validationURL);

            promise.then((response) => {
                const {
                    verifyCheckoutComApplePay: merchantSession,
                    verifyCheckoutComApplePay: { statusMessage = '' }
                } = response;

                if (statusMessage) {
                    showError(__(statusMessage));
                    Logger.log('Cannot validate merchant:', merchantSession);

                    return;
                }

                applePaySession.completeMerchantValidation(merchantSession);
            }).catch((error) => Logger.log(error));
        };

        applePaySession.onshippingcontactselected = () => {
            const status = window.ApplePaySession.STATUS_SUCCESS;
            const newTotal = {
                type: 'final',
                label: default_title,
                amount: grand_total
            };

            applePaySession.completeShippingContactSelection(status, [], newTotal, this._getLineItems());
        };

        applePaySession.onshippingmethodselected = () => {
            const status = window.ApplePaySession.STATUS_SUCCESS;
            const newTotal = {
                type: 'final',
                label: default_title,
                amount: grand_total
            };

            applePaySession.completeShippingMethodSelection(status, newTotal, this._getLineItems());
        };

        applePaySession.onpaymentmethodselected = () => {
            const newTotal = {
                type: 'final',
                label: default_title,
                amount: grand_total
            };

            applePaySession.completePaymentMethodSelection(newTotal, this._getLineItems());
        };

        applePaySession.onpaymentauthorized = (event) => {
            tokenize(
                {
                    type: 'applepay',
                    token_data: event.payment.token.paymentData
                }
            ).then((response) => {
                if (response && response.token) {
                    const data = {
                        source: {
                            type: 'token',
                            token: response.token
                        },
                        customer: {
                            email: customerEmail ?? email
                        },
                        '3ds': {
                            enabled: false
                        },
                        metadata: {
                            udf1: null
                        }
                    };

                    const status = placeOrder(CHECKOUT_APPLE_PAY, data)
                        ? window.ApplePaySession.STATUS_SUCCESS
                        : window.ApplePaySession.STATUS_FAILURE;

                    console.log('***', status);
                    applePaySession.completePayment(status);

                    console.log('***', 'Payment authorize completed');
                }
            });
        };

        applePaySession.oncancel = () => Logger.log('Apple Pay session was cancelled.');
    };

    /**
     * Get supported networks
     * @return {array}
     */
    _getSupportedNetworks = () => {
        const { supported_networks = '' } = this.state;

        return supported_networks.split(',');
    };

    /**
     * Get merchant capabilities
     * @return {array}
     */
    _getMerchantCapabilities = () => {
        const { merchant_capabilities } = this.state;
        const output = ['supports3DS'];
        const capabilities = merchant_capabilities.split(',');

        return output.concat(capabilities);
    };

    /**
     * Get line items
     * @returns {*[]}
     */
    _getLineItems = () => [];

    /**
     * Get apple pay validation
     * @param validationUrl
     * @returns {Promise<Request>}
     */
    _performValidation = (validationUrl) => {
        this.setState({ isLoading: true });
        const mutation = CheckoutComQuery.getVerifyCheckoutComApplePayQuery(validationUrl);

        return fetchMutation(mutation).finally(() => this.setState({ isLoading: false }));
    };

    /**
     * Render
     * @returns {*}
     */
    render() {
        const { isApplePayAvailable } = this.state;

        if (!isApplePayAvailable) {
            return null;
        }

        return (
            <CheckoutComApplePay
              { ...this.containerMethods }
              { ...this.state }
              { ...this.props }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutComApplePayContainer);
