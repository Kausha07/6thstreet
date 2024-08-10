/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";

import MyAccountQuery from "Query/MyAccount.query";
import CheckoutDispatcher from "Store/Checkout/Checkout.dispatcher";
import { goToPreviousNavigationState } from "Store/Navigation/Navigation.action";
import { TOP_NAVIGATION_TYPE } from "Store/Navigation/Navigation.reducer";
import { showNotification } from "Store/Notification/Notification.action";
import { setAddressLoadingStatus } from "Store/MyAccount/MyAccount.action";
import { hideActiveOverlay } from "Store/Overlay/Overlay.action";
import { addressType } from "Type/Account";
import { capitalize } from "Util/App";
import { fetchMutation } from "Util/Request";

import MyAccountAddressPopup from "./MyAccountAddressPopup.component";
import { ADDRESS_POPUP_ID, ADD_ADDRESS } from "./MyAccountAddressPopup.config";
import { showPopup } from "Store/Popup/Popup.action";
import { setNewAddressSaved } from "Store/MyAccount/MyAccount.action";

export const MyAccountDispatcher = import(
  /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
  "Store/MyAccount/MyAccount.dispatcher"
);

export const mapStateToProps = (state) => ({
  payload: state.PopupReducer.popupPayload[ADDRESS_POPUP_ID] || {},
  is_nationality_mandatory: state.AppConfig.is_nationality_mandatory,
  isExpressDelivery: state.AppConfig.isExpressDelivery,
  vwoData: state.AppConfig.vwoData,
  isNewCheckoutPageEnable: state.AppConfig.isNewCheckoutPageEnable,
});

export const mapDispatchToProps = (dispatch) => ({
  hideActiveOverlay: () => dispatch(hideActiveOverlay()),
  showErrorNotification: (error) =>
    dispatch(showNotification("error", error[0].message)),
  showSuccessNotification: (message) =>
    dispatch(showNotification("success", message)),
  updateCustomerDetails: () =>
    MyAccountDispatcher.then(({ default: dispatcher }) =>
      dispatcher.requestCustomerData(dispatch)
    ),
  goToPreviousHeaderState: () =>
    dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE)),
  // eslint-disable-next-line max-len
  validateAddress: (address) =>
    CheckoutDispatcher.validateAddress(dispatch, address),
  addAddress: (address) => CheckoutDispatcher.addAddress(dispatch, address),
  updateAddress: (address_id, address) =>
    CheckoutDispatcher.updateAddress(dispatch, address_id, address),
  removeAddress: (id) => CheckoutDispatcher.removeAddress(dispatch, id),
  showNotification: (type, message) =>
    dispatch(showNotification(type, message)),
  setAddressLoadingStatus: (status) =>
    dispatch(setAddressLoadingStatus(status)),
  showPopup: (payload) => dispatch(showPopup(ADDRESS_POPUP_ID, payload)),
  showNotification: (error) =>
    dispatch(showNotification("error", error)),
  setNewAddressSaved: (val) => dispatch(setNewAddressSaved(val)),
  selectedCityArea: (data) =>
    MyAccountDispatcher.then(({ default: dispatcher }) =>
      dispatcher.selectedCityArea(dispatch, data)
    ),
  expressPopUpOpen: (val) =>
    MyAccountDispatcher.then(({ default: dispatcher }) =>
      dispatcher.expressPopUpOpen(dispatch, val)
    ),
  setAddressDeleted: (val) =>
    MyAccountDispatcher.then(({ default: dispatcher }) =>
      dispatcher.setAddressDeleted(dispatch, val)
    ),
  setPrevSelectedAddressForPLPFilters: (val) =>
    MyAccountDispatcher.then(({ default: dispatcher }) =>
      dispatcher.setPrevSelectedAddressForPLPFilters(dispatch, val)
    ),
});

export class MyAccountAddressPopupContainer extends PureComponent {
  static propTypes = {
    showErrorNotification: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    updateCustomerDetails: PropTypes.func.isRequired,
    showCards: PropTypes.func.isRequired,
    hideActiveOverlay: PropTypes.func.isRequired,
    goToPreviousHeaderState: PropTypes.func.isRequired,
    closeForm: PropTypes.func.isRequired,
    payload: PropTypes.shape({
      address: addressType,
    }),
    validateAddress: PropTypes.func.isRequired,
  };

  static defaultProps = {
    payload: {},
  };

  state = {
    isLoading: false,
  };

  containerFunctions = {
    handleAddress: this.handleAddress.bind(this),
    handleDeleteAddress: this.handleDeleteAddress.bind(this),
  };

  handleAfterAction = () => {
    const {
      hideActiveOverlay,
      updateCustomerDetails,
      showErrorNotification,
      goToPreviousHeaderState,
      closeForm,
      setAddressLoadingStatus
    } = this.props;

    updateCustomerDetails().then(() => {
      this.setState({ isLoading: false }, () => {
        hideActiveOverlay();
        goToPreviousHeaderState();
        closeForm();
        setAddressLoadingStatus(false);
      });
    }, showErrorNotification);
  };

  handleError = (error) => {
    const { showErrorNotification } = this.props;
    showErrorNotification(error);
    this.setState({ isLoading: false });
  };

  validateAddress(address) {
    const {
      country_id,
      region: { region, region_id },
      city,
      telephone = "",
      street,
      phonecode = "",
      type_of_identity = 0,
      identity_number = "",
      mailing_address_type = "",
    } = address;
    const { validateAddress } = this.props;

    return validateAddress({
      area: region ?? region_id,
      city,
      country_code: country_id,
      phone: phonecode + telephone,
      postcode: region ?? region_id,
      region: region ?? region_id,
      street: Array.isArray(street) ? street[0] : street,
      type_of_identity: type_of_identity,
      identity_number: identity_number,
      mailing_address_type: mailing_address_type,
    });
  }

  handleValidationError(response) {
    const { showNotification } = this.props;

    const { parameters, message = "" } = response;
    const formattedParams = parameters ? capitalize(parameters[0]) : "Address";

    showNotification("error", `${message}`);
  }

  handleAddress(address) {
    const {
      payload: {
        address: { id },
      },
    } = this.props;
    const { showNotification, setAddressLoadingStatus } = this.props;

    const validationResult = this.validateAddress(address);
    setAddressLoadingStatus(true);
    if (!validationResult) {
      showNotification("error", __("Something went wrong."));
      setAddressLoadingStatus(false);
    }

    validationResult.then((response) => {
      const { success } = response;

      if (success) {
        const elmnts = document.getElementsByClassName("MyAccount-Heading");

        if (elmnts && elmnts.length > 0) {
          elmnts[0].scrollIntoView({ behavior: "smooth", block: "end" });
        }
        setAddressLoadingStatus(false); 
        if (id) {
          return this.handleEditAddress(address);
        }

        return this.handleCreateAddress(address);
      }
      setAddressLoadingStatus(false);
      return this.handleValidationError(response);
    });
  }

  setDeletedAddress = (address) => {
    const { setAddressDeleted } = this.props;
    setAddressDeleted(address);
  };

  setLocalStorageAddress = (newAddress) => {
    const {
      isExpressDelivery,
      setNewAddressSaved,
      vwoData,
      isNewCheckoutPageEnable,
      selectedCityArea,
      expressPopUpOpen,
      setPrevSelectedAddressForPLPFilters,
    } = this.props;
    if (
      (isExpressDelivery && vwoData?.Express?.isFeatureEnabled) ||
      isNewCheckoutPageEnable
    ) {
      const { country_code = "", city = "", area = "" } = newAddress;
      let requestObj = {
        country: country_code,
        city: city,
        area: area,
        courier: null,
        source: null,
      };
      setPrevSelectedAddressForPLPFilters( JSON.parse(localStorage.getItem("currentSelectedAddress")));
      localStorage.setItem("EddAddressReq", JSON.stringify(requestObj));
      localStorage.setItem(
        "currentSelectedAddress",
        JSON.stringify(newAddress)
      );
      setNewAddressSaved(false);
      selectedCityArea(newAddress);
      expressPopUpOpen(false);
    }
  };

  handleEditAddress(address) {
    const {
      showCards,
      payload: {
        address: { id },
      },
      updateAddress,
      showNotification,
      is_nationality_mandatory
    } = this.props;
    const { newAddress } = this.getNewAddressField(address);
    newAddress.id = id;

    const isValidInput =
      (newAddress?.type_of_identity == 0 &&
        /^\d{1,9}$/.test(newAddress?.identity_number) &&
        newAddress?.identity_number?.length <= 9) ||
      (newAddress?.type_of_identity == 1 &&
        /^[a-zA-Z0-9]*$/.test(newAddress?.identity_number) &&
        newAddress?.identity_number?.length <= 15);

    if (!isValidInput && is_nationality_mandatory) {
      if (newAddress?.type_of_identity == 0) {
        showNotification(__("Enter a valid National ID number"));
      } else {
        showNotification(__("Enter a valid Passport number"));
      }
      return;
    }

    const apiResult = updateAddress(id, newAddress);
    if (
      Object.keys(address).length > 0 &&
      address?.type_of_identity &&
      address?.identity_number &&
      this.props?.onIdentityNumberChange &&
      this.props?.onTypeOfIdentityChange
    ) {
      this.props?.onIdentityNumberChange(address?.identity_number);
      this.props?.onTypeOfIdentityChange(address?.type_of_identity);
    }

    if (apiResult) {
      apiResult.then(this.handleAfterAction, this.handleError, this.setLocalStorageAddress(newAddress)).then(showCards);
    }
  }

  async handleDeleteAddress() {
    const {
      showCards,
      payload: {
        address: { id, default_billing, default_shipping },
      },
      showPopup,
      removeAddress,
    } = this.props;

    showPopup({
      action: ADD_ADDRESS,
      title: __("Add new address"),
      address: {},
    });

    if (default_shipping || default_billing) {
      this.setState({ isLoading: true });
      const deleteApiResult = removeAddress(id);
      this.props.setNewAddressSaved(false);
      deleteApiResult
        .then(this.handleAfterAction, this.setDeletedAddress(this.props?.payload?.address), this.handleError)
        .then(showCards);
      return;
    }

    this.setState({ isLoading: true });
    const deleteApiResult = removeAddress(id);
    deleteApiResult
      .then(this.handleAfterAction, this.setDeletedAddress(this.props?.payload?.address), this.handleError)
      .then(showCards);
  }

  handleCreateAddress(address) {
    const { showCards, addAddress } = this.props;
    const { newAddress } = this.getNewAddressField(address);
    const apiResult = addAddress(newAddress);
    if (apiResult) {
      apiResult.then(this.handleAfterAction, this.handleError).then(showCards);
    }
  }

  getNewAddressField(address) {
    const {
      default_shipping,
      postcode,
      country_id,
      firstname,
      lastname,
      street,
      city,
      telephone,
      type_of_identity = this.props?.type_of_identity || 0,
      identity_number = this.props?.identity_number || "",
      mailing_address_type,
    } = address;
    const newAddress = {
      firstname: firstname,
      lastname: lastname,
      street: street,
      city: city,
      area: postcode,
      phone: telephone,
      country_code: country_id,
      default_shipping: default_shipping,
      type_of_identity: type_of_identity,
      identity_number: identity_number,
      mailing_address_type: mailing_address_type,
    };
    return { newAddress };
  }

  render() {
    return (
      <MyAccountAddressPopup
        {...this.props}
        {...this.state}
        {...this.containerFunctions}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyAccountAddressPopupContainer);
