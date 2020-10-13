import CheckoutDeliveryOptions from 'Component/CheckoutDeliveryOptions';
import {
    CheckoutShipping as SourceCheckoutShipping
} from 'SourceComponent/CheckoutShipping/CheckoutShipping.component';
import isMobile from 'Util/Mobile';

export class CheckoutShipping extends SourceCheckoutShipping {
    renderButtonsPlaceholder() {
        return isMobile.any() || isMobile.tablet()
            ? __('Proceed to secure payment')
            : __('Place order');
    }

    renderActions() {
        const { selectedShippingMethod } = this.props;

        return (
            <div block="Checkout" elem="StickyButtonWrapper">
                <button
                  type="submit"
                  block="Button"
                  disabled={ !selectedShippingMethod }
                  mix={ { block: 'CheckoutShipping', elem: 'Button' } }
                >
                    { this.renderButtonsPlaceholder() }
                </button>
            </div>
        );
    }

    renderDelivery() {
        const {
            shippingMethods,
            onShippingMethodSelect
        } = this.props;

        return (
            <CheckoutDeliveryOptions
              shippingMethods={ shippingMethods }
              onShippingMethodSelect={ onShippingMethodSelect }
            />
        );
    }
}

export default CheckoutShipping;
