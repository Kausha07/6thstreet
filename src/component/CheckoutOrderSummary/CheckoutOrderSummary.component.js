import StoreCredit from 'Component/StoreCredit';
import {
    CheckoutOrderSummary as SourceCheckoutOrderSummary
} from 'SourceComponent/CheckoutOrderSummary/CheckoutOrderSummary.component';

import './CheckoutOrderSummary.extended.style';

export class CheckoutOrderSummary extends SourceCheckoutOrderSummary {
    renderToggleableDiscountOptions() {
        return (
            <div block="CheckoutOrderSummary" elem="DiscountOptionWrapper">
                <StoreCredit canApply />
            </div>
        );
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
