import React, { useState } from "react";
import { connect } from "react-redux";

import { isSignedIn } from "Util/Auth";
import isMobile from "Util/Mobile";
import { getCountryFromUrl } from "Util/Url";
import { isArabic } from "Util/App";

import { showPopup } from "Store/Popup/Popup.action";
import {
  ADD_ADDRESS,
  ADDRESS_POPUP_ID,
  EDIT_ADDRESS,
} from "Component/MyAccountAddressPopup/MyAccountAddressPopup.config";

import Image from "Component/Image";
import SignInSignUpWithCityAreaPopup from "Component/SignInSignUpWithCityAreaPopup/index";
import MyAccountOverlay from "Component/MyAccountOverlay";
import MyAccountAddressPopup from "Component/MyAccountAddressPopup";
import CityAreaSelectionPopUp from "Component/CityAreaSelectionPopUp";
import DeliveryAddressPopUp from "Component/DeliveryAddressPopUp";
import DeliveryAddressPopUpWhenNoAddress from "Component/DeliveryAddressPopUpWhenNoAddress";

import address from "Component/PDPSummary/icons/address_black.svg";
import "./CityArea.style";

export const mapStateToProps = (state) => ({
  addresses: state.MyAccountReducer.addresses,
  customer: state.MyAccountReducer.customer,
  defaultShippingAddress: state.MyAccountReducer.defaultShippingAddress,
});
export const mapDispatchToProps = (dispatch) => ({
  showPopup: (payload) => dispatch(showPopup(ADDRESS_POPUP_ID, payload)),
  showAddEditAddressPopup: (payload) =>
    dispatch(showPopup(ADDRESS_POPUP_ID, payload)),
});

export const CityArea = (props) => {
  const [showPopUp, setShowPopUp] = useState(false);
  const [showSignInRegisterPopup, setShowSignInRegisterPopup] = useState(false);
  const [isRegisterScreen, setIsRegisterScreen] = useState(false);
  const [showCityAreaSelectionPopUp, setShowCityAreaSelectionPopUp] =
    useState(false);
  const [formContent, setFormContent] = useState(false);
  const [hideCards, setHideCards] = useState(false);
  const [addAndEditAddressButtonClicked, setAddAndEditAddressButtonClicked] =
    useState(false);
  const {
    addresses,
    customer,
    showPopup,
    showAddEditAddressPopup,
    defaultShippingAddress,
  } = props;

  const editSelectedAddress = (address) => {
    setAddAndEditAddressButtonClicked(true);
    openForm();
    showAddEditAddressPopup({
      action: EDIT_ADDRESS,
      title: __("Edit address"),
      address,
    });
    showHidePOPUP(false);
  };

  const addNewAddress = () => {
    setAddAndEditAddressButtonClicked(true);
    openForm();
    showAddEditAddressPopup({
      action: ADD_ADDRESS,
      title: __("Add new address"),
      address: {},
    });
    showHidePOPUP(false);
  };

  const openForm = () => {
    setFormContent(true);
  };

  const closeForm = () => {
    setFormContent(false);
  };

  const showCards = () => {
    closeForm();
    setHideCards(false);
    setAddAndEditAddressButtonClicked(false);
  };

  const renderForm = () => {
    if (!addAndEditAddressButtonClicked) {
      return null;
    }
    return (
      <div
        block="MyAccountAddressBook"
        elem="ContentWrapper"
        mods={{ formContent }}
      >
        <button
          block="MyAccountAddressBook"
          elem="backButton"
          mods={{ isArabic: isArabic() }}
          onClick={showCards}
        />
        <MyAccountAddressPopup
          formContent={formContent}
          closeForm={closeForm}
          openForm={openForm}
          showCards={showCards}
          customer={customer}
        />
      </div>
    );
  };

  const toggleRegisterScreen = (value) => {
    setIsRegisterScreen(value);
  };

  const showMyAccountPopup = () => {
    setShowSignInRegisterPopup(true);
    setShowPopUp(false);
  };

  const closePopup = () => {
    setShowSignInRegisterPopup(false);
  };

  const onSignIn = () => {
    closePopup();
  };

  const renderMyAccountOverlay = () => {
    if (!showSignInRegisterPopup) {
      return null;
    }
    return (
      <MyAccountOverlay
        closePopup={closePopup}
        onSignIn={onSignIn}
        isPopup
        showRegisterScreen={isRegisterScreen}
      />
    );
  };

  const showHidePOPUP = (val) => {
    setShowPopUp(val);
  };

  const showHideCityAreaSelection = (val) => {
    setShowCityAreaSelectionPopUp(val);
    showHidePOPUP(false);
  };

  const renderCityAreaSelectionPopUp = () => {
    return (
      <CityAreaSelectionPopUp
        showHideCityAreaSelection={showHideCityAreaSelection}
        showCityAreaSelectionPopUp={showCityAreaSelectionPopUp}
      />
    );
  };

  const renderAddressPopUp = () => {
    const countryWiseAddresses = addresses?.filter(
      (obj) => obj?.country_code === getCountryFromUrl()
    );

    if (countryWiseAddresses && countryWiseAddresses?.length > 0) {
      return (
        <DeliveryAddressPopUp
          showHidePOPUP={showHidePOPUP}
          showPopUp={showPopUp}
          countryWiseAddresses={countryWiseAddresses}
          editSelectedAddress={editSelectedAddress}
          addNewAddress={addNewAddress}
          defaultShippingAddress={defaultShippingAddress}
        />
      );
    } else {
      return (
        <DeliveryAddressPopUpWhenNoAddress
          showHidePOPUP={showHidePOPUP}
          showPopUp={showPopUp}
          showHideCityAreaSelection={showHideCityAreaSelection}
          addNewAddress={addNewAddress}
        />
      );
    }
  };

  const popUpForMobile = () => {
    if (!isSignedIn()) {
      return (
        <SignInSignUpWithCityAreaPopup
          renderMyAccountOverlay={showMyAccountPopup}
          toggleRegisterScreen={toggleRegisterScreen}
          showHidePOPUP={showHidePOPUP}
          showPopUp={showPopUp}
          showHideCityAreaSelection={showHideCityAreaSelection}
        />
      );
    } else {
      return renderAddressPopUp();
    }
  };

  const popUpForDesktop = () => {
    return null;
  };

  const cityAreaPopUp = () => {
    if (isMobile.any()) {
      return popUpForMobile();
    } else {
      return popUpForDesktop();
    }
  };

  return (
    <div block="cityAreaAddressSelection">
      {renderMyAccountOverlay()}
      {renderForm()}
      <Image lazyLoad={false} src={address} alt="" />
      <div block="cityAreaText" onClick={() => showHidePOPUP(true)}>
        {__("Select Area")}
      </div>
      {showPopUp && cityAreaPopUp()}
      {showCityAreaSelectionPopUp && renderCityAreaSelectionPopUp()}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CityArea);
