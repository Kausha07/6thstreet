import CheckoutDeliveryOptions from 'Component/CheckoutDeliveryOptions';
import Field from 'Component/Field';
import {
    CheckoutShipping as SourceCheckoutShipping
} from 'SourceComponent/CheckoutShipping/CheckoutShipping.component';
import { isArabic } from 'Util/App';
import isMobile from 'Util/Mobile';

import './CheckoutShipping.style';

export class CheckoutShipping extends SourceCheckoutShipping {
    state = {
        isArabic: isArabic()
    };

    renderButtonsPlaceholder() {
        return isMobile.any() || isMobile.tablet()
            ? __('Proceed to secure payment')
            : __('Place order');
    }

    checkForDisabling() {
        const { selectedShippingMethod } = this.props;

        if (!selectedShippingMethod || !isMobile.any() || !isMobile.tablet()) {
            return true;
        }

        return false;
    }

    renderActions() {
        return (
            <div block="Checkout" elem="StickyButtonWrapper">
                <button
                  type="submit"
                  block="Button"
                  disabled={ this.checkForDisabling() }
                  mix={ { block: 'CheckoutShipping', elem: 'Button' } }
                >
                    { this.renderButtonsPlaceholder() }
                </button>
            </div>
        );
    }

    renderDeliveryButton() {
        const { selectedShippingMethod } = this.props;

        if (isMobile.any() || isMobile.tablet()) {
            return null;
        }

        return (
            <div block="CheckoutShippingStep" elem="DeliveryButton">
                <button
                  type="submit"
                  block="Button button primary medium"
                  disabled={ !selectedShippingMethod }
                >
                    { __('Deliver to this address') }
                </button>
            </div>
        );
    }

    renderDifferentBillingLabel = () => (
        <>
            { __('Add a different ') }
            <span>
                { __('Billing address') }
            </span>
        </>
    );

    renderDelivery() {
        const {
            shippingMethods,
            onShippingMethodSelect
        } = this.props;

        const { isArabic } = this.state;

        return (
            <div block="CheckoutShippingStep" mods={ { isArabic } }>
                <Field
                  type="toggle"
                  id="DifferentBilling"
                  name="DifferentBilling"
                  label={ this.renderDifferentBillingLabel() }
                />
                { this.renderDeliveryButton() }
                <CheckoutDeliveryOptions
                  shippingMethods={ shippingMethods }
                  onShippingMethodSelect={ onShippingMethodSelect }
                />
            </div>
        );
    }
}

export default CheckoutShipping;
