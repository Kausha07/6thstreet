import { getStore } from 'Store';
import { setShipping } from 'Store/Checkout/Checkout.action';
import {
    estimateShippingMethods,
    saveShippingInformation,
    validateShippingAddress
} from 'Util/API/endpoint/Checkout/Checkout.enpoint';
import Logger from 'Util/Logger';

export class CheckoutDispatcher {
    async estimateShipping(dispatch, address) {
        const { Cart: { cartId } } = getStore().getState();

        try {
            const { success: isAddressValid } = await validateShippingAddress({ address });

            if (isAddressValid) {
                const res = await estimateShippingMethods({ cartId, address });

                console.log('*** SHIPPING:', res);

                const rest = await saveShippingInformation({
                    cartId,
                    data: {
                        shipping_address: address,
                        billing_address: address,
                        shipping_carrier_code: 'fetchr',
                        shipping_method_code: 'fetchr'
                    }
                });

                console.log('***', rest);

                dispatch(setShipping({}));
            }
        } catch (e) {
            Logger.log(e);
        }
    }
}

export default new CheckoutDispatcher();
