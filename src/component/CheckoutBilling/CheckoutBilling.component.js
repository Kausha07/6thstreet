import {
    CheckoutBilling as SourceCheckoutBilling
} from 'SourceComponent/CheckoutBilling/CheckoutBilling.component';

export class CheckoutBilling extends SourceCheckoutBilling {
    renderPriceLine(price, name, mods) {
        const { totals: { currency_code } } = this.props;

        return (
            <li block="CheckoutOrderSummary" elem="SummaryItem" mods={ mods }>
                <strong block="CheckoutOrderSummary" elem="Text">
                    { name }
                </strong>
                { price !== undefined
                    ? (
                <strong block="CheckoutOrderSummary" elem="Price">
                    { `${currency_code } ${ price}` }
                </strong>
                    )
                    : null }
            </li>
        );
    }

    renderTotals() {
        const {
            totals: { subtotal }, totals
        } = this.props;

        console.log(totals);
        if (subtotal !== {}) {
            return (
                    <div block="Checkout" elem="OrderTotals">
                            { this.renderPriceLine(subtotal, __('Total')) }
                    </div>
            );
        }

        return null;
    }

    renderActions() {
        const {
            isOrderButtonVisible,
            isOrderButtonEnabled,
            isTermsAndConditionsAccepted
        } = this.state;

        const { termsAreEnabled } = this.props;

        if (!isOrderButtonVisible) {
            return null;
        }

        // if terms and conditions are enabled, validate for acceptance
        const isDisabled = termsAreEnabled
            ? !isOrderButtonEnabled || !isTermsAndConditionsAccepted
            : !isOrderButtonEnabled;

        return (
            <div block="Checkout" elem="StickyButtonWrapper">
                { this.renderTotals() }
                <button
                  type="submit"
                  block="Button"
                  disabled={ isDisabled }
                  mix={ { block: 'CheckoutBilling', elem: 'Button' } }
                >
                    { __('Place order') }
                </button>
            </div>
        );
    }
}

export default CheckoutBilling;
