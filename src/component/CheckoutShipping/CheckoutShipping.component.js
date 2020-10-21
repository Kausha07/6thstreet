import PropTypes from 'prop-types';

import CheckoutDeliveryOptions from 'Component/CheckoutDeliveryOptions';
import {
    CheckoutShipping as SourceCheckoutShipping
} from 'SourceComponent/CheckoutShipping/CheckoutShipping.component';
import { shippingMethodsType, shippingMethodType } from 'Type/Checkout';
import isMobile from 'Util/Mobile';

export class CheckoutShipping extends SourceCheckoutShipping {
    static propTypes = {
        onShippingSuccess: PropTypes.func.isRequired,
        onShippingError: PropTypes.func.isRequired,
        onShippingEstimationFieldsChange: PropTypes.func.isRequired,
        shippingMethods: shippingMethodsType.isRequired,
        onShippingMethodSelect: PropTypes.func.isRequired,
        selectedShippingMethod: shippingMethodType,
        onAddressSelect: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        totals: PropTypes
    };

    static defaultProps = {
        selectedShippingMethod: null,
        totals: {}
    };

    renderButtonsPlaceholder() {
        return isMobile.any() || isMobile.tablet()
            ? __('Proceed to secure payment')
            : __('Place order');
    }

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
            totals: { subtotal }
        } = this.props;

        if (subtotal !== {}) {
            return (
                    <div block="Checkout" elem="OrderTotals">
                            { this.renderPriceLine(subtotal, __('Subtotal')) }
                    </div>
            );
        }

        return null;
    }

    renderActions() {
        const { selectedShippingMethod } = this.props;

        return (
            <div block="Checkout" elem="StickyButtonWrapper">
                { this.renderTotals() }
                <button
                  type="submit"
                  block="Button"
                  disabled={ !selectedShippingMethod }
                  mix={ { block: 'CheckoutShipping', elem: 'Button' } }
                >
                    { this.renderButtonsPlaceholder() }
                </button>
            </div>
        );
    }

    renderDelivery() {
        const {
            shippingMethods,
            onShippingMethodSelect
        } = this.props;

        return (
            <CheckoutDeliveryOptions
              shippingMethods={ shippingMethods }
              onShippingMethodSelect={ onShippingMethodSelect }
            />
        );
    }
}

export default CheckoutShipping;
