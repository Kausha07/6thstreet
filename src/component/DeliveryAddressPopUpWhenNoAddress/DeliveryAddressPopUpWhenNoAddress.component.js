import React, { useState, useEffect, createRef } from "react";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import Image from "Component/Image";
import address from "Component/PDPSummary/icons/address_black.svg";
import ModalWithOutsideClick from "Component/ModalWithOutsideClick";

import "./DeliveryAddressPopUpWhenNoAddress.style.scss";

export const DeliveryAddressPopUpWhenNoAddress = (props) => {
  const {
    showHideCityAreaSelection,
    showPopUp,
    showHidePOPUP,
    addNewAddress,
    customer,
    setExpressPopUp,
    isSignInTypePopUp,
  } = props;

  const wrapperRef = createRef();

  useEffect(() => {
    if (!isSignInTypePopUp) {
      window.addEventListener("scroll", closePopupOnOutsideClick);
      window.addEventListener("mousedown", closePopupOnOutsideClick);
    }
    return () => {
      window.removeEventListener("scroll", closePopupOnOutsideClick);
      window.removeEventListener("mousedown", closePopupOnOutsideClick);
    };
  }, [wrapperRef]);

  const closePopupOnOutsideClick = (e) => {
    if (
      showPopUp &&
      wrapperRef.current &&
      !wrapperRef?.current?.contains(e.target) &&
      !isMobile.any()
    ) {
      showHidePOPUP(false);
      setExpressPopUp(false);
    }
  };

  const render = () => {
    const { firstname = "", lastname = "" } = customer;
    return (
      <div
        block="deliveryAddressPopUpWhenNoAddressBlock"
        elem={isSignInTypePopUp && "stylePopUp"}
        mods={{ isArabic: isArabic() }}
      >
        <div block="deliveryAddressPopUpWhenNoAddressOuterBlock">
          <div block="deliveryAddressPopUpWhenNoAddressPopUp" ref={wrapperRef}>
            <div block="deliveryAddressPopUpWhenNoAddressInnerBlock">
              <div block="greetingToUser">
                <h1 block="headingText">
                  {__("Hello,")} {firstname}{" "}
                  {lastname != "LASTNAME_PLACEHOLDER" && lastname}
                </h1>
              </div>
              <div block="deliveryNote">
                <p>
                  {__(
                    "Please provide your location so that we can ensure the best available delivery. Your details are secure with us."
                  )}
                </p>
              </div>
              <div
                block="addNewAddressButton"
                onClick={() => {
                  addNewAddress();
                  setExpressPopUp(true);
                }}
              >
                <button>{__("Add new Address")}</button>
              </div>
              <div block="partition">{__("or")}</div>
              <div block="cityAreaSelectionWhenNoAddress">
                <div block="selectLocation">
                  <Image lazyLoad={false} src={address} alt="" />
                  <div
                    block="selectLocationText"
                    onClick={() => showHideCityAreaSelection(true)}
                  >
                    {__("Select your location")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isSignInTypePopUp || isMobile.any()) {
    return (
      <ModalWithOutsideClick
        show={showPopUp}
        onClose={() => {
          setExpressPopUp(false);
          showHidePOPUP(false);
        }}
      >
        {render()}
      </ModalWithOutsideClick>
    );
  } else {
    return render();
  }
};

export default DeliveryAddressPopUpWhenNoAddress;
