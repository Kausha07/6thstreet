/* eslint-disable no-magic-numbers */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { PureComponent } from "react";
import PropTypes from "prop-types";
import history from "Util/History";

import CheckoutAddressBook from "Component/CheckoutAddressBook";
import Form from "Component/Form";
import MyAccountAddressPopup from "Component/MyAccountAddressPopup";
import { SHIPPING_STEP } from "Route/Checkout/Checkout.config";
import { customerType } from "Type/Account";
import { isArabic } from "Util/App";
import { isSignedIn } from "Util/Auth";
import isMobile from "Util/Mobile";
import { getCountryFromUrl } from "Util/Url/Url";
import { ThreeDots } from "react-loader-spinner";

import "./PickUpAddress.style";
import {
  ADDRESS_POPUP_ID,
  ADD_ADDRESS
} from "Component/MyAccountAddressPopup/MyAccountAddressPopup.config";
import { connect } from "react-redux";
import CheckoutDispatcher from "Store/Checkout/Checkout.dispatcher";
import { showNotification } from "Store/Notification/Notification.action";
import { showPopup } from "Store/Popup/Popup.action";

export const mapDispatchToProps = (dispatch) => ({
  showPopup: (payload) => dispatch(showPopup(ADDRESS_POPUP_ID, payload)),
  showNotification: (type, message) =>
    dispatch(showNotification(type, message)),
  validateAddress: (address) =>
    CheckoutDispatcher.validateAddress(dispatch, address),
  // eslint-disable-next-line max-len
});

export const mapStateToProps = (state) => ({
  customer: state.MyAccountReducer.customer,
  addresses: state.MyAccountReducer.addresses,
  eddResponse: state.MyAccountReducer.eddResponse,
  edd_info: state.AppConfig.edd_info,
  addressCityData: state.MyAccountReducer.addressCityData,
  totals: state.CartReducer.cartTotals,
});
export class PickUpAddress extends PureComponent {
  static propTypes = {
    customer: customerType.isRequired,
    showCreateNewPopup: PropTypes.func.isRequired,
  };

  state = {
    isArabic: isArabic(),
    formContent: false,
    isSignedIn: isSignedIn(),
    isMobile: isMobile.any() || isMobile.tablet(),
    openFirstPopup: false,
    renderLoading: false,
    isButtondisabled: false,
  };

  componentDidMount() {
    const { isSignedIn } = this.state
    if (!isSignedIn) {
      history.push('/')
    }
  }
  renderButtonsPlaceholder() {
    return __("Proceed")
  }

  checkForDisabling() {
    const { selectedShippingMethod } = this.props;
    const { isMobile } = this.state;
    if ((!selectedShippingMethod) || !isMobile) {
      return true;
    }

    return false;
  }

  renderActions() {
    const { isPaymentLoading } = this.props;
    const { isButtondisabled } = this.state;

    return (
      <div block="PickUpAddresses" elem="StickyButtonWrapper">
        <button
          type="submit"
          block={"Button"}
          form={SHIPPING_STEP}
          // disabled={this.checkForDisabling()}
          disabled={isButtondisabled}
          mix={{
            block: "PickUpAddress",
            elem: isPaymentLoading ? "LoadingButton" : "Button",
          }}
        >
          {!isPaymentLoading ? (
            this.renderButtonsPlaceholder()
          ) : (
            <ThreeDots color="white" height={6} width={"100%"} />
          )}
        </button>
      </div>
    );
  }

  renderDeliveryButton() {
    const {
      addresses,
      selectedCustomerAddressId,
      isPaymentLoading,
    } = this.props;
    const { isSignedIn } = this.state;
    const selectedAddress = addresses.filter(
      ({ id }) => id === selectedCustomerAddressId
    );
    const { country_code: selectedAddressCountry = "" } = selectedAddress.length
      ? selectedAddress[0]
      : {};

    if (
      // isMobile.any() ||
      // isMobile.tablet() ||
      (isSignedIn && addresses.length === 0) ||
      (isSignedIn &&
        selectedAddressCountry !== getCountryFromUrl())
    ) {
      this.setState({ isButtondisabled: true })
      return null;
    } else {
      this.setState({ isButtondisabled: false })
    }

    return (
      <div block="CheckoutShippingStep" elem="DeliveryButton">
        <button
          type="submit"
          block="Button button primary medium"
          disabled={isPaymentLoading}
        >
          {__("Next")}
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
      <div
        block="MyAccountAddressBook"
        elem="ContentWrapper"
        mods={{ formContent }}
      >
        <button
          block="MyAccountAddressBook"
          elem="backButton"
          mods={{ isArabic }}
          onClick={this.showCards}
        />
        <MyAccountAddressPopup
          formContent={formContent}
          closeForm={this.closeForm}
          openForm={this.openForm}
          showCards={this.showCards}
          customer={customer}
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

  showCreateNewPopup() {
    const { showPopup } = this.props;

    this.openForm();
    showPopup({
      action: ADD_ADDRESS,
      title: __("Add new address"),
      address: {},
    });
  }

  openNewForm = () => {
    this.openForm();
    this.showCreateNewPopup();
  };

  renderButtonLabel() {
    const { isMobile } = this.state;

    return isMobile ? (
      <>
        <span
          style={{ paddingRight: "10px", fontWeight: "bold", fontSize: "16px" }}
        >
          +
        </span>{" "}
        {__("New address")}
      </>
    ) : (
      __("Add new address")
    );
  }

  notSavedAddress = () => {
    const { addresses } = this.props;

    if (addresses.length === 0) {
      return true;
    }

    return !addresses.find(
      ({ country_code = null }) => country_code === getCountryFromUrl()
    );
  }

  renderOpenPopupButton = () => {
    const { openFirstPopup, formContent, isArabic } = this.state;
    const {
      addresses,
    } = this.props;

    const isCountryNotAddressAvailable =
      !addresses.some((add) => add.country_code === getCountryFromUrl()) &&
      !isMobile.any();
    if (
      !openFirstPopup &&
      addresses &&
      isSignedIn() &&
      this.notSavedAddress()
    ) {
      this.setState({ openFirstPopup: true });
      this.openNewForm();
    }

    if (isSignedIn() && addresses.length > 0) {
      return (
        <div
          block="MyAccountAddressBook"
          elem="NewAddressWrapper"
          mods={{ formContent, isArabic, isCountryNotAddressAvailable }}
        >
          <button
            block="MyAccountAddressBook"
            elem="NewAddress"
            mix={{
              block: "button primary small",
            }}
            onClick={this.openNewForm}
          >
            {this.renderButtonLabel()}
          </button>
        </div>
      );
    }

    return null;
  };

  // renderDelivery() {
  //   const { shippingMethods, onShippingMethodSelect } = this.props;

  //   const { isArabic } = this.state;

  //   return (
  //     <div block="CheckoutShippingStep" mods={{ isArabic }}>
  //       {this.renderDeliveryButton()}
  //       <CheckoutDeliveryOptions
  //         shippingMethods={shippingMethods}
  //         onShippingMethodSelect={onShippingMethodSelect}
  //       />
  //     </div>
  //   );
  // }

  renderHeading(text, isDisabled) {
    return (
      <h2 block="PickUpAddresses" elem="Heading" mods={{ isDisabled }}>
        {__(text)}
      </h2>
    );
  }
  onEditSelect() {
    this.setState({ editAddress: true });
  }

  renderAddressBook() {
    const {
      onAddressSelect,
      addresses,
    } = this.props;
    const { formContent } = this.state;
    return (
      <CheckoutAddressBook
        onAddressSelect={onAddressSelect}
        addresses={addresses}
        formContent={formContent}
        closeForm={this.closeForm.bind(this)}
        openForm={this.openForm.bind(this)}
        showCards={this.showCards}
        hideCards={this.hideCards}
      />
    );
  }

  render() {
    const {
      onShippingSuccess,
      onShippingError,
      addresses
    } = this.props;
    const { formContent } = this.state;
    return (
      <div
        block="ShippingStep"
        mods={{ isSignedIn: isSignedIn(), formContent }}
      >
        {this.renderOpenPopupButton()}
        {isSignedIn() ? this.renderAddAdress() : null}
        <Form
          id={SHIPPING_STEP}
          mix={{ block: "PickUpAddress" }}
          onSubmitError={onShippingError}
          onSubmitSuccess={onShippingSuccess}
        >
          {isSignedIn() ? (
            <>
              <h4 block="PickUpAddress" elem="DeliveryMessage">
                {__("Select Pick Up Address")}
              </h4>
            </>
          ) : null}
          {isSignedIn() && this.renderAddressBook()}
          <div>
            {this.renderActions()}
          </div>
        </Form>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PickUpAddress);
