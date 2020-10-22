import StoreCredit from 'Component/StoreCredit';
import { SHIPPING_STEP } from 'Route/Checkout/Checkout.config';
import {
    CheckoutOrderSummary as SourceCheckoutOrderSummary
} from 'SourceComponent/CheckoutOrderSummary/CheckoutOrderSummary.component';
import { formatCurrency } from 'Util/Price';

import './CheckoutOrderSummary.extended.style';

export class CheckoutOrderSummary extends SourceCheckoutOrderSummary {
    renderToggleableDiscountOptions() {
        return (
            <div block="CheckoutOrderSummary" elem="DiscountOptionWrapper">
                <StoreCredit canApply hideIfZero />
            </div>
        );
    }

    renderTotals() {
        const {
            totals: {
                subtotal,
                tax_amount,
                grand_total,
                shipping_amount
            },
            paymentTotals: {
                grand_total: payment_grand_total
            }, checkoutStep
        } = this.props;

        return (
            <div block="CheckoutOrderSummary" elem="OrderTotals">
                <ul>
                    { this.renderCashOnDeliveryFee() }
                    { this.renderPriceLine(subtotal, __('Cart Subtotal')) }
                    { checkoutStep !== SHIPPING_STEP
                        ? this.renderPriceLine(shipping_amount, __('Shipping'), { divider: true })
                        : null }
                    { this.renderCouponCode() }
                    { this.renderPriceLine(tax_amount, __('Tax')) }
                    { checkoutStep !== SHIPPING_STEP
                        ? this.renderPriceLine(payment_grand_total || grand_total, __('Order total'))
                        : this.renderPriceLine(subtotal + tax_amount, __('Order total')) }
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
                { this.renderItems() }
                { this.renderToggleableDiscountOptions() }
                { this.renderTotals() }
            </article>
        );
    }
}

export default CheckoutOrderSummary;
