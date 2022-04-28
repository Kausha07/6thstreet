import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  ADD_ADDRESS,
  ADDRESS_POPUP_ID,
} from "Component/MyAccountAddressPopup/MyAccountAddressPopup.config";
import {
  CheckoutAddressBookContainer as SourceCheckoutAddressBookContainer,
  mapStateToProps,
} from "SourceComponent/CheckoutAddressBook/CheckoutAddressBook.container";
import { showPopup } from "Store/Popup/Popup.action";
import { customerType } from "Type/Account";
import CheckoutAddressBook from "./CheckoutAddressBook.component";

export const MyAccountDispatcher = import(
  /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
  "Store/MyAccount/MyAccount.dispatcher"
);

export const mapDispatchToProps = (dispatch) => ({
  showPopup: (payload) => dispatch(showPopup(ADDRESS_POPUP_ID, payload)),
  requestCustomerData: () =>
    MyAccountDispatcher.then(({ default: dispatcher }) =>
      dispatcher.requestCustomerData(dispatch)
    ),
  estimateEddResponse: (request) =>
    MyAccountDispatcher.then(({ default: dispatcher }) =>
      dispatcher.estimateEddResponse(dispatch, request)
    ),
});

export class CheckoutAddressBookContainer extends SourceCheckoutAddressBookContainer {
  static propTypes = {
    isSignedIn: PropTypes.bool.isRequired,
    requestCustomerData: PropTypes.func.isRequired,
    onShippingEstimationFieldsChange: PropTypes.func,
    onAddressSelect: PropTypes.func,
    customer: customerType.isRequired,
    isBilling: PropTypes.bool,
    showPopup: PropTypes.func.isRequired,
    shippingAddress: PropTypes.object.isRequired,
    isClickAndCollect: PropTypes.string.isRequired,
  };

  containerFunctions = {
    onAddressSelect: this.onAddressSelect.bind(this),
    showCreateNewPopup: this.showCreateNewPopup.bind(this),
  };

  onAddressSelect(address) {
    const { id = 0, city, area, country_code } = address;
    const { estimateEddResponse, edd_info } = this.props;
    this.setState({ selectedAddressId: id });
    if (edd_info && edd_info.is_enable) {
      let request = {
        country: country_code,
        city: city,
        area: area,
        courier: null,
        source: null,
      };
      estimateEddResponse(request);
    }
  }

  showCreateNewPopup() {
    const { showPopup } = this.props;

    this.openForm();
    showPopup({
      action: ADD_ADDRESS,
      title: __("Add new address"),
      address: {},
    });
  }

  estimateShipping(addressId) {
    const { onShippingEstimationFieldsChange, addresses } = this.props;

    const address = addresses.find(({ id }) => id === addressId);
    if (!address) {
      return;
    }

    const { city, country_code, area, street, phone } = address;

    if (!country_code) {
      return;
    }

    onShippingEstimationFieldsChange({
      city,
      country_code,
      region_id: null,
      area,
      postcode: area,
      phone,
      street,
      telephone: phone.substring("4"),
    });
  }
  render() {
    return (
      <CheckoutAddressBook
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
)(CheckoutAddressBookContainer);
