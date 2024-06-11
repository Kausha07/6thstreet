import React, { useEffect, useState, useRef } from "react";
import { getStore } from "Store";
import "./CareemPay.style";
import { careemPayCreateInvoice } from "Util/API/endpoint/Checkout/Checkout.endpoint";
import { getOrderData } from "Util/API/endpoint/Checkout/Checkout.endpoint";
import { createOrderCareemPay } from "Util/API/endpoint/Checkout/Checkout.endpoint";
import {
  SUCCESS,
  FAILURE,
  CAREEM_PAY,
} from "./CareemPay.config";


function CareemPay({
  continueAsGuest,
  isSignedIn,
  setDetailsStep,
  orderID,
  setLoading,
  setIsFailed,
  resetCart,
  setShippingAddressCareem,
  setProcessingLoader,
  setPaymentinfoCareemPay,
  showErrorNotification,
  setCareemPayInfo,
  setCareemPayStatus,
}) {
  const [isCareemCreateOrder, setIsCaremCreateOrder] = useState(false);

  const addCareemPayScripts = () => {
    const checkSript = document.getElementById("careemPayScript");
    if (checkSript) {
      return;
    }
    const script = document.createElement("script");
    script.src = "https://one-click-js.careem-pay.com/v2/index.es.js";
    script.id = "careemPayScript";
    script.defer = true;
    script.type = "module";
    script.addEventListener("load", () => {
      const careemPay = window.CareemPay(
        process.env.REACT_APP_CAREEM_PAY_CLIENT_ID,
        {
          env: process.env.REACT_APP_CAREEM_PAY_ENV, // 'sandbox' or 'production'
          mode: "popup",
        }
      );
      const checkoutBtn = document.getElementById("checkoutBtn");
      if (careemPay && checkoutBtn) {
        careemPay.attach("checkoutBtn");
      }
    });
    document.body.appendChild(script);
  };

  function processCareemPay() {
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (!checkoutBtn) {
      return;
    }
    const cart = JSON.parse(localStorage.getItem("CART_ID_CACHE_KEY"));
    const cartId = cart?.data;
    const data = { cart_id: cartId };
    try {
      checkoutBtn.addEventListener("checkout", async (checkoutAttempt) => {
        // handle checkout attempt here
        const respo = await getCareemPayInvoice(data);
        const invoiceId = respo?.invoiceId;
        if (!invoiceId) {
          // cancel the payment attempt if invoice id is not generated
          checkoutAttempt.cancel();
          return;
        }
        // invoidId is generated - begin checkout with careem pay
        try {
          const result = await checkoutAttempt.begin(invoiceId);
          setProcessingLoader(true);
          setPaymentinfoCareemPay(CAREEM_PAY);
          if (result.status === SUCCESS) {
            setIsCaremCreateOrder(true);
            setCareemPayStatus(SUCCESS);
          } else if (result.status === FAILURE) {
            setIsFailed(true);
            setIsCaremCreateOrder(true);
            setCareemPayStatus(FAILURE);
          }
        } catch (error) {
          console.error(error);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function getCareemPayInvoice(data) {
    try {
      const res = await careemPayCreateInvoice({ data: data });
      if (res?.error) {
        showErrorNotification(`${res?.error}`);
      }
      if (res) {
        return res;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function createCareemPayOrder() {
    try {
      const code = CAREEM_PAY;
      const {
        Cart: { cartId },
      } = getStore().getState();
      const data = {
        cart_id: cartId,
        edd_items: [],
        payment: {
          method: code,
          data: {},
        },
      };
      const response = await createOrderCareemPay({ data });
      if (response) {
        const orderidd = response?.data?.order_id;
        const increment_id = response?.data?.increment_id;
        const orderStatus = response?.data?.success;

        if (orderStatus) {
          setDetailsStep(orderidd, increment_id);
          const resp = await getOrderData(orderidd);
          if (resp) {
            const { billing_address } = resp?.data;
            if (billing_address) {
              setShippingAddressCareem(billing_address);
              setPaymentinfoCareemPay(CAREEM_PAY, {
                ...billing_address,
                guest_email: billing_address?.email,
              });
            } else {
              showErrorNotification("Billing address not available.");
            }
          }
          resetCart();
        } else {
          // if Payment is successful on careem pay modal but
          // Create-order2 API fails or not able to place order in Magento.
          // currently in this case backend sending us "qty not available" message in response.

          setIsFailed(true);
          const careemPayInfo = {
            isCreateOrderFail: true,
            messageTitle: response?.data,
            messageDetails: response?.message,
          };
          setCareemPayInfo(careemPayInfo);

          showErrorNotification(response?.data);
          setDetailsStep(orderidd, increment_id);
        }
      }
      setProcessingLoader(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    addCareemPayScripts();
    processCareemPay();
    return () => {
      const script = document.getElementById("careemPayScript");
      if (script) {
        script.parentNode.removeChild(script);
      }
    };
  }, [continueAsGuest, isSignedIn]);

  useEffect(() => {
    if (isCareemCreateOrder) {
      createCareemPayOrder();
    }
  }, [isCareemCreateOrder]);

  if (continueAsGuest) {
    return null;
  }

  return (
    <>
      {isSignedIn ? null : (
        <div className="dashedWerapper">
          <div className="dashed">
            <span>or</span>
          </div>
        </div>
      )}
      <div className="carrrmPayWrapperDiv">
        <br />
        <h3>One-Click Checkout</h3>
        <div className="carremPayInnerDiv">
          <cpay-checkout-button id="checkoutBtn"></cpay-checkout-button>
        </div>
        <br />
      </div>
    </>
  );
}

export default CareemPay;
