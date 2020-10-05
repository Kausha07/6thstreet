import { getStore } from 'Store';
import { setShipping } from 'Store/Checkout/Checkout.action';
import {
    estimateShippingMethods,
    saveShippingInformation,
    validateShippingAddress
} from 'Util/API/endpoint/Checkout/Checkout.enpoint';
import Logger from 'Util/Logger';

export class CheckoutDispatcher {
    /* eslint-disable-next-line */
    async estimateShipping(dispatch, address) {
        const { Cart: { cartId } } = getStore().getState();

        try {
            const { success: isAddressValid } = await validateShippingAddress({ address });

            if (isAddressValid) {
                return await estimateShippingMethods({ cartId, address });
            }
        } catch (e) {
            Logger.log(e);
        }
    }

    async saveAddressInformation(dispatch, address) {
        const { Cart: { cartId } } = getStore().getState();

        dispatch(setShipping({}));

        return saveShippingInformation({
            cartId,
            data: address
        });
    }
}

export default new CheckoutDispatcher();
