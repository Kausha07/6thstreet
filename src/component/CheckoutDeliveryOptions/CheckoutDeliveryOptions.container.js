import {
    CheckoutDeliveryOptionsContainer as SourceCheckoutDeliveryOptionsContainer
} from 'SourceComponent/CheckoutDeliveryOptions/CheckoutDeliveryOptions.container';

export class CheckoutDeliveryOptionsContainer extends SourceCheckoutDeliveryOptionsContainer {
    static getDerivedStateFromProps(props, state) {
        const { shippingMethods = [] } = props;
        const { prevShippingMethods = [] } = state;
        console.log('***', prevShippingMethods);
        console.log('***', shippingMethods);
        if (shippingMethods.length !== prevShippingMethods.length) {
            const selectedShippingMethodCode = CheckoutDeliveryOptionsContainer._getDefaultMethod(props);

            return {
                selectedShippingMethodCode,
                prevShippingMethods: shippingMethods
            };
        }

        return null;
    }
}

export default CheckoutDeliveryOptionsContainer;
