import { getStore } from 'Store';
import { setShipping } from 'Store/Checkout/Checkout.action';
import { showNotification } from 'Store/Notification/Notification.action';
import {
    createOrder,
    estimateShippingMethods,
    getPaymentMethods,
    saveShippingInformation,
    selectPaymentMethod,
    validateShippingAddress
} from 'Util/API/endpoint/Checkout/Checkout.enpoint';
import {
    createSession,
    getInstallmentForValue,
    verifyPayment
} from 'Util/API/endpoint/Tabby/Tabby.enpoint';
import Logger from 'Util/Logger';

export class CheckoutDispatcher {
    /* eslint-disable-next-line */
    async estimateShipping(dispatch, address) {
        const { Cart: { cartId } } = getStore().getState();
        const { area, street } = address;
        try {
            const response = await validateShippingAddress({ address });
            const { success: isAddressValid } = response;

            if (!isAddressValid && (area !== undefined || street !== undefined)) {
                const { error: { parameters } } = response;
                const message = parameters.length > 1
                    ? `(${parameters}) ${__('fields are not valid')}`
                    : `(${parameters}) ${__('field is not valid')}`;

                dispatch(showNotification('error', message));
            }
            if (isAddressValid) {
                return await estimateShippingMethods({ cartId, address });
            }
        } catch (e) {
            dispatch(showNotification('error', __('The address or phone field is incorrect')));
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

    async getPaymentMethods() {
        return getPaymentMethods();
    }

    async getTabbyInstallment(dispatch, price) {
        return getInstallmentForValue(price);
    }

    async createTabbySession(dispatch, billingData) {
        const { Cart: { cartId } } = getStore().getState();

        const {
            email, firstname, lastname, phone, city, street
        } = billingData;

        return createSession({
            cart_id: cartId.toString(),
            buyer: {
                email,
                name: `${firstname} ${lastname}`,
                phone,
                city,
                address: street
            }
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

    async verifyPayment(dispatch, paymentId) {
        return verifyPayment(paymentId);
    }
}

export default new CheckoutDispatcher();
