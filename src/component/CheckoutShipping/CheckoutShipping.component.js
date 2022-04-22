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
import { getCurrency, isArabic } from "Util/App";
import { isSignedIn } from "Util/Auth";
import isMobile from "Util/Mobile";
import { getCountryFromUrl } from "Util/Url/Url";
import { ThreeDots } from "react-loader-spinner";

import "./CheckoutShipping.style";

export class CheckoutShipping extends SourceCheckoutShipping {
  static propTypes = {
    ...SourceCheckoutShipping.propTypes,
    customer: customerType.isRequired,
    showCreateNewPopup: PropTypes.func.isRequired,
    shippingAddress: PropTypes.object.isRequired,
    isClickAndCollect: PropTypes.string.isRequired,
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
    const {isMobile} = this.state
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
      totals: {
        coupon_code: couponCode,
        discount,
        subtotal = 0,
        total = 0,
        currency_code = getCurrency(),
        total_segments: totals = [],
        shipping_fee = 0,
      },
    } = this.props;

    if (total !== {}) {
      const grandTotal = getFinalPrice(total, currency_code);
      const subTotal = getFinalPrice(subtotal, currency_code);
      if (discount != 0) {
        return (
          <div block="Checkout" elem="OrderTotals">
            <ul>
              <div block="Checkout" elem="Subtotals">
                {this.renderPriceLine(subTotal, __("Subtotal"))}
                {couponCode || (discount && discount != 0)
                  ? this.renderPriceLine(discount, __("Discount"))
                  : null}
                {this.renderPriceLine(grandTotal, __("Total Amount"), {
                  divider: true,
                })}
              </div>
            </ul>
          </div>
        );
      } else {
        return (
          <div block="Checkout" elem="OrderTotals">
            {this.renderPriceLine(subTotal, __("Subtotal"), {
              subtotalOnly: true,
            })}
          </div>
        );
      }
    }

    return null;
  }

  checkForDisabling() {
    const { selectedShippingMethod, checkClickAndCollect } = this.props;
    const { isMobile } = this.state;
    if ((!checkClickAndCollect() && !selectedShippingMethod) || !isMobile) {
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
          // disabled={this.checkForDisabling()}
          mix={{
            block: "CheckoutShipping",
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
      checkClickAndCollect,
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
      isMobile.any() ||
      isMobile.tablet() ||
      (isSignedIn && addresses.length === 0 && !checkClickAndCollect()) ||
      (isSignedIn &&
        selectedAddressCountry !== getCountryFromUrl() &&
        !checkClickAndCollect())
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
      addresses,
      isClickAndCollect,
      checkClickAndCollect,
    } = this.props;

    const isCountryNotAddressAvailable =
      !addresses.some((add) => add.country_code === getCountryFromUrl()) &&
      !isMobile.any();
    if (
      !openFirstPopup &&
      addresses &&
      isSignedIn() &&
      notSavedAddress() &&
      !checkClickAndCollect()
    ) {
      this.setState({ openFirstPopup: true });
      this.openNewForm();
    }

    if (isSignedIn() && !checkClickAndCollect() && addresses.length > 0) {
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
      totals,
      addresses,
      citiesData
    } = this.props;
    const { formContent } = this.state;
    return (
      <CheckoutAddressBook
        onAddressSelect={onAddressSelect}
        addresses={addresses}
        citiesData={citiesData}
        onShippingEstimationFieldsChange={onShippingEstimationFieldsChange}
        shippingAddress={shippingAddress}
        formContent={formContent}
        closeForm={this.closeForm.bind(this)}
        openForm={this.openForm.bind(this)}
        showCards={this.showCards}
        hideCards={this.hideCards}
        totals={totals}
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
          {isSignedIn() && !checkClickAndCollect() ? (
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
