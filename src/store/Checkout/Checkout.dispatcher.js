import { getStore } from 'Store';
import { setShipping } from 'Store/Checkout/Checkout.action';
// import { showNotification } from 'Store/Notification/Notification.action';
import {
    estimateShippingMethods
} from 'Util/API/endpoint/Checkout/Checkout.enpoint';
import Logger from 'Util/Logger';

export class CheckoutDispatcher {
    async estimateShipping(dispatch, address) {
        console.log('***', 'TEST');

        const { MobileCart: { cartId } } = getStore().getState();

        try {
            console.log('*** Will estimate shipping...');

            const res = await estimateShippingMethods({ cartId, address });

            console.log('*** SHIPPING:', res);

            dispatch(setShipping({}));
        } catch (e) {
            Logger.log(e);
        }
    }
}

export default new CheckoutDispatcher();
