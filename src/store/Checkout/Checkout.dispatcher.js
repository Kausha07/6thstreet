/* eslint-disable */
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
    getInstallmentForValue,
    verifyPayment
} from 'Util/API/endpoint/Tabby/Tabby.enpoint';
import Logger from 'Util/Logger';
import { TABBY_PAYMENT_CODES } from "Component/CheckoutPayments/CheckoutPayments.config";

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
