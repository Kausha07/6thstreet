import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import isMobile from "Util/Mobile";
import { getCountryFromUrl } from "Util/Url";
import { isArabic } from "Util/App";
import BrowserDatabase from "Util/BrowserDatabase";

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

import MyAccountDispatcher from "Store/MyAccount/MyAccount.dispatcher";
import { CART_ITEMS_CACHE_KEY } from "../../store/Cart/Cart.reducer";
import address from "Component/PDPSummary/icons/address_black.svg";
import "./CityArea.style";

export const mapStateToProps = (state) => ({
  addresses: state.MyAccountReducer.addresses,
  customer: state.MyAccountReducer.customer,
  defaultShippingAddress: state.MyAccountReducer.defaultShippingAddress,
  edd_info: state.AppConfig.edd_info,
  isSignedIn: state.MyAccountReducer.isSignedIn,
  cartItems: state.Cart.cartItems,
  isExpressDelivery: state.AppConfig.isExpressDelivery,
  EddAddress: state.MyAccountReducer.EddAddress,
  currentSelectedCityArea: state.MyAccountReducer.currentSelectedCityArea,
  pdpProduct: state.PDP.product,
});
export const mapDispatchToProps = (dispatch) => ({
  showPopup: (payload) => dispatch(showPopup(ADDRESS_POPUP_ID, payload)),
  showAddEditAddressPopup: (payload) =>
    dispatch(showPopup(ADDRESS_POPUP_ID, payload)),
  estimateEddResponse: (request, type) =>
    MyAccountDispatcher.estimateEddResponse(dispatch, request, type),
  expressService: (data) => MyAccountDispatcher.expressService(dispatch, data),
  selectedCityArea: (data) =>
    MyAccountDispatcher.selectedCityArea(dispatch, data),
  estimateEddResponseForPDP: (request) =>
    MyAccountDispatcher.estimateEddResponseForPDP(dispatch, request),
});

export const CityArea = (props) => {
  const {
    addresses,
    customer,
    showPopup,
    showAddEditAddressPopup,
    defaultShippingAddress,
    estimateEddResponse,
    edd_info,
    isSignedIn,
    isExpressDelivery,
    isPDP = false,
    isToMakeEDDCallPage = true,
    showBackgroundColor = true,
    showEllipsisArea = true,
    EddAddress,
    expressService,
    selectedCityArea,
    currentSelectedCityArea,
    pdpProduct,
    estimateEddResponseForPDP,
  } = props;

  const [showPopUp, setShowPopUp] = useState(false);
  const [showSignInRegisterPopup, setShowSignInRegisterPopup] = useState(false);
  const [isRegisterScreen, setIsRegisterScreen] = useState(false);
  const [showCityAreaSelectionPopUp, setShowCityAreaSelectionPopUp] =
    useState(false);
  const [formContent, setFormContent] = useState(false);
  const [hideCards, setHideCards] = useState(false);
  const [addAndEditAddressButtonClicked, setAddAndEditAddressButtonClicked] =
    useState(false);

  const [finalAreaText, setFinalAreaText] = useState(
    JSON.parse(localStorage?.getItem("EddAddressReq"))?.area
      ? JSON.parse(localStorage?.getItem("EddAddressReq"))?.area
      : defaultShippingAddress?.area
      ? defaultShippingAddress?.area
      : __("Select Area")
  );

  useEffect(() => {
    if (JSON.parse(localStorage?.getItem("EddAddressReq"))?.area) {
      setFinalAreaText(
        JSON.parse(localStorage?.getItem("EddAddressReq"))?.area
      );
    }
  }, [JSON.parse(localStorage?.getItem("EddAddressReq"))]);

  useEffect(() => {
    if (
      defaultShippingAddress?.area &&
      !JSON.parse(localStorage?.getItem("EddAddressReq"))?.area
    ) {
      setFinalAreaText(defaultShippingAddress?.area);
    }
  }, [defaultShippingAddress?.area]);

  useEffect(() => {
    if (!isPDP && isExpressDelivery) {
      const reqOBJ = JSON.parse(localStorage?.getItem("EddAddressReq"))
        ? JSON.parse(localStorage?.getItem("EddAddressReq"))
        : defaultShippingAddress
        ? defaultShippingAddress
        : {};
      let data = {
        city: reqOBJ?.city ? reqOBJ?.city : "",
        area: reqOBJ?.area ? reqOBJ?.area : "",
      };

      if (data?.city && data?.area) {
        expressService(data);
      }
    }
  }, [finalAreaText]);

  const editSelectedAddress = (address) => {
    setAddAndEditAddressButtonClicked(true);
    openForm();
    showAddEditAddressPopup({
      action: EDIT_ADDRESS,
      title: __("Edit address"),
      address,
      displayType: !isMobile.any() ? "desktopPopUp" : "",
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
      displayType: !isMobile.any() ? "desktopPopUp" : "",
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

    if (formContent) {
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
    }
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

  const getEddResponse = async (data, type) => {
    const { area = "", city = "", country_code = "" } = data;

    let request = {
      country: country_code || getCountryFromUrl(),
      city: city,
      area: area,
      courier: null,
      source: null,
    };
    let payload = {};

    if (edd_info?.has_item_level) {
      let items_in_cart = BrowserDatabase.getItem(CART_ITEMS_CACHE_KEY) || [];
      request.intl_vendors = null;
      let items = [];

      items_in_cart?.map((item) => {
        if (
          !(
            item &&
            item.full_item_info &&
            item.full_item_info.cross_border &&
            !edd_info.has_cross_border_enabled
          )
        ) {
          payload = {
            sku: item.sku,
            intl_vendor:
              item?.full_item_info?.cross_border &&
              edd_info.international_vendors &&
              item.full_item_info.international_vendor &&
              edd_info.international_vendors.indexOf(
                item.full_item_info.international_vendor
              ) > -1
                ? item.full_item_info.international_vendor
                : null,
          };
          payload["qty"] = parseInt(item?.full_item_info?.available_qty);
          payload["cross_border_qty"] = parseInt(
            item?.full_item_info?.cross_border_qty
          )
            ? parseInt(item?.full_item_info?.cross_border_qty)
            : "";
          payload["brand"] = item?.full_item_info?.brand_name;
          items.push(payload);
        }
      });
      request.items = items;

      if (items?.length) {
        await estimateEddResponse(request, type);
      }
    } else {
      await estimateEddResponse(request, type);
    }
  };

  const getEddForPDP = async (selectedArea = null, selectedCity = null) => {
    const {
      simple_products = {},
      international_vendor = null,
      brand_name = "",
    } = pdpProduct;
    if (
      edd_info &&
      edd_info.is_enable &&
      edd_info.has_pdp &&
      edd_info.has_item_level
    ) {
      let cross_border_qty = 0;
      if (typeof simple_products === "object" && simple_products !== null) {
        Object.values(simple_products).forEach((obj) => {
          if (
            parseInt(obj.cross_border_qty) &&
            parseInt(obj.quantity) <= parseInt(obj.cross_border_qty)
          ) {
            cross_border_qty = 1;
          }
        });
      }
      if (selectedArea && selectedCity) {
        let request = {
          country: getCountryFromUrl(),
          city: selectedCity,
          area: selectedArea,
          courier: null,
          source: null,
        };
        request.intl_vendors = null;
        let payload = {};
        if (!(cross_border_qty && !edd_info?.has_cross_border_enabled)) {
          let items = [];
          Object.keys(simple_products).map((sku) => {
            payload = {
              sku: sku,
              intl_vendor:
                edd_info.international_vendors &&
                international_vendor &&
                edd_info.international_vendors.indexOf(international_vendor) >
                  -1
                  ? international_vendor
                  : null,
            };

            payload["qty"] = parseInt(simple_products?.[sku]?.quantity);
            payload["cross_border_qty"] = parseInt(
              simple_products?.[sku]?.cross_border_qty
            )
              ? parseInt(simple_products?.[sku]?.cross_border_qty)
              : "";
            payload["brand"] = brand_name;

            items.push(payload);
          });
          request.items = items;
          if (items?.length) {
            await estimateEddResponseForPDP(request, true);
          }
        }
      }
    }
  };

  const autoPopulateCityArea = async (selectedAddress) => {
    const { area = "", city = "", country_code = "" } = selectedAddress;

    let requestObj = {
      country: country_code || getCountryFromUrl(),
      city: city,
      area: area,
      courier: null,
      source: null,
    };

    selectedCityArea(requestObj);

    localStorage.setItem("EddAddressReq", JSON.stringify(requestObj));

    if (window.pageType === "PRODUCT") {
      // checking this condition rather than isPDP bcz if we are on PDP page and
      // select address from the top header section then there's no EDD call for PDP
      await getEddForPDP(selectedAddress?.area, selectedAddress?.city);
      await getEddResponse(selectedAddress, true);
    } else if (isToMakeEDDCallPage) {
      await getEddResponse(selectedAddress, true);
    }

    const request = JSON.parse(localStorage.getItem("EddAddressReq"));
    setFinalAreaText(request?.area);
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
        autoPopulateCityArea={autoPopulateCityArea}
      />
    );
  };

  const renderAddressPopUp = () => {
    const countryWiseAddresses = addresses
      ?.filter((obj) => obj?.country_code === getCountryFromUrl())
      .sort((a, b) => {
        if (a.default_shipping === true && b.default_shipping !== true) {
          return -1;
        }
        if (a.default_shipping !== true && b.default_shipping === true) {
          return 1;
        }
        return 0;
      });

    if (countryWiseAddresses && countryWiseAddresses?.length > 0) {
      return (
        <DeliveryAddressPopUp
          showHidePOPUP={showHidePOPUP}
          showPopUp={showPopUp}
          countryWiseAddresses={countryWiseAddresses}
          editSelectedAddress={editSelectedAddress}
          addNewAddress={addNewAddress}
          defaultShippingAddress={defaultShippingAddress}
          autoPopulateCityArea={autoPopulateCityArea}
        />
      );
    } else {
      return (
        <DeliveryAddressPopUpWhenNoAddress
          showHidePOPUP={showHidePOPUP}
          showPopUp={showPopUp}
          showHideCityAreaSelection={showHideCityAreaSelection}
          addNewAddress={addNewAddress}
          customer={customer}
        />
      );
    }
  };

  const cityAreaPopUp = () => {
    if (!isSignedIn) {
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

  const render = () => {
    return (
      <div block="cityAreaAddressSelection">
        {renderMyAccountOverlay()}
        {renderForm()}
        <div
          block={`cityAreaDropdown  ${
            showBackgroundColor ? "showBackgroundColor" : ""
          }`}
          onClick={() => showHidePOPUP(!showPopUp)}
        >
          <img src={address} alt="" block="locationImage" />
          {finalAreaText && (
            <div
              block={`cityAreaText  ${
                showEllipsisArea ? "showEllipsisArea" : ""
              }`}
            >
              {finalAreaText}
            </div>
          )}
        </div>
        {showPopUp && cityAreaPopUp()}
        {showCityAreaSelectionPopUp && renderCityAreaSelectionPopUp()}
      </div>
    );
  };

  return isExpressDelivery ? render() : null;
};

export default connect(mapStateToProps, mapDispatchToProps)(CityArea);
