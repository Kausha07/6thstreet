/* eslint-disable no-magic-numbers */
import PropTypes from 'prop-types';

import CheckoutBilling from 'Component/CheckoutBilling';
import CheckoutGuestForm from 'Component/CheckoutGuestForm';
import CheckoutOrderSummary from 'Component/CheckoutOrderSummary';
import {
    TABBY_ISTALLMENTS,
    TABBY_PAY_LATER,
    TABBY_PAYMENT_CODES
} from 'Component/CheckoutPayments/CheckoutPayments.config';
import CheckoutShipping from 'Component/CheckoutShipping';
import ContentWrapper from 'Component/ContentWrapper';
import TabbyPopup from 'Component/TabbyPopup';
import { TABBY_POPUP_ID } from 'Component/TabbyPopup/TabbyPopup.config';
import Loader from 'SourceComponent/Loader';
import { Checkout as SourceCheckout } from 'SourceRoute/Checkout/Checkout.component';
import { isArabic } from 'Util/App';

import {
    AUTHORIZED_STATUS,
    BILLING_STEP,
    CHECKOUT_URL
} from './Checkout.config';

import './Checkout.style';

export class Checkout extends SourceCheckout {
    static propTypes = {
        isSignedIn: PropTypes.bool.isRequired
    };

    state = {
        cashOnDeliveryFee: null,
        isCustomAddressExpanded: false,
        continueAsGuest: false,
        isInvalidEmail: false,
        isArabic: isArabic(),
        tabbyInstallmentsUrl: '',
        tabbyPayLaterUrl: '',
        tabbyPaymentId: '',
        tabbyPaymentStatus: '',
        isTabbyPopupShown: false
    };

    savePaymentInformation = (paymentInformation) => {
        const { savePaymentInformation, showErrorNotification } = this.props;
        const { selectedPaymentMethod, tabbyInstallmentsUrl, tabbyPayLaterUrl } = this.state;

        if (TABBY_PAYMENT_CODES.includes(selectedPaymentMethod)) {
            if (tabbyInstallmentsUrl || tabbyPayLaterUrl) {
                this.setState({ isTabbyPopupShown: true });

                // Need to get payment data from Tabby.
                // Could not get callback of Tabby another way because Tabby is iframe in iframe
                setTimeout(
                    () => this.processTabbyWithTimeout(3, paymentInformation),
                    10000
                );
            } else {
                showErrorNotification(__('Something went wrong with Tabby'));
            }
        } else {
            savePaymentInformation(paymentInformation);
        }

        return null;
    };

    processTabby(paymentInformation) {
        const { savePaymentInformation, verifyPayment, checkoutStep } = this.props;
        const { tabbyPaymentId } = this.state;

        if (checkoutStep !== BILLING_STEP) {
            return;
        }

        verifyPayment(tabbyPaymentId).then(
            ({ status }) => {
                if (status === AUTHORIZED_STATUS) {
                    savePaymentInformation(paymentInformation);
                }

                this.setState({ tabbyPaymentStatus: status });
            }
        );
    }

    processTabbyWithTimeout(counter, paymentInformation) {
        const { tabbyPaymentStatus } = this.state;
        const { showErrorNotification, hideActiveOverlay, activeOverlay } = this.props;

        // Need to get payment data from Tabby.
        // Could not get callback of Tabby another way because Tabby is iframe in iframe
        if (tabbyPaymentStatus !== AUTHORIZED_STATUS && counter < 60 && activeOverlay === TABBY_POPUP_ID) {
            setTimeout(
                () => {
                    this.processTabby(paymentInformation);
                    this.processTabbyWithTimeout(counter + 1, paymentInformation);
                },
                5000
            );
        }

        if (counter === 60) {
            showErrorNotification('Tabby session timeout');
            hideActiveOverlay();
        }

        if (counter === 60 || activeOverlay !== TABBY_POPUP_ID) {
            this.setState({ isTabbyPopupShown: false });
        }
    }

    setTabbyWebUrl = (url, paymentId, type) => {
        this.setState({ tabbyPaymentId: paymentId });
        switch (type) {
        case TABBY_ISTALLMENTS:
            this.setState({ tabbyInstallmentsUrl: url });

            break;
        case TABBY_PAY_LATER:
            this.setState({ tabbyPayLaterUrl: url });

            break;
        default:
            break;
        }
    };

    setPaymentCode = (code) => {
        this.setState({ selectedPaymentMethod: code });
    };

    setCashOnDeliveryFee = (fee) => {
        this.setState({ cashOnDeliveryFee: fee });
    };

    renderLoader() {
        const { isLoading, checkoutStep } = this.props;
        if (checkoutStep === BILLING_STEP && isLoading) {
            return (
                <div block="CheckoutSuccess">
                    <div block="LoadingOverlay">
                        <p>
                            { __('Processing Your Order') }
                        </p>
                    </div>
                </div>
            );
        }

        return <Loader isLoading={ isLoading } />;
    }

    renderSummary() {
        const { cashOnDeliveryFee } = this.state;
        const { checkoutTotals, checkoutStep, paymentTotals } = this.props;
        const { areTotalsVisible } = this.stepMap[checkoutStep];

        if (!areTotalsVisible) {
            return null;
        }

        return (
          <CheckoutOrderSummary
            checkoutStep={ checkoutStep }
            totals={ checkoutTotals }
            paymentTotals={ paymentTotals }
            cashOnDeliveryFee={ cashOnDeliveryFee }
          />
        );
    }

    renderTitle() {
        const { checkoutStep, isSignedIn } = this.props;
        const { isCustomAddressExpanded, continueAsGuest } = this.state;
        const url = `${ CHECKOUT_URL }/shipping`;

        return ((isSignedIn || continueAsGuest)
          && (
            <div block="CheckoutNavigation" mods={ { isCustomAddressExpanded } }>
                <div
                  block="CheckoutNavigation"
                  elem="FirstColumn"
                  mods={ { checkoutStep } }
                >
                    <a href={ url }>
                        <div
                          block="CheckoutNavigation"
                          elem="Delivery"
                          mods={ { checkoutStep } }
                        />
                        <span
                          block="CheckoutNavigation"
                          elem="DeliveryLabel"
                          mods={ { checkoutStep } }
                        >
                            { __('Delivery') }
                        </span>
                    </a>
                </div>
                <hr />
                <div block="CheckoutNavigation" elem="SecondColumn">
                    <div
                      block="CheckoutNavigation"
                      elem="Payment"
                      mods={ { checkoutStep } }
                    />
                    <span
                      block="CheckoutNavigation"
                      elem="PaymentLabel"
                      mods={ { checkoutStep } }
                    >
                        { __('Payment') }
                    </span>
                </div>
            </div>
          )
        );
    }

    renderBillingStep() {
        const {
            setLoading,
            setDetailsStep,
            shippingAddress,
            paymentMethods = []
        } = this.props;

        return (
          <CheckoutBilling
            setLoading={ setLoading }
            paymentMethods={ paymentMethods }
            setDetailsStep={ setDetailsStep }
            shippingAddress={ shippingAddress }
            setCashOnDeliveryFee={ this.setCashOnDeliveryFee }
            savePaymentInformation={ this.savePaymentInformation }
            setTabbyWebUrl={ this.setTabbyWebUrl }
            setPaymentCode={ this.setPaymentCode }
          />
        );
    }

    continueAsGuest = () => {
        const { email } = this.props;

        if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            this.setState({ isInvalidEmail: false });
            this.setState({ continueAsGuest: true });
        } else {
            this.setState({ isInvalidEmail: true });
        }
    };

    changeEmail = () => {
        this.setState({ continueAsGuest: false });
    };

    renderHeading(text, isDisabled) {
        return (
        <h2 block="Checkout" elem="Heading" mods={ { isDisabled } }>
            { __(text) }
        </h2>
        );
    }

    renderGuestForm() {
        const {
            checkoutStep,
            isCreateUser,
            onEmailChange,
            onCreateUserChange,
            onPasswordChange,
            isGuestEmailSaved,
            isLoading
        } = this.props;
        const { continueAsGuest, isInvalidEmail } = this.state;
        const isBilling = checkoutStep === BILLING_STEP;

        return (
            <CheckoutGuestForm
              isLoading={ isLoading }
              isBilling={ isBilling }
              isCreateUser={ isCreateUser }
              onEmailChange={ onEmailChange }
              onCreateUserChange={ onCreateUserChange }
              onPasswordChange={ onPasswordChange }
              isGuestEmailSaved={ isGuestEmailSaved }
              isEmailAdded={ continueAsGuest }
              isInvalidEmail={ isInvalidEmail }
            />
        );
    }

    renderTabbyIframe() {
        const {
            isTabbyPopupShown,
            tabbyInstallmentsUrl,
            tabbyPayLaterUrl,
            selectedPaymentMethod
        } = this.state;

        if (!isTabbyPopupShown) {
            return null;
        }

        return (
          <TabbyPopup
            tabbyWebUrl={ selectedPaymentMethod === TABBY_ISTALLMENTS ? tabbyInstallmentsUrl : tabbyPayLaterUrl }
          />
        );
    }

    renderShippingStep() {
        const {
            shippingMethods,
            onShippingEstimationFieldsChange,
            saveAddressInformation,
            isDeliveryOptionsLoading,
            email,
            checkoutTotals,
            isSignedIn
        } = this.props;

        const { continueAsGuest, isArabic } = this.state;
        const renderCheckoutShipping = (
          <div
            block="Checkout"
            elem="Shipping"
            mods={ isSignedIn }
          >
            { continueAsGuest ? this.renderHeading('Login / Sign Up', true) : null }
            <CheckoutShipping
              isLoading={ isDeliveryOptionsLoading }
              shippingMethods={ shippingMethods }
              saveAddressInformation={ saveAddressInformation }
              onShippingEstimationFieldsChange={ onShippingEstimationFieldsChange }
              guestEmail={ email }
              totals={ checkoutTotals }
            />
          </div>
        );

        return (
            <>
              <div
                block="Checkout"
                elem="GuestButton"
                mods={ { continueAsGuest, isSignedIn, isArabic } }
              >
                <button onClick={ continueAsGuest ? this.changeEmail : this.continueAsGuest }>
                  { continueAsGuest ? <span>{ __('Edit') }</span> : <span>{ __('Continue as guest') }</span> }
                </button>
                { continueAsGuest ? renderCheckoutShipping : null }
              </div>
              { isSignedIn ? renderCheckoutShipping : null }
              { continueAsGuest || isSignedIn ? null : this.renderHeading('Shipping Options', true) }
              { continueAsGuest || isSignedIn ? null : this.renderHeading('Delivery Options', true) }
              { continueAsGuest || isSignedIn ? null : this.renderHeading('Payment Options', true) }
            </>
        );
    }

    render() {
        return (
          <main block="Checkout">
              <ContentWrapper
                wrapperMix={ { block: 'Checkout', elem: 'Wrapper' } }
                label={ __('Checkout page') }
              >
                  <div block="Checkout" elem="Step">
                      { this.renderTitle() }
                      { this.renderGuestForm() }
                      { this.renderStep() }
                      { this.renderLoader() }
                  </div>
                  <div>
                      { this.renderSummary() }
                      { this.renderPromo() }
                      { this.renderTabbyIframe() }
                  </div>
              </ContentWrapper>
          </main>
        );
    }
}

export default Checkout;
