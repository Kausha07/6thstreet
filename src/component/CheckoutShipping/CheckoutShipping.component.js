/* eslint-disable jsx-a11y/control-has-associated-label */
import PropTypes from 'prop-types';

import CheckoutDeliveryOptions from 'Component/CheckoutDeliveryOptions';
import Form from 'Component/Form';
import Loader from 'Component/Loader';
import MyAccountAddressPopup from 'Component/MyAccountAddressPopup';
import { SHIPPING_STEP } from 'Route/Checkout/Checkout.config';
import {
    CheckoutShipping as SourceCheckoutShipping
} from 'SourceComponent/CheckoutShipping/CheckoutShipping.component';
import { customerType } from 'Type/Account';
import { isArabic } from 'Util/App';
import { isSignedIn } from 'Util/Auth';
import isMobile from 'Util/Mobile';

import './CheckoutShipping.style';

export class CheckoutShipping extends SourceCheckoutShipping {
    static propTypes = {
        ...SourceCheckoutShipping.propTypes,
        customer: customerType.isRequired,
        showCreateNewPopup: PropTypes.func.isRequired
    };

    state = {
        isArabic: isArabic(),
        formContent: false,
        isSignedIn: isSignedIn(),
        isMobile: isMobile.any() || isMobile.tablet()
    };

    renderButtonsPlaceholder() {
        return isMobile
            ? __('Proceed to secure payment')
            : __('Place order');
    }

    renderPriceLine(price, name, mods) {
        const { totals: { currency_code } } = this.props;
        const roundedPrice = Math.round(price);

        return (
            <li block="CheckoutOrderSummary" elem="SummaryItem" mods={ mods }>
                <strong block="CheckoutOrderSummary" elem="Text">
                    { name }
                </strong>
                { price !== undefined
                    ? (
                <strong block="CheckoutOrderSummary" elem="Price">
                    { `${currency_code } ${ roundedPrice}` }
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
        const { isMobile } = this.state;

        if (!selectedShippingMethod || !isMobile) {
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

    openForm() {
        this.setState({ formContent: true });
    }

    closeForm = () => {
        this.setState({ formContent: false });
    };

    renderAddAdress() {
        const { formContent, isArabic } = this.state;
        const { customer } = this.props;
        return (
                <div block="MyAccountAddressBook" elem="ContentWrapper" mods={ { formContent } }>
                    <button
                      block="MyAccountAddressBook"
                      elem="backBtn"
                      mods={ { isArabic } }
                      onClick={ this.showCards }
                    />
                    <MyAccountAddressPopup
                      formContent={ formContent }
                      closeForm={ this.closeForm }
                      openForm={ this.openForm }
                      showCards={ this.showCards }
                      customer={ customer }
                    />
                </div>
        );
    }

    hideCards = () => {
        this.setState({ hideCards: true });
    };

    showCards = () => {
        this.closeForm();
        this.setState({ hideCards: false });
    };

    openNewForm = () => {
        const { showCreateNewPopup } = this.props;
        this.openForm();
        showCreateNewPopup();
    };

    renderButtonLabel() {
        const { isMobile } = this.state;

        return isMobile ? __('New address') : __('Add new address');
    }

    renderOpenPopupButton() {
        const { isSignedIn, formContent, isArabic } = this.state;

        if (isSignedIn) {
            return (
                <div
                  block="MyAccountAddressBook"
                  elem="NewAddressWrapper"
                  mods={ { formContent, isArabic } }
                >
                    <button
                      block="MyAccountAddressBook"
                      elem="NewAddress"
                      mix={ {
                          block: 'button primary small'
                      } }

                      onClick={ this.openNewForm }
                    >
                        { this.renderButtonLabel() }
                    </button>
                </div>
            );
        }

        return null;
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

    renderHeading(text, isDisabled) {
        return (
          <h2 block="Checkout" elem="Heading" mods={ { isDisabled } }>
              { __(text) }
          </h2>
        );
    }

    render() {
        const {
            onShippingSuccess,
            onShippingError,
            isLoading
        } = this.props;

        const {
            isSignedIn,
            formContent
        } = this.state;

        return (
            <div block="ShippingStep" mods={ { isSignedIn, formContent } }>
                { this.renderOpenPopupButton() }
                { isSignedIn ? this.renderAddAdress() : null }
                <Form
                  id={ SHIPPING_STEP }
                  mix={ { block: 'CheckoutShipping' } }
                  onSubmitError={ onShippingError }
                  onSubmitSuccess={ onShippingSuccess }
                >
                    { isSignedIn ? <h3>{ __('Delivering to') }</h3> : null }
                    { this.renderAddressBook() }
                    <div>
                        <Loader isLoading={ isLoading } />
                        { this.renderDelivery() }
                        { this.renderHeading('Payment Options', true) }
                        { this.renderActions() }
                    </div>
                </Form>
            </div>
        );
    }
}

export default CheckoutShipping;
