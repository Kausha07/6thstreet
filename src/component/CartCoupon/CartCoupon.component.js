import Field from 'Component/Field';
import Loader from 'Component/Loader';
import { CartCoupon as SourceCartCoupon } from 'SourceComponent/CartCoupon/CartCoupon.component';
import { isArabic } from 'Util/App';

import './CartCoupon.extended.style';

export class CartCoupon extends SourceCartCoupon {
    renderApplyCoupon() {
        const { enteredCouponCode } = this.state;

        return (
            <>
                <Field
                  type="text"
                  id="couponCode"
                  name="couponCode"
                  value={ enteredCouponCode }
                  placeholder={ __('Enter a coupon or Discount code') }
                  onChange={ this.handleCouponCodeChange }
                  mix={ { block: 'CartCoupon', elem: 'Input' } }
                />
                <button
                  block="CartCoupon"
                  elem="Button"
                  type="button"
                  mix={ { block: 'Button' } }
                  disabled={ !enteredCouponCode }
                  onClick={ this.handleApplyCoupon }
                >
                    { __('Add') }
                </button>
            </>
        );
    }

    renderRemoveCoupon() {
        const { couponCode } = this.props;

        return (
            <>
                <p block="CartCoupon" elem="Message">
                    <strong>{ couponCode.toUpperCase() }</strong>
                </p>
                <button
                  block="CartCoupon"
                  elem="Button"
                  type="button"
                  mix={ { block: 'Button' } }
                  onClick={ this.handleRemoveCoupon }
                >
                    { __('Remove') }
                </button>
            </>
        );
    }

    render() {
        const { isLoading, couponCode } = this.props;

        return (
            <form
              block="CartCoupon"
              mods={ { active: !!couponCode, isArabic: isArabic() } }
              onSubmit={ this.handleFormSubmit }
            >
                <Loader isLoading={ isLoading } />
                { (couponCode
                    ? this.renderRemoveCoupon()
                    : this.renderApplyCoupon()
                ) }
            </form>
        );
    }
}

export default CartCoupon;
