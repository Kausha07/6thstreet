import CheckoutBilling from 'Component/CheckoutBilling';
import CheckoutOrderSummary from 'Component/CheckoutOrderSummary';
import CheckoutShipping from 'Component/CheckoutShipping';
import ContentWrapper from 'Component/ContentWrapper';
import TabbyPopup from 'Component/TabbyPopup';
import { Checkout as SourceCheckout } from 'SourceRoute/Checkout/Checkout.component';

import './Checkout.style';

export class Checkout extends SourceCheckout {
    state = {
        isCustomAddressExpanded: false,
        tabbyWebUrl: '',
        isTabbyPopupShown: false,
        cashOnDeliveryFee: null
    };

    callbackFunction = (childData) => {
        this.setState({ isCustomAddressExpanded: childData });
    };

    savePaymentInformation = (paymentInformation) => {
        const { savePaymentInformation } = this.props;
        const { tabbyWebUrl } = this.state;

        if (tabbyWebUrl) {
            // TODO: Add response processing for the Tabby
            this.setState({ isTabbyPopupShown: true });
        } else {
            savePaymentInformation(paymentInformation);
        }

        return null;
    };

    setTabbyWebUrl = (url) => {
        this.setState({ tabbyWebUrl: url });
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
