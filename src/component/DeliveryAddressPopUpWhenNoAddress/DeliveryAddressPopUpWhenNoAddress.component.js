import React, { useState, useEffect, createRef } from "react";
import Image from "Component/Image";
import address from "Component/PDPSummary/icons/address_black.svg";

import "./DeliveryAddressPopUpWhenNoAddress.style.scss";

export const DeliveryAddressPopUpWhenNoAddress = (props) => {
  const {
    showHideCityAreaSelection,
    showPopUp,
    showHidePOPUP,
    addNewAddress,
    customer,
  } = props;

  const wrapperRef = createRef();

  useEffect(() => {
    window.addEventListener("mousedown", closePopupOnOutsideClick);
    return () => {
      window.removeEventListener("mousedown", closePopupOnOutsideClick);
    };
  }, [wrapperRef]);

  useEffect(() => {
    const html = document.getElementsByTagName("html")[0];
    if (showPopUp) {
      html.style.overflow = "hidden";
    }
    return () => {
      html.style.overflow = "auto";
    };
  }, [showPopUp]);

  const closePopupOnOutsideClick = (e) => {
    if (
      showPopUp &&
      wrapperRef.current &&
      !wrapperRef?.current?.contains(e.target)
    ) {
      showHidePOPUP(false);
    }
  };

  const render = () => {
    const { firstname = "", lastname = "" } = customer;
    return (
      <div block="deliveryAddressPopUpWhenNoAddressBlock">
        <div block="deliveryAddressPopUpWhenNoAddressOuterBlock">
          <div block="deliveryAddressPopUpWhenNoAddressPopUp">
            <div
              block="deliveryAddressPopUpWhenNoAddressInnerBlock"
              ref={wrapperRef}
            >
              <div block="greetingToUser">
                <h1>
                  {__("Hello,")} {firstname} {lastname}
                </h1>
              </div>
              <div block="deliveryNote">
                <p>
                  {__(
                    "We need your location to provide you with best experience. your location is safe with us."
                  )}
                </p>
              </div>
              <div block="addNewAddressButton" onClick={addNewAddress}>
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
  return render();
};

export default DeliveryAddressPopUpWhenNoAddress;
