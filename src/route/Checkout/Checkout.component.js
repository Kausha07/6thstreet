/* eslint-disable no-magic-numbers */
import CheckoutBilling from "Component/CheckoutBilling";
import CheckoutFail from "Component/CheckoutFail";
import CheckoutGuestForm from "Component/CheckoutGuestForm";
import CheckoutOrderSummary from "Component/CheckoutOrderSummary";
import {
  TABBY_ISTALLMENTS,
  TABBY_PAY_LATER,
} from "Component/CheckoutPayments/CheckoutPayments.config";
import CheckoutShipping from "Component/CheckoutShipping";
import CheckoutSuccess from "Component/CheckoutSuccess";
import ContentWrapper from "Component/ContentWrapper";
import CreditCardPopup from "Component/CreditCardPopup";
import HeaderLogo from "Component/HeaderLogo";
import TabbyPopup from "Component/TabbyPopup";
import { TABBY_POPUP_ID } from "Component/TabbyPopup/TabbyPopup.config";
import PropTypes from "prop-types";
import Popup from "SourceComponent/Popup";
import { Checkout as SourceCheckout } from "SourceRoute/Checkout/Checkout.component";
import { TotalsType } from "Type/MiniCart";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import {
  AUTHORIZED_STATUS,
  BILLING_STEP,
  CAPTURED_STATUS,
  SHIPPING_STEP
} from "./Checkout.config";
import "./Checkout.style";
import GiftIconSmall from "./icons/gift-heart.png";
import GiftIconLarge from "./icons/gift-heart@3x.png";
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
    isTabbyPopupShown: PropTypes.bool,
    showOverlay: PropTypes.func.isRequired,
    hideActiveOverlay: PropTypes.func.isRequired,
    isClickAndCollect: PropTypes.bool.isRequired
  };

  state = {
    cashOnDeliveryFee: null,
    processingRequest: false,
    isCustomAddressExpanded: false,
    continueAsGuest: false,
    isInvalidEmail: false,
    isArabic: isArabic(),
    tabbyInstallmentsUrl: "",
    tabbyPayLaterUrl: "",
    tabbyPaymentId: "",
    tabbyPaymentStatus: "",
    paymentInformation: {},
    creditCardData: {},
    isSuccess: false,
    isOpen: false,
    isMobile: isMobile.any() || isMobile.tablet(),
    binInfo: {},
  };

  componentDidMount() {
    const paymentInformation = JSON.parse(localStorage.getItem("PAYMENT_INFO"));
    if (paymentInformation) {
      this.setState({ paymentInformation });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { paymentInformation } = this.state;
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
  }

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

  processTabbyWithTimeout(counter, paymentInformation) {
    const { tabbyPaymentStatus } = this.state;
    const { showErrorNotification, hideActiveOverlay, activeOverlay } =
      this.props;

    // Need to get payment data from Tabby.
    // Could not get callback of Tabby another way because Tabby is iframe in iframe
    if (
      tabbyPaymentStatus !== AUTHORIZED_STATUS &&
      tabbyPaymentStatus !== CAPTURED_STATUS &&
      counter < 60 &&
      activeOverlay === TABBY_POPUP_ID
    ) {
      setTimeout(() => {
        this.processTabby(paymentInformation);
        this.processTabbyWithTimeout(counter + 1, paymentInformation);
      }, 5000);
    }

    if (counter === 60) {
      showErrorNotification("Tabby session timeout");
      hideActiveOverlay();
    }

    if (counter === 60 || activeOverlay !== TABBY_POPUP_ID) {
      //this.setState({ isTabbyPopupShown: false });
    }
  }

  setTabbyWebUrl = (url, paymentId, type) => {
    this.setState({ tabbyPaymentId: paymentId });
    switch (type) {
      case TABBY_ISTALLMENTS:
        this.setState({ tabbyInstallmentsUrl: url });

        break;
      case TABBY_PAY_LATER:
        this.setState({ tabbyPayLaterUrl: url });

        break;
      default:
        break;
    }
  };

  setPaymentCode = (code) => {
    this.setState({ selectedPaymentMethod: code });
  };

  setCashOnDeliveryFee = (fee) => {
    this.setState({ cashOnDeliveryFee: fee });
  };

  renderLoader() {
    const { isLoading, checkoutStep , QPAYRedirect} = this.props;

    if ((checkoutStep === BILLING_STEP && isLoading) || (checkoutStep === SHIPPING_STEP && QPAYRedirect)) {
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
    const { checkoutTotals, checkoutStep, paymentTotals, processingRequest } =
      this.props;
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
                { isClickAndCollect ? __("Pick Up") : __("Delivery") }
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
      isClickAndCollect
    } = this.props;
    const { isArabic, cashOnDeliveryFee } = this.state;

    return (
      <>
        <div block="Checkout" elem="BackButtons" mods={{ isArabic }}>
          {isSignedIn ? null : (
            <button onClick={this.goBackLogin}>
              {this.renderHeading("Login / Sign Up", true)}
              <span>{__("Edit")}</span>
            </button>
          )}
          <button onClick={()=>setBillingStep()}>
            {this.renderHeading(__("Delivery Options"), true)}
            <span>{__("Edit")}</span>
          </button>
        </div>
        <CheckoutBilling
          cashOnDeliveryFee={cashOnDeliveryFee}
          setLoading={setLoading}
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
      isLoading
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

  renderTabbyIframe() {
    const { tabbyInstallmentsUrl, tabbyPayLaterUrl, selectedPaymentMethod } =
      this.state;
    const { isTabbyPopupShown } = this.props;
    if (!isTabbyPopupShown) {
      return null;
    }
    return (
      <TabbyPopup
        tabbyWebUrl={
          selectedPaymentMethod === TABBY_ISTALLMENTS
            ? tabbyInstallmentsUrl
            : tabbyPayLaterUrl
        }
      />
    );
  }

  renderDetailsStep() {
    const {
      orderID,
      shippingAddress,
      incrementID,
      isFailed,
      initialTotals,
      isVerificationCodeSent,
      newCardVisible,
      QPayDetails, 
      QPayOrderDetails
    } = this.props;
    const { cashOnDeliveryFee } = this.state;
    const {
      paymentInformation: { billing_address, paymentMethod, selectedCard },
      creditCardData,
    } = this.state;
    this.setState({ isSuccess: true });

    console.log("this.props checkoutsuccess", this.props)

    if (!isFailed) {
      return (
        <CheckoutSuccess
          orderID={orderID}
          incrementID={incrementID}
          shippingAddress={shippingAddress}
          billingAddress={billing_address}
          paymentMethod={paymentMethod}
          creditCardData={creditCardData}
          totals={initialTotals}
          cashOnDeliveryFee={cashOnDeliveryFee}
          isVerificationCodeSent={isVerificationCodeSent}
          QPAY_DETAILS={QPayDetails}
          selectedCard={newCardVisible ? {} : selectedCard}
          order = {QPayOrderDetails}
        />
      );
    }
    return (
      <CheckoutFail
        orderID={orderID}
        incrementID={incrementID}
        shippingAddress={shippingAddress}
        billingAddress={billing_address}
        paymentMethod={paymentMethod}
        creditCardData={creditCardData}
        totals={initialTotals}
        isVerificationCodeSent={isVerificationCodeSent}
        selectedCard={newCardVisible ? {} : selectedCard}
        QPAY_DETAILS={QPayDetails}
        order = {QPayOrderDetails}
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
      isClickAndCollect
    } = this.props;

    const { continueAsGuest, isArabic } = this.state;
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
        />
      </div>
    );

    return (
      <>
        {
          continueAsGuest || isSignedIn
          ?
          null
          :
          this.renderHeading(__("Login / Sign Up"), false)
        }
        <div block="Checkout" elem="GuestCheckout" mods={{ continueAsGuest }}>
          {continueAsGuest ? (
            <h3 block="Checkout" elem="DeliveryMessageGuest">
              { isClickAndCollect ? __("Please Confirm your contact details") : __("Where can we send your order?")}
            </h3>
          ) : null}
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
    const { history, goBack, setGender, setBillingStep ,checkoutStep} = this.props;

    if (isMobile) {
     
      const path = location.pathname.match(/checkout/);
   

      if (path) {
        if(checkoutStep ==="SHIPPING_STEP"){
          return history.push("/cart");
        }
        if (continueAsGuest) {
          this.continueAsGuest()
          setBillingStep()
        } else {
          setBillingStep()
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
              {isSuccess ? null : this.renderTitle()}
              {this.renderStep()}
              {this.renderLoader()}
            </div>
            <div block="Checkout" elem="WebDisplay">
              <div block="Checkout" elem="Additional">
                {this.renderSummary()}
                {this.renderPromo()}
                {this.renderTabbyIframe()}
                {this.renderCreditCardIframe()}
              </div>
            </div>
          </ContentWrapper>
        </main>
      </>
    );
  }
}

export default Checkout;
