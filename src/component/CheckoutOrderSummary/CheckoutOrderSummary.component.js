import CartCoupon from 'Component/CartCoupon';
import CmsBlock from 'Component/CmsBlock';
import Link from 'Component/Link';
import StoreCredit from 'Component/StoreCredit';
import { SHIPPING_STEP } from 'Route/Checkout/Checkout.config';
import {
    CheckoutOrderSummary as SourceCheckoutOrderSummary
} from 'SourceComponent/CheckoutOrderSummary/CheckoutOrderSummary.component';
import { formatCurrency } from 'Util/Price';

import Delivery from './icons/delivery-truck.png';

import './CheckoutOrderSummary.extended.style';

export class CheckoutOrderSummary extends SourceCheckoutOrderSummary {
    renderItemSuffix() {
        const { totals: { items = [] } } = this.props;
        return (items.length === 1)
            ? __(' Item')
            : __(' Items');
    }

    renderHeading() {
        const { totals: { items = [] } } = this.props;

        const itemQuantityArray = items.map((item) => item.qty);
        const totalQuantity = itemQuantityArray.reduce((qty, nextQty) => qty + nextQty, 0);

        return (
            <div block="CheckoutOrderSummary" elem="HeaderWrapper">
                <span block="CheckoutOrderSummary" elem="ItemCount">
                    { totalQuantity }
                    { this.renderItemSuffix() }
                </span>
                <Link block="CheckoutOrderSummary" elem="Edit" to="/cart">
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

        if (cart_cms) {
            return <CmsBlock identifier={ cart_cms } />;
        }

        return (
            <div
              block="CheckoutOrderSummary"
              elem="PromoBlock"
            >
                <div block="CheckoutOrderSummary" elem="PromoText">
                    <img src={ Delivery } alt="Delivery icon" />
                    { __('Add ') }
                    <span block="CheckoutOrderSummary" elem="AED">AED 200</span>
                    { __('more to your cart for ') }
                    <span
                      block="CheckoutOrderSummary"
                      elem="FreeDelivery"
                    >
                        { __('Free delivery') }
                    </span>
                </div>
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
        return (
            <div
              block="CheckoutOrderSummary"
              elem="Promo"
            >
                { this.renderPromoContent() }
            </div>
        );
    }

    renderToggleableDiscountOptions() {
        return (
            <div block="CheckoutOrderSummary" elem="DiscountOptionWrapper">
                <StoreCredit canApply hideIfZero />
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
            checkoutStep
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
                    </div>
                    <div block="CheckoutOrderSummary" elem="Totals">
                        { checkoutStep !== SHIPPING_STEP
                            ? this.renderPriceLine(Math.round(total + tax_amount), __('Total'))
                            : this.renderPriceLine(Math.round(total + tax_amount), __('Total')) }
                            <span>{ __('(Taxes included)') }</span>
                    </div>
                </ul>
            </div>
        );
    }

    renderCashOnDeliveryFee() {
        const { cashOnDeliveryFee, totals: { quote_currency_code } } = this.props;
        const priceString = formatCurrency(quote_currency_code);

        if (cashOnDeliveryFee) {
            return (
                <li block="CheckoutOrderSummary" elem="SummaryItem">
                    <span block="CheckoutOrderSummary" elem="Text">
                        { __('Cash on Delivery Fee') }
                    </span>
                    <span block="CheckoutOrderSummary" elem="Text">
                        { `${priceString}${cashOnDeliveryFee}` }
                    </span>
                </li>
            );
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
