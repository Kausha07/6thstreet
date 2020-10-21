import { getStore } from 'Store';
import { setShipping } from 'Store/Checkout/Checkout.action';
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
    getInstallmentForValue
} from 'Util/API/endpoint/Tabby/Tabby.enpoint';
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

    async getPaymentMethods() {
        return getPaymentMethods();
    }

    async getTabbyInstallment(dispatch, price) {
        return getInstallmentForValue(price);
    }

    async selectPaymentMethod(dispatch, billingData) {
        const { Cart: { cartId } } = getStore().getState();
        const { code } = billingData;
        const tabbyPaymentCodes = ['tabby_checkout', 'tabby_installments'];

        const result = selectPaymentMethod({
            cartId,
            data: {
                method: code,
                cart_id: cartId
            }
        });

        if (tabbyPaymentCodes.includes(code)) {
            const {
                billingAddress: {
                    email, firstname, lastname, phone, city, street
                }
            } = billingData;

            return createSession({
                cart_id: cartId,
                buyer: {
                    email,
                    name: `${firstname} ${lastname}`,
                    phone,
                    city,
                    address: street
                }
            });
        }

        return result;
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
