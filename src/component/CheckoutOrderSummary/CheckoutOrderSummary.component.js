import StoreCredit from 'Component/StoreCredit';
import { SHIPPING_STEP } from 'Route/Checkout/Checkout.config';
import {
    CheckoutOrderSummary as SourceCheckoutOrderSummary
} from 'SourceComponent/CheckoutOrderSummary/CheckoutOrderSummary.component';

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
        const { cashOnDeliveryFee } = this.props;
        if (cashOnDeliveryFee) {
            return (
                <p>
                FEE:
                { cashOnDeliveryFee }
                </p>
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
                { this.renderCashOnDeliveryFee() }
            </article>
        );
    }
}

export default CheckoutOrderSummary;
