import React, { useEffect, useState } from "react";
import "./TamaraCard.style";
import Round1 from "./icons/Round1.svg";
import Round2 from "./icons/Round2.svg";
import Round3 from "./icons/Round3.svg";
import Round4 from "./icons/Round4.svg";
import tamaraIcon from "./icons/tamaraIcon.png";
import { connect } from "react-redux";
import { getCurrency } from "Util/App";
import CheckoutDispatcher from "Store/Checkout/Checkout.dispatcher";

export const mapDispatchToProps = (dispatch) => ({
  getTamaraInstallment: (price) =>
    CheckoutDispatcher.getTamaraInstallment(dispatch, price),
});

function TamaraCard(props) {
  const {
    isMobile,
    isArabic,
    getTamaraInstallment,
    countryCode,
    productPrice,
  } = props;
  const languageCode = isArabic ? "ar" : "en";
  const [installmentAmount, setInstallmentAmount] = useState(0);
  const currencyCode = getCurrency() || "";

  const renderCardHeader = () => {
    return (
      <div className="tamara-header-wrapper">
        <div className="tamara-header-wrapper-tamara-icon">
          <img src={tamaraIcon} />
        </div>
        <div block="tamara-header-wrapper-tamara-line" mods={{ isArabic }}>
          {__("Split in 4 payments - No late fees.")}
        </div>
      </div>
    );
  };

  const renderCircleSVG = (svg) => {
    return (
      <div className="round">
        <img src={svg} />
      </div>
    );
  };

  const renderCircleText = (text) => {
    return <div className="text-circle">{text}</div>;
  };

  const renderCircleBlock = (circle) => {
    const { text, svg, textAr } = circle;
    return (
      <div
        block="roundWrapper"
        elem={
          isArabic
            ? "round-warp-horizontal-line-isArabic"
            : "round-warp-horizontal-line"
        }
        className="roundWrapper"
      >
        {renderCircleSVG(svg)}
        <div className="text-circle-bold">
          {currencyCode} {installmentAmount}
        </div>
        {isArabic ? renderCircleText(textAr) : renderCircleText(text)}
      </div>
    );
  };

  const renderFourCircles = () => {
    const FourCirclesData = [
      { text: "Today", textAr: "اليوم", svg: Round1 },
      { text: "In 1 month", textAr: "خلال 1 شهر", svg: Round2 },
      { text: "In 2 month", textAr: "خلال 2 شهر", svg: Round3 },
      { text: "In 3 month", textAr: "خلال 3 شهر", svg: Round4 },
    ];
    return (
      <div block="circleWrapper">{FourCirclesData.map(renderCircleBlock)}</div>
    );
  };

  const getTamaraInstallments = async () => {
    const response = await getTamaraInstallment(productPrice);
    const { value = 0 } = response;
    setInstallmentAmount(value);
  };

  useEffect(() => {
    getTamaraInstallments();
  }, [productPrice]);

  if (installmentAmount === 0) {
    return null;
  }

  return (
    <div
      block="tamaraCardContainer"
      mods={{ isMobile: isMobile ? true : false }}
    >
      {renderCardHeader()}
      {renderFourCircles()}
    </div>
  );
}

export default connect(null, mapDispatchToProps)(TamaraCard);
