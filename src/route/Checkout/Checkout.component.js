/* eslint-disable no-magic-numbers */
import CheckoutBilling from "Component/CheckoutBilling";
import CheckoutFail from "Component/CheckoutFail";
import CheckoutGuestForm from "Component/CheckoutGuestForm";
import CheckoutOrderSummary from "Component/CheckoutOrderSummary";
import { TABBY_ISTALLMENTS } from "Component/CheckoutPayments/CheckoutPayments.config";
import { connect } from "react-redux";
import { getStore } from "Store";
import CheckoutShipping from "Component/CheckoutShipping";
import CheckoutSuccess from "Component/CheckoutSuccess";
import ContentWrapper from "Component/ContentWrapper";
import CreditCardPopup from "Component/CreditCardPopup";
import HeaderLogo from "Component/HeaderLogo";
import PropTypes from "prop-types";
import CareemPay from "../../component/CareemPay/CareemPay";
import Popup from "SourceComponent/Popup";
import { Checkout as SourceCheckout } from "SourceRoute/Checkout/Checkout.component";
import { TotalsType } from "Type/MiniCart";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import Loader from "Component/Loader";
import {
  AUTHORIZED_STATUS,
  BILLING_STEP,
  CAPTURED_STATUS,
  SHIPPING_STEP,
} from "./Checkout.config";
import "./Checkout.style";
import { showNotification } from "Store/Notification/Notification.action";
import GiftIconSmall from "./icons/gift-heart.png";
import GiftIconLarge from "./icons/gift-heart@3x.png";
import Image from "Component/Image";
import CheckoutDispatcher from "Store/Checkout/Checkout.dispatcher";
import MyAccountDispatcher from "Store/MyAccount/MyAccount.dispatcher";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { processingPaymentSelectRequest } from "Store/Cart/Cart.action";
import Event, {
  EVENT_GTM_AUTHENTICATION,
  EVENT_CONTINUE_AS_GUEST,
  MOE_trackEvent
} from "Util/Event";
import BrowserDatabase from "Util/BrowserDatabase";
import {CART_ITEMS_CACHE_KEY} from "../../store/Cart/Cart.reducer";
import {
  CARD,
  FREE,
  CHECKOUT_APPLE_PAY,
} from "Component/CheckoutPayments/CheckoutPayments.config";
import { getFinalAddressInWords } from "Util/Common";
export const mapStateToProps = (state) => ({
  is_nationality_mandatory: state.AppConfig.is_nationality_mandatory,
  mailing_address_type: state.AppConfig.mailing_address_type,
})

export const mapDispatchToProps = (dispatch) => ({
  selectPaymentMethod: (code) =>
    CheckoutDispatcher.selectPaymentMethod(dispatch, code),
  finishPaymentRequest: (status) =>
    dispatch(processingPaymentSelectRequest(status)),
  showError: (message) => dispatch(showNotification("error", message)),
  estimateEddResponse: (code) =>
    MyAccountDispatcher.estimateEddResponse(dispatch, code),
  createOrder: (code, additional_data, eddItems) =>
    CheckoutDispatcher.createOrder(dispatch, code, additional_data, eddItems),
  showErrorNotification: (error) => dispatch(showNotification("error", error)),
});

export class Checkout extends SourceCheckout {
  static propTypes = {
    isSignedIn: PropTypes.bool.isRequired,
    processingRequest: PropTypes.bool,
    orderID: PropTypes.string.isRequired,
    incrementID: PropTypes.string.isRequired,
    shippingAddress: PropTypes.object.isRequired,
    setGender: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    threeDsUrl: PropTypes.string.isRequired,
    isFailed: PropTypes.bool.isRequired,
    processApplePay: PropTypes.bool.isRequired,
    initialTotals: TotalsType.isRequired,
    showOverlay: PropTypes.func.isRequired,
    hideActiveOverlay: PropTypes.func.isRequired,
    isClickAndCollect: PropTypes.string.isRequired,
    isClubApparelEnabled: PropTypes.bool,
  };

  state = {
    cashOnDeliveryFee: null,
    processingRequest: false,
    isCustomAddressExpanded: false,
    continueAsGuest: false,
    isInvalidEmail: false,
    isArabic: isArabic(),
    tabbyInstallmentsUrl: "",
    tabbyPaymentId: "",
    tabbyPaymentStatus: "",
    paymentInformation: {},
    creditCardData: {},
    isSuccess: false,
    isOpen: false,
    isMobile: isMobile.any() || isMobile.tablet(),
    binInfo: {},
    processingLoader: false,
    careemPayInfo:{},
    careemPayStatus: "",
    type_of_identity: "0",
    identity_number : "",
    validationError: false,
    isNationalityClick: true,
    isIdentityNumberModified: false,
    mailing_address_type: getFinalAddressInWords(this.props.mailing_address_type)?.["home"],
    placeOrderBtnEnable: false,
  };

  onIdentityNumberChange = (value) => {
    const isValidInput =
      (this.state.type_of_identity == 0 && /^\d{0,12}$/.test(value)) ||
      (this.state.type_of_identity == 1 && /^[a-zA-Z0-9]*$/.test(value));

    this.setState({ identity_number : value, validationError: !isValidInput });
  };

  onTypeOfIdentityChange = (typeOfIdentityValue) => {
    if(typeOfIdentityValue == 0) {
      this.setState({ type_of_identity : typeOfIdentityValue, isNationalityClick : true });
    }else {
      this.setState({ type_of_identity : typeOfIdentityValue, isNationalityClick : false });
    }
  };

  onMailingAddressTypeChange = (val) => {
    this.setState({ mailing_address_type: val });
  };

  getArabicCityArea = (city, area) => {
    const { addressCityData } = this.props;
    let finalArea = area;
    let finalCity = city;
    if (
      isArabic() &&
      addressCityData &&
      Object.values(addressCityData).length > 0
    ) {
      let finalResp = Object.values(addressCityData).filter((cityData) => {
        return cityData.city === city;
      });
      if (finalResp.length > 0) {
        let engAreaIndex = Object.keys(finalResp[0].areas).filter((key) => {
          if (finalResp[0].areas[key] === area) {
            return key;
          }
        });
        let arabicArea = Object.values(finalResp[0].areas_ar).filter(
          (area, index) => {
            if (index === parseInt(engAreaIndex[0])) {
              return area;
            }
          }
        );
        finalArea = arabicArea[0];
        finalCity = finalResp[0].city_ar;
      }
    }
    return { finalArea, finalCity };
  };

  componentDidMount() {
    const paymentInformation = JSON.parse(localStorage.getItem("PAYMENT_INFO"));
    if (paymentInformation) {
      this.setState({ paymentInformation });
    }
    const { estimateEddResponse, edd_info, addresses } = this.props;
    if (edd_info && edd_info.is_enable && addresses && addresses.length > 0) {
      const defaultAddress = addresses.find(
        ({ default_shipping }) => default_shipping === true
      );

      const { city, area, country_code } = defaultAddress ? defaultAddress : addresses[0];
      if(country_code == getCountryFromUrl()) {
        const { finalCity, finalArea } = this.getArabicCityArea(city, area);
        let request = {
          country: country_code,
          city: isArabic() ? finalCity : city,
          area: isArabic() ? finalArea : area,
          courier: null,
          source: null,
        };
        let payload = {};
        if(edd_info?.has_item_level) {
          let items_in_cart = BrowserDatabase.getItem(CART_ITEMS_CACHE_KEY) || [];
          request.intl_vendors=null;
          let items = [];
          items_in_cart.map(item => {
            if(!(item && item.full_item_info && item.full_item_info.cross_border && !edd_info.has_cross_border_enabled)) {
              payload = { sku : item.sku, intl_vendor : item?.full_item_info?.international_vendor && edd_info.international_vendors && edd_info.international_vendors.indexOf(item?.full_item_info?.international_vendor)>-1 ? item?.full_item_info?.international_vendor : null}
              payload["qty"] = parseInt(item?.full_item_info?.available_qty);
              payload["cross_border_qty"] = parseInt(item?.full_item_info?.cross_border_qty) ? parseInt(item?.full_item_info?.cross_border_qty) : "";
              payload["brand"] = item?.full_item_info?.brand_name;
              items.push(payload);
            }
          });
          request.items = items;
          if(items.length) estimateEddResponse(request, false);
        } else {
          estimateEddResponse(request, false);
        }
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { paymentInformation, cashOnDeliveryFee } = this.state;
    const { selectPaymentMethod, updateTotals, finishPaymentRequest } =
      this.props;
    const { checkoutStep } = this.props;
    const {
      Cart: { cartId },
    } = getStore().getState();
    const paymentInformationUpdated = JSON.parse(
      localStorage.getItem("PAYMENT_INFO")
    );

    if (
      prevState?.paymentInformation?.paymentMethod?.code !==
      paymentInformation?.paymentMethod?.code &&
      paymentInformationUpdated
    ) {
      this.setState({ paymentInformation: paymentInformationUpdated });
    }
    // if (checkoutStep === SHIPPING_STEP && cashOnDeliveryFee) {
    //   this.setState({ cashOnDeliveryFee: null });
    //   const countryCode = ["AE", "SA"].includes(getCountryFromUrl());
    //   selectPaymentMethod(
    //     countryCode && !!!window.ApplePaySession ? CHECKOUT_APPLE_PAY : CARD
    //   )
    //     .then(() => {
    //       updateTotals(cartId);
    //       finishPaymentRequest();
    //     })
    //     .catch(() => {
    //       const { showError } = this.props;
    //       showError(__("Something went wrong"));
    //     });
    // }
    if (
     ( prevState?.identity_number !== this.state?.identity_number ||
      prevState?.type_of_identity !== this.state?.type_of_identity) && !this.state.isIdentityNumberModified
    ) {
      this.setState({ isIdentityNumberModified: true });
    }
  }

  componentWillUnmount() {
    localStorage.removeItem("PAYMENT_INFO");
  }

  hideModalListener = () => {
    // Will hide bin promotion popup after 5 sec
    setTimeout(() => {
      this.hideOverlay();
    }, 5000);
  };

  showModal = (binInfo) => {
    const { isOpen } = this.state;
    const { showOverlay } = this.props;
    const { discount } = binInfo;
    if (discount && discount > 0) {
      showOverlay("BinPromotion");
      this.setState({ isOpen: true, binInfo: binInfo });
      this.hideModalListener();
    }
  };

  savePaymentInformation = (paymentInformation) => {
    const { savePaymentInformation, showErrorNotification } = this.props;
    //const { selectedPaymentMethod, tabbyInstallmentsUrl, tabbyPayLaterUrl } = this.state;
    this.setState({ paymentInformation });

    /* if (TABBY_PAYMENT_CODES.includes(selectedPaymentMethod)) {
            if (tabbyInstallmentsUrl || tabbyPayLaterUrl) {\

                this.setState({ isTabbyPopupShown: true });

                // Need to get payment data from Tabby.
                // Could not get callback of Tabby another way because Tabby is iframe in iframe
                setTimeout(
                    () => this.processTabbyWithTimeout(3, paymentInformation),
                    10000
                );
            } else {
                showErrorNotification(__('Something went wrong with Tabby'));
            }
        } else {
            const { tabbyPaymentId } = this.state;
            paymentInformation = {...paymentInformation,'tabbyPaymentId':tabbyPaymentId}
            savePaymentInformation(paymentInformation);
        }*/
    const { tabbyPaymentId } = this.state;
    paymentInformation = {
      ...paymentInformation,
      tabbyPaymentId: tabbyPaymentId,
    };
    savePaymentInformation(paymentInformation);
    return null;
  };

  savePaymentInformationApplePay = (paymentInformation) => {
    this.setState({ paymentInformation });
  };

  processTabby(paymentInformation) {
    const { savePaymentInformation, verifyPayment, checkoutStep } = this.props;
    const { tabbyPaymentId } = this.state;

    if (checkoutStep !== BILLING_STEP) {
      return;
    }

    verifyPayment(tabbyPaymentId).then(({ status }) => {
      if (status === AUTHORIZED_STATUS || status === CAPTURED_STATUS) {
        const { tabbyPaymentId } = this.state;
        paymentInformation = {
          ...paymentInformation,
          tabbyPaymentId: tabbyPaymentId,
        };
        savePaymentInformation(paymentInformation);
      }

      this.setState({ tabbyPaymentStatus: status });
    });
  }

  setTabbyWebUrl = (url, paymentId, type) => {
    const { setTabbyURL } = this.props;
    this.setState({ tabbyPaymentId: paymentId });
    switch (type) {
      case TABBY_ISTALLMENTS:
        this.setState({ tabbyInstallmentsUrl: url });
        setTabbyURL(url);
        break;
      default:
        break;
    }
  };

  setPaymentCode = (code) => {
    this.setState({ selectedPaymentMethod: code, placeOrderBtnEnable: true });
  };

  setCashOnDeliveryFee = (fee) => {
    this.setState({ cashOnDeliveryFee: fee });
  };

  setProcessingLoader=(curretStste)=>{
    this.setState({ processingLoader: curretStste});    
  }

  setPaymentinfoCareemPay= (payMethod, billingAddress) => {
    const { paymentInformation } = this.state;
    if(billingAddress){
      const newPaymentInformation = {...paymentInformation, billing_address: billingAddress};
      this.setState({ paymentInformation: newPaymentInformation });
    }else {
      const newPaymentInformation = {...paymentInformation, paymentMethod: {code: payMethod}}
      this.setState({ paymentInformation: newPaymentInformation });
    }
  }

  setCareemPayInfo = (careemPayInfo) => {
    this.setState({ careemPayInfo: careemPayInfo });
  }

  setCareemPayStatus = (careemPayStatus) => {
    this.setState({ careemPayStatus: careemPayStatus });
  }

  renderLoader() {
    const { isLoading, checkoutStep, PaymentRedirect } = this.props;
    const { processingLoader } = this.state;

    if (
      (checkoutStep === BILLING_STEP && isLoading) ||
      (checkoutStep === SHIPPING_STEP && PaymentRedirect) ||
      processingLoader
    ) {
      return (
        <div block="CheckoutSuccess">
          <div block="LoadingOverlay" dir="ltr">
            <p>{__("Processing Your Order")}</p>
          </div>
        </div>
      );
    }
    return null;
  }

  renderSummary() {
    const { cashOnDeliveryFee } = this.state;
    const {
      checkoutTotals,
      checkoutStep,
      paymentTotals,
      processingRequest,
      couponsItems=[],
      removeCouponFromCart,
      couponLists,
      applyCouponToCart,
      isClubApparelEnabled
    } = this.props;
    const { areTotalsVisible } = this.stepMap[checkoutStep];
    if (!areTotalsVisible) {
      return null;
    }

    return (
      <CheckoutOrderSummary
        checkoutStep={checkoutStep}
        totals={checkoutTotals}
        paymentTotals={paymentTotals}
        cashOnDeliveryFee={cashOnDeliveryFee}
        processingRequest={processingRequest}
        couponsItems={couponsItems}
        removeCouponFromCart={removeCouponFromCart}
        couponLists={couponLists}
        applyCouponToCart={applyCouponToCart}
        isClubApparelEnabled={isClubApparelEnabled}
      />
    );
  }

  renderTitle() {
    const { checkoutStep, isSignedIn, isClickAndCollect } = this.props;
    const { isCustomAddressExpanded, continueAsGuest } = this.state;
    const isBilling = checkoutStep === BILLING_STEP;

    return (
      (isSignedIn || continueAsGuest) && (
        <div block="CheckoutNavigation" mods={{ isCustomAddressExpanded }}>
          <div
            block="CheckoutNavigation"
            elem="FirstColumn"
            mods={{ checkoutStep }}
          >
            <button
              block="CheckoutNavigation"
              elem="NavButton"
              onClick={isBilling ? this.redirectURL : null}
            >
              <div
                block="CheckoutNavigation"
                elem="Delivery"
                mods={{ checkoutStep }}
              />
              <span
                block="CheckoutNavigation"
                elem="DeliveryLabel"
                mods={{ checkoutStep }}
              >
                {isClickAndCollect ? __("Pick Up") : __("Delivery")}
              </span>
            </button>
          </div>
          <hr />
          <div block="CheckoutNavigation" elem="SecondColumn">
            <div
              block="CheckoutNavigation"
              elem="Payment"
              mods={{ checkoutStep }}
            />
            <span
              block="CheckoutNavigation"
              elem="PaymentLabel"
              mods={{ checkoutStep }}
            >
              {__("Payment")}
            </span>
          </div>
        </div>
      )
    );
  }

  goBackLogin = () => {
    const { goBack } = this.props;
    this.setState({ continueAsGuest: false });
    goBack();
  };

  renderBillingStep() {
    const {
      setLoading,
      setDetailsStep,
      shippingAddress,
      paymentMethods = [],
      goBack,
      isSignedIn,
      processApplePay,
      placeOrder,
      getBinPromotion,
      updateTotals,
      setBillingStep,
      isClickAndCollect,
      addresses,
      isClubApparelEnabled
    } = this.props;
    const {
      isArabic,
      cashOnDeliveryFee,
      type_of_identity = 0,
      identity_number = "",
      validationError,
      mailing_address_type = "",
    } = this.state;

    const { 
      couponsItems=[],
      removeCouponFromCart,
      couponLists,
      applyCouponToCart,
    } = this.props;

    return (
      <>
        <div block="Checkout" elem="BackButtons" mods={{ isArabic }}>
          {isSignedIn ? null : (
            <button onClick={this.goBackLogin}>
              {this.renderHeading("Login / Sign Up", true)}
              <span>{__("Edit")}</span>
            </button>
          )}
          <button onClick={() => setBillingStep()}>
            {this.renderHeading(__("Delivery Options"), true)}
            <span>{__("Edit")}</span>
          </button>
        </div>
        <CheckoutBilling
          cashOnDeliveryFee={cashOnDeliveryFee}
          setLoading={setLoading}
          addresses={addresses}
          paymentMethods={paymentMethods}
          setDetailsStep={setDetailsStep}
          shippingAddress={shippingAddress}
          setCashOnDeliveryFee={this.setCashOnDeliveryFee}
          savePaymentInformation={this.savePaymentInformation}
          savePaymentInformationApplePay={this.savePaymentInformationApplePay}
          getBinPromotion={getBinPromotion}
          updateTotals={updateTotals}
          setTabbyWebUrl={this.setTabbyWebUrl}
          setPaymentCode={this.setPaymentCode}
          binModal={this.showModal}
          isSignedIn={isSignedIn}
          setCheckoutCreditCardData={this.setCheckoutCreditCardData}
          processApplePay={processApplePay}
          placeOrder={placeOrder}
          isClickAndCollect={isClickAndCollect}
          couponsItems={couponsItems}
          removeCouponFromCart={removeCouponFromCart}
          couponLists={couponLists}
          applyCouponToCart={applyCouponToCart}
          isClubApparelEnabled={isClubApparelEnabled}
          type_of_identity={type_of_identity}
          identity_number={identity_number}
          validationError={validationError}
          onIdentityNumberChange={this.onIdentityNumberChange}
          onTypeOfIdentityChange={this.onTypeOfIdentityChange}
          onMailingAddressTypeChange={this.onMailingAddressTypeChange}
          mailing_address_type={mailing_address_type}
        />
      </>
    );
  }

  setCheckoutCreditCardData = (
    number,
    expMonth,
    expYear,
    cvv,
    saveCard,
    email
  ) => {
    let creditCardData = {
      cvv,
      email,
      number,
      expMonth,
      expYear,
      saveCard,
    };
    this.setState({ creditCardData });
    this.props.updateCreditCardData(creditCardData);
  };

  continueAsGuest = () => {
    this.setState({ continueAsGuest: true });
    const eventDetails = {
      name: EVENT_CONTINUE_AS_GUEST,
      action: EVENT_CONTINUE_AS_GUEST,
      category: "checkout",
    };
    Event.dispatch(EVENT_GTM_AUTHENTICATION, eventDetails);
    MOE_trackEvent(EVENT_CONTINUE_AS_GUEST, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      app6thstreet_platform: "Web",
    });
  };

  changeEmail = () => {
    this.setState({ continueAsGuest: false });
  };

  renderHeading(text, isDisabled) {
    const { isSignedIn } = this.props;

    return (
      <h2 block="Checkout" elem="Heading" mods={{ isDisabled, isSignedIn }}>
        {__(text)}
      </h2>
    );
  }

  renderGuestForm() {
    const {
      checkoutStep,
      isCreateUser,
      onEmailChange,
      onCreateUserChange,
      onPasswordChange,
      isGuestEmailSaved,
      isLoading,
    } = this.props;
    const { continueAsGuest, isInvalidEmail } = this.state;
    const isBilling = checkoutStep === BILLING_STEP;
    return (
      <CheckoutGuestForm
        isLoading={isLoading}
        isBilling={isBilling}
        isCreateUser={isCreateUser}
        onEmailChange={onEmailChange}
        onCreateUserChange={onCreateUserChange}
        onPasswordChange={onPasswordChange}
        isGuestEmailSaved={isGuestEmailSaved}
        isEmailAdded={continueAsGuest}
        isInvalidEmail={isInvalidEmail}
      />
    );
  }

  renderCreditCardIframe() {
    const { threeDsUrl } = this.props;

    if (!threeDsUrl) {
      return null;
    }

    return <CreditCardPopup threeDsUrl={threeDsUrl} />;
  }

  renderDetailsStep() {
    const {
      guestAutoSignIn,
      orderID,
      shippingAddress,
      incrementID,
      isFailed,
      initialTotals,
      isVerificationCodeSent,
      newCardVisible,
      QPayDetails,
      QPayOrderDetails,
      KnetDetails,
      KNETOrderDetails,
      orderDetailsCartTotal = {},
      redirectPaymentMethod,
    } = this.props;
    const { cashOnDeliveryFee } = this.state;
    const {
      paymentInformation: { billing_address, paymentMethod, selectedCard },
      creditCardData,
      careemPayInfo,
      careemPayStatus,
    } = this.state;
    this.setState({ isSuccess: true });

    if (!isFailed) {
      return (
        <CheckoutSuccess
          orderID={orderID}
          incrementID={incrementID}
          isFailed={isFailed}
          shippingAddress={shippingAddress}
          billingAddress={billing_address}
          paymentMethod={paymentMethod}
          creditCardData={creditCardData}
          totals={initialTotals}
          cashOnDeliveryFee={cashOnDeliveryFee}
          isVerificationCodeSent={isVerificationCodeSent}
          QPAY_DETAILS={QPayDetails}
          selectedCard={newCardVisible ? {} : selectedCard}
          order={QPayOrderDetails ? QPayOrderDetails : KNETOrderDetails}
          KnetDetails={KnetDetails}
          KNETOrderDetails={KNETOrderDetails}
          guestAutoSignIn={guestAutoSignIn}
          orderDetailsCartTotal={orderDetailsCartTotal}
          redirectPaymentMethod={redirectPaymentMethod}
        />
      );
    }
    return (
      <CheckoutFail
        orderID={orderID}
        incrementID={incrementID}
        isFailed={isFailed}
        shippingAddress={shippingAddress}
        billingAddress={billing_address}
        paymentMethod={paymentMethod}
        creditCardData={creditCardData}
        totals={initialTotals}
        isVerificationCodeSent={isVerificationCodeSent}
        selectedCard={newCardVisible ? {} : selectedCard}
        QPAY_DETAILS={QPayDetails}
        order={QPayOrderDetails ? QPayOrderDetails : KNETOrderDetails}
        KnetDetails={KnetDetails}
        KNETOrderDetails={KNETOrderDetails}
        careemPayInfo={careemPayInfo}
        careemPayStatus={careemPayStatus}
        orderDetailsCartTotal={orderDetailsCartTotal}
        redirectPaymentMethod={redirectPaymentMethod}
      />
    );
  }

  renderShippingStep() {
    const {
      shippingMethods,
      onShippingEstimationFieldsChange,
      saveAddressInformation,
      isDeliveryOptionsLoading,
      email,
      checkoutTotals,
      isSignedIn,
      shippingAddress,
      setLoading,
      isLoading,
      isClickAndCollect,
      handleClickNCollectPayment,
      createOrder,
      setDetailsStep,
      orderID,
      setIsFailed,
      resetCart,
      setShippingAddressCareem,
      showErrorNotification,
      checkoutTotals: {
        total = 0,
      },
      config: { countries },
      config,
      is_nationality_mandatory = false,
      addresses,
      paymentMethods = [],
      getBinPromotion,
      updateTotals,
      processApplePay,
      placeOrder,
      couponsItems=[],
      removeCouponFromCart,
      couponLists,
      applyCouponToCart,
      isClubApparelEnabled,
      isAddressAdded,
      setIsAddressAdded,
      selectedPaymentMethod,
    } = this.props;

    let platform = "";
    platform = new URLSearchParams(window.location.search).get("platform");

    if (platform === "app") {
      return <Loader isLoading={true} />;
    }

    const isCareemPayDisplayToUser = isSignedIn ? (config?.is_carrempay_enable_loggedinuser) : true;    
    const {
      continueAsGuest,
      isArabic,
      type_of_identity = 0,
      identity_number = "",
      validationError = false,
      isIdentityNumberModified = false,
      mailing_address_type = "",
      cashOnDeliveryFee,
      placeOrderBtnEnable,
    } = this.state;
    const country_code = getCountryFromUrl();
    const isCareemPayAvailable = countries[country_code]?.is_careempay_enabled;
    const lang = isArabic ? "ar" : "en";
    const isCareemPayEnabled = isCareemPayAvailable ? isCareemPayAvailable[lang] : false;
    const renderCheckoutShipping = (
      <div block="Checkout" elem="Shipping" mods={isSignedIn}>
        {continueAsGuest ? this.renderHeading("Login / Sign Up", true) : null}
        <CheckoutShipping
          isLoading={isDeliveryOptionsLoading}
          isPaymentLoading={isLoading}
          shippingMethods={shippingMethods}
          saveAddressInformation={saveAddressInformation}
          onShippingEstimationFieldsChange={onShippingEstimationFieldsChange}
          guestEmail={email}
          totals={checkoutTotals}
          shippingAddress={shippingAddress}
          setLoading={setLoading}
          isClickAndCollect={isClickAndCollect}
          renderGuestForm={this.renderGuestForm.bind(this)}
          handleClickNCollectPayment={handleClickNCollectPayment}
          is_nationality_mandatory={is_nationality_mandatory}
          type_of_identity={type_of_identity}
          identity_number={identity_number}
          validationError={validationError}
          onIdentityNumberChange={this.onIdentityNumberChange}
          onTypeOfIdentityChange={this.onTypeOfIdentityChange}
          isIdentityNumberModified={isIdentityNumberModified}
          onMailingAddressTypeChange={this.onMailingAddressTypeChange}
          mailing_address_type={mailing_address_type}
          savePaymentInformationApplePay={this.savePaymentInformationApplePay}
          setCashOnDeliveryFee={this.setCashOnDeliveryFee}
          addresses={addresses}
          paymentMethods={paymentMethods}
          setDetailsStep={setDetailsStep}
          savePaymentInformation={this.savePaymentInformation}
          getBinPromotion={getBinPromotion}
          updateTotals={updateTotals}
          setTabbyWebUrl={this.setTabbyWebUrl}
          setPaymentCode={this.setPaymentCode}
          binModal={this.showModal}
          setCheckoutCreditCardData={this.setCheckoutCreditCardData}
          processApplePay={processApplePay}
          placeOrder={placeOrder}
          couponsItems={couponsItems}
          removeCouponFromCart={removeCouponFromCart}
          couponLists={couponLists}
          applyCouponToCart={applyCouponToCart}
          isClubApparelEnabled={isClubApparelEnabled}
          cashOnDeliveryFee={cashOnDeliveryFee}
          isAddressAdded={isAddressAdded}
          setIsAddressAdded={setIsAddressAdded}
          setShippingAddress={setShippingAddressCareem}
          selectedPaymentMethod={selectedPaymentMethod}
          placeOrderBtnEnable={placeOrderBtnEnable}
        />
      </div>
    );

    return (
      <>
        {continueAsGuest || isSignedIn
          ? null
          : this.renderHeading(__("Login / Sign Up"), false)}
        <div block="Checkout" elem="GuestCheckout" mods={{ continueAsGuest }}>
          {this.renderGuestForm()}
          <div
            block="Checkout"
            elem="GuestButton"
            mods={{ continueAsGuest, isSignedIn, isArabic }}
          >
            <button
              onClick={
                continueAsGuest ? this.changeEmail : this.continueAsGuest
              }
            >
              {continueAsGuest ? (
                <span>{__("Edit")}</span>
              ) : (
                <span>{__("Continue as guest")}</span>
              )}
            </button>
          </div>
          {continueAsGuest ? renderCheckoutShipping : null}
        </div>
        {/* Currently Careem Pay is only available for EN-AE Desktop site. */}
        { (isCareemPayEnabled && total != 0 && isCareemPayDisplayToUser) ? (
            <CareemPay 
              continueAsGuest={continueAsGuest}
              isSignedIn={isSignedIn}
              createOrder={createOrder}
              setDetailsStep={setDetailsStep}
              orderID={orderID}
              setLoading={setLoading}
              setIsFailed={setIsFailed}
              resetCart={resetCart}
              setShippingAddressCareem={setShippingAddressCareem}
              setProcessingLoader={this.setProcessingLoader}
              setPaymentinfoCareemPay={this.setPaymentinfoCareemPay}
              showErrorNotification={showErrorNotification}
              setCareemPayInfo={this.setCareemPayInfo}
              setCareemPayStatus={this.setCareemPayStatus}
            />
          ) : null}
        {isSignedIn ? renderCheckoutShipping : null}
        {continueAsGuest || isSignedIn
          ? null
          : this.renderHeading(__("Shipping Options"), true)}
        {continueAsGuest || isSignedIn
          ? null
          : this.renderHeading(__("Delivery Options"), true)}
        {continueAsGuest || isSignedIn
          ? null
          : this.renderHeading(__("Payment Options"), true)}
      </>
    );
  }

  redirectURL = () => {
    const { isMobile, continueAsGuest } = this.state;
    const { history, goBack, setGender, setBillingStep, checkoutStep } =
      this.props;

    if (isMobile) {
      const path = location.pathname.match(/checkout/);

      if (path) {
        if (checkoutStep === "SHIPPING_STEP") {
          return history.goBack();
        }
        if (continueAsGuest) {
          this.continueAsGuest();
          setBillingStep();
        } else {
          setBillingStep();
        }
      } else {
        goBack();
      }
    } else {
      setGender("women");
      history.push("/women.html");
    }
  };

  renderSecureShippingLabel() {
    const { isArabic } = this.state;

    return (
      <div block="CheckoutHeader" elem="SecureShipping" mods={{ isArabic }}>
        <span block="CheckoutHeader" elem="SecureShippingLabel">
          {__("Secure checkout")}
        </span>
      </div>
    );
  }

  renderBackToShoppingButton() {
    const { isArabic, isMobile } = this.state;

    return (
      <div
        block="CheckoutHeader"
        elem={isMobile ? "BackToShoppingMobile" : "BackToShoppingDesktop"}
        mods={{ isArabic }}
      >
        <button
          block={isMobile ? "BackMobileButton" : "button secondary medium"}
          onClick={this.redirectURL}
        >
          {isMobile ? " " : __("Back to shopping")}
        </button>
      </div>
    );
  }

  renderCheckoutHeder() {
    const { isMobile } = this.state;
    if (isMobile) {
      return this.renderBackToShoppingButton();
    }

    return (
      <div block="CheckoutHeader">
        {this.renderBackToShoppingButton()}
        <HeaderLogo key="logo" />
        {this.renderSecureShippingLabel()}
      </div>
    );
  }

  hideOverlay = () => {
    const { hideActiveOverlay } = this.props;
    this.setState({ isOpen: false, binInfo: {} });
    const { isMobile } = this.state;
    if (isMobile) {
      setTimeout(() => {
        hideActiveOverlay();
      }, 500);
    } else {
      hideActiveOverlay();
    }
  };

  renderContent() {
    const {
      isArabic,
      isMobile,
      isOpen,
      binInfo: { discount, details },
    } = this.state;

    const svg = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 -1 26 26"
      >
        <path
          d="M23.954 21.03l-9.184-9.095 9.092-9.174-1.832-1.807-9.09 9.179-9.176-9.088-1.81
                  1.81 9.186 9.105-9.095 9.184 1.81 1.81 9.112-9.192 9.18 9.1z"
        />
      </svg>
    );

    const giftImgUrl = isMobile ? GiftIconSmall : GiftIconLarge;

    return (
      <>
        <div block="BinContent" mods={{ isOpen }}>
          <button
            block="BinContent"
            elem="Close"
            mods={{ isArabic }}
            onClick={this.hideOverlay}
          >
            {svg}
          </button>
          <div block="Placeholder" onClick={this.hideOverlay}>
            <div block="Placeholder" elem="Line"></div>
          </div>
          <div block="BinContent" elem="Icon">
            <img src={giftImgUrl} alt="__('Gift Icon')" />
          </div>
          <h1 block="BinContent" elem="Title1">
            {__("Congrats!")}
          </h1>
          <h3 block="BinContent" elem="Title2">
            {__("You have received %s% off!", discount)}
          </h3>
          <p block="BinContent" elem="Description">
            {details}
          </p>
          <button block="BinContent" elem="Button" onClick={this.hideOverlay}>
            {__("Continue")}
          </button>
        </div>
      </>
    );
  }
  renderBinPromotion() {
    const {
      isArabic,
      isOpen,
      binInfo: { discount },
    } = this.state;

    return (
      <Popup
        clickOutside={false}
        mix={{
          block: "BinPromotion",
          elem: "Modal",
          mods: {
            isOpen,
            isArabic,
            isClosed: !isOpen,
          },
        }}
        id="BinPromotion"
      >
        {discount && discount > 0 ? this.renderContent() : null}
      </Popup>
    );
  }
  render() {
    const { isSuccess } = this.state;
    const { checkoutStep } = this.props;
    return (
      <>
        {this.renderBinPromotion()}
        {isSuccess ? null : this.renderCheckoutHeder()}
        <main block="Checkout" mods={{ isSuccess }}>
          <ContentWrapper
            wrapperMix={{ block: "Checkout", elem: "Wrapper" }}
            label={__("Checkout page")}
          >
            <div block="Checkout" elem="Step">
              {this.renderStep()}
              {this.renderLoader()}
            </div>
            <div block="Checkout" elem="WebDisplay">
              <div block="Checkout" elem="Additional">
                {this.renderSummary()}
                {this.renderPromo()}
                {this.renderCreditCardIframe()}
              </div>
            </div>
          </ContentWrapper>
        </main>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
