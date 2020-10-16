import { getStore } from 'Store';
import { setShipping } from 'Store/Checkout/Checkout.action';
import {
    createOrder,
    estimateShippingMethods,
    saveShippingInformation,
    selectPaymentMethod,
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

    async selectPaymentMethod(dispatch, code) {
        const { Cart: { cartId } } = getStore().getState();

        return selectPaymentMethod({
            cartId,
            data: {
                method: code,
                cart_id: cartId
            }
        });
    }

    async createOrder(dispatch, code, additional_data) {
        const { Cart: { cartId } } = getStore().getState();

        return createOrder({
            data: {
                cart_id: cartId,
                payment: {
                    method: code,
                    data: additional_data
                }
            }
        });
    }
}

export default new CheckoutDispatcher();
