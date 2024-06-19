import React, { useState, useEffect, createRef } from "react";
import isMobile from "Util/Mobile";
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

  const render = () => {
    const { firstname = "", lastname = "" } = customer;
    return (
      <div block="deliveryAddressPopUpWhenNoAddressBlock">
        <div block="deliveryAddressPopUpWhenNoAddressOuterBlock">
          <div block="deliveryAddressPopUpWhenNoAddressPopUp">
            <div block="deliveryAddressPopUpWhenNoAddressInnerBlock">
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
