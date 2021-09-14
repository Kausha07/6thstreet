/* eslint-disable no-magic-numbers */
/* eslint-disable jsx-a11y/control-has-associated-label */
import PropTypes from "prop-types";

import CheckoutAddressBook from "Component/CheckoutAddressBook";
import CheckoutDeliveryOptions from "Component/CheckoutDeliveryOptions";
import Form from "Component/Form";
import Loader from "Component/Loader";
import MyAccountAddressPopup from "Component/MyAccountAddressPopup";
import { getFinalPrice } from "Component/Price/Price.config";
import { SHIPPING_STEP } from "Route/Checkout/Checkout.config";
import { CheckoutShipping as SourceCheckoutShipping } from "SourceComponent/CheckoutShipping/CheckoutShipping.component";
import { customerType } from "Type/Account";
import { isArabic } from "Util/App";
import { isSignedIn } from "Util/Auth";
import isMobile from "Util/Mobile";
import { getCountryFromUrl } from "Util/Url/Url";
import Spinner from "react-spinkit";
import "./CheckoutShipping.style";

export class CheckoutShipping extends SourceCheckoutShipping {
  static propTypes = {
    ...SourceCheckoutShipping.propTypes,
    customer: customerType.isRequired,
    showCreateNewPopup: PropTypes.func.isRequired,
    shippingAddress: PropTypes.object.isRequired,
    isClickAndCollect: PropTypes.bool.isRequired,
  };

  state = {
    isArabic: isArabic(),
    formContent: false,
    isSignedIn: isSignedIn(),
    isMobile: isMobile.any() || isMobile.tablet(),
    openFirstPopup: false,
    renderLoading: false,
  };

  renderButtonsPlaceholder() {
    return isMobile ? __("Proceed to secure payment") : __("Place order");
  }

  renderPriceLine(price, name, mods) {
    const {
      totals: { currency_code },
    } = this.props;

    return (
      <li block="CheckoutOrderSummary" elem="SummaryItem" mods={mods}>
        <strong block="CheckoutOrderSummary" elem="Text">
          {name}
        </strong>
        {price !== undefined ? (
          <strong block="CheckoutOrderSummary" elem="Price">
            {`${currency_code} ${price}`}
          </strong>
        ) : null}
      </li>
    );
  }

  renderTotals() {
    const {
      totals: { total, currency_code },
    } = this.props;

    if (total !== {}) {
      const finalPrice = getFinalPrice(total, currency_code);

      return (
        <div block="Checkout" elem="OrderTotals">
          {this.renderPriceLine(finalPrice, __("Subtotal"))}
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
    const { isPaymentLoading } = this.props;
    return (
      <div block="Checkout" elem="StickyButtonWrapper">
        {this.renderTotals()}
        <button
          type="submit"
          block={"Button"}
          form={SHIPPING_STEP}
          disabled={this.checkForDisabling()}
          mix={{
            block: "CheckoutShipping",
            elem: isPaymentLoading ? "LoadingButton" : "Button",
          }}
        >
          {!isPaymentLoading ? (
            this.renderButtonsPlaceholder()
          ) : (
            <Spinner name="three-bounce" color="white" fadeIn="none" />
          )}
          {/* <Spinner name="three-bounce" /> */}
        </button>
      </div>
    );
  }

  renderDeliveryButton() {
    const {
      customer: { addresses = [] },
      selectedCustomerAddressId,
      checkClickAndCollect,
      isPaymentLoading,
    } = this.props;
    const { isSignedIn } = this.state;
    const selectedAddress = addresses.filter(
      ({ id }) => id === selectedCustomerAddressId
    );
    const { country_id: selectedAddressCountry = "" } = selectedAddress.length
      ? selectedAddress[0]
      : {};

    if (
      isMobile.any() ||
      isMobile.tablet() ||
      (isSignedIn && addresses.length === 0) ||
      (isSignedIn && selectedAddressCountry !== getCountryFromUrl())
    ) {
      return null;
    }

    return (
      <div block="CheckoutShippingStep" elem="DeliveryButton">
        <button
          type="submit"
          block="Button button primary medium"
          disabled={isPaymentLoading}
        >
          {checkClickAndCollect() ? "Next" : __("Deliver to this address")}
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

  openNewForm = () => {
    const { showCreateNewPopup } = this.props;
    this.openForm();
    showCreateNewPopup();
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

  renderOpenPopupButton = () => {
    const { openFirstPopup, formContent, isArabic } = this.state;
    const {
      notSavedAddress,
      customer: { addresses = [] },
      isClickAndCollect,
    } = this.props;

    if (!openFirstPopup && addresses && isSignedIn() && notSavedAddress()) {
      this.setState({ openFirstPopup: true });
      this.openNewForm();
    }

    if (isSignedIn() && !!!isClickAndCollect) {
      return (
        <div
          block="MyAccountAddressBook"
          elem="NewAddressWrapper"
          mods={{ formContent, isArabic }}
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

  renderDelivery() {
    const { shippingMethods, onShippingMethodSelect } = this.props;

    const { isArabic } = this.state;

    return (
      <div block="CheckoutShippingStep" mods={{ isArabic }}>
        {this.renderDeliveryButton()}
        <CheckoutDeliveryOptions
          shippingMethods={shippingMethods}
          onShippingMethodSelect={onShippingMethodSelect}
        />
      </div>
    );
  }

  renderHeading(text, isDisabled) {
    return (
      <h2 block="Checkout" elem="Heading" mods={{ isDisabled }}>
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
      onShippingEstimationFieldsChange,
      shippingAddress,
      isClickAndCollect,
      checkClickAndCollect,
    } = this.props;
    const { formContent } = this.state;
    return (
      <CheckoutAddressBook
        onAddressSelect={onAddressSelect}
        onShippingEstimationFieldsChange={onShippingEstimationFieldsChange}
        shippingAddress={shippingAddress}
        formContent={formContent}
        closeForm={this.closeForm.bind(this)}
        openForm={this.openForm.bind(this)}
        showCards={this.showCards}
        hideCards={this.hideCards}
        isClickAndCollect={isClickAndCollect}
        clickAndCollectStatus={checkClickAndCollect()}
      />
    );
  }

  render() {
    const {
      onShippingSuccess,
      onShippingError,
      isClickAndCollect,
      checkClickAndCollect,
      handleClickNCollectPayment,
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
          mix={{ block: "CheckoutShipping" }}
          onSubmitError={onShippingError}
          onSubmitSuccess={
            !checkClickAndCollect()
              ? onShippingSuccess
              : handleClickNCollectPayment
          }
        >
          {isSignedIn() ? (
            <>
              <h3>{__("Delivering to")}</h3>
              <h4 block="CheckoutShipping" elem="DeliveryMessage">
                {checkClickAndCollect()
                  ? "Please confirm your contact details"
                  : __("Where can we send your order?")}
              </h4>
            </>
          ) : null}
          {this.renderAddressBook()}
          <div>
            {/* {<Loader isLoading={isLoading} />} */}
            {this.renderDelivery()}
            {this.renderHeading(__("Payment Options"), true)}
            {this.renderActions()}
          </div>
        </Form>
      </div>
    );
  }
}

export default CheckoutShipping;
