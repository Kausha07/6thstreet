import React, { useState, useEffect, createRef } from "react";
import { BluePlus, EditPencil } from "Component/Icons/index";
import "./DeliveryAddressPopUp.style";

export const DeliveryAddressPopUp = (props) => {
  const [clickedAddressIdx, setClickedAddressIdx] = useState(0);
  const {
    showHidePOPUP,
    showPopUp,
    countryWiseAddresses,
    editSelectedAddress,
    addNewAddress,
    defaultShippingAddress,
  } = props;

  const wrapperRef = createRef();

  useEffect(() => {
    const html = document.getElementsByTagName("html")[0];
    if (showPopUp) {
      html.style.overflow = "hidden";
    }
    return () => {
      html.style.overflow = "auto";
    };
  }, [showPopUp]);

  useEffect(() => {
    window.addEventListener("mousedown", closePopupOnOutsideClick);
    return () => {
      window.removeEventListener("mousedown", closePopupOnOutsideClick);
    };
  }, [wrapperRef]);

  const closePopupOnOutsideClick = (e) => {
    if (
      showPopUp &&
      wrapperRef.current &&
      !wrapperRef.current.contains(e.target)
    ) {
      showHidePOPUP(false);
    }
  };

  const changeAddress = (idx) => {
    setClickedAddressIdx(idx);
  };

  const onEditButtonClick = (address) => {
    editSelectedAddress(address);
  };

  const onAddNewClick = () => {
    addNewAddress();
  };

  const render = () => {
    return (
      <div block="deliveryAddressMainBlock">
        <div block="deliveryAddressOuterBlock">
          <div block="deliveryAddressPopUp">
            <div block="deliveryAddressInnerBlock" ref={wrapperRef}>
              <div block="deliveryAddressUpperInnerBlock">
                <div block="deliveryTextwithAddNewButton">
                  <h1 block="deliveryText">
                    {__("Where should we deliver your order?")}
                  </h1>
                  <button block="addnewButton" onClick={onAddNewClick}>
                    <img src={BluePlus} alt="plus icon" />
                    {__("Add New")}
                  </button>
                </div>
                <p block="paragraphText">
                  {__(
                    "Delivery option and speed may vary for different location"
                  )}
                </p>
              </div>
              <div block="allAddressAndEditBlock">
                {countryWiseAddresses.length > 0 &&
                  countryWiseAddresses?.map((address, index) => {
                    const {
                      area,
                      city,
                      country_code,
                      default_shipping,
                      firstname,
                      lastname,
                      phone,
                      street,
                    } = address;
                    return (
                      <div
                        block="deliveryAddressInfoBlock"
                        id={index}
                        onClick={() => changeAddress(index)}
                      >
                        <div
                          block="nameAndCityAreaBlock"
                          mods={{
                            isSelected:
                              default_shipping ||
                              (!defaultShippingAddress &&
                                clickedAddressIdx === index),
                          }}
                        >
                          <div block="nameWithDefaultText">
                            <div block="nameBlock">
                              {firstname}
                              {lastname}
                            </div>
                            {default_shipping && (
                              <div block="defaultText">{"Default"}</div>
                            )}
                          </div>
                          <div block="cityAreaInfo">
                            <div block="street">{street}</div>
                            <div block="city">
                              {area}
                              {"-"}
                              {city}
                              {"-"}
                              {country_code}
                            </div>
                            <div block="number">{phone}</div>
                          </div>
                        </div>
                        {clickedAddressIdx === index && (
                          <div
                            block="editBlock"
                            onClick={() => onEditButtonClick(address)}
                          >
                            <img src={EditPencil} alt="Edit" />
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
              <div block="deliverHereBlock">
                <button block="deliverHereButton">{__("Delivery Here")}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return render();
};

export default DeliveryAddressPopUp;
