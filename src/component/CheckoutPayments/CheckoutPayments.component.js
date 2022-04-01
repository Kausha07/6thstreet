/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import PropTypes from "prop-types";
import isMobile from "Util/Mobile";

import CheckoutPayment from "Component/CheckoutPayment";
import { PAYMENTS_DATA } from "Component/CheckoutPayment/CheckoutPayment.config";
import tabbyAr from "Component/CheckoutPayment/icons/tabby-logo-black-ar@2x.png";
import CreditCard from "Component/CreditCard";
import Slider from "Component/Slider";
import TabbyMiniPopup from "Component/TabbyMiniPopup";
import {
  TABBY_TOOLTIP_INSTALLMENTS,
} from "Component/TabbyMiniPopup/TabbyMiniPopup.config";
import SourceCheckoutPayments from "SourceComponent/CheckoutPayments/CheckoutPayments.component";
import { isArabic } from "Util/App";
import Applepay from "./icons/apple-pay@3x.png";

import {
  CARD,
  CASH_ON_DELIVERY,
  CHECKOUT_APPLE_PAY,
  FREE,
  TABBY_ISTALLMENTS,
  TABBY_PAYMENT_CODES,
  CHECKOUT_QPAY,
} from "./CheckoutPayments.config";
import info from "./icons/info.png";
import Image from "Component/Image";

import "./CheckoutPayments.extended.style";

export class CheckoutPayments extends SourceCheckoutPayments {
  static propTypes = {
    ...SourceCheckoutPayments.propTypes,
    selectedPaymentCode: PropTypes.string,
    processApplePay: PropTypes.bool,
    placeOrder: PropTypes.func,
    isClickAndCollect: PropTypes.string.isRequired
  };

  static defaultProps = {
    ...SourceCheckoutPayments.defaultProps,
    selectedPaymentCode: "",
    processApplePay: true,
    placeOrder: () => { },
  };

  paymentRenderMap = {
    ...SourceCheckoutPayments.paymentRenderMap,
    [CARD]: this.renderCreditCard.bind(this),
    [CASH_ON_DELIVERY]: this.renderCashOnDelivery.bind(this),
    [TABBY_ISTALLMENTS]: this.renderTabbyPaymentMethods.bind(this),
    [CHECKOUT_APPLE_PAY]: this.renderApplePayMethods.bind(this),
    [FREE]: this.renderFree.bind(this),
    [CHECKOUT_QPAY]: this.renderQPay.bind(this),
  };

  state = {
    activeSliderImage: 0,
    tabbyPaymentMethods: [],
    tabbyIsRendered: false,
    tooltipContent: null,
    isArabic: isArabic(),
    isMobile: isMobile.any() || isMobile.tablet(),
  };
  componentDidMount() {
    const script = document.createElement("script");

    script.src = "https://checkout.tabby.ai/tabby-card.js";
    script.async = true;
    script.onload = function () {
      let s = document.createElement('script');
      s.type = 'text/javascript';
      const code = `new TabbyCard({
        selector: '#tabbyCard', // empty div for TabbyCard
        currency: 'AED', // or SAR, BHD, KWD; required, currency for your product
        price: '100.00', // required, price or your product
        lang: 'en', // or ar; optional, language of snippet and popups, if the property is not set, then it is based on the attribute 'lang' of your html tag
        size: 'narrow' // or wide
        });`;
      try {
        s.appendChild(document.createTextNode(code));
        document.body.appendChild(s);
      } catch (e) {
        s.text = code;
        document.body.appendChild(s);
      }
    }
    document.body.appendChild(script);
  }
  componentDidUpdate(prevProps) {
    const {
      selectedPaymentCode,
      totals: { total, currency_code },
    } = this.props;
    const { isArabic, isMobile } = this.state;
    if (selectedPaymentCode === TABBY_ISTALLMENTS) {
      const script = document.createElement("script");

      script.src = "https://checkout.tabby.ai/tabby-card.js";
      script.async = true;
      script.onload = function () {
        let s = document.createElement('script');
        s.type = 'text/javascript';
        const code = `new TabbyCard({
        selector: '#tabbyCard', // empty div for TabbyCard
        currency: '${currency_code}', // or SAR, BHD, KWD; required, currency for your product
        price: '${total}', // required, price or your product
        lang: '${isArabic ? `ar` : `en`}', // or ar; optional, language of snippet and popups, if the property is not set, then it is based on the attribute 'lang' of your html tag
        size: 'wide' // or wide
        });`;
        try {
          s.appendChild(document.createTextNode(code));
          document.body.appendChild(s);
        } catch (e) {
          s.text = code;
          document.body.appendChild(s);
        }
      }
      document.body.appendChild(script);
    }
  }
  handleChange = (activeImage) => {
    this.setState({ activeSliderImage: activeImage });
  };

  renderPayment = (method) => {
    const {
      selectPaymentMethod,
      selectedPaymentCode,
      setCashOnDeliveryFee,
      isTabbyInstallmentAvailable,
      isClickAndCollect
    } = this.props;
    const { m_code } = method;
    if (m_code === "msp_cashondelivery" && isClickAndCollect) {
      return null;
    }

    const isSelected = selectedPaymentCode === m_code;
    const { tabbyPaymentMethods = [] } = this.state;
    const isTabbySelected = TABBY_PAYMENT_CODES.includes(selectedPaymentCode);
    if (
      TABBY_PAYMENT_CODES.includes(m_code) &&
      tabbyPaymentMethods.length > 0
    ) {
      if (!isTabbyInstallmentAvailable) {
        return null;
      }
      return (
        <CheckoutPayment
          key={m_code}
          isSelected={isTabbySelected}
          method={method}
          onClick={selectPaymentMethod}
          setCashOnDeliveryFee={setCashOnDeliveryFee}
        />
      );
    }

    return (
      <CheckoutPayment
        key={m_code}
        isSelected={isSelected}
        method={method}
        onClick={selectPaymentMethod}
        setCashOnDeliveryFee={setCashOnDeliveryFee}
      />
    );
  };

  getSelectedMethodData = () => {
    const { paymentMethods, selectedPaymentCode } = this.props;
    const selectedMethod = paymentMethods.find(
      (method) => method.m_code === selectedPaymentCode
    );

    return selectedMethod;
  };

  renderCashOnDelivery() {
    const { isClickAndCollect } = this.props;
    if (isClickAndCollect) {
      return null;
    }

    const {
      options: { method_description, method_title },
    } = this.getSelectedMethodData();

    return (
      <div block="CheckoutPayments" elem="SelectedInfo">
        <h2 block="CheckoutPayments" elem="MethodTitle">
          {method_title}
        </h2>
        <p block="CheckoutPayments" elem="MethodDiscription">
          {method_description}
        </p>
      </div>
    );
  }

  renderFree() {
    return (
      <div block="CheckoutPayments" elem="SelectedInfo">
        <h2 block="CheckoutPayments" elem="MethodTitle">
          {__("Free")}
        </h2>
        <p block="CheckoutPayments" elem="MethodDiscription">
          {__("No Payment Information Required")}
        </p>
      </div>
    );
  }

  renderTabbyPaymentMethods() {
    const { tabbyPaymentMethods = [] } = this.state;
    return (
      <div block="CheckoutPayments" elem="TabbyPayments">
        <div block="CheckoutPayments" elem="TabbyPaymentsHeader">
          <h2>{__("Tabby")}</h2>
        </div>
        <div block="CheckoutPayments" elem="TabbyPaymentsContent">
          {tabbyPaymentMethods.map((method) =>
            this.renderTabbyPaymentMethod(method)
          )}
        </div>
      </div>
    );
  }

  renderQPay() {
    const {
      options: { method_description, method_title },
    } = this.getSelectedMethodData();
    return (
      <div block="CheckoutPayments" elem="SelectedInfo">
        <h2 block="CheckoutPayments" elem="MethodTitle">
          {method_title}
        </h2>
        <p block="CheckoutPayments" elem="MethodDiscription">
          {method_description}
        </p>
      </div>
    );
  }

  renderApplePayMethods() {
    const { isClickAndCollect } = this.props;
    if (isClickAndCollect) {
      return null;
    }

    const {
      options: { method_description, method_title },
    } = this.getSelectedMethodData();

    return (
      <div block="CheckoutPayments" elem="SelectedInfo">
        <h2 block="CheckoutPayments" elem="MethodTitle">
          {method_title}
        </h2>
        <p block="CheckoutPayments" elem="MethodDiscription">
          {method_description}
        </p>
        <div block="CheckoutPayments" elem="MethodImage">
          <img src={Applepay} alt="Apple pay" />
        </div>
      </div>
    );
  }

  renderTabbyPaymentMethod(method) {
    const { title, m_code } = method;
    const {
      selectPaymentMethod,
      selectedPaymentCode,
      isTabbyInstallmentAvailable,
      setCashOnDeliveryFee,
    } = this.props;
    const { img } = PAYMENTS_DATA[m_code];
    const { isArabic, isMobile } = this.state;

    const isSelected = m_code === selectedPaymentCode;

    if (
      (m_code === TABBY_ISTALLMENTS && !isTabbyInstallmentAvailable)
    ) {
      return null;
    }
    const check = isMobile ? true : false;

    return (
      <div block="CheckoutPayments" elem="TabbyPayment" key={m_code} mods={{ check }}>
        <div block="CheckoutPayments" elem="TabbyPaymentSelect" mods={{ check }}>
          <CheckoutPayment
            key={m_code}
            isSelected={isSelected}
            method={method}
            onClick={selectPaymentMethod}
            setCashOnDeliveryFee={setCashOnDeliveryFee}
          />
          {/* <img src={isArabic ? tabbyAr : img} alt={m_code} /> */}
          <img src={img} alt={m_code} />
        </div>
        <div block="CheckoutPayments" elem="TabbyPaymentContent">
          <div block="CheckoutPayments" elem="TabbyPaymentContentTitle">
            <button onClick={this.openTabbyInstallmentsTooltip}>
              <img src={info} alt="info" />
            </button>
          </div>
          <div id="tabbyCard"></div>
        </div>
      </div>
    );
  }

  renderHeading() {
    return (
      <h2 block="CheckoutPayments" elem="Heading">
        {__("Payment type")}
      </h2>
    );
  }

  renderSelectedPayment() {
    const { selectedPaymentCode } = this.props;

    const render = this.paymentRenderMap[selectedPaymentCode];
    if (!render) {
      return null;
    }

    return render();
  }

  renderCreditCard() {
    const {
      paymentMethods,
      setCreditCardData,
      setOrderButtonDisabled,
      setOrderButtonEnabled,
      applyPromotionSavedCard,
      removePromotionSavedCard,
      isSignedIn,
    } = this.props;
    const cardData = paymentMethods.find(({ m_code }) => m_code === CARD);

    return (
      <CreditCard
        cardData={cardData}
        isSignedIn={isSignedIn}
        setCreditCardData={setCreditCardData}
        setOrderButtonDisabled={setOrderButtonDisabled}
        setOrderButtonEnabled={setOrderButtonEnabled}
        applyPromotionSavedCard={applyPromotionSavedCard}
        removePromotionSavedCard={removePromotionSavedCard}
      />
    );
  }

  renderPayments() {
    const {
      paymentMethods = [],
      totals: { total },
    } = this.props;
    const { tabbyPaymentMethods = [] } = this.state;

    if (total === 0) {
      return this.renderPayment({ m_code: FREE });
    }

    const hasTabby = paymentMethods.some(({ code }) =>
      TABBY_PAYMENT_CODES.includes(code)
    );

    if (hasTabby && tabbyPaymentMethods.length === 0) {
      const tabbyPaymentMethods = paymentMethods.reduce((acc, method) => {
        const { code } = method;

        if (TABBY_PAYMENT_CODES.includes(code)) {
          acc.push(method);
        }

        return acc;
      }, []);

      this.setState({ tabbyPaymentMethods });
    }
    return paymentMethods.map(this.renderPayment);
  }

  renderContent() {
    const { hasError, activeSliderImage } = this.state;

    if (hasError) {
      return (
        <p>
          {__(
            "The error occurred during initializing payment methods. Please try again later!"
          )}
        </p>
      );
    }

    return (
      <>
        {this.renderHeading()}
        <ul block="CheckoutPayments" elem="Methods">
          <Slider
            activeImage={activeSliderImage}
            onActiveImageChange={this.handleChange}
          >
            {this.renderPayments()}
          </Slider>
        </ul>
        {this.renderSelectedPayment()}
        {/* {this.renderPayPal()} */}
      </>
    );
  }

  openTabbyInstallmentsTooltip = (e) => {
    e.preventDefault();
    this.setState({ tooltipContent: TABBY_TOOLTIP_INSTALLMENTS });
  };

  closeTabbyPopup = (e) => {
    e.preventDefault();
    this.setState({ tooltipContent: null });
  };

  renderTabbyPopup = () => {
    const { tooltipContent } = this.state;

    if (tooltipContent === TABBY_TOOLTIP_INSTALLMENTS) {
      return (
        <TabbyMiniPopup
          content={TABBY_TOOLTIP_INSTALLMENTS}
          closeTabbyPopup={this.closeTabbyPopup}
        />
      );
    }

    return null;
  };

  render() {
    return (
      <div block="CheckoutPayments" dir={this.state.isArabic ? "rtl" : "ltr"}>
        {this.renderContent()}
        {this.renderTabbyPopup()}
      </div>
    );
  }
}

export default CheckoutPayments;
