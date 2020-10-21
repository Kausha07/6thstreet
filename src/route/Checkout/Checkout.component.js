import CheckoutShipping from 'Component/CheckoutShipping';
import { Checkout as SourceCheckout } from 'SourceRoute/Checkout/Checkout.component';
import isMobile from 'Util/Mobile';

import './Checkout.style';

export class Checkout extends SourceCheckout {
  state = {
      isCustomAddressExpanded: false
  };

  callbackFunction = (childData) => {
      this.setState({ isCustomAddressExpanded: childData });
  };

  renderTitle() {
      const { checkoutStep } = this.props;
      const { isCustomAddressExpanded } = this.state;

      if (isMobile.any() || isMobile.tablet()) {
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

      return null;
  }

  renderShippingStep() {
      const {
          shippingMethods,
          onShippingEstimationFieldsChange,
          saveAddressInformation,
          isDeliveryOptionsLoading,
          email
      } = this.props;

      return (
            <CheckoutShipping
              isLoading={ isDeliveryOptionsLoading }
              shippingMethods={ shippingMethods }
              saveAddressInformation={ saveAddressInformation }
              onShippingEstimationFieldsChange={ onShippingEstimationFieldsChange }
              guestEmail={ email }
              parentCallback={ this.callbackFunction }
            />
      );
  }
}

export default Checkout;
