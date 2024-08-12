import React from "react";
import { connect } from "react-redux";

import {
  ADD_ADDRESS,
  ADDRESS_POPUP_ID,
  EDIT_ADDRESS,
} from "Component/MyAccountAddressPopup/MyAccountAddressPopup.config";
import address from "Component/PDPSummary/icons/address_black.svg";

import "./DeliveryAddress.scss";

import { getCountryFromUrl } from "Util/Url";
import isMobile from "Util/Mobile";
import { isArabic as checkIsArabic } from "Util/App";
import { isArabic } from "Util/App";

import MyAccountDispatcher from "Store/MyAccount/MyAccount.dispatcher";
import { getSelectedAddress } from "./utils/DeliveryAddress.helper";
import { showPopup } from "Store/Popup/Popup.action";
import CityArea from "Component/CityArea/index";

export const mapStateToProps = (state) => ({
  isSignedIn: state.MyAccountReducer.isSignedIn,
  addresses: state.MyAccountReducer.addresses,
  customer: state.MyAccountReducer.customer,
  defaultShippingAddress: state.MyAccountReducer.defaultShippingAddress,
  currentSelectedCityArea: state.MyAccountReducer.currentSelectedCityArea,
});

export const mapDispatchToProps = (dispatch) => ({
  showAddEditAddressPopup: (payload) =>
    dispatch(showPopup(ADDRESS_POPUP_ID, payload)),
  selectedCityArea: (data) =>
    MyAccountDispatcher.selectedCityArea(dispatch, data),
});

const DeliveryAddress = (props) => {
  const {
    selectedAddressId,
    shippingAddress,
    addresses,
    currentSelectedCityArea,
    onAddressSelect,
    isSignedIn,
    editCheckoutAddress,
  } = props;

  const selectedAddressForRender = isSignedIn
    ? getSelectedAddress(selectedAddressId, addresses) || {}
    : shippingAddress;
  const isArabic = checkIsArabic();
  const isMobileDevice = isMobile.any() || isMobile.tablet();

  const onAddressSelectPopup = (selectedAddress) => {
    onAddressSelect(selectedAddress);
  };

  const renderSelectedAddressMsite = () => {
    const { area = "", city = "", street = "" } = selectedAddressForRender;

    return (
      <div block="address-card-Msite">
        <div block="address-card-Msite" elem="icon-container">
          <img src={address} alt="" />
        </div>
        <div block="address-card-Msite" elem="text-container">
          <p block="address-card-Msite" elem="title">
            {__("HOME")}
          </p>
          <p block="address-card-Msite" elem="description">
            <span>{area}</span> <span>{city}</span> <span>{street}</span>
          </p>
        </div>
      </div>
    );
  };

  const renderSelectedAddress = () => {
    const {
      firstname = "",
      lastname = "",
      area = "",
      city = "",
      country_code = "",
      id = "",
      phone = "",
      street = "",
    } = selectedAddressForRender;

    if (isMobileDevice) {
      if (isSignedIn) {
        return (
          <CityArea
            isNewCheckoutPage={true}
            onAddressSelectPopup={onAddressSelectPopup}
            renderSelectedAddressMsite={renderSelectedAddressMsite}
          />
        );
      }
      return (
        <div onClick={editCheckoutAddress}>{renderSelectedAddressMsite()}</div>
      );
    }

    return (
      <div block="address-card" mods={{ isGuestUser: !isSignedIn }}>
        <div block="address-card" elem="header">
          <>
            <h2>{__("Delivery Address")}</h2>
            {isSignedIn ? (
              <CityArea
                isNewCheckoutPage={true}
                onAddressSelectPopup={onAddressSelectPopup}
              />
            ) : (
              <button
                className="editAddressBtn"
                type="button"
                onClick={editCheckoutAddress}
              >
                {__("Edit")}
              </button>
            )}
          </>
        </div>
        <div block="address-card" elem="content">
          <h3 className="addressCardName">{`${firstname} ${lastname}`}</h3>
          <p className="cityAreaName">{`${area}`}</p>
          <p>{`${area}, ${street}`}</p>
          <p className="contactNumber">{`${phone}`}</p>
        </div>
      </div>
    );
  };

  return <>{renderSelectedAddress()}</>;
};

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryAddress);
