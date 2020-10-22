import CheckoutBilling from 'Component/CheckoutBilling';
import CheckoutOrderSummary from 'Component/CheckoutOrderSummary';
import CheckoutShipping from 'Component/CheckoutShipping';
import { Checkout as SourceCheckout } from 'SourceRoute/Checkout/Checkout.component';

import './Checkout.style';

export class Checkout extends SourceCheckout {
  state = {
      isCustomAddressExpanded: false,
      cashOnDeliveryFee: null
  };

  callbackFunction = (childData) => {
      this.setState({ isCustomAddressExpanded: childData });
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
          paymentMethods = [],
          savePaymentInformation
      } = this.props;

      return (
          <CheckoutBilling
            setLoading={ setLoading }
            paymentMethods={ paymentMethods }
            setDetailsStep={ setDetailsStep }
            shippingAddress={ shippingAddress }
            savePaymentInformation={ savePaymentInformation }
            setCashOnDeliveryFee={ this.setCashOnDeliveryFee }
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
}

export default Checkout;
