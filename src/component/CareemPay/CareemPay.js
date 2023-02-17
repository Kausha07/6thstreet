import React, { useEffect, useState, useRef } from "react";
import { getStore } from "Store";
import "./CareemPay.style";
import { careemPayCreateInvoice } from "Util/API/endpoint/Checkout/Checkout.endpoint";
import { getOrderData } from "Util/API/endpoint/Checkout/Checkout.endpoint";
import { createOrderCareemPay } from "Util/API/endpoint/Checkout/Checkout.endpoint";
import {
  SUCCESS,
  FAILURE,
  guestUserAddress,
  loggedInUserAddress,
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
    const checkSript = document.getElementById("CareemPayScript");
    if(checkSript){
      return;
    }
    const script = document.createElement("script");
    script.src = "https://dist.cpay.me/latest/merchant-sdk.js";
    script.defer = true;
    script.id = "CareemPayScript";
    document.body.appendChild(script);
  };

  async function getCareemPayInvoice(data) {
    try {
      const res = await careemPayCreateInvoice({data : data});
      if(res){
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
      }
      const response = await createOrderCareemPay({ data });
      if(response) {
        const orderidd = response?.data?.order_id;
        const increment_id = response?.data?.increment_id;
        const orderStatus = response?.data?.success;


        if(orderStatus) {     
          setDetailsStep(orderidd, increment_id);
          const resp = await getOrderData(orderidd);    
          if(resp) {
            const { billing_address } = resp?.data;
            if(billing_address) {
              setShippingAddressCareem(billing_address);
              setPaymentinfoCareemPay(CAREEM_PAY, {...billing_address, guest_email: billing_address?.email});
            }else {
              showErrorNotification("Billing address not available.");
            }
          }
          resetCart();
        }else {
          // if Payment is successful on careem pay modal but 
          // Create-order2 API fails or not able to place order in Magento.
          // currently in this case backend sending us "qty not available" message in response.

          setIsFailed(true);
          const careemPayInfo = { isCreateOrderFail: true, messageTitle:response?.data, messageDetails:response?.message }
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

  const goToResult=() =>{
    console.log('goToResult:');
  }
  
  const CareemPayfun = () => {
    const cart = JSON.parse(localStorage.getItem("CART_ID_CACHE_KEY"));
    const cartId = cart?.data;
    const data = { cart_id: cartId };

    const cpay = window?.CareemPay({
      env: process.env.REACT_APP_CAREEM_PAY_ENV, // 'sandbox' or 'production'
    });

    try {
      cpay.autostrap({
        el: "careemBtn",
        requester: (e) => getCareemPayInvoice(data),
        onComplete: (status) => {
          console.log(`Checkout completed with status: ${status}`);
          setProcessingLoader(true);
          setPaymentinfoCareemPay(CAREEM_PAY);
          if (status === SUCCESS) {
            setIsCaremCreateOrder(true);
            setCareemPayStatus(SUCCESS);
          }else if(status === FAILURE){
            setIsFailed(true)
            setIsCaremCreateOrder(true);
            setCareemPayStatus(FAILURE);
          }
          goToResult();  //navigate to the result page
          
        },
        onError: (e) => {
          console.error("something went wrong", e);
          //handleError(e);
        },
        onClose: () => {
          console.log("user has closed the modal");
          //sendAnalytics();
        },
      });
    } catch (error) {
      console.log("check", error);
    }
  };

  useEffect(() => {
    window.addEventListener("careempayready", () => {
      CareemPayfun();
    });
    addCareemPayScripts();
  }, []);

  useEffect(() => {
    if(isCareemCreateOrder) {
      createCareemPayOrder();
    }
  }, [isCareemCreateOrder]);
  
  useEffect(() => {
    if (window.CareemPay) {
      CareemPayfun();
    }
  },[continueAsGuest, isSignedIn]);

  if(continueAsGuest) {
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
      )
      }
      <div className="carrrmPayWrapperDiv">
        <br />
        <h3>1-click Checkout</h3>
        <div className="carremPayInnerDiv">
          <button id="careemBtn" className="careemBtnCss">
            checkout
          </button>
        </div>
        <br />
      </div>
    </>
  );
}

export default CareemPay;
