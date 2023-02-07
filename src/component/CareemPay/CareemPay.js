import React, { useEffect, useState, useRef } from "react";
import "./CareemPay.style";
import { careemPayCreateInvoice } from "Util/API/endpoint/Checkout/Checkout.endpoint";
import { getOrderData } from "Util/API/endpoint/Checkout/Checkout.endpoint";
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
  createOrder,
  setDetailsStep,
  orderID,
  setLoading,
  setIsFailed,
  resetCart,
  setShippingAddressCareem,
  setProcessingLoader,
  setPaymentinfoCareemPay,
  showErrorNotification,
}) {

  const [isCareemCreateOrder, setIsCaremCreateOrder] = useState(false);

  const addCareemPayScripts = () => {
    const script = document.createElement("script");
    script.src = "https://dist.cpay.me/latest/merchant-sdk.js";
    script.defer = true;
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
      const response = await createOrder(code);
      if(response) {        
        const orderidd = response?.data?.order_id;
        const increment_id = response?.data?.increment_id;
        const orderStatus = response?.data?.success;

        
        if(orderStatus) {     
          setDetailsStep(orderidd, increment_id);
          const resp = await getOrderData(orderidd);    
          if(resp) {
            const { billing_address } = resp?.data;
            if(isSignedIn) {
              const adddress1 = billing_address;
              setShippingAddressCareem(adddress1);
            }else {
              const adddress2 = billing_address;
              setShippingAddressCareem(adddress2);
            }
          }
          resetCart();
        }else {
          // if Payment is successful on careem pay modal but 
          // Create-order2 API fails or not able to place order in Magento.
          // currently in this case backend sending us "qty not available" message in response.
          showErrorNotification(response);
          setShippingAddressCareem(guestUserAddress);
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
          }else if(status === FAILURE){
            setIsFailed(true)
            setIsCaremCreateOrder(true);
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
