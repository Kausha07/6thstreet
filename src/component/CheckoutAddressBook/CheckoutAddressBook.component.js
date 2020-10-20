/* eslint-disable jsx-a11y/control-has-associated-label */
import PropTypes from 'prop-types';

import CheckoutAddressForm from 'Component/CheckoutAddressForm';
import MyAccountAddressPopup from 'Component/MyAccountAddressPopup';
import Slider from 'Component/Slider';
import { BILLING_STEP, SHIPPING_STEP } from 'Route/Checkout/Checkout.config';
import { CheckoutAddressBook as SourceCheckoutAddressBook }
    from 'SourceComponent/CheckoutAddressBook/CheckoutAddressBook.component';
import { customerType } from 'Type/Account';
import isMobile from 'Util/Mobile';

import './CheckoutAddressBook.style.scss';

export class CheckoutAddressBook extends SourceCheckoutAddressBook {
    static propTypes = {
        customer: customerType.isRequired,
        onAddressSelect: PropTypes.func.isRequired,
        onShippingEstimationFieldsChange: PropTypes.func.isRequired,
        selectedAddressId: PropTypes.number.isRequired,
        isSignedIn: PropTypes.bool.isRequired,
        isBilling: PropTypes.bool.isRequired
    };

    state = {
        isCustomAddressExpanded: false,
        currentPage: 0,
        hideCards: false
    };

    renderCustomAddress() {
        const { isBilling, onShippingEstimationFieldsChange, isSignedIn } = this.props;
        const formPortalId = isBilling ? BILLING_STEP : SHIPPING_STEP;

        return (
            <CheckoutAddressForm
              onShippingEstimationFieldsChange={ onShippingEstimationFieldsChange }
              address={ {} }
              isSignedIn={ isSignedIn }
              id={ formPortalId }
            />
        );
    }

    renderSignedInContent() {
        const { currentPage } = this.state;

        if (isMobile.any()) {
            return (
                <>
                    <div block="CheckoutAddressBookSlider" elem="Wrapper">
                        <Slider
                          mix={ { block: 'CheckoutAddressBookSlider', elem: 'MobileSlider' } }
                          activeImage={ currentPage }
                          onActiveImageChange={ this.mobileSliderCallback }
                        >
                            { this.renderAddressList() }
                        </Slider>
                    </div>
                    { this.renderOptionalCustomAddress() }
                </>
            );
        }

        return (
            <>
                <div block="CheckoutAddressBook" elem="Wrapper">
                        { this.renderAddressList() }
                </div>
                { this.renderOptionalCustomAddress() }
            </>
        );
    }

    mobileSliderCallback = (newPage) => {
        this.setState({ currentPage: newPage });
    };

    hideCards = () => {
        this.setState({ hideCards: true });
    };

    renderButtonLabel() {
        return isMobile.any()
            ? __('new address')
            : __('Add new address');
    }

    openNewForm = () => {
        const { showCreateNewPopup } = this.props;

        if (isMobile.any()) {
            this.hideCards();
        }
        showCreateNewPopup();
    };

    renderOptionalCustomAddress() {
        const { isCustomAddressExpanded } = this.state;

        return (
            <div
              block="CheckoutAddressBook"
              elem="CustomAddressWrapper"
            >
                <button
                  block="CheckoutAddressBook"
                  elem="Button"
                  mods={ { isCustomAddressExpanded } }
                  mix={ {
                      block: 'button primary medium',
                      mods: { isHollow: true }
                  } }
                  type="button"
                  onClick={ this.openNewForm }
                >
                    { this.renderButtonLabel() }
                </button>
                { isCustomAddressExpanded && this.renderCustomAddress() }
            </div>
        );
    }

    renderPopup() {
        const {
            formContent,
            closeForm,
            openForm,
            customer
        } = this.props;

        return (
            <MyAccountAddressPopup
              formContent={ formContent }
              closeForm={ closeForm }
              openForm={ openForm }
              showCards={ this.showCards }
              customer={ customer }
            />
        );
    }

    render() {
        const { hideCards } = this.state;

        if (hideCards) {
            return (
                <div block="MyAccountAddressBook">
                    <button
                      block="MyAccountAddressBook"
                      elem="backBtn"
                      onClick={ this.showCards }
                    />
                    { this.renderPopup() }
                </div>
            );
        }

        return (
            <div block="CheckoutAddressBook">
                { this.renderHeading() }
                { this.renderContent() }
                { this.renderPopup() }
            </div>
        );
    }
}

export default CheckoutAddressBook;
