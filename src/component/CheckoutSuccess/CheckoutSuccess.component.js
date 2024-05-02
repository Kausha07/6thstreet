/* eslint-disable radix */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-magic-numbers */
import ChangePhonePopup from "Component/ChangePhonePopUp";
import { MINI_CARDS } from "Component/CreditCard/CreditCard.config";
import Field from "Component/Field";
import Form from "Component/Form";
import Link from "Component/Link";
import MyAccountOverlay from "Component/MyAccountOverlay";
import { getFinalPrice } from "Component/Price/Price.config";
import SuccessCheckoutItem from "Component/SuccessCheckoutItem";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { TotalsType } from "Type/MiniCart";
import MyAccountOrderViewItem from "Component/MyAccountOrderViewItem";
import { getDiscountFromTotals, isArabic, getCurrency } from "Util/App";
import "./CheckoutSuccess.style";
import Apple from "./icons/apple.png";
import Call from "./icons/call.svg";
import Cash from "./icons/cash.png";
import Confirm from "./icons/confirm.png";
import Mail from "./icons/mail.svg";
import SuccessCircle from "./icons/success-circle.png";
import TabbyAR from "./icons/tabby-ar.png";
import Tabby from "../../style/icons/tabby.png";
import Whatsapp from "./icons/whatsapp.svg";
import { Oval } from "react-loader-spinner";
import Image from "Component/Image";
import { TYPE_HOME } from "Route/UrlRewrites/UrlRewrites.config";
import { CAREEM_PAY } from "Component/CareemPay/CareemPay.config";
import {
  TAMARA,
} from "Component/CheckoutPayments/CheckoutPayments.config";
import { EarnedCashReward } from "./../MyWallet/HelperComponents/HelperComponents.js"
import Event, {
  EVENT_GTM_PURCHASE,
  EVENT_MOE_CONTINUE_SHOPPING,
  EVENT_PHONE,
  EVENT_MAIL,
  EVENT_MOE_CHAT,
  EVENT_SIGN_IN_CTA_CLICK,
  EVENT_GTM_AUTHENTICATION,
  EVENT_SIGN_IN_SCREEN_VIEWED,
  EVENT_LOGIN_CLICK,
  EVENT_VERIFICATION_CODE_SCREEN_VIEW,
  EVENT_RESEND_OTP_CLICK,
  EVENT_OTP_VERIFY_WITH_EMAIL,
  EVENT_OTP_VERIFY_WITH_PHONE,
  MOE_trackEvent,
} from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { isSignedIn as isSignedInFn } from "Util/Auth";
import { SECONDS_TO_RESEND_OTP } from "./../MyAccountOverlayV1/MyAccountOverlay.config";
import { lazy, Suspense } from "react";

const DynamicContentReferralBanner = lazy(() =>
  import(
    /* webpackChunkName: 'DynamicContentReferralBanner' */ "../DynamicContentReferralBanner"
  )
);
export class CheckoutSuccess extends PureComponent {
  constructor(props) {
    super(props);
    this.otpInput = React.createRef();
  }
  static propTypes = {
    initialTotals: TotalsType.isRequired,
    shippingAddress: PropTypes.object.isRequired,
    billingAddress: PropTypes.object.isRequired,
    paymentMethod: PropTypes.object.isRequired,
    creditCardData: PropTypes.object.isRequired,
    orderID: PropTypes.number.isRequired,
    incrementID: PropTypes.number.isRequired,
    isSignedIn: PropTypes.bool.isRequired,
    isVerificationCodeSent: PropTypes.bool.isRequired,
    requestCustomerData: PropTypes.func.isRequired,
    customer: PropTypes.isRequired,
    onVerifySuccess: PropTypes.func.isRequired,
    onResendCode: PropTypes.func.isRequired,
    isPhoneVerified: PropTypes.bool.isRequired,
    changePhone: PropTypes.func.isRequired,
    isChangePhonePopupOpen: PropTypes.bool.isRequired,
    toggleChangePhonePopup: PropTypes.func.isRequired,
    phone: PropTypes.string.isRequired,
    cashOnDeliveryFee: PropTypes.number.isRequired,
    selectedCard: PropTypes.object.isRequired,
  };

  state = {
    paymentTitle: "",
    isArabic: isArabic(),
    isPhoneVerification: true,
    delay: 1000,
    successHidden: false,
    wasLoaded: false,
    eventSent: false,
    popupEvent: false,
    otp: null,
    isVerifyEmailViewState: false,
    otpTimer: SECONDS_TO_RESEND_OTP,
    isTimerEnabled: false,
    eventSent: false,
    popupEvent: false,
    verifyScreenEventSent: false,
  };

  componentDidMount() {
    const { delay } = this.state;
    this.timer = setInterval(this.tick, delay);
    this.OtpTimerFunction();
  }

  componentDidUpdate(prevProps, prevState) {
    const { delay } = this.state;
    if (prevState !== delay) {
      clearInterval(this.interval);
      this.interval = setInterval(this.tick, delay);
    }

    if (
      this.state.otpTimer === 0 &&
      this.state.isTimerEnabled &&
      this.timerInterval != null
    ) {
      clearInterval(this.timerInterval);
    }
  }

  getCountryConfigs() {
    const {
      config: { countries },
      country,
    } = this.props;

    const {
      contact_using: {
        options: { phone },
      },
    } = countries[country];

    return {
      phone
    };
  }

  OtpTimerFunction() {
    if (this.timerInterval != null) {
      clearInterval(this.timerInterval);
    }
    this.setState({
      otpTimer: SECONDS_TO_RESEND_OTP,
    });
    this.timerInterval = setInterval(() => {
      this.setState({
        otpTimer: this.state.otpTimer - 1,
        isTimerEnabled: true,
      });
    }, 1000);
  }
  componentWillUnmount() {
    const { setCheckoutDetails } = this.props;
    setCheckoutDetails(false);
    if (this.timerInterval != null && this.state.isTimerEnabled) {
      clearInterval(this.timerInterval);
    }
  }
  tick = () => {
    const { wasLoaded, successHidden } = this.state;
    if (!successHidden) {
      this.setState({ successHidden: true });
    }
    if (!wasLoaded && successHidden) {
      this.setState({ wasLoaded: true });
    }
  };

  renderSuccessMessage = (email) => {
    const { isArabic } = this.state;

    return (
      <div block="SuccessMessage" mods={{ isArabic }}>
        <div block="SuccessMessage" elem="Icon" mods={{ isArabic }}>
          <img src={SuccessCircle} alt="success circle" />
        </div>
        <div block="SuccessMessage" elem="Text">
          <div block="SuccessMessage-Text" elem="Title">
            {__("Order Placed")}
          </div>
          <div block="SuccessMessage-Text" elem="Message">
            {__("Order confirmation has been sent to")}
          </div>
          <div block="SuccessMessage-Text" elem="Email">
            {email}
          </div>
        </div>
      </div>
    );
  };

  renderPhoneVerified() {
    const { isPhoneVerified } = this.props;
    const { isArabic } = this.state;

    if (!isPhoneVerified) {
      return null;
    }

    return (
      <div block="PhoneVerified" mods={{ isArabic }}>
        <div block="PhoneVerified" elem="Content" mods={{ isArabic }}>
          <div block="PhoneVerified" elem="Image">
            <img src={Confirm} alt="Verified" />
          </div>
          <div block="PhoneVerified" elem="Text">
            {__("Phone Verified")}
          </div>
        </div>
      </div>
    );
  }

  renderTrackOrder() {
    const {
      isSignedIn,
      orderID,
      onVerifySuccess,
      onResendCode,
      isPhoneVerified,
      toggleChangePhonePopup,
      phone,
      isVerificationCodeSent,
      guestAutoSignIn,
      onGuestAutoSignIn,
      isLoading,
      sendOTPOnMailOrPhone,
      email,
      otpError,
      OtpErrorClear,
      sendEvents,
    } = this.props;
    const {
      isArabic,
      isPhoneVerification,
      otp,
      isVerifyEmailViewState,
      verifyScreenEventSent,
    } = this.state;
    const countryCode = phone ? phone.slice(0, "4") : null;
    const phoneNumber = phone ? phone.slice("4") : null;
    const isNumber = (evt) => {
      const invalidChars = ["-", "+", "e", "E", "."];
      const abc = evt.target.value;
      if (invalidChars.includes(evt.key)) {
        evt.preventDefault();
        return false;
      }
      if (abc.length > 4) {
        return evt.preventDefault();
      }
    };
    const isSignedInState = isSignedInFn();

    if (
      (!isSignedInState && guestAutoSignIn && !verifyScreenEventSent) ||
      (!isPhoneVerified &&
        isVerificationCodeSent &&
        isSignedIn &&
        !verifyScreenEventSent)
    ) {
      sendEvents(EVENT_VERIFICATION_CODE_SCREEN_VIEW);
      this.setState({ verifyScreenEventSent: true });
    }
    if (!isPhoneVerified && isVerificationCodeSent && isSignedIn) {
      return (
        <div
          mix={{ block: "TrackOrder", mods: { isArabic, isPhoneVerification } }}
        >
          <div block="TrackOrder" elem="Text">
            <div block="TrackOrder-Text" elem="Title">
              {__("Please Verify your Number")}
            </div>
            <div block="TrackOrder-Text" elem="Message">
              {__("Verification code has been sent to")}
            </div>
            <div block="TrackOrder-Text" elem="Phone">
              <button onClick={toggleChangePhonePopup}>
                {`${countryCode} ${phoneNumber}`}
              </button>
            </div>
          </div>
          <Form onSubmitSuccess={onVerifySuccess}>
            <div block="TrackOrder" elem="Code" mods={{ isArabic }}>
              <Field
                maxlength="5"
                type="text"
                placeholder="_____"
                name="otp"
                id="otp"
              />
            </div>
            <button block="primary" type="submit">
              {__("Verify phone number")}
            </button>
          </Form>
          <div block="TrackOrder" elem="ResendCode">
            <button
              onClick={() => {
                onResendCode();
                sendEvents(EVENT_RESEND_OTP_CLICK);
              }}
            >
              {__("Resend Verification Code")}
            </button>
          </div>
        </div>
      );
    }

    if (!isPhoneVerified && !isVerificationCodeSent && isSignedIn) {
      return (
        <div mix={{ block: "TrackOrder", mods: { isArabic, isSignedIn } }}>
          <Link to={`/sales/order/view/order_id/${orderID}/`}>
            <button block="primary">{__("track your order")}</button>
          </Link>
        </div>
      );
    }

    if (isPhoneVerified && isSignedIn) {
      return (
        <div mix={{ block: "TrackOrder", mods: { isArabic, isSignedIn } }}>
          <Link to={`/sales/order/view/order_id/${orderID}/`}>
            <button block="primary">{__("track your order")}</button>
          </Link>
        </div>
      );
    }

    return (
      <>
        {!isSignedInState && guestAutoSignIn ? (
          <div mix={{ block: "VerifyPhone", mods: { isArabic } }}>
            <div block="VerifyPhone" elem="Text">
              <span block="VerifyPhone" elem="Text-Title">
                {__("Please enter verification code")}
              </span>
              <div block="VerifyPhone" elem="Text-Message">
                {__("To sign in and track your order")}
              </div>
              <div block="VerifyPhone" elem="Text-Phone">
                {isLoading ? (
                  <Oval
                    color="#333"
                    secondaryColor="#333"
                    height={30}
                    width={"100%"}
                    strokeWidth={3}
                    strokeWidthSecondary={3}
                  />
                ) : isVerifyEmailViewState ? (
                  <button>{`${email}`}</button>
                ) : (
                  <button>{`${countryCode} ${phoneNumber}`}</button>
                )}
              </div>
            </div>
            <div block="VerifyPhone" elem="Code" mods={{ isArabic }}>
              <input
                type="number"
                placeholder="&#9679; &nbsp; &#9679; &nbsp; &#9679; &nbsp; &#9679; &nbsp; &#9679;"
                name="otp"
                disabled={isLoading}
                id="otp"
                onKeyPress={(e) => isNumber(e)}
                onChange={(e) =>
                  onGuestAutoSignIn(e.target.value, isVerifyEmailViewState)
                }
                ref={this.otpInput}
              />
            </div>
            {otpError && (
              <div
                block="VerifyPhone"
                elem="ErrMessage"
                mods={{ isValidated: otpError.length !== 0 }}
              >
                {__(otpError)}
              </div>
            )}
            <div
              block="VerifyPhone"
              elem="OtpLoader"
              mods={{ isSubmitted: isLoading }}
            >
              <Oval
                color="#333"
                secondaryColor="#333"
                height={38}
                width={"100%"}
                strokeWidth={3}
                strokeWidthSecondary={3}
              />
            </div>

            <div
              block="VerifyPhone"
              elem="ResendCode"
              mods={{ isVerifying: !isLoading }}
            >
              <button
                onClick={() => {
                  onResendCode(isVerifyEmailViewState);
                  this.OtpTimerFunction();
                  this.otpInput.current.value = "";
                  OtpErrorClear();
                  sendEvents(EVENT_RESEND_OTP_CLICK);
                }}
                className={this.state.otpTimer > 0 ? "disableBtn" : ""}
                disabled={this.state.otpTimer > 0}
              >
                {this.state.otpTimer > 0 ? (
                  <span>
                    00 :
                    {this.state.otpTimer < 10
                      ? ` 0${this.state.otpTimer}`
                      : ` ${this.state.otpTimer}`}
                  </span>
                ) : (
                  __("Resend Code")
                )}
              </button>
            </div>
            <div className="VerifyEmail">
              <span>{__("Problems with verification code?")}</span>
              {!isVerifyEmailViewState ? (
                <button
                  disabled={this.state.otpTimer > 0}
                  className={
                    this.state.otpTimer > 0
                      ? "disableBtn VerifyEmailBtn"
                      : "VerifyEmailBtn"
                  }
                  onClick={() => {
                    this.setState({ isVerifyEmailViewState: true });
                    sendOTPOnMailOrPhone(true);
                    this.OtpTimerFunction();
                    this.otpInput.current.value = "";
                    OtpErrorClear();
                    sendEvents(EVENT_OTP_VERIFY_WITH_EMAIL);
                  }}
                >
                  {__("Verify with E-mail")}
                </button>
              ) : (
                <button
                  disabled={this.state.otpTimer > 0}
                  className={
                    this.state.otpTimer > 0
                      ? "disableBtn VerifyEmailBtn"
                      : "VerifyEmailBtn"
                  }
                  onClick={() => {
                    this.setState({ isVerifyEmailViewState: false });
                    sendOTPOnMailOrPhone(false);
                    this.OtpTimerFunction();
                    this.otpInput.current.value = "";
                    OtpErrorClear();
                    sendEvents(EVENT_OTP_VERIFY_WITH_PHONE);
                  }}
                >
                  {__("Verify with Phone")}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div mix={{ block: "TrackOrder", mods: { isArabic } }}>
            <div block="TrackOrder" elem="Text">
              <span block="TrackOrder" elem="Text-Title">
                {__("track your order")}
              </span>
              <span block="TrackOrder" elem="Text-SubTitle">
                {__("sign in to access your account and track your order")}
              </span>
            </div>
            <button
              block="secondary"
              onClick={() => {
                this.showMyAccountPopup();
                sendEvents(EVENT_LOGIN_CLICK);
              }}
            >
              {__("sign in")}
            </button>
          </div>
        )}
      </>
    );
  }

  showMyAccountPopup = () => {
    this.setState({ showPopup: true });
  };

  renderChangePhonePopUp = () => {
    const {
      changePhone,
      shippingAddress,
      toggleChangePhonePopup,
      isChangePhonePopupOpen,
    } = this.props;

    return (
      <ChangePhonePopup
        isChangePhonePopupOpen={isChangePhonePopupOpen}
        closeChangePhonePopup={toggleChangePhonePopup}
        changePhone={changePhone}
        countryId={shippingAddress.country_id}
      />
    );
  };

  renderMyAccountPopup() {
    const { showPopup, popupEvent } = this.state;
    const { billingAddress, newSignUpEnabled } = this.props;

    const email = billingAddress?.guest_email;

    if (!showPopup) {
      return null;
    }
    if (showPopup && !popupEvent && !newSignUpEnabled) {
      const eventDetails = {
        name: EVENT_SIGN_IN_CTA_CLICK,
        action: EVENT_SIGN_IN_CTA_CLICK,
        category: "thank_you",
      };
      Event.dispatch(EVENT_GTM_AUTHENTICATION, eventDetails);
      const popupEventData = {
        name: EVENT_SIGN_IN_SCREEN_VIEWED,
        category: "user_login",
        action: EVENT_SIGN_IN_SCREEN_VIEWED,
        popupSource: "Sign In CTA",
      };
      Event.dispatch(EVENT_GTM_AUTHENTICATION, popupEventData);
      this.setState({ popupEvent: true });
    }
    return (
      <MyAccountOverlay
        closePopup={this.closePopup}
        onSignIn={this.onSignIn}
        email={email}
        isPopup
        redirectToMyOrdersPage
      />
    );
  }

  onSignIn = () => {
    const { requestCustomerData } = this.props;

    // requestCustomerData();
    this.closePopup();
  };

  closePopup = () => {
    this.setState({ showPopup: false, popupEvent: false });
  };

  renderItem = (item) => {
    const {
      order: { base_currency_code: currency },
      eddResponse,
      intlEddResponse,
      isFailed,
      edd_info,
      paymentMethod,
      international_shipping_fee,
    } = this.props;

    return (
      <MyAccountOrderViewItem
        key={item.item_id}
        item={item}
        isFailed={isFailed}
        compRef={"checkout"}
        edd_info={edd_info}
        paymentMethod={paymentMethod}
        eddResponse={eddResponse}
        intlEddResponse={intlEddResponse}
        currency={currency}
        displayDiscountPercentage={true}
        international_shipping_fee={international_shipping_fee}
      />
    );
  };

  renderItemKnet = (item) => {
    const { isFailed } = this.props;
    let country_name = getCountryFromUrl();
    let txt_diff = {
      AE: __("AED"),
      SA: __("SAR"),
      KW: __("KWD"),
      QA: __("QAR"),
      OM: __("OMR"),
      BH: __("BHD"),
    };
    const currencyCode = txt_diff[country_name];
    const formattedCartItem = {
      item_id: item.item_id,
      product: {
          name: item.name,
          type_id: item.product_type,
          thumbnail: {
              url: item.thumbnail
          },
      },
      row_total: item.price || 0,
      sku: item.sku,
      qty: Math.round(item.qty_ordered),
      optionValue: item?.product_options?.info_buyRequest?.options?.US || item?.product_options?.info_buyRequest?.options?.EU || item?.product_options?.info_buyRequest?.options?.UK,
      thumbnail_url: item.thumbnail,
      basePrice: item.base_original_price,
      brand_name: item.brand_name,
      currency: currencyCode,
      full_item_info: item,
    };
    return (
      <SuccessCheckoutItem
        key={formattedCartItem.item_id}
        item={formattedCartItem}
        currency_code={formattedCartItem.currency}
        isEditing
        isFailed={isFailed}
        isLikeTable
      />
    )
  }

  renderTotalsItems() {
    const { paymentMethod, order } = this.props;
    if (
      (paymentMethod?.code === "checkout_qpay" ||
      paymentMethod?.code === "tabby_installments" ) && order
    ) {
      const {
        order: { status, unship = [], base_currency_code: currency },
        incrementID,
      } = this.props;

      return (
        <div block="TotalItems">
          <div block="TotalItems" elem="OrderId">
            {`${__("Order")} #${incrementID} ${__("Details")}`}
          </div>
          <ul block="TotalItems" elem="Items">
            {unship
              .reduce((acc, { items }) => [...acc, ...items], [])
              .filter(
                ({ qty_canceled, qty_ordered }) => +qty_canceled < +qty_ordered
              )
              .map(this.renderItem)}
          </ul>
        </div>
      );
    } else if (paymentMethod?.code === "checkout_knet" && order) {
      const {
        order: { unship = [], base_currency_code: currency },
        incrementID,
      } = this.props;

      return (
        <div block="TotalItems">
          <div block="TotalItems" elem="OrderId">
            {`${__("Order")} #${incrementID} ${__("Details")}`}
          </div>
          <ul block="TotalItems" elem="Items">
            {unship
              .reduce((acc, { items }) => [...acc, ...items], [])
              .filter(
                ({ qty_canceled, qty_ordered }) => +qty_canceled < +qty_ordered
              )
              .map(this.renderItemKnet)}
          </ul>
        </div>
      );
    } else {
      const {
        initialTotals: { items = [], quote_currency_code },
        incrementID,
        isFailed,
      } = this.props;

      if (!items || items.length < 1) {
        return <p>{__("There are no products in totals.")}</p>;
      }

      return (
        <div block="TotalItems">
          <div block="TotalItems" elem="OrderId">
          {(incrementID || incrementID != undefined) ? `${__("Order")} #${incrementID} ${__("Details")}` : "Order Details"}
          </div>
          <ul block="TotalItems" elem="Items">
            {items.map((item) => (
              <SuccessCheckoutItem
                key={item.item_id}
                item={item}
                currency_code={quote_currency_code}
                isEditing
                isFailed={isFailed}
                isLikeTable
              />
            ))}
          </ul>
        </div>
      );
    }
  }

  renderTotalPrice() {
    const { paymentMethod } = this.props;
    let fullPrice;
    if (
      paymentMethod?.code === "checkout_qpay" ||
      paymentMethod?.code === "tabby_installments"
    ) {
      const {
        order: { grand_total = 0, currency_code = getCurrency() },
      } = this.props;
      fullPrice = `${currency_code} ${grand_total}`;
    } else {
      const {
        initialTotals: { total, quote_currency_code },
      } = this.props;
      const finalPrice = getFinalPrice(total, quote_currency_code);
      fullPrice = `${quote_currency_code} ${finalPrice}`;
    }

    return (
      <div block="Totals">
        <div block="Totals" elem="TotalTitles">
          <span block="Title">{__("Total Amount")}</span>
          <span block="SubTitle">{__("(Taxes included)")}</span>
        </div>
        <div block="Totals" elem="TotalPrice">
          <div>{fullPrice}</div>
        </div>
      </div>
    );
  }

  renderPriceLine(price, name) {
    if (!price) {
      return null;
    }

    const {
      initialTotals: { quote_currency_code },
    } = this.props;
    const finalPrice = getFinalPrice(price, quote_currency_code);

    const fullPrice =
      finalPrice === __("FREE")
        ? finalPrice
        : `${quote_currency_code} ${finalPrice}`;

    return (
      <div block="Totals">
        <div block="Totals" elem="Title">
          <span>{name}</span>
        </div>
        <div block="Totals" elem="Price">
          <div>{fullPrice}</div>
        </div>
      </div>
    );
  }

  renderTotals = () => {
    const { isArabic } = this.state;
    const {
      cashOnDeliveryFee,
      initialTotals: { coupon_code: couponCode, discount, total_segments = [], items = [] },
      international_shipping_fee,
    } = this.props;
    let inventory_level_cross_border = false;
    items?.map((item) => {
      if (
        item?.full_item_info &&
        item?.full_item_info?.cross_border &&
        parseInt(item?.full_item_info.cross_border) > 0
      ) {
        inventory_level_cross_border = true;
      }
    });

    return (
      <div block="PriceTotals" mods={{ isArabic }}>
        {this.renderPriceLine(
          getDiscountFromTotals(total_segments, "subtotal"),
          __("Subtotal")
        )}
         {(!inventory_level_cross_border || !international_shipping_fee) &&
          this.renderPriceLine(
            getDiscountFromTotals(total_segments, "shipping") || __("FREE"),
            __("Shipping")
          )}
        {inventory_level_cross_border &&
          international_shipping_fee &&
          this.renderPriceLine(
            getDiscountFromTotals(total_segments, "intl_shipping") ||
              __("FREE"),
            __("International Shipping Fee")
          )}
        {cashOnDeliveryFee ? this.renderPriceLine(
            getDiscountFromTotals(total_segments, "msp_cashondelivery"),
          getCountryFromUrl() === "QA"
            ? __("Cash on Receiving Fee")
            : __("Cash on Delivery Fee")
        ) : null}
        {this.renderPriceLine(
          getDiscountFromTotals(total_segments, "customerbalance"),
          __("My Cash")
        )}
        {this.renderPriceLine(
          getDiscountFromTotals(total_segments, "reward"),
          __("My Rewards")
        )}
        {this.renderPriceLine(
          getDiscountFromTotals(total_segments, "clubapparel"),
          __("Club Apparel Redemption")
        )}
        {couponCode || (discount && discount != 0)
          ? this.renderPriceLine(discount, __("Discount"))
          : null}

        {this.renderTotalPrice()}
      </div>
    );
  };

  renderContact = () => {
    const { isArabic } = this.state;
    const {config} = this.props;
    const validateWhatsapp = config?.whatsapp_chatbot_phone ? config.whatsapp_chatbot_phone.replaceAll(/[^A-Z0-9]/ig, "") : null;
    const whatsappChat = `https://wa.me/${validateWhatsapp}`;
    const { phone } = this.getCountryConfigs();
    const updatedPhoneLink = phone ? phone.replaceAll(" ","") : null;
    return (
      <div block="ContactInfo" mods={{ isArabic }}>
        <div block="ContactInfo" elem="Links">
          <a
            href={`tel:${updatedPhoneLink}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => this.sendMOEEvents(EVENT_PHONE)}
          >
            <div block="ContactInfo" elem="Link">
              <span>
                <img src={Call} alt="Call" />
              </span>
              <span block="ContactInfo" elem="LinkName">
                {__("Phone")}
              </span>
            </div>
          </a>
          <a
            href={`mailto:${config?.support_email}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => this.sendMOEEvents(EVENT_MAIL)}
          >
            <div block="ContactInfo" elem="LinkMiddle">
              <span>
                <img src={Mail} alt="e-mail" />
              </span>
              <span block="ContactInfo" elem="LinkName">
                {__("Email")}
              </span>
            </div>
          </a>
          <a
            href={`${whatsappChat}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => this.sendMOEEvents(EVENT_MOE_CHAT)}
          >
            <div block="ContactInfo" elem="Link">
              <span>
                <img src={Whatsapp} alt="whatsapp" />
              </span>
              <span block="ContactInfo" elem="LinkName">
                {__("Whatsapp")}
              </span>
            </div>
          </a>
        </div>
        <div block="ContactInfo" elem="Timing">
          <span>{__("Customer service is available all days")}</span>
          <span>
            {__("from: ")}
            <span block="ContactInfo" elem="Time">
              {__("9am - 9pm")}
            </span>
          </span>
        </div>
      </div>
    );
  };

  renderClickAndCollectStoreName() {
    const {
      item: { extension_attributes },
    } = this.props;

    const { isArabic } = this.state;
    if (extension_attributes?.click_to_collect_store) {
      return (
        <div block="CartPageItem" elem="ClickAndCollect" mods={{ isArabic }}>
          <div block="CartPageItem-ClickAndCollect" elem="icon">
            <Store />
          </div>
          <div block="CartPageItem-ClickAndCollect" elem="StoreName">
            {extension_attributes?.click_to_collect_store_name}
          </div>
        </div>
      );
    }
    return null;
  }

  renderDeliveringAddress() {
    const {
      shippingAddress: {
        firstname,
        lastname,
        street,
        postcode,
        phone,
        city,
        country_id,
      },
    } = this.props;

    if(!firstname || !lastname || !postcode || !country_id || !city) {
      return null;
    }
    return (
      <div block="Address">
        <div block="Address" elem="Title">
          {__("Delivering to")}
        </div>
        <div block="Address" elem="FullName">
          {`${firstname} ${lastname}`}
        </div>
        <div block="Address" elem="Street">
          {street}, {postcode}
        </div>
        <div block="Address" elem="PostCode">
          {city} - {country_id}
        </div>
      </div>
    );
  }

  renderBillingAddress() {
    const {
      billingAddress: { firstname, lastname, street, postcode, phone },
    } = this.props;

    return (
      <div block="Address">
        <div block="Address" elem="Title">
          {__("Billing Address")}
        </div>
        <div block="Address" elem="FullName">
          {`${firstname} ${lastname}`}
        </div>
        <div block="Address" elem="Street">
          {street}
        </div>
        <div block="Address" elem="PostCode">
          {postcode}
        </div>
        <div block="Address" elem="Phone">
          {phone}
        </div>
      </div>
    );
  }

  renderAddresses = () => (
    <div block="Addresses">{this.renderDeliveringAddress()}</div>
  );

  renderDeliveryOption = () => (
    <div block="DeliveryOptions">
      <div block="DeliveryOptions" elem="Title">
        {__("Delivery Options")}
      </div>
      <div block="DeliveryOptions" elem="Option">
        {__("FREE (Standard Delivery)")}
      </div>
    </div>
  );

  renderKnetStatus = () => {
    const { KnetDetails } = this.props;
    const { status } = KnetDetails;
    if (status === "SUCCESS") {
      return __("SUCCESS");
    } else if (status === "FAILED") {
      return __("FAILED");
    }
  };

  renderKNETPaymentType = () => {
    const { KnetDetails, paymentMethod } = this.props;
    const { isArabic } = this.state;
    const {
      amount,
      bank_reference,
      currency,
      date,
      knet_payment_id,
      knet_transaction_id,
      status,
    } = KnetDetails;
    return (
      <>
        <br />
        <br />
        {paymentMethod?.code === "checkout_knet" && KnetDetails && (
          <>
            {KnetDetails?.knet_payment_id && (
              <>
                {" "}
                <div block="PaymentType" elem="Title">
                  {__("KNET Payment Id")}
                </div>
                {KnetDetails?.knet_payment_id}
                <br />
                <br />{" "}
              </>
            )}

            {KnetDetails?.knet_transaction_id && (
              <>
                {" "}
                <div block="PaymentType" elem="Title">
                  {__("KNET Transaction Id")}
                </div>
                {KnetDetails?.knet_transaction_id}
                <br />
                <br />{" "}
              </>
            )}

            {KnetDetails?.amount && (
              <>
                {" "}
                <div block="PaymentType" elem="Title">
                  {__("Amount")}
                </div>
                {currency} {KnetDetails?.amount}
                <br />
                <br />{" "}
              </>
            )}
            <div block="PaymentType" elem="Title">
              {__("Status")}
            </div>
            {isArabic ? this.renderKnetStatus() : status}
            <br />
            <br />
            <div block="PaymentType" elem="Title">
              {__("Date")}
            </div>
            {date}
            <br />
            <br />
          </>
        )}
      </>
    );
  };

  renderPaymentType = () => {
    const { isArabic } = this.state;
    const { QPAY_DETAILS, paymentMethod, KnetDetails } = this.props;
    const { PUN, date, status } = QPAY_DETAILS;
    return (
      <>
        <div block="PaymentType" mods={{ isArabic }}>
          <div block="PaymentType" elem="Title">
            {__("Payment")}
          </div>
          {this.renderPaymentTypeContent()}
          {paymentMethod?.code === "checkout_knet"
            ? this.renderKNETPaymentType()
            : null}
          <p></p>
          {paymentMethod?.code === "checkout_qpay" && QPAY_DETAILS && (
            <>
              <div block="PaymentType" elem="Title">
                {__("PUN")}
              </div>
              {PUN}
              <p></p>
              {QPAY_DETAILS?.Payment_ID && (
                <>
                  {" "}
                  <div block="PaymentType" elem="Title">
                    {__("Payment ID")}
                  </div>
                  {QPAY_DETAILS?.Payment_ID}
                  <p></p>{" "}
                </>
              )}
              {QPAY_DETAILS?.amount && (
                <>
                  {" "}
                  <div block="PaymentType" elem="Title">
                    {__("Amount")}
                  </div>
                  {QPAY_DETAILS?.amount}
                  <p></p>{" "}
                </>
              )}
              <div block="PaymentType" elem="Title">
                {__("Status")}
              </div>
              {status}
              <p></p>
              <div block="PaymentType" elem="Title">
                {__("Date")}
              </div>
              {date}
              <p></p>
            </>
          )}
          {paymentMethod?.code === CAREEM_PAY ? ("Careem Pay") : null}
          {paymentMethod?.code === TAMARA ? ("Tamara") : null}
        </div>
      </>
    );
  };

  // to check for the Mada card
  getIsMadaCard(numbers) {
    const { config } = this.props;
    const madaBinTable = config?.bin_table?.mada || {};
    const digitCountOfNumber = numbers.toString().length;

    for (const key in madaBinTable) {
        const values = madaBinTable[key];
        const number = numbers.slice(0, parseInt(key));
    
        if (
          digitCountOfNumber >= parseInt(key) &&
          values.includes(parseInt(number))
        ) {
          return true;
        }
    }
    return false;
  }

  renderCardLogo() {
    const {
      creditCardData: { number = "" },
    } = this.props;
    const { visa, mastercard, amex, mada } = MINI_CARDS;
    const first = parseInt(number.charAt(0));
    const second = parseInt(number.charAt(1));
    const isMadaCard = this.getIsMadaCard(number);

    if (isMadaCard) {
      return <img src={mada} alt="card icon" />;
    }

    if (first === 4) {
      return <img src={visa} alt="card icon" />;
    }

    if (first === 5) {
      return <img src={mastercard} alt="card icon" />;
    }

    if (first === 3 && (second === 4 || second === 7)) {
      return <img src={amex} alt="card icon" />;
    }

    return null;
  }

  renderMiniCard(miniCard) {
    const img = MINI_CARDS[miniCard];
    if (img) {
      return <img src={img} alt="card icon" />;
    }
    return null;
  }

  renderPaymentTypeContent = () => {
    const {
      creditCardData: { number = "", expMonth, expYear, cvv },
      paymentMethod,
      initialTotals: { total_segments = [] },
      selectedCard,
    } = this.props;
    if (
      number &&
      expMonth &&
      expYear &&
      cvv &&
      !paymentMethod?.code?.match(/cash/)
    ) {
      const displayNumberDigits = 4;
      const slicedNumber = number.slice(number.length - displayNumberDigits);

      return (
        <div block="Details">
          <div block="Details" elem="TypeLogo">
            {this.renderCardLogo()}
          </div>
          <div block="Details" elem="Number">
            <div block="Details" elem="Number-Dots">
              <div />
              <div />
              <div />
              <div />
            </div>
            <div block="Details" elem="Number-Value">
              {slicedNumber}
            </div>
          </div>
        </div>
      );
    } else if (selectedCard && Object.keys(selectedCard).length > 0) {
      //payment done from saved cards
      const {
        details: { scheme, expirationDate, maskedCC },
      } = selectedCard;
      return (
        <div block="Details">
          <div block="Details" elem="TypeLogo">
            {this.renderMiniCard(scheme.toLowerCase())}
          </div>
          <div block="Details" elem="Number">
            <div block="Details" elem="Number-Dots">
              <div />
              <div />
              <div />
              <div />
            </div>
            <div block="Details" elem="Number-Value">
              {maskedCC}
            </div>
          </div>
        </div>
      );
    }

    if (paymentMethod?.code?.match(/tabby_installments/)) {
      this.setState({ paymentTitle: __("Tabby: Pay in installments") });
    } else if (paymentMethod?.code?.match(/apple/)) {
      this.setState({ paymentTitle: __("Apple Pay") });
    } else if (paymentMethod?.code?.match(/cash/)) {
      this.setState({
        paymentTitle:
          getCountryFromUrl() === "QA"
            ? __("Cash on Receiving")
            : __("Cash on Delivery"),
      });
    } else if (paymentMethod?.code?.match(/free/)) {
      if (getDiscountFromTotals(total_segments, "clubapparel")) {
        this.setState({ paymentTitle: __("Club Apparel") });
      } else if (getDiscountFromTotals(total_segments, "customerbalance")) {
        this.setState({ paymentTitle: __("My Cash") });
      }
    } else if (paymentMethod?.code?.match(/qpay/)) {
      this.setState({ paymentTitle: __("QPAY") });
    } else if (paymentMethod?.code?.match(/knet/)) {
      this.setState({ paymentTitle: __("KNET") });
    }

    const { paymentTitle } = this.state;
    return (
      <div block="Details">
        <div block="Details" elem="TypeTitle">
          {__(paymentTitle)}
        </div>
      </div>
    );
  };

  renderPaymentMethodIcon(paymentTitle = "") {
    const { isArabic } = this.state;
    const formatedString = paymentTitle.split(":")[0];

    switch (formatedString) {
      case "Tabby":
        // if (!isArabic) {
        //   return <img src={Tabby} alt={paymentTitle} />;
        // }
        // return <img src={TabbyAR} alt={paymentTitle} />;
        return <img src={Tabby} alt={paymentTitle} />;
      case "Apple":
        return <img src={Apple} alt={paymentTitle} />;
      case "Cash":
        return <img src={Cash} alt={paymentTitle} />;

      default:
        return "";
    }
  }

  sendMOEEvents(event) {
    MOE_trackEvent(event, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      app6thstreet_platform: "Web",
    });
  }
  renderButton() {
    const { isArabic } = this.state;

    return (
      <div block="CheckoutSuccess" elem="ButtonWrapper" mods={{ isArabic }}>
        <Link
          block="CheckoutSuccess"
          elem="ContinueButton"
          to="/"
          onClick={() => {
            window.pageType = TYPE_HOME;
            this.sendMOEEvents(EVENT_MOE_CONTINUE_SHOPPING);
          }}
        >
          <button block="primary">{__("Continue shopping")}</button>
        </Link>
      </div>
    );
  }

  renderSuccess() {
    const { successHidden } = this.state;
    return (
      <div block={`SuccessOverlay ${successHidden ? "hidden" : ""}`} dir="ltr">
        <div block="OrderPlacedTextWrapper">
          <div block="confirmSimbol" />
          <p>{__("Order Placed")}</p>
        </div>
      </div>
    );
  }

  renderPriceLineQPAY(price, name, mods = {}, allowZero = false) {
    if (!price && !allowZero) {
      return null;
    }
    const { isTotal, isStoreCredit, isClubApparel } = mods;
    const formatPrice =
      isStoreCredit || isClubApparel ? parseFloat(-price) : parseFloat(price);

    const {
      order: { order_currency_code: currency_code = getCurrency() },
    } = this.props;
    const finalPrice = getFinalPrice(formatPrice, currency_code);

    return (
      <li block="MyAccountOrderView" elem="SummaryItem" mods={mods}>
        <strong block="MyAccountOrderView" elem="Text">
          {name}
          {isTotal && (
            <>
              {" "}
              <span>{__("(Taxes included)")}</span>
            </>
          )}
        </strong>
        <strong block="MyAccountOrderView" elem="Price">
          {currency_code} {finalPrice}
        </strong>
      </li>
    );
  }

  renderPaymentSummary() {
    const {
      order: {
        subtotal = 0,
        grand_total = 0,
        shipping_amount = 0,
        discount_amount = 0,
        msp_cod_amount = 0,
        tax_amount = 0,
        customer_balance_amount = 0,
        //club_apparel_amount = 0,
        currency_code = getCurrency(),
        international_shipping_charges= 0,
      },
    } = this.props;
    const grandTotal = getFinalPrice(grand_total, currency_code);
    const subTotal = getFinalPrice(subtotal, currency_code);

    return (
      <div block="MyAccountOrderView" elem="OrderTotals">
        <ul>
          <div block="MyAccountOrderView" elem="Subtotals">
            {this.renderPriceLineQPAY(subTotal, __("Subtotal"))}
            {this.renderPriceLineQPAY(shipping_amount, __("Shipping"), {
              divider: true,
            })}
            {this.renderPriceLineQPAY(
              international_shipping_charges,
              __("International Shipping fee")
            )}
            {customer_balance_amount !== 0
              ? this.renderPriceLineQPAY(
                  customer_balance_amount,
                  __("My Cash"),
                  { isStoreCredit: true }
                )
              : null}
            {this.props?.order?.club_apparel_amount &&
            parseFloat(this.props?.order?.club_apparel_amount) !== 0
              ? this.renderPriceLineQPAY(
                  this.props.order.club_apparel_amount,
                  __("Club Apparel Redemption"),
                  { isClubApparel: true }
                )
              : null}
            {parseFloat(discount_amount) !== 0
              ? this.renderPriceLineQPAY(discount_amount, __("Discount"))
              : null}
            {parseFloat(tax_amount) !== 0
              ? this.renderPriceLineQPAY(tax_amount, __("Tax"))
              : null}
            {parseFloat(msp_cod_amount) !== 0
              ? this.renderPriceLineQPAY(
                  msp_cod_amount,
                  getCountryFromUrl() === "QA"
                    ? __("Cash on Receiving")
                    : __("Cash on Delivery")
                )
              : null}
            {this.renderPriceLineQPAY(
              grandTotal,
              __("Total"),
              { isTotal: true },
              true
            )}
          </div>
        </ul>
      </div>
    );
  }

  renderReferralBanner() {
    const { isSignedIn } = this.props;
    if (isSignedIn) {
      return (
        <Suspense fallback={<div></div>}>
          <DynamicContentReferralBanner />
        </Suspense>
      );
    } else {
      return null;
    }
  }

  renderDetails() {
    const {
      customer,
      billingAddress,
      paymentMethod,
      incrementID,
      initialTotals,
      walletAmountEarned,
    } = this.props;
    const guest_email = billingAddress?.guest_email;
    const { eventSent } = this.state;
    let dispatchedObj = JSON.parse(localStorage.getItem("cartProducts"));
    const pagePathName = new URL(window.location.href).pathname;
    if (pagePathName !== "/checkout/error" && !eventSent) {
      if (
        paymentMethod?.code === "checkout_qpay" ||
        paymentMethod?.code === "tabby_installments" ||
        paymentMethod?.code === "checkout_knet"
      ) {
        Event.dispatch(EVENT_GTM_PURCHASE, {
          orderID: incrementID,
          totals: dispatchedObj,
          paymentMethod: paymentMethod?.code || "",
        });
      } else {
        Event.dispatch(EVENT_GTM_PURCHASE, {
          orderID: incrementID,
          totals: initialTotals,
          paymentMethod: paymentMethod?.code || "",
        });
      }
      this.setState({ eventSent: true });
    }
    localStorage.removeItem("cartProducts");
    return (
      <div block="CheckoutSuccess">
        {this.renderChangePhonePopUp()}
        <div block="CheckoutSuccess" elem="Details">
          {this.renderSuccessMessage(
            customer.email ? customer.email : guest_email
          )}
          {this.renderPhoneVerified()}
          {this.renderTrackOrder()}
          <EarnedCashReward rewardEarned={walletAmountEarned}/>
          {this.renderReferralBanner()}
          {this.renderTotalsItems()}
          {this.renderAddresses()}
          {this.renderPaymentType()}
          {paymentMethod?.code === "checkout_qpay" ||
          paymentMethod?.code === "tabby_installments" ||
          paymentMethod?.code === "checkout_knet" ||
          paymentMethod?.code === TAMARA
            ? this.renderPaymentSummary()
            : this.renderTotals()}
          {this.renderContact()}
        </div>
        {this.renderButton()}
        {this.renderMyAccountPopup()}
      </div>
    );
  }

  render() {
    return this.renderDetails();
  }
}

export default CheckoutSuccess;
