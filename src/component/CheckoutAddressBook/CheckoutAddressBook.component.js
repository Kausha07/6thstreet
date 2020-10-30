import PropTypes from 'prop-types';

import CheckoutAddressForm from 'Component/CheckoutAddressForm';
import Slider from 'Component/Slider';
import { BILLING_STEP, SHIPPING_STEP } from 'Route/Checkout/Checkout.config';
import { CheckoutAddressBook as SourceCheckoutAddressBook }
    from 'SourceComponent/CheckoutAddressBook/CheckoutAddressBook.component';
import { customerType } from 'Type/Account';
import { isArabic } from 'Util/App';
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
        isMobile: isMobile.any() || isMobile.tablet(),
        isArabic: isArabic()
    };

    renderHeading() {
        const { isBilling } = this.props;
        const addressName = isBilling ? null : __('Delivery country');

        return (
            <h2 block="Checkout" elem="Heading">
                { addressName }
            </h2>
        );
    }

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
        const { currentPage, isArabic, isMobile } = this.state;

        if (isMobile) {
            return (
                <div
                  block="CheckoutAddressBookSlider"
                  elem="Wrapper"
                  mods={ { isArabic } }
                >
                    <Slider
                      mix={ {
                          block: 'CheckoutAddressBookSlider',
                          elem: 'MobileSlider',
                          mods: { isArabic }
                      } }
                      activeImage={ currentPage }
                      onActiveImageChange={ this.mobileSliderCallback }
                    >
                        { this.renderAddressList() }
                    </Slider>
                </div>
            );
        }

        return (
            <div block="CheckoutAddressBook" elem="Wrapper">
                { this.renderAddressList() }
            </div>
        );
    }

    mobileSliderCallback = (newPage) => {
        this.setState({ currentPage: newPage });
    };

    render() {
        return (
            <div block="CheckoutAddressBook">
                { this.renderHeading() }
                { this.renderContent() }
            </div>
        );
    }
}

export default CheckoutAddressBook;
