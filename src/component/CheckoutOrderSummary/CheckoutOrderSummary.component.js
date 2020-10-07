import {
    CheckoutOrderSummary as SourceCheckoutOrderSummary
} from 'SourceComponent/CheckoutOrderSummary/CheckoutOrderSummary.component';

import './CheckoutOrderSummary.extended.style';

export class CheckoutOrderSummary extends SourceCheckoutOrderSummary {
    render() {
        return (
            <article block="CheckoutOrderSummary" aria-label="Order Summary">
                { this.renderItems() }
                { this.renderTotals() }
            </article>
        );
    }
}

export default CheckoutOrderSummary;
