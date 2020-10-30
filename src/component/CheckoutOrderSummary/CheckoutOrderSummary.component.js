import CartCoupon from 'Component/CartCoupon';
import ClubApparel from 'Component/ClubApparel';
import CmsBlock from 'Component/CmsBlock';
import Link from 'Component/Link';
import StoreCredit from 'Component/StoreCredit';
import { SHIPPING_STEP } from 'Route/Checkout/Checkout.config';
import {
    CheckoutOrderSummary as SourceCheckoutOrderSummary
} from 'SourceComponent/CheckoutOrderSummary/CheckoutOrderSummary.component';
import { isArabic } from 'Util/App';
import { isSignedIn } from 'Util/Auth';

import Delivery from './icons/delivery-truck.png';

import './CheckoutOrderSummary.extended.style';

export class CheckoutOrderSummary extends SourceCheckoutOrderSummary {
    state = {
        isArabic: isArabic()
    };

    renderItemSuffix() {
        const { totals: { items = [] } } = this.props;

        const itemQuantityArray = items.map((item) => item.qty);
        const totalQuantity = itemQuantityArray.reduce((qty, nextQty) => qty + nextQty, 0);

        return (totalQuantity === 1)
            ? __(' Item')
            : __(' Items');
    }

    renderHeading() {
        const { totals: { items = [] } } = this.props;
        const { isArabic } = this.state;

        const itemQuantityArray = items.map((item) => item.qty);
        const totalQuantity = itemQuantityArray.reduce((qty, nextQty) => qty + nextQty, 0);

        return (
            <div block="CheckoutOrderSummary" elem="HeaderWrapper">
                <span block="CheckoutOrderSummary" elem="ItemCount">
                    { totalQuantity }
                    { (totalQuantity === 1)
                        ? __(' Item')
                        : __(' Items') }
                </span>
                <Link
                  block="CheckoutOrderSummary"
                  elem="Edit"
                  mods={ { isArabic } }
                  to="/cart"
                >
                    <span>{ __(' Edit') }</span>
                </Link>
            </div>
        );
    }

    renderItems() {
        const { totals: { items = [] } } = this.props;

        return (
            <div block="CheckoutOrderSummary" elem="OrderItems">
                <ul block="CheckoutOrderSummary" elem="CartItemList">
                    { items.map(this.renderItem) }
                </ul>
            </div>
        );
    }

    renderPromoContent() {
        const { cart_content: { cart_cms } = {} } = window.contentConfiguration;
        const { totals: { currency_code, avail_free_shipping_amount } } = this.props;

        if (cart_cms) {
            return <CmsBlock identifier={ cart_cms } />;
        }

        return (
            <div
              block="CheckoutOrderSummary"
              elem="PromoBlock"
            >
                <figcaption block="CheckoutOrderSummary" elem="PromoText">
                    <img src={ Delivery } alt="Delivery icon" />
                    { __('Add ') }
                    <span
                      block="CheckoutOrderSummary"
                      elem="Currency"
                    >
                        { `${currency_code } ${avail_free_shipping_amount}` }
                    </span>
                    { __('more to your cart for ') }
                    <span
                      block="CheckoutOrderSummary"
                      elem="FreeDelivery"
                    >
                        { __('Free delivery') }
                    </span>
                </figcaption>
            </div>
        );
    }

    renderDiscountCode() {
        const {
            totals: { coupon_code }
        } = this.props;

        return (
            <CartCoupon couponCode={ coupon_code } />
        );
    }

    renderPromo() {
        const { totals: { avail_free_shipping_amount } } = this.props;

        return !avail_free_shipping_amount || avail_free_shipping_amount === 0 ? null : (
            <div
              block="CheckoutOrderSummary"
              elem="Promo"
            >
                { this.renderPromoContent() }
            </div>
        );
    }

    renderToggleableDiscountOptions() {
        if (!isSignedIn()) {
            return null;
        }

        return (
            <div block="CheckoutOrderSummary" elem="DiscountOptionWrapper">
                <StoreCredit canApply hideIfZero />
                <ClubApparel hideIfZero />
            </div>
        );
    }

    renderPriceLine(price, name, mods) {
        if (!price) {
            return null;
        }

        const { totals: { currency_code } } = this.props;

        return (
            <li block="CheckoutOrderSummary" elem="SummaryItem" mods={ mods }>
                <strong block="CheckoutOrderSummary" elem="Text">
                    { name }
                </strong>
                <strong block="CheckoutOrderSummary" elem="Price">
                    { `${currency_code } ${ price}` }
                </strong>
            </li>
        );
    }

    renderTotals() {
        const {
            totals: {
                subtotal,
                total,
                tax_amount,
                shipping_amount
            },
            checkoutStep,
            cashOnDeliveryFee
        } = this.props;

        return (
            <div block="CheckoutOrderSummary" elem="OrderTotals">
                <ul>
                    <div block="CheckoutOrderSummary" elem="Subtotals">
                        { this.renderPriceLine(subtotal, __('Subtotal')) }
                        { checkoutStep !== SHIPPING_STEP
                            ? this.renderPriceLine(shipping_amount, __('Shipping'), { divider: true })
                            : null }
                        { this.renderCouponCode() }
                        { this.renderPriceLine(tax_amount, __('Tax')) }
                        { this.renderCashOnDeliveryFee() }
                    </div>
                    <div block="CheckoutOrderSummary" elem="Totals">
                        { checkoutStep !== SHIPPING_STEP
                            ? this.renderPriceLine(total + tax_amount + cashOnDeliveryFee, __('Total'))
                            : this.renderPriceLine(total + tax_amount, __('Total')) }
                        <span>{ __('(Taxes included)') }</span>
                    </div>
                </ul>
            </div>
        );
    }

    renderCashOnDeliveryFee() {
        const { cashOnDeliveryFee } = this.props;

        if (cashOnDeliveryFee) {
            return this.renderPriceLine(cashOnDeliveryFee, __('Cash on Delivery'));
        }

        return null;
    }

    render() {
        return (
            <article block="CheckoutOrderSummary" aria-label="Order Summary">
                { this.renderHeading() }
                { this.renderItems() }
                { this.renderToggleableDiscountOptions() }
                { this.renderDiscountCode() }
                { this.renderPromo() }
                { this.renderTotals() }
            </article>
        );
    }
}

export default CheckoutOrderSummary;
