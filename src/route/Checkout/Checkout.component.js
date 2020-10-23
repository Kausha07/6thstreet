/* eslint-disable no-magic-numbers */
import CheckoutBilling from 'Component/CheckoutBilling';
import CheckoutOrderSummary from 'Component/CheckoutOrderSummary';
import CheckoutShipping from 'Component/CheckoutShipping';
import ContentWrapper from 'Component/ContentWrapper';
import TabbyPopup from 'Component/TabbyPopup';
import { Checkout as SourceCheckout } from 'SourceRoute/Checkout/Checkout.component';

import { AUTHORIZED_STATUS } from './Checkout.config';

import './Checkout.style';

export class Checkout extends SourceCheckout {
    state = {
        isCustomAddressExpanded: false,
        tabbyWebUrl: '',
        tabbyPaymentId: '',
        tabbyPaymentStatus: '',
        isTabbyPopupShown: false,
        cashOnDeliveryFee: null
    };

    callbackFunction = (childData) => {
        this.setState({ isCustomAddressExpanded: childData });
    };

    savePaymentInformation = (paymentInformation) => {
        const { savePaymentInformation } = this.props;
        const { tabbyWebUrl, tabbyPaymentStatus } = this.state;

        if (tabbyWebUrl) {
            this.setState({ isTabbyPopupShown: true });
            setTimeout(
                () => this.processTabbyWithTimeout(3, paymentInformation),
                10000
            );
        } else {
            savePaymentInformation(paymentInformation);
        }

        return null;
    };

    processTabby(paymentInformation) {
        const { savePaymentInformation, verifyPayment } = this.props;
        const { tabbyPaymentId } = this.state;

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
        const { showErrorNotification, hideActiveOverlay } = this.props;

        if (tabbyPaymentStatus !== AUTHORIZED_STATUS && counter < 60) {
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
            this.setState({ isTabbyPopupShown: false });
        }
    }

    setTabbyWebUrl = (url, paymentId) => {
        this.setState({ tabbyWebUrl: url, tabbyPaymentId: paymentId });
    };

    setCashOnDeliveryFee = (fee) => {
        this.setState({ cashOnDeliveryFee: fee });
    };

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
        const { checkoutStep } = this.props;
        const { isCustomAddressExpanded } = this.state;

        return (
            <div block="CheckoutNavigation" mods={ { isCustomAddressExpanded } }>
                <div block="CheckoutNavigation" elem="FirstColumn">
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
            checkoutTotals
        } = this.props;

        return (
            <CheckoutShipping
              isLoading={ isDeliveryOptionsLoading }
              shippingMethods={ shippingMethods }
              saveAddressInformation={ saveAddressInformation }
              onShippingEstimationFieldsChange={ onShippingEstimationFieldsChange }
              guestEmail={ email }
              totals={ checkoutTotals }
              parentCallback={ this.callbackFunction }
            />
        );
    }

    renderTabbyIframe() {
        const { isTabbyPopupShown, tabbyWebUrl } = this.state;

        if (!isTabbyPopupShown) {
            return null;
        }

        return (
            <TabbyPopup
              tabbyWebUrl={ tabbyWebUrl }
            />
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
