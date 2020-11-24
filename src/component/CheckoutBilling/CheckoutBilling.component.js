/* eslint-disable jsx-a11y/control-has-associated-label */
import PropTypes from 'prop-types';

import CartCoupon from 'Component/CartCoupon';
import CheckoutAddressBook from 'Component/CheckoutAddressBook';
import CheckoutPayments from 'Component/CheckoutPayments';
import CreditCardTooltip from 'Component/CreditCardTooltip';
import Field from 'Component/Field';
import Form from 'Component/Form';
import MyAccountAddressPopup from 'Component/MyAccountAddressPopup';
import { BILLING_STEP } from 'Route/Checkout/Checkout.config';
import {
    CheckoutBilling as SourceCheckoutBilling
} from 'SourceComponent/CheckoutBilling/CheckoutBilling.component';
import { isArabic } from 'Util/App';
import { isSignedIn } from 'Util/Auth';

import './CheckoutBilling.extended.style';

export class CheckoutBilling extends SourceCheckoutBilling {
    static propTypes = {
        ...SourceCheckoutBilling.propTypes,
        setTabbyWebUrl: PropTypes.func.isRequired,
        setCreditCardData: PropTypes.func.isRequired,
        showCreateNewPopup: PropTypes.func.isRequired,
        processingRequest: PropTypes.bool.isRequired
    };

    state = {
        isOrderButtonVisible: true,
        isOrderButtonEnabled: true,
        isTermsAndConditionsAccepted: false,
        isArabic: isArabic(),
        formContent: false,
        isSignedIn: isSignedIn()
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

    openForm() {
        this.setState({ formContent: true });
    }

    closeForm = () => {
        this.setState({ formContent: false });
    };

    renderAddAdress() {
        const { formContent, isArabic } = this.state;
        const { customer } = this.props;
        return (
            <div block="CheckoutBilling" elem="AddAddressWrapper">
                <div block="MyAccountAddressBook" elem="ContentWrapper" mods={ { formContent } }>
                    <button
                      type="button"
                      block="MyAccountAddressBook"
                      elem="backButton"
                      mods={ { isArabic } }
                      onClick={ this.showCards }
                    />
                    <MyAccountAddressPopup
                      formContent={ formContent }
                      closeForm={ this.closeForm }
                      openForm={ this.openForm }
                      showCards={ this.showCards }
                      customer={ customer }
                    />
                </div>
            </div>
        );
    }

    hideCards = () => {
        this.setState({ hideCards: true });
    };

    showCards = () => {
        this.closeForm();
        this.setState({ hideCards: false });
    };

    openNewForm = () => {
        const { showCreateNewPopup } = this.props;
        this.openForm();
        showCreateNewPopup();
    };

    renderButtonLabel() {
        const { isMobile } = this.state;

        return isMobile ? __('New address') : __('Add new address');
    }

    renderOpenPopupButton = () => {
        const { isSignedIn, formContent, isArabic } = this.state;
        const { customer: { addresses } } = this.props;

        if (addresses && (isSignedIn && addresses.length === 0)) {
            return this.openNewForm();
        }

        if (isSignedIn) {
            return (
                <div
                  block="MyAccountAddressBook"
                  elem="NewAddressWrapper"
                  mods={ { formContent, isArabic } }
                >
                    <button
                      type="button"
                      block="MyAccountAddressBook"
                      elem="NewAddress"
                      onClick={ this.openNewForm }
                    >
                        { this.renderButtonLabel() }
                    </button>
                </div>
            );
        }

        return null;
    };

    renderAddressBook() {
        const {
            onAddressSelect,
            isSameAsShipping,
            totals: { is_virtual }
        } = this.props;

        if (isSameAsShipping && !is_virtual) {
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
            { __('Add') }
            <span> </span>
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
        const { isSignedIn } = this.state;

        if (is_virtual) {
            return null;
        }

        return isSignedIn ? (
            <Field
              id="sameAsShippingAddress"
              name="sameAsShippingAddress"
              type="toggle"
              label={ this.renderDifferentBillingLabel() }
              value="sameAsShippingAddress"
              mix={ { block: 'CheckoutBilling', elem: 'Checkbox' } }
              checked={ !isSameAsShipping }
              onChange={ onSameAsShippingChange }
            />
        ) : null;
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

        const { termsAreEnabled, processingRequest } = this.props;

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
                      disabled={ isDisabled || processingRequest }
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
            <div block="CheckoutBilling" elem="AddressHeader">
            <h2 block="CheckoutBilling" elem="AddressHeading">
                { __('Billing Address') }
            </h2>
            { this.renderOpenPopupButton() }
            </div>
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

    renderCartCoupon() {
        const { totals: { coupon_code } } = this.props;

        return (
            <div block="CheckoutPayments" elem="CartCouponWrapper">
                <CartCoupon couponCode={ coupon_code } />
            </div>
        );
    }

    render() {
        const { onBillingSuccess, onBillingError, isSameAsShipping } = this.props;
        const { formContent } = this.state;

        return formContent ? this.renderAddAdress() : (
            <>
                <Form
                  mix={ { block: 'CheckoutBilling' } }
                  id={ BILLING_STEP }
                  onSubmitError={ onBillingError }
                  onSubmitSuccess={ onBillingSuccess }
                >
                    { this.renderAddresses() }
                    { isSameAsShipping ? null
                        : (
                            <div block="CheckoutBilling" elem="Line">
                                <hr />
                            </div>
                        ) }
                    { this.renderPayments() }
                    { this.renderTermsAndConditions() }
                    { this.renderActions() }
                    { this.renderPopup() }
                </Form>
                { this.renderCartCoupon() }
            </>
        );
    }
}

export default CheckoutBilling;
