import CheckoutShipping from 'Component/CheckoutShipping';
import { Checkout as SourceCheckout } from 'SourceRoute/Checkout/Checkout.component';

import './Checkout.style';

export class Checkout extends SourceCheckout {
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
            />
        );
    }
}

export default Checkout;
