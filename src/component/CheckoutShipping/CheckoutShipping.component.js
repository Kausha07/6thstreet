import PropTypes from 'prop-types';

import CheckoutDeliveryOptions from 'Component/CheckoutDeliveryOptions';
import {
    CheckoutShipping as SourceCheckoutShipping
} from 'SourceComponent/CheckoutShipping/CheckoutShipping.component';
import { shippingMethodsType, shippingMethodType } from 'Type/Checkout';
import { isArabic } from 'Util/App';
import isMobile from 'Util/Mobile';

import './CheckoutShipping.style';

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

    state = {
        isArabic: isArabic()
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

    checkForDisabling() {
        const { selectedShippingMethod } = this.props;

        if (!selectedShippingMethod) {
            return true;
        }

        return false;
    }

    renderActions() {
        return (
            <div block="Checkout" elem="StickyButtonWrapper">
                { this.renderTotals() }
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

    renderDelivery() {
        const {
            shippingMethods,
            onShippingMethodSelect
        } = this.props;

        const { isArabic } = this.state;

        return (
            <div block="CheckoutShippingStep" mods={ { isArabic } }>
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
