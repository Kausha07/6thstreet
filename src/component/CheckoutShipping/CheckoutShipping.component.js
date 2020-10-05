import CheckoutDeliveryOptions from 'Component/CheckoutDeliveryOptions';
import {
    CheckoutShipping as SourceCheckoutShipping
} from 'SourceComponent/CheckoutShipping/CheckoutShipping.component';

export class CheckoutShipping extends SourceCheckoutShipping {
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
