import React, { useEffect, useState } from "react";
import "./CareemPay.style";
import { careemPayCreateInvoice } from "Util/API/endpoint/Checkout/Checkout.endpoint";


function CareemPay() {
    const [funShouldRun, setFunShouldRun] = useState(true);

  const addCareemPayScripts = () => {
    const script = document.createElement("script");
    script.src = "https://dist.cpay.me/latest/merchant-sdk.esm.js";
    script.defer = true;
    document.body.appendChild(script);

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

  const createCareemPayOrder =() => {
    const { createOrder } = this.props;
    
    try {
      const code = "careem_pay"
      createOrder(code).then((response) => {
        if (
          response
        ) {
            const order = response;
            console.log(order);
            localStorage.removeItem("CART_ID_CACHE_KEY");
            localStorage.removeItem("CART_ITEMS_CACHE_KEY");
            return response;
        }
      });
    } catch (error) {
      console.error(error);
    }
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
          if (status === "success") {
            createCareemPayOrder();
          }
          //goToResult(); // navigate to the result page
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
    addCareemPayScripts();
  }, []);

  useEffect(() => {
    if (window.CareemPay && funShouldRun) {
      CareemPayfun();
      setFunShouldRun(false);
    }
  });

  return (
    <>
      <div block="Seperator3">{/* or */} </div>
      <div block="orTextdiv">or</div>
      <div className="carrrmPayWrapperDiv">
        <br />
        <br />
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
