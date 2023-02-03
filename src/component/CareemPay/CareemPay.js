import React, { useEffect, useState, useRef } from "react";
import "./CareemPay.style";
import { careemPayCreateInvoice } from "Util/API/endpoint/Checkout/Checkout.endpoint";
import MagentoAPI from "Util/API/provider/MagentoAPI";
import {
  SUCCESS,
  FAILURE,
  guestUserAddress,
  loggedInUserAddress,
} from "./CareemPay.config";


function CareemPay({
  continueAsGuest,
  isSignedIn,
  createOrder,
  setDetailsStep,
  orderID,
  setLoading,
  setIsFailed,
  resetCart,
  setShippingAddressCareem,
  setProcessingLoader,
  setPaymentinfoCareemPay,
}) {

  const addCareemPayScripts = () => {
    const script2 = document.createElement("script");
    script2.src = "https://dist.cpay.me/latest/merchant-sdk.js";
    script2.defer = true;
    document.body.appendChild(script2);
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
      const code = "careem_pay";
      const response = await createOrder(code);
      if(response) {        
        const orderidd = response?.data?.order_id;
        const increment_id = response?.data?.increment_id;
        const orderStatus = response?.data?.success;

        setDetailsStep(orderidd, increment_id);

        if(orderStatus) {
          const getOrderById=() => {return MagentoAPI.get(`orders/${orderidd}`);}
          const resp = await getOrderById();          
          if(resp) {
            if(isSignedIn) {
              const adddress1 = guestUserAddress;
              setShippingAddressCareem(adddress1);
            }else {
              const adddress2 = guestUserAddress;
              setShippingAddressCareem(adddress2);
            }
          }
          resetCart();
        }
      }
      setShippingAddressCareem(guestUserAddress);
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
    const cartId = cart.data;
    const data = { cart_id: cartId };

    const cpay = window?.CareemPay({
      env: "sandbox", // 'sandbox' or 'production'
    });

    try {
      cpay.autostrap({
        el: "careemBtn",
        requester: (e) => getCareemPayInvoice(data),
        onComplete: (status) => {
          console.log(`Checkout completed with status: ${status}`);
          setProcessingLoader(true);
          setPaymentinfoCareemPay("careem_pay");
          if (status === SUCCESS) {
            createCareemPayOrder();
          }else if(status === FAILURE){
            setIsFailed(true)
            createCareemPayOrder();
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
