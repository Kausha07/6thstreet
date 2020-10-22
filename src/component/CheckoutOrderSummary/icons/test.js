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
        },
        checkoutStep
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