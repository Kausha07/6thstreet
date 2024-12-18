import React, { useState, useEffect, createRef } from "react";
import { connect } from "react-redux";
import { isArabic } from "Util/App";
import { getCountryFromUrl } from "Util/Url";
import { BluePlus, EditPencil } from "Component/Icons/index";
import ModalWithOutsideClick from "Component/ModalWithOutsideClick";
import MyAccountDispatcher from "Store/MyAccount/MyAccount.dispatcher";
import "./DeliveryAddressPopUp.style";

export const mapDispatchToProps = (dispatch) => ({
  expressPopUpOpen: (val) =>
    MyAccountDispatcher.expressPopUpOpen(dispatch, val),
});

export const DeliveryAddressPopUp = (props) => {
  const {
    showHidePOPUP,
    showPopUp,
    addresses,
    editSelectedAddress,
    addNewAddress,
    defaultShippingAddress,
    autoPopulateCityArea,
    setExpressPopUp,
    expressPopUpOpen,
  } = props;

  const [selectedAddress, setSelectedAddress] = useState(
    JSON.parse(localStorage?.getItem("currentSelectedAddress"))
      ? JSON.parse(localStorage?.getItem("currentSelectedAddress"))
      : defaultShippingAddress
      ? defaultShippingAddress
      : {}
  );

  const changeAddress = (address) => {
    setSelectedAddress(address);
  };

  const onEditButtonClick = (address) => {
    editSelectedAddress(address);
    setExpressPopUp(true);
  };

  const onAddNewClick = () => {
    expressPopUpOpen(true);
    addNewAddress();
    setExpressPopUp(true);
  };

  const onDeliveryHereButtonClicked = async () => {
    await autoPopulateCityArea(selectedAddress);
    showHidePOPUP(false);
    setExpressPopUp(false);
  };

  let currentSelectedAddressId = JSON.parse(
    localStorage?.getItem("currentSelectedAddress")
  )?.id;

  let countryWiseAddresses = addresses?.sort((a, b) => {
    // Priority 1: Sort by currentSelectedAddressId if it exists
    if (currentSelectedAddressId) {
      if (a.id === currentSelectedAddressId) {
        return -1; // a should come before b
      } else if (b.id === currentSelectedAddressId) {
        return 1; // b should come before a
      }
    }

    // Priority 2: Sort by default_shipping flag
    if (a.default_shipping === true && b.default_shipping !== true) {
      return -1; // a should come before b
    } else if (a.default_shipping !== true && b.default_shipping === true) {
      return 1; // b should come before a
    }

    // If none of the above conditions apply, maintain the current order
    return 0;
  });

  return (
    <ModalWithOutsideClick
      show={showPopUp}
      onClose={() => {
        setExpressPopUp(false);
        return showHidePOPUP(false);
      }}
    >
      <div block="deliveryAddressMainBlock" mods={{ isArabic: isArabic() }}>
        <div block="deliveryAddressOuterBlock">
          <div block="deliveryAddressPopUp">
            <div block="deliveryAddressInnerBlock">
              <div block="deliveryAddressUpperInnerBlock">
                <div block="deliveryTextwithAddNewButton">
                  <h1 block="deliveryText">
                    {__("Where should we deliver your order?")}
                  </h1>
                  <button block="addnewButton" onClick={() => onAddNewClick()}>
                    <img src={BluePlus} alt="plus icon" block="plusIconImage" />
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
                      id,
                    } = address;
                    return (
                      <div
                        block="deliveryAddressInfoBlock"
                        id={index}
                        onClick={(e) => changeAddress(address, e)}
                        key={index}
                      >
                        <div
                          block={`nameAndCityAreaBlock${
                            isArabic() ? " isArabic" : ""
                          }`}
                          mods={{
                            isSelected: selectedAddress?.id === id,
                          }}
                        >
                          <div block="nameWithDefaultText">
                            <div block="nameBlock">
                              {firstname} {lastname}
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
                        {selectedAddress?.id === id && (
                          <div
                            block="editBlock"
                            onClick={(e) => onEditButtonClick(address, e)}
                          >
                            <img src={EditPencil} alt="Edit" />
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
              <div
                block="deliverHereBlock"
                onClick={() => {
                  onDeliveryHereButtonClicked();
                }}
              >
                <button block="deliverHereButton">{__("Delivery Here")}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalWithOutsideClick>
  );
};

export default connect(null, mapDispatchToProps)(DeliveryAddressPopUp);
