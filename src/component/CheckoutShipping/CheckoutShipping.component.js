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
import { getCurrency, isArabic, getDiscountFromTotals } from "Util/App";
import { isSignedIn } from "Util/Auth";
import isMobile from "Util/Mobile";
import { ThreeDots } from "react-loader-spinner";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import BrowserDatabase from "Util/BrowserDatabase";
import { EVENT_MOE_GO_TO_PAYMENT, MOE_trackEvent } from "Util/Event";
import CartTotal from "Component/CartTotal";
import NewCheckoutPayment from "Component/NewCheckoutPayment";
import NewCheckoutShippment from "Component/NewCheckoutShippment";

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
    isButtondisabled: false,
  };
  renderButtonsPlaceholder() {
    return __("Proceed to secure payment");
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
            {`${price === __("FREE") ? "" : currency_code} ${price}`}
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
        items = [],
      },
      international_shipping_fee,
      config,
      vwoData,
    } = this.props;

    let inventory_level_cross_border = false;
    items?.map((item) => {
      if (
        item?.full_item_info &&
        item?.full_item_info?.cross_border &&
        parseInt(item.full_item_info.cross_border) > 0
      ) {
        inventory_level_cross_border = true;
      }
    });
    
    const { isMobile } = this.state;
    const countryCode = getCountryFromUrl();
    const isSidewideCouponEnabled =  vwoData?.SiteWideCoupon?.isFeatureEnabled || false;

    if (isSidewideCouponEnabled && isMobile ) {
      return (
        <CartTotal
          pageType="CheckoutPage"
          block="CheckoutOrderSummary"
        />
      );
    }

    if (total !== {}) {
      const grandTotal = getFinalPrice(total, currency_code);
      const subTotal = getFinalPrice(subtotal, currency_code);
      if (discount != 0) {
        return (
          <div block="Checkout" elem="OrderTotals">
            <ul>
              <div block="Checkout" elem="Subtotals">
                {this.renderPriceLine(subTotal, __("Subtotal"))}
                {(!inventory_level_cross_border ||
                  !international_shipping_fee) &&
                  this.renderPriceLine(
                    getDiscountFromTotals(totals, "shipping") || __("FREE"),
                    __("Shipping Charges")
                  )}
                {international_shipping_fee &&
                  inventory_level_cross_border &&
                  this.renderPriceLine(
                    getDiscountFromTotals(totals, "intl_shipping") ||
                      __("FREE"),
                    __("International Shipping Fee")
                  )}
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
            {(!inventory_level_cross_border || !international_shipping_fee) &&
              this.renderPriceLine(
                getDiscountFromTotals(totals, "shipping") || __("FREE"),
                __("Shipping Charges")
              )}
            {international_shipping_fee &&
              inventory_level_cross_border &&
              this.renderPriceLine(
                getDiscountFromTotals(totals, "intl_shipping") || __("FREE"),
                __("International Shipping Fee")
              )}
            {this.renderPriceLine(grandTotal, __("Total Amount"), {
              divider: true,
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

  sendMOEEvents = () => {
    const {
      totals: {
        items,
        coupon_code,
        currency_code,
        shipping_fee,
        subtotal,
        total,
        discount,
      },
      shippingAddress: { city, email, area, telephone },
      addresses,
      selectedCustomerAddressId,
      customer,
    } = this.props;
    const { isSignedIn } = this.state;
    const selectedAddress = addresses.filter(
      ({ id }) => id === selectedCustomerAddressId
    );
    const getformValue = (key) => {
      if (document.getElementById(key)) {
        return document.getElementById(key).value;
      } else {
        return;
      }
    };
    const form_phone = getformValue("phonecode") + getformValue("telephone");
    const currentAppState = BrowserDatabase.getItem(APP_STATE_CACHE_KEY);
    const selectedAddressInBook = selectedAddress[0];
    const phoneNumber =
      telephone && telephone.length > 0
        ? telephone
        : form_phone && form_phone.length > 0
        ? form_phone
        : selectedAddressInBook.phone
        ? selectedAddressInBook.phone
        : "";
    const formatPhoneNumber = phoneNumber.includes("+")
      ? phoneNumber.replace("+", "")
      : phoneNumber;

    if (items && items.length > 0) {
      let productName = [],
        productColor = [],
        productBrand = [],
        productSku = [],
        productGender = [],
        productBasePrice = [],
        productSizeOption = [],
        productSizeValue = [],
        productSubCategory = [],
        productThumbanail = [],
        productUrl = [],
        productQty = [],
        productCategory = [],
        productItemPrice = [];
      items.forEach((item) => {
        let productKeys = item?.full_item_info;
        productName.push(productKeys?.name);
        productColor.push(productKeys?.color);
        productBrand.push(productKeys?.brand_name);
        productSku.push(productKeys?.config_sku);
        productGender.push(productKeys?.gender);
        productBasePrice.push(productKeys?.original_price);
        productSizeOption.push(productKeys?.size_option);
        productSizeValue.push(productKeys?.size_value);
        productSubCategory.push(productKeys?.subcategory);
        productThumbanail.push(productKeys?.thumbnail_url);
        productUrl.push(productKeys?.url);
        productQty.push(productKeys?.qty);
        productCategory.push(productKeys?.original_price);
        productItemPrice.push(productKeys?.itemPrice);
      });

      MOE_trackEvent(EVENT_MOE_GO_TO_PAYMENT, {
        country: getCountryFromUrl().toUpperCase(),
        language: getLanguageFromUrl().toUpperCase(),
        category: currentAppState?.gender
          ? currentAppState.gender.toUpperCase()
          : "",
        brand_name: productBrand.length > 0 ? productBrand : "",
        color: productColor.length > 0 ? productColor : "",
        discounted_price: productItemPrice.length > 0 ? productItemPrice : "",
        full_price: productBasePrice.length > 0 ? productBasePrice : "",
        product_name: productName.length > 0 ? productName : "",
        product_sku: productSku.length > 0 ? productSku : "",
        gender: productGender.length > 0 ? productGender : "",
        size_id: productSizeOption.length > 0 ? productSizeOption : "",
        size: productSizeValue.length > 0 ? productSizeValue : "",
        subcategory: productSubCategory.length > 0 ? productSubCategory : "",
        coupon_code_applied: coupon_code || "",
        currency: currency_code || "",
        discounted_amount: discount || "",
        product_count: items.length || "",
        shipping_fee: shipping_fee || "",
        subtotal_amount: subtotal || "",
        total_amount: total || "",
        city:
          city && city.length > 0
            ? city
            : getformValue("city") && getformValue("city").length > 0
            ? getformValue("city")
            : selectedAddressInBook?.city || "",
        area:
          area && area.length > 0
            ? area
            : getformValue("region_id") && getformValue("region_id").length > 0
            ? getformValue("region_id")
            : selectedAddressInBook?.area || "",
        email:
          email && email.length > 0
            ? email
            : getformValue("guest_email") &&
              getformValue("guest_email").length > 0
            ? getformValue("guest_email")
            : customer.email || "",
        phone: formatPhoneNumber,
        isLoggedIn: isSignedIn,
        app6thstreet_platform: "Web",
      });
    }
  };

  renderItems() {
    const {
      totals: { items = [], quote_currency_code },
    } = this.props;
    const { isSignedIn } = this.state;

    return (
      <NewCheckoutShippment
        items={items}
        quote_currency_code={quote_currency_code}
        isSignedIn={isSignedIn}
      />
    );
  }

  renderActions() {
    const { isPaymentLoading, isAddressSelected } = this.props;
    const { isButtondisabled } = this.state;

    if(isAddressSelected){
      return null;
    }

    return (
      <div block="Checkout" elem="StickyButtonWrapper">
        {this.renderTotals()}
        <button
          type="submit"
          block={"Button"}
          form={SHIPPING_STEP}
          // disabled={this.checkForDisabling()}
          disabled={isButtondisabled}
          onClick={() => this.sendMOEEvents()}
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
      addressLoader,
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
      (isSignedIn && addresses.length === 0 && !checkClickAndCollect()) ||
      (isSignedIn &&
        selectedAddressCountry !== getCountryFromUrl() &&
        !checkClickAndCollect())
    ) {
      this.setState({ isButtondisabled: true });
      return null;
    } else {
      this.setState({ isButtondisabled: false });
    }
    const isLoading = !isSignedIn
      ? isPaymentLoading
      : !isPaymentLoading && !addressLoader
      ? false
      : true;
    return (
      <div block="CheckoutShippingStep" elem="DeliveryButton">
        <button
          type="submit"
          block="Button button primary medium"
          disabled={isLoading}
          onClick={() => this.sendMOEEvents()}
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
    const { customer, onMailingAddressTypeChange, } = this.props;
    return (
      <div
        block="MyAccountAddressBook"
        elem="ContentWrapper"
        mods={{ formContent }}
      >
        <button
          block={`${formContent ? "" : "isButtonVisbile"} MyAccountAddressBook`}
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
          type_of_identity={this.props?.type_of_identity}
          identity_number={this.props?.identity_number}
          onTypeOfIdentityChange={this.props?.onTypeOfIdentityChange}
          onIdentityNumberChange={this.props?.onIdentityNumberChange}
          onMailingAddressTypeChange={onMailingAddressTypeChange}
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
          style={{ paddingRight: "10px", fontWeight: "500", fontSize: "12px" }}
        >
          +
        </span>{" "}
        {__("Add New")}
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


    return null;
  };

  renderDelivery() {
    const { shippingMethods, onShippingMethodSelect, isAddressSelected, addresses } = this.props;
    const { isArabic } = this.state;

    const isCountryAddressAvailable =
    addresses.some((add) => add.country_code === getCountryFromUrl());

    if(isAddressSelected || isCountryAddressAvailable) {
      return null;
    }

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
      edd_info,
      addressCityData,
      customer,
      onMailingAddressTypeChange,
      onUpdateAddress,
      setCurrentAddress,
    } = this.props;
    const { formContent } = this.state;
    return (
      <CheckoutAddressBook
        onAddressSelect={onAddressSelect}
        addresses={addresses}
        edd_info={edd_info}
        addressCityData={addressCityData}
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
        customer={customer}
        type_of_identity={this.props?.type_of_identity}
        identity_number={this.props?.identity_number}
        onIdentityNumberChange={this.props?.onIdentityNumberChange}
        onTypeOfIdentityChange={this.props?.onTypeOfIdentityChange}
        onMailingAddressTypeChange={onMailingAddressTypeChange}
        onUpdateAddress={onUpdateAddress}
        setCurrentAddress={setCurrentAddress}
      />
    );
  }

  renderNewPaymentBlock = () => {
    const {
      cashOnDeliveryFee,
      setLoading,
      paymentMethods,
      setDetailsStep,
      shippingAddress,
      setCashOnDeliveryFee,
      savePaymentInformation,
      savePaymentInformationApplePay,
      getBinPromotion,
      updateTotals,
      setTabbyWebUrl,
      setPaymentCode,
      binModal,
      setCheckoutCreditCardData,
      processApplePay,
      placeOrder,
      isClickAndCollect,
      couponsItems,
      removeCouponFromCart,
      couponLists,
      applyCouponToCart,
      isClubApparelEnabled,
      type_of_identity,
      identity_number,
      validationError,
      onIdentityNumberChange,
      onTypeOfIdentityChange,
      onMailingAddressTypeChange,
      mailing_address_type,
      setShippingAddress,
      selectedPaymentMethod,
    } = this.props;

    return (
      <NewCheckoutPayment
        cashOnDeliveryFee={cashOnDeliveryFee}
        setLoading={setLoading}
        paymentMethods={paymentMethods}
        setDetailsStep={setDetailsStep}
        shippingAddress={shippingAddress}
        setCashOnDeliveryFee={setCashOnDeliveryFee}
        savePaymentInformation={savePaymentInformation}
        savePaymentInformationApplePay={savePaymentInformationApplePay}
        getBinPromotion={getBinPromotion}
        updateTotals={updateTotals}
        setTabbyWebUrl={setTabbyWebUrl}
        setPaymentCode={setPaymentCode}
        binModal={binModal}
        setCheckoutCreditCardData={setCheckoutCreditCardData}
        processApplePay={processApplePay}
        placeOrder={placeOrder}
        isClickAndCollect={isClickAndCollect}
        couponsItems={couponsItems}
        removeCouponFromCart={removeCouponFromCart}
        couponLists={couponLists}
        applyCouponToCart={applyCouponToCart}
        isClubApparelEnabled={isClubApparelEnabled}
        type_of_identity={type_of_identity}
        identity_number={identity_number}
        validationError={validationError}
        onIdentityNumberChange={onIdentityNumberChange}
        onTypeOfIdentityChange={onTypeOfIdentityChange}
        onMailingAddressTypeChange={onMailingAddressTypeChange}
        mailing_address_type={mailing_address_type}
        setShippingAddress={setShippingAddress} // Delete this if not used
        selectedPaymentMethod={selectedPaymentMethod}
      />
    );
  };

  renderAddNewAddressButton = () => {
    const {
      addresses,
      checkClickAndCollect,
    } = this.props;
    const { formContent, isArabic } = this.state;
    const isCountryNotAddressAvailable =
      !addresses.some((add) => add.country_code === getCountryFromUrl()) &&
      !isMobile.any();
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
  }
  render() {
    const {
      onShippingSuccess,
      onShippingError,
      isClickAndCollect,
      checkClickAndCollect,
      handleClickNCollectPayment,
      isPaymentLoading,
    } = this.props;
    const { formContent, isMobile } = this.state;
    return (
      <div
        block="ShippingStep"
        mods={{ isSignedIn: isSignedIn(), formContent }}
      >
        {this.renderOpenPopupButton()}
        {isSignedIn() ? this.renderAddAdress() : null}
        {isSignedIn() && !checkClickAndCollect() && !isMobile ? (
            <div block="header-new-address-container" mods={{formContent}}>
              <div>
                <h4 block="CheckoutShipping" elem="DeliveryMessage">
                  {checkClickAndCollect()
                    ? "Please confirm your contact details"
                    : __("Where can we send your order?")}
                </h4 >
              </div>
            </div>
          ) : null
        }
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
          {this.renderAddressBook()}
          <div>
            {/* {<Loader isLoading={isLoading} />} */}
            {this.renderDelivery()}
            {this.renderNewPaymentBlock()}
            {/* {this.renderHeading(__("Payment Options"), true)} */}
            {isMobile ? this.renderItems() : null}
            {isMobile ? this.renderActions() : null}
            <Loader isLoading={isPaymentLoading}/>
          </div>
        </Form>
      </div>
    );
  }
}

export default CheckoutShipping;
