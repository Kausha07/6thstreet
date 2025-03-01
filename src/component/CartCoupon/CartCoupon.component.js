import Field from "Component/Field";
import Loader from "Component/Loader";
import { CartCoupon as SourceCartCoupon } from "SourceComponent/CartCoupon/CartCoupon.component";
import { isArabic } from "Util/App";
import Event, {
  EVENT_REMOVE_COUPON,
  EVENT_APPLY_COUPON_FAILED,
  EVENT_APPLY_COUPON,
  EVENT_GTM_COUPON,
  MOE_trackEvent
} from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import "./CartCoupon.extended.style";

export class CartCoupon extends SourceCartCoupon {
  handleCouponCodeChange = (enteredCouponCode) => {
    this.setState({
      enteredCouponCode: this.removeCouponSpace(enteredCouponCode),
    });
  };

  removeCouponSpace = (value) => {
    return value.replace(/\s/g, "");
  };

  handleApplyCoupon = () => {
    const { handleApplyCouponToCart } = this.props;
    const { enteredCouponCode } = this.state;
    const formattedCouponValue = this.removeCouponSpace(enteredCouponCode);
    handleApplyCouponToCart(formattedCouponValue);
  };

  sendEvents(event, coupon) {
    MOE_trackEvent(event, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      coupon_code: coupon || "",
      app6thstreet_platform: "Web",
    });
    const eventData = {
      name: event,
      coupon: coupon,
      discount: this.props?.totals?.discount || "",
      shipping: this.props?.totals?.shipping_fee || "",
      tax: this.props?.totals?.tax_amount || "",
      sub_total : this.props?.totals?.subtotal || "",
      subtotal_incl_tax : this.props?.totals?.subtotal_incl_tax || "",
      total: this.props?.totals?.total || "",
    };
    Event.dispatch(EVENT_GTM_COUPON, eventData);
  }

  handleApplyCode = async (e, couponCode) => {
    e.stopPropagation();

    this.setState({
      enteredCouponCode: "",
    });
    try {
      let apiResponse =
        (await this.props.applyCouponToCart(couponCode)) || null;
      if (apiResponse) {
        this.sendEvents(EVENT_APPLY_COUPON_FAILED, couponCode);
      } else {
        this.sendEvents(EVENT_APPLY_COUPON, couponCode);
      }
      if (typeof apiResponse !== "string") {
        this.props.closePopup();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // if coupon is sitewide copon
  handleRemoveCouponFromCart() {
    const {
      removeCouponFromCart,
      isSignedIn,
      totals: { coupon_code = "" },
      config,
    } = this.props;
    let isSiteWideCoupon = false;
    const countryCode = getCountryFromUrl();
    const langCode = getLanguageFromUrl();
    const sidewideCouponCode =
      config?.countries?.[countryCode]?.sidewideCouponCode?.[langCode] || "";

    this.setState({ isLoading: true });

    if (
      coupon_code &&
      coupon_code != "" &&
      sidewideCouponCode &&
      sidewideCouponCode != "" &&
      coupon_code.toLowerCase() === sidewideCouponCode.toLowerCase()
    ) {
      isSiteWideCoupon = true;
    }

    removeCouponFromCart({
      is_guest: !isSignedIn,
      isSiteWide: isSiteWideCoupon,
    }).then(
        () => this.setState({ isLoading: false })
    );
}

  handleRemoveCoupon = () => {
    localStorage.removeItem("lastCouponCode");
    this.handleRemoveCouponFromCart();

    // We need to reset input field. If we do it in applyCouponCode,
    // then it will disappear if code is incorrect. We want to avoid it
    this.setState({
      enteredCouponCode: "",
    });
  };

  handleFormSubmit = (e) => {
    const { couponCode } = this.props;
    e.preventDefault();

    if (couponCode) {
      this.handleRemoveCoupon();
      return;
    }

    const submitButton = document.getElementById("couponCodeButton");
    submitButton.click();
  };

  renderApplyCoupon() {
    const { enteredCouponCode } = this.state;
    const formattedCouponValue = this.removeCouponSpace(enteredCouponCode);
    localStorage.setItem("lastCouponCode", formattedCouponValue);
    return (
      <>
        <Field
          type="text"
          id="couponCode"
          name="couponCode"
          value={formattedCouponValue}
          placeholder={__("ENTER YOUR COUPON CODE")}
          onChange={this.handleCouponCodeChange}
          mix={{ block: "CartCoupon", elem: "Input" }}
        />
        <button
          block="CartCoupon"
          elem="Button"
          type="button"
          id="couponCodeButton"
          mix={{ block: "Button" }}
          disabled={!formattedCouponValue}
          onClick={(e) => {
            this.handleApplyCode(e, formattedCouponValue);
          }}
        >
          {__("Apply")}
        </button>
      </>
    );
  }

  renderRemoveCoupon() {
    const { couponCode } = this.props;

    return (
      <>
        <p block="CartCoupon" elem="Message">
          <strong>{couponCode.toUpperCase()}</strong>
        </p>
        <button
          block="CartCoupon"
          elem="Button"
          type="button"
          mix={{ block: "Button" }}
          onClick={() => {
            this.sendEvents(EVENT_REMOVE_COUPON, couponCode);
            this.handleRemoveCoupon();
          }}
        >
          {__("Remove")}
        </button>
      </>
    );
  }

  render() {
    const { isLoading, couponCode } = this.props;
    return (
      <form
        block="CartCoupon"
        mods={{ active: !!couponCode, isArabic: isArabic() }}
        onSubmit={this.handleFormSubmit}
      >
        <Loader isLoading={isLoading} />
        {couponCode ? this.renderRemoveCoupon() : this.renderApplyCoupon()}
      </form>
    );
  }
}

export default CartCoupon;
