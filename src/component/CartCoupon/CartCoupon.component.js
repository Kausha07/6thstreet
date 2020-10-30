import Field from 'Component/Field';
import { CartCoupon as SourceCartCoupon } from 'SourceComponent/CartCoupon/CartCoupon.component';

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
}

export default CartCoupon;
