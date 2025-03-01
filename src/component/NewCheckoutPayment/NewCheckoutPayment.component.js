import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { getCountryFromUrl } from "Util/Url";
import isMobile from "Util/Mobile";
import { isArabic as checkIsArabic } from "Util/App";
import { isSignedIn } from "Util/Auth";

import CheckoutPayments from "Component/CheckoutPayments";
import PlaceOrderBtn from "Component/NewCheckoutPayment/utils/PlaceOrderBtn.component";
import { getTabbyInstallmentFromTotal } from "Component/NewCheckoutPayment/utils/NewCheckoutPayment.helper";
import { newCheckoutProcessPlaceOrder } from "Component/NewCheckoutPayment/utils/NewCheckoutPlaceOrder.helper";
import {
  processApplePayOrder,
  launchPaymentMethod,
  requestConfig,
} from "Component/NewCheckoutPayment/utils/ApplePay.helper";

import {
  CHECKOUT_APPLE_PAY,
  CARD,
  TAMARA,
} from "Component/CheckoutPayments/CheckoutPayments.config";

import MyAccountDispatcher from "Store/MyAccount/MyAccount.dispatcher";
import CheckoutDispatcher from "Store/Checkout/Checkout.dispatcher";
import CreditCardDispatcher from "Store/CreditCard/CreditCard.dispatcher";
import { showNotification } from "Store/Notification/Notification.action";

import "./NewCheckoutPayment.scss";

export const mapStateToProps = (state) => ({
  addresses: state.MyAccountReducer.addresses,
  customer: state.MyAccountReducer.customer,
  defaultShippingAddress: state.MyAccountReducer.defaultShippingAddress,
  currentSelectedCityArea: state.MyAccountReducer.currentSelectedCityArea,
  totals: state.CartReducer.cartTotals,
  savedCards: state.CreditCardReducer.savedCards,
  newCardVisible: state.CreditCardReducer.newCardVisible,
  processingRequest: state.CartReducer.processingRequest,
  isAddressSelected: state.CheckoutReducer.isAddressSelected,
  vwoData: state.AppConfig.vwoData,
  default_title: state.ConfigReducer.default_title,
  international_shipping_fee: state.AppConfig.international_shipping_amount,
  customer: state.MyAccountReducer.customer,
  processingPaymentSelectRequest:
    state.CartReducer.processingPaymentSelectRequest,
  processAddressChange: state.CheckoutReducer.processAddressChange,
});

export const mapDispatchToProps = (dispatch) => ({
  getTabbyInstallment: (price) =>
    CheckoutDispatcher.getTabbyInstallment(dispatch, price),
  createTabbySession: (code) =>
    CheckoutDispatcher.createTabbySession(dispatch, code),
  showErrorNotification: (message) =>
    dispatch(showNotification("error", message)),
  addNewCreditCard: (cardData) =>
    CreditCardDispatcher.addNewCreditCard(dispatch, cardData),
  getCardType: (bin) => CreditCardDispatcher.getCardType(dispatch, bin),
  removeBinPromotion: () => CheckoutDispatcher.removeBinPromotion(dispatch),
  showError: (message) => dispatch(showNotification("error", message)),
  showSuccessMessage: (message) =>
    dispatch(showNotification("success", message)),
  removeBinPromotion: () => CheckoutDispatcher.removeBinPromotion(dispatch),
});

const NewCheckoutPayment = (props) => {
  const {
    customer,
    addresses,
    cashOnDeliveryFee,
    setLoading,
    paymentMethods = [],
    setDetailsStep,
    shippingAddress,
    setCashOnDeliveryFee,
    savePaymentInformation,
    savePaymentInformationApplePay,
    default_title,
    international_shipping_fee,
    updateTotals,
    setTabbyWebUrl,
    setPaymentCode,
    binModal,
    processApplePay,
    placeOrder,
    isClickAndCollect,
    couponsItems,
    removeCouponFromCart,
    couponLists,
    applyCouponToCart,
    isClubApparelEnabled,
    type_of_identity,
    identity_number,
    validationError,
    onIdentityNumberChange,
    onTypeOfIdentityChange,
    onMailingAddressTypeChange,
    mailing_address_type,
    getTabbyInstallment,
    createTabbySession,
    totals,
    setShippingAddress,
    currentSelectedCityArea,
    showErrorNotification,
    showSuccessMessage,
    newCardVisible,
    savedCards,
    addNewCreditCard,
    getCardType,
    setCheckoutCreditCardData,
    getBinPromotion,
    removeBinPromotion,
    selectedPaymentMethod,
    processingRequest,
    processingPaymentSelectRequest,
    isAddressSelected,
    vwoData,
    showError,
    processAddressChange,
    placeOrderBtnEnable,
  } = props;

  const isSignedInUser = isSignedIn();
  const isArabic = checkIsArabic();
  const merchant_id = process.env.REACT_APP_CHECKOUT_COM_APPLE_MERCHANT_ID;

  const [currentPaymentMethod, setCurrentPaymentMethod] = useState(null);
  const [isTabbyInstallmentAvailable, setIsTabbyInstallmentAvailable] =
    useState(false);
  // below states are for credit card
  const [binApplied, setBinApplied] = useState(null);
  const [number, setNumber] = useState(null);
  const [expMonth, setExpMonth] = useState(null);
  const [expYear, setExpYear] = useState(null);
  const [cvv, setCvv] = useState(null);
  const [saveCard, setSaveCard] = useState(null);
  // COD limit
  const [isCODInLimit, setIsCODInLimit] = useState(true);
  const [isOrderButtonVisible, setIsOrderButtonVisible] = useState(true);
  const [isOrderButtonEnabled, setIsOrderButtonEnabled] = useState(true);
  const [dropdownToggleIcon, setDropdownToggleIcon] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  // For Apple Pay
  const [applePayDisabled, setApplePayDisabled] = useState(true);
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(
    !!window.ApplePaySession || false
  );
  const [applePayData, setApplePayData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const onPaymentMethodSelect = (code) => {
    setCurrentPaymentMethod(code);
    setPaymentCode(code);
  };

  // calling Tabby API
  const getTabbyData = async () => {
    const getTabbyDt = await getTabbyInstallmentFromTotal({
      getTabbyInstallment,
      createTabbySession,
      setTabbyWebUrl,
      totals,
      shippingAddress,
      currentSelectedCityArea,
    });

    if (getTabbyDt?.isTabbyInstallmentAvailable) {
      setIsTabbyInstallmentAvailable(true);
    }
  };

  const setCreditCardData = (data) => {
    const { number, expMonth, expYear, cvv, saveCard } = data;

    if (number) {
      setNumber(number);
    }

    if (expMonth) {
      setExpMonth(expMonth);
    }

    if (expYear) {
      setExpYear(expYear);
    }

    if (cvv) {
      setCvv(cvv);
    }
    if (binApplied) {
      if (newCardVisible && !number) {
        RemoveBinPromotion();
      }
      setBinApplied(false);
    }
    if (saveCard !== undefined && saveCard !== null) {
      setSaveCard(saveCard);
    }
  };

  // setting order button enable-disable
  const setOrderButtonEnableStatus = (isOrderButtonEnabled) =>
    setIsOrderButtonEnabled(isOrderButtonEnabled);

  const setOrderButtonDisabled = () => setIsOrderButtonEnabled(false);

  const setOrderButtonEnabled = () => setIsOrderButtonEnabled(true);

  const handleError = (e) => console.error(e);

  const resetBinApply = () => setBinApplied(false);

  // This is for new credit card - bin promotion
  const applyBinPromotion = async () => {
    const response = await getBinPromotion(number.substr("0", "6"));
    if (isSignedIn() && saveCard) {
      showSuccessMessage(__("Debit/Credit Card Added Successfully"));
    }
    binModal(response);
    await updateTotals();
    setBinApplied(true);
    setOrderButtonEnabled();
  };

  // This is for saved card - bin promotion
  const applyBinPromotionOnSavedCard = async () => {
    let selectedCard = savedCards.find((a) => a.selected === true);
    if (selectedCard && selectedCard.details) {
      //if saved card is selected
      const {
        details: { bin },
      } = selectedCard;
      const response = await getBinPromotion(bin);
      binModal(response);
      await updateTotals();
      setBinApplied(true);
    }
  };

  const RemoveBinPromotion = async () => {
    resetBinApply();
    await removeBinPromotion();
    await updateTotals();
  };

  // to Apply Promotion - passing this as prop
  const applyPromotionSavedCard = async () => {
    if (binApplied) {
      //if promotion already applied
      await RemoveBinPromotion();
      await applyBinPromotionOnSavedCard();
    } else {
      await applyBinPromotionOnSavedCard();
    }
  };

  //  to remove promotion --> passing this as prop
  const removePromotionSavedCard = async () => {
    await RemoveBinPromotion();
    resetBinApply();
  };

  const setLimitDisabled = () => setIsCODInLimit(true);

  const setLimitEnabled = () => setIsCODInLimit(false);

  const getCartError = (message) => {
    switch (message) {
      case "card_number_invalid":
        return __("Card number is not valid");
      case "card_expiry_month_invalid":
        return __("Card exp month is not valid");
      case "card_expiry_year_invalid":
        return __("Card exp year is not valid");
      case "cvv_invalid":
        return __("Card cvv is not valid");
      default:
        return __("Something went wrong");
    }
  };

  const onPlaceOrderClick = () => {
    newCheckoutProcessPlaceOrder({
      currentPaymentMethod,
      newCardVisible,
      binApplied,
      applyBinPromotion,
      setCheckoutCreditCardData,
      number,
      expMonth,
      expYear,
      cvv,
      saveCard,
      shippingAddress,
      getCardType,
      addNewCreditCard,
      savePaymentInformation,
      showErrorNotification,
      getCartError,
      handleError,
      savedCards,
    });
  };

  const onDropdownClicked = () => {
    setDropdownToggleIcon(!dropdownToggleIcon);
    setIsDropdownOpen(!isDropdownOpen);
  };

  // apple pay click
  const onApplePayClick = () => {
    processApplePayOrder({
      savePaymentInformationApplePay,
      totals,
      default_title,
      shippingAddress,
      international_shipping_fee,
      isClubApparelEnabled,
      customer,
      showError,
      placeOrder,
      isApplePayAvailable,
      merchant_id,
      isLoading,
      setIsLoading,
      applePayData,
    });
  };

  // initiate the apple pay
  const initiateApplePay = () => {
    launchPaymentMethod({
      isApplePayAvailable,
      merchant_id,
      showError,
      isLoading,
      setIsLoading,
      setApplePayDisabled,
    });
  };

  const renderActions = () => {
    if (!isAddressSelected) {
      return null;
    }
    return (
      <>
        <PlaceOrderBtn
          isCODInLimit={isCODInLimit}
          isOrderButtonVisible={isOrderButtonVisible}
          isOrderButtonEnabled={isOrderButtonEnabled}
          processingRequest={processingRequest}
          processingPaymentSelectRequest={processingPaymentSelectRequest}
          paymentMethod={currentPaymentMethod}
          applePayDisabled={applePayDisabled}
          binApplied={binApplied}
          newCardVisible={newCardVisible}
          processPlaceOrder={onPlaceOrderClick}
          onApplePayClick={onApplePayClick}
          applePayData={applePayData}
          totals={totals}
          vwoData={vwoData}
          dropdownToggleIcon={dropdownToggleIcon}
          isDropdownOpen={isDropdownOpen}
          onDropdownClicked={onDropdownClicked}
          isArabic={isArabic}
          processAddressChange={processAddressChange}
          placeOrderBtnEnable={placeOrderBtnEnable}
        />
      </>
    );
  };

  const renderPayments = () => {
    if (!paymentMethods.length) {
      return null;
    }
    return (
      <div className="paymentWrapper">
        <CheckoutPayments
          savePaymentInformationApplePay={savePaymentInformationApplePay}
          setCashOnDeliveryFee={setCashOnDeliveryFee}
          setLoading={setLoading}
          setDetailsStep={setDetailsStep}
          paymentMethods={paymentMethods}
          onPaymentMethodSelect={onPaymentMethodSelect}
          billingAddress={shippingAddress}
          setOrderButtonEnableStatus={setOrderButtonEnableStatus}
          setTabbyWebUrl={setTabbyWebUrl}
          setCreditCardData={setCreditCardData}
          setOrderButtonDisabled={setOrderButtonDisabled}
          setOrderButtonEnabled={setOrderButtonEnabled}
          resetBinApply={resetBinApply}
          processApplePay={processApplePay}
          placeOrder={placeOrder}
          isSignedIn={isSignedInUser}
          applyPromotionSavedCard={applyPromotionSavedCard}
          removePromotionSavedCard={removePromotionSavedCard}
          isClickAndCollect={isClickAndCollect}
          isTabbyInstallmentAvailable={isTabbyInstallmentAvailable}
          setLimitDisabled={setLimitDisabled}
          setLimitEnabled={setLimitEnabled}
        />
      </div>
    );
  };

  // write logic to render payment heading before adding address
  const renderHeading = (text, isDisabled) => {
    return (
      <h2 block="Checkout" elem="Heading" mods={{ isDisabled }}>
        {__(text)}
      </h2>
    );
  };

  useEffect(() => {
    const { email, firstname, lastname, phone, city, street } = shippingAddress;
    if (email && firstname && lastname && phone && city && street) {
      getTabbyData();
    }
  }, [shippingAddress]);

  useEffect(() => {
    if (currentPaymentMethod === CHECKOUT_APPLE_PAY && isApplePayAvailable) {
      requestConfig({ setIsLoading, setApplePayData }).then(initiateApplePay);
    }
  }, [currentPaymentMethod]);

  return (
    <div className="newCheckoutPayment">
      {isAddressSelected
        ? renderPayments()
        : renderHeading(__("Payment Options"), true)}
      {renderActions()}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(NewCheckoutPayment);
