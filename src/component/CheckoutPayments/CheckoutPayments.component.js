import StoreCredit from 'Component/StoreCredit';
import SourceCheckoutPayments from 'SourceComponent/CheckoutPayments/CheckoutPayments.component';

import './CheckoutPayments.extended.style';

export class CheckoutPayments extends SourceCheckoutPayments {
    renderToggleableDiscountOptions() {
        return (
            <div block="CheckoutPayments" elem="DiscountOptionWrapper">
                <StoreCredit canApply hideIfZero />
            </div>
        );
    }

    renderContent() {
        const { hasError } = this.state;

        if (hasError) {
            return (
                <p>{ __('The error occurred during initializing payment methods. Please try again later!') }</p>
            );
        }

        return (
            <>
                { this.renderHeading() }
                <ul block="CheckoutPayments" elem="Methods">
                    { this.renderPayments() }
                </ul>
                { this.renderSelectedPayment() }
                { this.renderPayPal() }
                { this.renderToggleableDiscountOptions() }
            </>
        );
    }
}

export default CheckoutPayments;
