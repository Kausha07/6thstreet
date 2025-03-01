import PropTypes from "prop-types";

import CheckoutAddressForm from "Component/CheckoutAddressForm";
import CheckoutAddressTable from "Component/CheckoutAddressTable";
import Slider from "Component/Slider";
import { BILLING_STEP, SHIPPING_STEP } from "Route/Checkout/Checkout.config";
import { CheckoutAddressBook as SourceCheckoutAddressBook } from "SourceComponent/CheckoutAddressBook/CheckoutAddressBook.component";
import { customerType } from "Type/Account";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import { getCountryFromUrl } from "Util/Url/Url";
import MyAccountAddressPopup from "Component/MyAccountAddressPopup";
import MyAccountAddressNationalityFieldForm from "Component/MyAccountAddressNationalityFieldForm/MyAccountAddressNationalityFieldFrom.component";
import { getStore } from "Store";
import DeliveryAddress from "Component/DeliveryAddress";

import "./CheckoutAddressBook.style.scss";

export class CheckoutAddressBook extends SourceCheckoutAddressBook {
  static propTypes = {
    customer: customerType.isRequired,
    onAddressSelect: PropTypes.func.isRequired,
    onShippingEstimationFieldsChange: PropTypes.func.isRequired,
    selectedAddressId: PropTypes.number.isRequired,
    isSignedIn: PropTypes.bool.isRequired,
    isBilling: PropTypes.bool.isRequired,
    shippingAddress: PropTypes.object.isRequired,
    isClickAndCollect: PropTypes.string.isRequired,
  };

  state = {
    isCustomAddressExpanded: false,
    currentPage: 0,
    isMobile: isMobile.any() || isMobile.tablet(),
    isArabic: isArabic(),
  };

  openForm() {
    this.setState({ formContent: true });
  }

  renderHeading() {
    const { isBilling, isSignedIn, isExchange, isAddressSelected } = this.props;
    const { isArabic } = this.state;

    if(isAddressSelected) {
      return null;
    }

    const addressName = isBilling ? null : isExchange ? ("Select a pick up address"): __("Delivery country");

    return (
      <h2
        block="Checkout"
        elem="Heading"
        mods={{ isArabic, isDeliveringCountry: isSignedIn }}
      >
        {addressName}
      </h2>
    );
  }

  editCheckoutAddress = () => {
    const { selectIsAddressSet } = this.props;
    selectIsAddressSet(false);
  }

  renderCustomAddress() {
    const {
      isBilling,
      onShippingEstimationFieldsChange,
      isSignedIn,
      shippingAddress,
      isClickAndCollect,
      clickAndCollectStatus,
      customer,
      selectedAddressId,
      onAddressSelect,
      isAddressSelected,
      onUpdateAddress,
      setCurrentAddress,
    } = this.props;
    const formPortalId = isBilling ? BILLING_STEP : SHIPPING_STEP;

    if (isAddressSelected) {
      return (
        <div>
          <DeliveryAddress
            selectedAddressId={selectedAddressId}
            onAddressSelect={onAddressSelect}
            shippingAddress={shippingAddress}
            editCheckoutAddress={this.editCheckoutAddress}
            onUpdateAddress={onUpdateAddress}
            setCurrentAddress={setCurrentAddress}
          />
        </div>
      );
    }

    return (
      <CheckoutAddressForm
        onShippingEstimationFieldsChange={onShippingEstimationFieldsChange}
        address={{}}
        // If Click And Collect is selected, treat it as guest form
        isSignedIn={isSignedIn && !clickAndCollectStatus}
        showCountry={isSignedIn}
        id={formPortalId}
        shippingAddress={shippingAddress}
        clickAndCollectStatus={clickAndCollectStatus}
        isClickAndCollect={isClickAndCollect}
        customer={customer}
      />
    );
  }

  renderAddress = (address) => {
    const {
      onAddressSelect,
      selectedAddressId,
      openForm,
      closeForm,
      hideCards,
      isBilling,
      PickUpAddress
    } = this.props;
    const { id, area } = address;
    if (!area) {
      return null;
    }

    return (
      <CheckoutAddressTable
        onClick={onAddressSelect}
        isSelected={selectedAddressId === id}
        title={__("Address #%s", id)}
        address={address}
        key={id}
        PickUpAddress={PickUpAddress}
        showActions={!!!isBilling}
        hideCards={hideCards}
        openForm={openForm}
        closeForm={closeForm}
      />
    );
  };

  renderNoAddresses() {
    const {
      openForm,
    } = this.props;
    return (
      <div block="CheckoutNoAddressBlock">
        <p>{__('You have no configured addresses.')}</p>
        <div block="CheckoutAddressBook" elem="NewAddressBtn">
          <button
            type="button"
            block="CheckoutAddressBook"
            elem="NewAddress"
            mix={{
              block: "button primary small",
            }}
            onClick={openForm}
          >
            {__('Add New Address')}
          </button>
        </div>
      </div>
    );
  }

  renderAddressList() {
    const {
      addresses,
      selectedAddressId,
      onAddressSelect,
      shippingAddress,
      onUpdateAddress,
      setCurrentAddress,
    } = this.props;
    const isCountryNotAddressAvailable =
      !addresses.some((add) => add.country_code === getCountryFromUrl()) &&
      !isMobile.any();

    if (!addresses) {
      return this.renderLoading();
    }
    if (!addresses.length || isCountryNotAddressAvailable) {
      return this.renderNoAddresses();
    }

    return (
      <DeliveryAddress
        selectedAddressId={selectedAddressId}
        onAddressSelect={onAddressSelect}
        shippingAddress={shippingAddress}
        editCheckoutAddress={this.editCheckoutAddress}
        onUpdateAddress={onUpdateAddress}
        setCurrentAddress={setCurrentAddress}
      />
    );

    
    for(let i=1; i<addresses.length; i++){
      if(addresses[i].default_shipping){
        let temp = addresses[i];
        addresses[i]= addresses[0];
        addresses[0] = temp; 
      }
    }

    return addresses.map(this.renderAddress);
  }

  renderSignedInContent() {
    const { currentPage, isArabic, isMobile } = this.state;

    return (
      <div block="CheckoutAddressBook" elem="Wrapper">
        {this.renderAddressList()}
      </div>
    );
  }

  mobileSliderCallback = (newPage) => {
    this.setState({ currentPage: newPage });
  };

  renderPopup() {
    const { formContent, closeForm, openForm, customer,isExchange } = this.props;

    return (
      <div block="EditAddress" elem="PopUp">
        <button
          block="CheckoutAddressBook"
          elem="backBtn"
          onClick={this.showCards}
        />
        <MyAccountAddressPopup
          isExchange={isExchange}
          formContent={formContent}
          closeForm={closeForm}
          openForm={openForm}
          showCards={this.showCards}
          customer={customer}
        />
      </div>
    );
  }
  renderGuestUserCustomClearanceField = () => {
    const {
      AppConfig: { is_nationality_visible = false },
    } = getStore().getState();
    const type_of_identity = {
      value: this.props?.type_of_identity,
      onTypeOfIdentityChange: this.props?.onTypeOfIdentityChange,
    };
    const identity_number = {
      value: this.props?.identity_number,
      onIdentityNumberChange: this.props?.onIdentityNumberChange,
      validationError: this.props?.validationError,
    };
    return (
      <>
        {this.renderGuestContent()}
        {is_nationality_visible && (
          <div block="custom-clearance-guest-user">
            <MyAccountAddressNationalityFieldForm
              isArabic={isArabic}
              isCheckoutPage={true}
              type_of_identity={type_of_identity}
              identity_number={identity_number}
            />
          </div>
        )}
      </>
    );
  };

  getidentityNumberSelectedAddress = () => {
    const { addresses = [], selectedAddressId } = this.props;
    if (addresses && addresses?.length > 0 && selectedAddressId) {
      const selectedAddressObject = addresses?.find((address) => {
        if (address?.id === selectedAddressId) {
          return true;
        }
      })
      if (selectedAddressObject?.identity_number && selectedAddressObject?.identity_number?.length > 0) {
        return true;
      }
    }
    return false;
  }

  renderSignInCustomClearanceField = () => {
    const {
      AppConfig: { is_nationality_visible = false },
    } = getStore().getState();
    const { isSignedIn } = this.props;
    const type_of_identity = {
      value: this.props?.type_of_identity,
      onTypeOfIdentityChange: this.props?.onTypeOfIdentityChange,
    };
    const identity_number = {
      value: this.props?.identity_number,
      onIdentityNumberChange: this.props?.onIdentityNumberChange,
      validationError: this.props?.validationError,
    };
    const isIdentityNumberExist = !this.getidentityNumberSelectedAddress();
    return isSignedIn && is_nationality_visible && isIdentityNumberExist ? (
      <div block="checkoutAddressBookCustomClearanceContainer">
        <h3 className="custom-clearance-header">
          {__("Customs Clearance Information")}
        </h3>
        <div block="checkoutAddressBookCustomClearance">
          <MyAccountAddressNationalityFieldForm
            isArabic={isArabic}
            isCheckoutPage={true}
            type_of_identity={type_of_identity}
            identity_number={identity_number}
          />
        </div>
      </div>
    ) : null;
  };
  renderContent() {
    const { isSignedIn, isClickAndCollect, clickAndCollectStatus } = this.props;
    if (isSignedIn && !clickAndCollectStatus) {
      return this.renderSignedInContent();
    }

    return this.renderGuestUserCustomClearanceField();
  }

  render() {
    const { isBilling,PickUpAddress } = this.props; 
    return (
      <div block="CheckoutAddressBook" mods={{ isBilling }}>
        {!PickUpAddress && this.renderHeading()}
        {!this.state.isMobile && this.renderSignInCustomClearanceField()}
        {this.renderContent()}
        {this.state.isMobile && this.renderSignInCustomClearanceField()}
      </div>
    );
  }
}

export default CheckoutAddressBook;
