import CheckoutAddressForm from 'Component/CheckoutAddressForm';
import Slider from 'Component/Slider';
import { BILLING_STEP, SHIPPING_STEP } from 'Route/Checkout/Checkout.config';
import { CheckoutAddressBook as SourceCheckoutAddressBook }
    from 'SourceComponent/CheckoutAddressBook/CheckoutAddressBook.component';
import isMobile from 'Util/Mobile';

import './CheckoutAddressBook.style.scss';

export class CheckoutAddressBook extends SourceCheckoutAddressBook {
    state = {
        isCustomAddressExpanded: false,
        currentPage: 0
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

    renderButtonLabel() {
        return isMobile.any()
            ? __('new address')
            : __('Add new address');
    }

    hideCards = () => {
        this.setState({ hideCards: true });
    };

    openNewForm = () => {
        const { showCreateNewPopup } = this.props;

        if (isMobile.any()) {
            this.hideCards();
        }
        showCreateNewPopup();

        if (!isMobile.any()) {
            const elmnts = document.getElementsByClassName('MyAccountAddressBook-NewAddress');
            elmnts[0].scrollIntoView();
        }
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
                      // mix: { block: 'button primary medium', mods: { isMobile } }
                  } }
                  type="button"
                  onClick={ isMobile.any() ? this.openNewForm : this.expandCustomAddress }
                >
                    { this.renderButtonLabel() }
                </button>
                { isCustomAddressExpanded && this.renderCustomAddress() }
            </div>
        );
    }
}

export default CheckoutAddressBook;
