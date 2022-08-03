import Field from "Component/Field";
import Loader from "Component/Loader";
import { CartCoupon as SourceCartCoupon } from "SourceComponent/CartCoupon/CartCoupon.component";
import { isArabic } from "Util/App";

import "./CartCoupon.extended.style";

export class CartCoupon extends SourceCartCoupon {

    removeCouponSpace = (value) => {
        return value.replace(/\s/g, "");
    };

    handleCouponCodeChange = (enteredCouponCode) => {
        const SpaceRemovedCoupon = this.removeCouponSpace(enteredCouponCode);
        this.setState({
            enteredCouponCode: SpaceRemovedCoupon,
        });
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
            return;
        }

        this.handleApplyCoupon();
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
