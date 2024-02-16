import React, { useEffect, useState } from "react";
import "./TamaraWidget.style";
import { connect } from "react-redux";
import CheckoutDispatcher from "Store/Checkout/Checkout.dispatcher";
import { tamaraLogo } from "Component/Icons";
import { getCurrency } from "Util/App";

export const mapDispatchToProps = (dispatch) => ({
  getTamaraInstallment: (price) =>
    CheckoutDispatcher.getTamaraInstallment(dispatch, price),
});

function TamaraWidget(props) {
  const {
    isArabic,
    countryCode,
    productPrice,
    getTamaraInstallment,
    isMobile,
    pageType,
  } = props;
  const languageCode = isArabic ? "ar" : "en";
  const [installmentAmount, setInstallmentAmount] = useState(0);
  const currencyCode = getCurrency() || "";

  const renderLearnMore = () => {
    return (
      <>
        <span>&nbsp;</span>
        <a className="tamara-summary-widget-inline-text-underline">
          {__("Learn more")}
        </a>
      </>
    );
  };

  const renderInstallmentsAmount = () => {
    return (
      <span className="tamara-summary-widget-amount">
        {" "}
        {currencyCode} {installmentAmount}{" "}
      </span>
    );
  };

  const addTamaraScripts = () => {
    const checkSript = document.getElementById("TamaraScript");
    if (checkSript) {
      return;
    }
    const script = document.createElement("script");
    script.src = process.env.REACT_APP_TAMARA_WIDGET_URL;
    script.id = "TamaraScript";
    document.body.appendChild(script);
  };

  const getTamaraInstallments = async () => {
    const response = await getTamaraInstallment(productPrice);
    const { value = 0 } = response;
    setInstallmentAmount(value);
  };

  useEffect(() => {
    window.tamaraWidgetConfig = {
      lang: languageCode,
      country: countryCode,
      publicKey: process.env.REACT_APP_TAMARA_AUTH_KEY,

      style: {
        fontSize: "14px",
        badgeRatio: "0.58",
        background: "white",
      },
      css: `
            .tamara-summary-widget__container {
              background: white;
            }
            .my-custome-class-tamara{
              display: flex;
              justify-content: space-between;
            }
            .tamara-summary-widget-amount{
              font-weight: 700;
            }
            .tamara-summary-widget-inline-text-underline{
              text-decoration: underline;
            }
            .tamara-summary-widget-content {
              color: #0A0A0A;
              font-family: "Avenir Next";
              font-size: 14px;
              font-style: normal;
              font-weight: 400;
              line-height: 18px;
              margin-right: 12px;
            }
            .tamara-summary-widget-content-ar {
              color: #0A0A0A;
              font-family: "Avenir Next";
              font-size: 14px;
              font-style: normal;
              font-weight: 400;
              line-height: 18px;
              margin-left: 12px;
            }
            .tamara-icon-tamara-widget {
              max-width: 55px;
            }`,
    };

    addTamaraScripts();
  }, []);

  useEffect(() => {
    setInstallmentAmount(0);
    getTamaraInstallments();
  }, [productPrice]);

  if (installmentAmount === 0) {
    return null;
  }

  return (
    <div className="tamara-widget-example">
      <tamara-widget
        type="tamara-summary"
        amount={productPrice}
        inline-type="0"
      >
        <div className="my-custome-class-tamara">
          <div
            className={
              isArabic
                ? "tamara-summary-widget-content-ar"
                : "tamara-summary-widget-content"
            }
          >
            <span className="tamara-widget__number-of-installments-node">
              {__("Pay a minimum of")}
            </span>
            {renderInstallmentsAmount()}
            <span className="tamara-widget__number-of-installments-node">
              {__("now, and the rest over time - no hidden fees, no interest.")}
            </span>
            {renderLearnMore()}
          </div>

          <img
            className={
              !isMobile && pageType === "cartPage"
                ? "tamara-icon-tamara-widget"
                : ""
            }
            src={tamaraLogo}
            alt="Tamara"
          />
        </div>
      </tamara-widget>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(TamaraWidget);
