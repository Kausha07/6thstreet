import { getStore } from "Store";
import { processingPaymentSelectRequest } from "Store/Cart/Cart.action";
import CartDispatcher from "Store/Cart/Cart.dispatcher";
import {
  setShipping,
  setCartTotal,
  setIsAddressSelected,
  setShipment,
  setCheckoutLoader,
  setProcessAddressChange,
} from "Store/Checkout/Checkout.action";
import { showNotification } from "Store/Notification/Notification.action";
import {
  createOrder,
  estimateShippingMethods,
  getLastOrder,
  getPaymentMethods,
  saveShippingInformation,
  selectPaymentMethod,
  sendVerificationCode,
  validateShippingAddress,
  addShippingAddress,
  updateShippingAddress,
  removeShippingAddress,
  getShippingAddresses,
  verifyUserPhone,
  getPaymentAuthorization,
  capturePayment,
  cancelOrder,
  getBinPromotion,
  removeBinPromotion,
  getPaymentAuthorizationQPay,
  getPaymentAuthorizationKNET,
  getShipment,
  updateShipment,
} from "Util/API/endpoint/Checkout/Checkout.endpoint";
import {
  createSession,
  getInstallmentForValue,
  verifyPayment,
  updateTabbyPayment,
} from "Util/API/endpoint/Tabby/Tabby.enpoint";
import { capitalize } from "Util/App";
import Logger from "Util/Logger";
import {
  getInstallmentForTamara,
  createSessionTamara,
  verifyTamaraPayment,
  updateTamaraPayment,
} from "Util/API/endpoint/Tamara/Tamara.endpoint";
import BrowserDatabase from "Util/BrowserDatabase";

export class CheckoutDispatcher {
  async validateAddress(dispatch, address) {
    /* eslint-disable */
    delete address.region_id;

    return validateShippingAddress({ address });
  }

  async addAddress(dispatch, address) {
    /* eslint-disable */
    return addShippingAddress({ address });
  }

  async updateAddress(dispatch, address_id, address) {
    /* eslint-disable */
    return updateShippingAddress({ address_id, address });
  }

  async removeAddress(dispatch, address_id) {
    /* eslint-disable */
    return removeShippingAddress({ address_id });
  }

  async getAddresses(dispatch) {
    /* eslint-disable */
    return getShippingAddresses();
  }

  /* eslint-disable-next-line */
  async estimateShipping(dispatch, address, isValidated = false) {
    const {
      Cart: { cartId },
    } = getStore().getState();
    try {
      if (isValidated) {
        return await estimateShippingMethods({ cartId, address });
      } else {
        const response = await validateShippingAddress({ address });
        const { success: isAddressValid } = response;

        if (!isAddressValid) {
          const { parameters, message } = response;
          const formattedParams = capitalize(parameters[0]);

          dispatch(
            showNotification(
              "error",
              `${formattedParams} ${__("is not valid")}. ${message}`
            )
          );
        }
        if (isAddressValid) {
          return await estimateShippingMethods({ cartId, address });
        }
      }
    } catch (e) {
      dispatch(
        showNotification("error", __("The address or phone field is incorrect"))
      );
      Logger.log(e);
    }
  }

  async saveAddressInformation(dispatch, address) {
    const {
      Cart: { cartId },
    } = getStore().getState();

    dispatch(setShipping({}));

    const resp = await saveShippingInformation({
      cartId,
      data: address,
    });
    dispatch(setCartTotal(resp?.data?.totals?.total || 0));
    return resp;
  }

  async getPaymentMethods() {
    const {
      Cart: { cartId },
    } = getStore().getState();

    return getPaymentMethods({
      cart_id: cartId.toString(),
    });
  }

  async getTamaraInstallment(dispatch, price) {
    return getInstallmentForTamara(price);
  }

  async createTamaraSession(dispatch, billingData = {}) {
    const {
      Cart: { cartId },
    } = getStore().getState();

    return createSessionTamara({
      cart_id: cartId.toString(),
    });
  }

  async verifyTamaraPayment(dispatch, paymentID) {
    return verifyTamaraPayment(paymentID);
  }

  async updateTamaraPayment(dispatch, paymentID, orderId, paymentStatus) {
    return updateTamaraPayment(paymentID, orderId, paymentStatus);
  }

  async getTabbyInstallment(dispatch, price) {
    return getInstallmentForValue(price);
  }

  async createTabbySession(dispatch, billingData) {
    const {
      Cart: { cartId },
    } = getStore().getState();

    const { email, firstname, lastname, phone, city, street } = billingData;

    return createSession({
      cart_id: cartId.toString(),
      buyer: {
        email,
        name: `${firstname} ${lastname}`,
        phone,
        city,
        address: street,
      },
    });
  }

  async selectPaymentMethod(dispatch, code) {
    const {
      Cart: { cartId },
    } = getStore().getState();

    dispatch(processingPaymentSelectRequest(true));

    try {
      const response = await selectPaymentMethod({
        cartId,
        data: {
          method: code,
          cart_id: cartId,
        },
      });
      if (response?.data) {
        return response;
      } else {
        dispatch(showNotification("error", `${response}`));
      }
    } catch (error) {
      Logger.log(error);
    }
  }

  async getBinPromotion(dispatch, bin) {
    const {
      Cart: { cartId },
    } = getStore().getState();

    return getBinPromotion({ cartId, bin });
  }

  async removeBinPromotion(dispatch) {
    const {
      Cart: { cartId },
    } = getStore().getState();

    return removeBinPromotion({ cartId });
  }

  async createOrder(dispatch, code, additional_data, eddItems, vipData = {} ) {
    const {
      Cart: { cartId },
    } = getStore().getState();

    const {
      is_vip = false,
      is_vip_chargeable = true,
    } = vipData;

    return createOrder({
      data: {
        cart_id: cartId,
        edd_items: eddItems,
        is_vip,
        is_vip_chargeable,
        payment: {
          method: code,
          data: additional_data,
        },
      },
    });
  }

  async cancelOrder(dispatch, orderId, cancelReason) {
    return cancelOrder({
      data: {
        order_id: orderId,
        cancel_reason: cancelReason,
      },
    });
  }

  async verifyPayment(dispatch, paymentId) {
    return verifyPayment(paymentId);
  }

  async updateTabbyPayment(dispatch, paymentId, order_id) {
    return updateTabbyPayment(paymentId, order_id);
  }
  async sendVerificationCode(dispatch, data) {
    return sendVerificationCode({ data });
  }

  async verifyUserPhone(dispatch, data) {
    return verifyUserPhone({ data });
  }

  async getLastOrder(dispatch) {
    return getLastOrder();
  }

  async getPaymentAuthorization(dispatch, paymentId, qpaymethod, KNETpay) {
    if (qpaymethod) {
      return getPaymentAuthorizationQPay({ paymentId });
    }
    if (KNETpay) {
      return getPaymentAuthorizationKNET({ paymentId });
    }

    return getPaymentAuthorization({ paymentId });
  }

  async capturePayment(dispatch, paymentId, orderId) {
    return capturePayment({ paymentId, orderId });
  }

  setCheckoutLoader(dispatch, currState) {
    return setCheckoutLoader(currState);
  }

  selectIsAddressSet(dispatch, isAddress) {
    dispatch(setIsAddressSelected(isAddress));
  }

  setProcessAddressChange(dispatch, currState) {
    dispatch(setProcessAddressChange(currState));
  }

  async getShipment(dispatch, cartId) {
    const {
      AppConfig: { isExpressDelivery = false, vwoData = {} },
    } = getStore().getState();

    if(!isExpressDelivery || !vwoData?.Express?.isFeatureEnabled ) {
      dispatch(setShipment({}));
      this.setProcessAddressChange(dispatch, false);
      return {};
    }

    const cityAreaFromSelectionPopUp = BrowserDatabase.getItem(
        "cityAreaFromSelectionPopUp"
    );
 
    const reqObj = await JSON.parse(
      localStorage.getItem("currentSelectedAddress")
    )|| cityAreaFromSelectionPopUp;
    const params = {
      area: reqObj?.area || "",
      city: reqObj?.city || "",
      address_type: reqObj?.mailing_address_type || "37303",
    };

    try {
      const response = await getShipment({ cartId, params });
      this.setProcessAddressChange(dispatch, false);
      await CartDispatcher.getCartTotals(dispatch, cartId);
      if(response) {
        dispatch(setShipment(response));
      }
      return response;
    } catch (e) {
      console.error(e);
    }
  }

  async updateShipment(dispatch, shipmentData = {}) {
    const reqObj = await JSON.parse(
      localStorage.getItem("currentSelectedAddress")
    );
    const data = {
      area: reqObj?.area || "",
      city: reqObj?.city || "",
      ...shipmentData,
    };

    try {
      const response = await updateShipment({ data });

      if (response) {
        await this.getShipment(dispatch, shipmentData?.quote_id);
        await CartDispatcher.getCartTotals(dispatch, shipmentData?.quote_id)
      }
    } catch (e) {
      console.error(e);
    }
  }
}

export default new CheckoutDispatcher();
