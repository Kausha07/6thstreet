import PropTypes from 'prop-types';

import CheckoutAddressBook from 'Component/CheckoutAddressBook';
import CheckoutPayments from 'Component/CheckoutPayments';
import CreditCardTooltip from 'Component/CreditCardTooltip';
import Field from 'Component/Field';
import Form from 'Component/Form';
import { BILLING_STEP } from 'Route/Checkout/Checkout.config';
import {
    CheckoutBilling as SourceCheckoutBilling
} from 'SourceComponent/CheckoutBilling/CheckoutBilling.component';

import './CheckoutBilling.extended.style';

export class CheckoutBilling extends SourceCheckoutBilling {
    static propTypes = {
        ...SourceCheckoutBilling.propTypes,
        setTabbyWebUrl: PropTypes.func.isRequired,
        setCreditCardData: PropTypes.func.isRequired
    };

    renderPriceLine(price, name, mods) {
        const { totals: { currency_code } } = this.props;

        return (
            <li block="CheckoutOrderSummary" elem="SummaryItem" mods={ mods }>
                <strong block="CheckoutOrderSummary" elem="Text">
                    { name }
                </strong>
                    { price !== undefined
                        ? (
                        <strong block="CheckoutOrderSummary" elem="Price">
                            { `${currency_code } ${ price}` }
                        </strong>
                        )
                        : null }
            </li>
        );
    }

    renderAddressBook() {
        const {
            onAddressSelect,
            isSameAsShipping,
            totals: { is_virtual }
        } = this.props;

        if (!isSameAsShipping && !is_virtual) {
            return null;
        }

        return (
            <>
                { this.renderAddressHeading() }
                <CheckoutAddressBook
                  onAddressSelect={ onAddressSelect }
                  isBilling
                />
            </>
        );
    }

    renderDifferentBillingLabel = () => (
        <>
            { __('Add a different ') }
            <span>
                { __('Billing address') }
            </span>
        </>
    );

    renderSameAsShippingCheckbox() {
        const {
            isSameAsShipping,
            onSameAsShippingChange,
            totals: { is_virtual }
        } = this.props;

        if (is_virtual) {
            return null;
        }

        return (
            <Field
              id="sameAsShippingAddress"
              name="sameAsShippingAddress"
              type="toggle"
              label={ this.renderDifferentBillingLabel() }
              value="sameAsShippingAddress"
              mix={ { block: 'CheckoutBilling', elem: 'Checkbox' } }
              checked={ isSameAsShipping }
              onChange={ onSameAsShippingChange }
            />
        );
    }

    renderPayments() {
        const {
            paymentMethods,
            onPaymentMethodSelect,
            setLoading,
            setDetailsStep,
            shippingAddress,
            setTabbyWebUrl,
            setCashOnDeliveryFee,
            setCreditCardData
        } = this.props;

        if (!paymentMethods.length) {
            return null;
        }

        return (
            <CheckoutPayments
              setCashOnDeliveryFee={ setCashOnDeliveryFee }
              setLoading={ setLoading }
              setDetailsStep={ setDetailsStep }
              paymentMethods={ paymentMethods }
              onPaymentMethodSelect={ onPaymentMethodSelect }
              setOrderButtonVisibility={ this.setOrderButtonVisibility }
              billingAddress={ shippingAddress }
              setOrderButtonEnableStatus={ this.setOrderButtonEnableStatus }
              setTabbyWebUrl={ setTabbyWebUrl }
              setCreditCardData={ setCreditCardData }
              setOrderButtonDisabled={ this.setOrderButtonDisabled }
              setOrderButtonEnabled={ this.setOrderButtonEnabled }
            />
        );
    }

    renderTotals() {
        const {
            totals: { total }
        } = this.props;

        return (
            <div block="Checkout" elem="OrderTotals">
                { this.renderPriceLine(total, __('Total Amount')) }
            </div>
        );
    }

    renderCreditCardTooltipBar() {
        const {
            paymentMethods
        } = this.props;

        const {
            options: {
                promo_message: {
                    collapsed: { text } = {},
                    expanded
                } = {}
            }
        } = paymentMethods[0];

        return (
            expanded !== undefined
            && (
                <CreditCardTooltip
                  collapsedPromoMessage={ (text) }
                  expandedPromoMessage={ (expanded[0].value) }
                  bankLogos={ (expanded[1].value) }
                />
            )
        );
    }

    setOrderButtonDisabled = () => {
        this.setState({ isOrderButtonEnabled: false });
    };

    setOrderButtonEnabled = () => {
        this.setState({ isOrderButtonEnabled: true });
    };

    renderActions() {
        const {
            isOrderButtonVisible,
            isOrderButtonEnabled,
            isTermsAndConditionsAccepted
        } = this.state;

        const { termsAreEnabled } = this.props;

        if (!isOrderButtonVisible) {
            return null;
        }

        // if terms and conditions are enabled, validate for acceptance
        const isDisabled = termsAreEnabled
            ? !isOrderButtonEnabled || !isTermsAndConditionsAccepted
            : !isOrderButtonEnabled;

        return (
            <>
                { this.renderCreditCardTooltipBar() }
                <div block="Checkout" elem="StickyButtonWrapper">
                    { this.renderTotals() }
                    <button
                      type="submit"
                      block="Button"
                      disabled={ isDisabled }
                      mix={ { block: 'CheckoutBilling', elem: 'Button' } }
                    >
                        { __('Place order') }
                    </button>
                </div>
            </>
        );
    }

    renderAddressHeading() {
        return (
            <h2 block="CheckoutBilling" elem="AddressHeading">
                { __('Billing Address') }
            </h2>
        );
    }

    renderAddresses() {
        return (
            <>
                { this.renderSameAsShippingCheckbox() }
                { this.renderAddressBook() }
            </>
        );
    }

    render() {
        const { onBillingSuccess, onBillingError } = this.props;

        return (
            <Form
              mix={ { block: 'CheckoutBilling' } }
              id={ BILLING_STEP }
              onSubmitError={ onBillingError }
              onSubmitSuccess={ onBillingSuccess }
            >
                { this.renderAddresses() }
                <div block="CheckoutBilling" elem="Line">
                    <hr />
                </div>
                { this.renderPayments() }
                { this.renderTermsAndConditions() }
                { this.renderActions() }
                { this.renderPopup() }
            </Form>
        );
    }
}

export default CheckoutBilling;
