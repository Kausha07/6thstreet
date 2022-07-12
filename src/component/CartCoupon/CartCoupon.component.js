import Field from "Component/Field";
import Loader from "Component/Loader";
import { CartCoupon as SourceCartCoupon } from "SourceComponent/CartCoupon/CartCoupon.component";
import { isArabic } from "Util/App";
import { EVENT_MOE_REMOVE_COUPON } from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import "./CartCoupon.extended.style";

export class CartCoupon extends SourceCartCoupon {
  handleCouponCodeChange = (enteredCouponCode) => {
    this.setState({
      enteredCouponCode: this.removeCouponSpace(enteredCouponCode),
    });
  };

  removeCouponSpace = (value) => {
    // if (value.includes(" ")) {
    return value.replace(/\s/g, "");
    //} else {
    //  return value;
    //}
  };

  handleApplyCoupon = () => {
    const { handleApplyCouponToCart } = this.props;
    const { enteredCouponCode } = this.state;
    const formattedCouponValue = this.removeCouponSpace(enteredCouponCode);
    handleApplyCouponToCart(formattedCouponValue);
  };

  handleApplyCode = async (e, couponCode) => {
    e.stopPropagation();
    try {
      let apiResponse =
        (await this.props.applyCouponToCart(couponCode)) || null;
      if (typeof apiResponse !== "string") {
        this.props.closePopup();
      }
    } catch (error) {
      console.error(error);
    }
  };

  handleFormSubmit = (e) => {
    const { couponCode } = this.props;
    e.preventDefault();

    if (couponCode) {
      this.handleRemoveCoupon();
      Moengage.track_event(EVENT_MOE_REMOVE_COUPON, {
        country: getCountryFromUrl() ? getCountryFromUrl().toUpperCase() : "",
        language: getLanguageFromUrl()
          ? getLanguageFromUrl().toUpperCase()
          : "",
        coupon_code: couponCode || "",
        app6thstreet_platform: "Web",
      });
      return;
    }

    this.handleApplyCoupon();
  };

  renderApplyCoupon() {
    const { enteredCouponCode } = this.state;
    const formattedCouponValue = this.removeCouponSpace(enteredCouponCode);
    return (
      <>
        <Field
          type="text"
          id="couponCode"
          name="couponCode"
          value={formattedCouponValue}
          placeholder={__("Enter a Coupon or Discount Code")}
          onChange={this.handleCouponCodeChange}
          mix={{ block: "CartCoupon", elem: "Input" }}
        />
        <button
          block="CartCoupon"
          elem="Button"
          type="button"
          mix={{ block: "Button" }}
          disabled={!formattedCouponValue}
          onClick={(e) => {
            this.handleApplyCode(e, formattedCouponValue);
          }}
        >
          {__("Add")}
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
          onClick={this.handleRemoveCoupon}
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
