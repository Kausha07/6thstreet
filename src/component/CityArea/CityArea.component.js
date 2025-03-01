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

import SignInSignUpWithCityAreaPopup from "Component/SignInSignUpWithCityAreaPopup/index";
import MyAccountOverlay from "Component/MyAccountOverlay";
import MyAccountAddressPopup from "Component/MyAccountAddressPopup";
import CityAreaSelectionPopUp from "Component/CityAreaSelectionPopUp";
import DeliveryAddressPopUp from "Component/DeliveryAddressPopUp";
import DeliveryAddressPopUpWhenNoAddress from "Component/DeliveryAddressPopUpWhenNoAddress";
import ModalWithOutsideClick from "Component/ModalWithOutsideClick";

import MyAccountDispatcher from "Store/MyAccount/MyAccount.dispatcher";
import CartDispatcher from "Store/Cart/Cart.dispatcher";
import { CART_ITEMS_CACHE_KEY } from "../../store/Cart/Cart.reducer";
import address from "Component/PDPSummary/icons/address_black.svg";
import { ChevronDown, ChevronLeft } from "Component/Icons";
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
  cartId: state.Cart.cartId,
  vwoData: state.AppConfig.vwoData,
  isAddressDeleted: state.MyAccountReducer.isAddressDeleted,
});

export const mapDispatchToProps = (dispatch) => ({
  showPopup: (payload) => dispatch(showPopup(ADDRESS_POPUP_ID, payload)),
  showAddEditAddressPopup: (payload) =>
    dispatch(showPopup(ADDRESS_POPUP_ID, payload)),
  estimateEddResponse: (request, type) =>
    MyAccountDispatcher.estimateEddResponse(dispatch, request, type),
  expressService: (data) => MyAccountDispatcher.expressService(dispatch, data),
  expressCutOffTime: () => MyAccountDispatcher.expressCutOffTime(dispatch),
  selectedCityArea: (data) =>
    MyAccountDispatcher.selectedCityArea(dispatch, data),
  estimateEddResponseForPDP: (request) =>
    MyAccountDispatcher.estimateEddResponseForPDP(dispatch, request),
  expressPopUpOpen: (val) =>
    MyAccountDispatcher.expressPopUpOpen(dispatch, val),
  setExpressPLPAddressForm: (val) =>
    MyAccountDispatcher.setExpressPLPAddressForm(dispatch, val),
  getCart: (cartId) => CartDispatcher.getCartTotals(dispatch, cartId),
  setPrevSelectedAddressForPLPFilters: (val) =>
    MyAccountDispatcher.setPrevSelectedAddressForPLPFilters(dispatch, val),
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
    showBackgroundColor = false,
    showEllipsisArea = true,
    EddAddress,
    expressService,
    selectedCityArea,
    currentSelectedCityArea,
    pdpProduct,
    estimateEddResponseForPDP,
    expressCutOffTime,
    isSignInTypePopUp,
    expressPopUpOpen,
    isNewCheckoutPage,
    onAddressSelectPopup,
    setExpressPLPAddressForm,
    showSignInPopUpForGuest = false,
    getCart,
    cartId,
    cartItems,
    renderSelectedAddressMsite = () => {},
    vwoData = {},
    setPrevSelectedAddressForPLPFilters,
    isAddressDeleted,
    onUpdateAddress,
    setCurrentAddress,
  } = props;

  const currentSelectedAddress = JSON.parse(
    localStorage.getItem("currentSelectedAddress")
  );
  const EddAddressReq = JSON.parse(localStorage.getItem("EddAddressReq"));
  const cityAreaFromSelectionPopUp = BrowserDatabase.getItem(
    "cityAreaFromSelectionPopUp"
  );
  const [showSignInRegisterPopup, setShowSignInRegisterPopup] = useState(false);
  const [isRegisterScreen, setIsRegisterScreen] = useState(false);
  const [showCityAreaSelectionPopUp, setShowCityAreaSelectionPopUp] =
    useState(false);
  const [formContent, setFormContent] = useState(false);
  const [hideCards, setHideCards] = useState(false);
  const [addAndEditAddressButtonClicked, setAddAndEditAddressButtonClicked] =
    useState(false);

  const [finalAreaText, setFinalAreaText] = useState(
    EddAddressReq?.area
      ? EddAddressReq?.area
      : cityAreaFromSelectionPopUp
      ? cityAreaFromSelectionPopUp?.area
      : defaultShippingAddress?.area
      ? defaultShippingAddress?.area
      : __("Select Area")
  );

  const [showPopUp, setShowPopUp] = useState(
    showSignInPopUpForGuest &&
      !isSignedIn &&
      !currentSelectedAddress &&
      !EddAddressReq &&
      [
        "/",
        "/men.html",
        "/women.html",
        "/kids.html",
        "/home.html",
        "/influencer.html",
      ].includes(location.pathname)
      ? showSignInPopUpForGuest
      : false
  );

  useEffect(() => {
    if (!isPDP && isExpressDelivery) {
      expressCutOffTime();
    }
  }, []);

  // Effect to update finalAreaText based on localStorage changes
  useEffect(() => {
    if (isExpressDelivery) {
      const reqOBJ = EddAddressReq;
      if (reqOBJ?.area) {
        setFinalAreaText(reqOBJ?.area);
        setShowPopUp(false);
        if (!isPDP && window.pageType === "PRODUCT" && isAddressDeleted) {
          getEddForPDP(reqOBJ?.area, reqOBJ?.city);
        }
      } else if (!isSignedIn || !reqOBJ) {
        setFinalAreaText(__("Select Area"));
      }
    }
  }, [EddAddressReq?.area]);

  useEffect(() => {
    if (isExpressDelivery) {
      const reqOBJ = EddAddressReq;
      if (reqOBJ?.area) {
        setFinalAreaText(reqOBJ?.area);
      } else if (!reqOBJ) {
        setFinalAreaText(__("Select Area"));
      }
    }
  }, [EddAddressReq]);

  useEffect(() => {
    if (
      defaultShippingAddress?.area &&
      !EddAddressReq?.area &&
      isExpressDelivery
    ) {
      setFinalAreaText(defaultShippingAddress?.area);
      localStorage.setItem(
        "currentSelectedAddress",
        JSON.stringify(defaultShippingAddress)
      );
      setShowPopUp(false);
      const {
        country_code = "",
        city = "",
        area = "",
      } = defaultShippingAddress;
      let requestObj = {
        country: country_code,
        city: city,
        area: area,
        courier: null,
        source: null,
      };
      localStorage.setItem("EddAddressReq", JSON.stringify(requestObj));
    }
  }, [defaultShippingAddress?.area]);

  useEffect(() => {
    if (!isPDP && isExpressDelivery) {
      const reqOBJ = cityAreaFromSelectionPopUp
        ? cityAreaFromSelectionPopUp
        : currentSelectedAddress
        ? currentSelectedAddress
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

  useEffect(() => {
    if (isExpressDelivery) {
      const reqOBJ = cityAreaFromSelectionPopUp;

      if (reqOBJ?.area) {
        setFinalAreaText(reqOBJ?.area);
      } else if (!reqOBJ) {
        setFinalAreaText(__("Select Area"));
      }
    }
  }, [cityAreaFromSelectionPopUp]);

  const setExpressPopUp = (val) => {
    expressPopUpOpen(val);
  };

  const editSelectedAddress = (address) => {
    showHidePOPUP(false);
    setAddAndEditAddressButtonClicked(true);
    setExpressPLPAddressForm(true);
    openForm();
    showAddEditAddressPopup({
      action: EDIT_ADDRESS,
      title: __("Edit address"),
      address,
      displayType: !isMobile.any() ? "desktopPopUp" : "",
      setCurrentAddress,
      onUpdateAddress,
    });
  };

  const addNewAddress = () => {
    showHidePOPUP(false);
    setAddAndEditAddressButtonClicked(true);
    setExpressPLPAddressForm(true);
    openForm();
    showAddEditAddressPopup({
      action: ADD_ADDRESS,
      title: __("Add new address"),
      address: {},
      displayType: !isMobile.any() ? "desktopPopUp" : "",
      setCurrentAddress,
      onUpdateAddress,
    });
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
        <ModalWithOutsideClick
          show={addAndEditAddressButtonClicked}
          onClose={() => {
            setExpressPopUp(false);
            return setAddAndEditAddressButtonClicked(false);
          }}
        >
          <div
            block="MyAccountAddressBook-Express"
            elem="ContentWrapper"
            mods={{ formContent }}
          >
            <span
              onClick={() => {
                showCards();
                setExpressPLPAddressForm(false);
              }}
              block="popUpBackArrow"
            >
              {" "}
              <ChevronLeft
                style={{
                  position: "fixed",
                  top: "30px",
                  left: "10px",
                  zIndex: "99999",
                  width: "20px",
                  height: "30px",
                }}
              />
            </span>
            <div block="PageWrapper" mods={{ isArabic: isArabic() }}>
              <MyAccountAddressPopup
                formContent={formContent}
                closeForm={closeForm}
                openForm={openForm}
                showCards={showCards}
                customer={customer}
              />
            </div>{" "}
          </div>
        </ModalWithOutsideClick>
      );
    }
  };

  const toggleRegisterScreen = (value) => {
    setIsRegisterScreen(value);
  };

  const showMyAccountPopup = () => {
    setShowSignInRegisterPopup(true);
    setShowPopUp(false);
    expressPopUpOpen(true);
  };

  const closePopup = () => {
    setShowSignInRegisterPopup(false);
    setExpressPopUp(false);
    setShowPopUp(false);
  };

  const onSignIn = () => {
    closePopup();
  };

  const addNewAddressOnCreateAccount = () => {
    // showHidePOPUP(false);
    setAddAndEditAddressButtonClicked(true);
    openForm();
    showAddEditAddressPopup({
      action: ADD_ADDRESS,
      title: __("Add new address"),
      address: {},
      displayType: !isMobile.any() ? "desktopPopUp" : "",
    });
  };

  const onCreateAccount = () => {
    setShowSignInRegisterPopup(false);
    addNewAddressOnCreateAccount();
  };

  const renderMyAccountOverlay = () => {
    if (!showSignInRegisterPopup) {
      return null;
    }
    return (
      <ModalWithOutsideClick
        show={showSignInRegisterPopup}
        onClose={() => closePopup}
      >
        <div block="PageWrapper" mods={{ isArabic: isArabic() }}>
          <MyAccountOverlay
            closePopup={closePopup}
            onSignIn={onSignIn}
            isPopup
            showRegisterScreen={isRegisterScreen}
            onCreateAccount={onCreateAccount}
          />
        </div>
      </ModalWithOutsideClick>
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
    const {
      area = "",
      city = "",
      country_code = "",
      area_ar = "",
      city_ar = "",
      isSelectedFromCitySelectionPopUp = false,
    } = selectedAddress;

    let requestObj = {
      country: country_code || getCountryFromUrl(),
      city: isArabic() && area_ar ? city_ar : city,
      area: isArabic() && area_ar ? area_ar : area,
      courier: null,
      source: null,
    };

    selectedCityArea(selectedAddress);
    if (isNewCheckoutPage) {
      onAddressSelectPopup(selectedAddress);
    }
    expressPopUpOpen(false);

    if (isSelectedFromCitySelectionPopUp) {
      setPrevSelectedAddressForPLPFilters(
        JSON.parse(localStorage.getItem("cityAreaFromSelectionPopUp"))
      );
    }

    if (!isSelectedFromCitySelectionPopUp) {
      setPrevSelectedAddressForPLPFilters(
        JSON.parse(localStorage.getItem("currentSelectedAddress"))
      );
    }

    if (!isSelectedFromCitySelectionPopUp) {
      localStorage.setItem("EddAddressReq", JSON.stringify(requestObj));
      localStorage.setItem(
        "currentSelectedAddress",
        JSON.stringify(selectedAddress)
      );
    }

    if (isSelectedFromCitySelectionPopUp) {
      BrowserDatabase.setItem(requestObj, "cityAreaFromSelectionPopUp");
    }

    // whenever you change address make get carts API call to send the current selected city and area to backend team in API params
    if (cartItems?.length > 0) {
      getCart(cartId);
    }

    if (window.pageType === "PRODUCT") {
      // checking this condition rather than isPDP bcz if we are on PDP page and
      // select address from the top header section then there's no EDD call for PDP
      await getEddForPDP(selectedAddress?.area, selectedAddress?.city);
      await getEddResponse(requestObj, true);
    } else if (isToMakeEDDCallPage) {
      await getEddResponse(requestObj, true);
    }

    const request = EddAddressReq;
    setFinalAreaText(request?.area);
  };

  const showHidePOPUP = (val) => {
    if (val) expressPopUpOpen(val);
    setShowPopUp(val);
  };

  const showHideCityAreaSelection = (val) => {
    showHidePOPUP(false);
    expressPopUpOpen(val);
    setShowCityAreaSelectionPopUp(val);
  };

  const renderCityAreaSelectionPopUp = () => {
    return (
      <CityAreaSelectionPopUp
        showHideCityAreaSelection={showHideCityAreaSelection}
        showCityAreaSelectionPopUp={showCityAreaSelectionPopUp}
        autoPopulateCityArea={autoPopulateCityArea}
        setExpressPopUp={setExpressPopUp}
      />
    );
  };

  const renderAddressPopUp = () => {
    let countryWiseAddresses = addresses?.filter(
      (obj) => obj?.country_code === getCountryFromUrl()
    );
    if (countryWiseAddresses && countryWiseAddresses?.length > 0) {
      return (
        <DeliveryAddressPopUp
          showHidePOPUP={showHidePOPUP}
          showPopUp={showPopUp}
          addresses={countryWiseAddresses}
          editSelectedAddress={editSelectedAddress}
          addNewAddress={addNewAddress}
          defaultShippingAddress={defaultShippingAddress}
          autoPopulateCityArea={autoPopulateCityArea}
          setExpressPopUp={setExpressPopUp}
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
          setExpressPopUp={setExpressPopUp}
          isSignInTypePopUp={isSignInTypePopUp}
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
          isSignInTypePopUp={isSignInTypePopUp}
          setExpressPopUp={setExpressPopUp}
        />
      );
    } else {
      return renderAddressPopUp();
    }
  };

  const render = () => {
    const isMobileDevice = isMobile.any() || isMobile.tablet();
    return (
      <div block="cityAreaAddressSelection" mods={{ isArabic: isArabic() }}>
        {renderMyAccountOverlay()}
        {renderForm()}
        {isNewCheckoutPage ? (
          isMobileDevice ? (
            <div
              onClick={() => {
                showHidePOPUP(true);
              }}
            >
              {renderSelectedAddressMsite()}
            </div>
          ) : (
            <p
              onClick={() => {
                showHidePOPUP(true);
              }}
              block="address-card"
              elem="change-address"
            >
              {__("Change Address")}
            </p>
          )
        ) : (
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
                }  ${
                  currentSelectedAddress?.area ||
                  cityAreaFromSelectionPopUp?.area
                    ? "colorBlack"
                    : "colorBlue"
                }`}
              >
                {finalAreaText}
              </div>
            )}
            <ChevronDown />
          </div>
        )}
        {showPopUp && cityAreaPopUp()}
        {showCityAreaSelectionPopUp && renderCityAreaSelectionPopUp()}
      </div>
    );
  };

  return (isExpressDelivery && vwoData?.Express?.isFeatureEnabled) ||
    isNewCheckoutPage
    ? render()
    : null;
};

export default connect(mapStateToProps, mapDispatchToProps)(CityArea);
