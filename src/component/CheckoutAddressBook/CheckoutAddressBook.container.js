import PropTypes from "prop-types";
import { PureComponent } from 'react';
import { connect } from "react-redux";

import {
  ADD_ADDRESS,
  ADDRESS_POPUP_ID,
} from "Component/MyAccountAddressPopup/MyAccountAddressPopup.config";
import { showPopup } from "Store/Popup/Popup.action";
import { customerType } from "Type/Account";
import CheckoutAddressBook from "./CheckoutAddressBook.component";
import { isArabic } from "Util/App";
import BrowserDatabase from "Util/BrowserDatabase";
import {CART_ITEMS_CACHE_KEY} from "../../store/Cart/Cart.reducer";
import { setSelectedAddressID } from "Store/MyAccount/MyAccount.action";
import { getCountryFromUrl } from "Util/Url/Url";

export const MyAccountDispatcher = import(
  /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
  "Store/MyAccount/MyAccount.dispatcher"
);
import CheckoutDispatcher from "Store/Checkout/Checkout.dispatcher";

export const mapStateToProps = (state) => ({
  customer: state.MyAccountReducer.customer,
  isSignedIn: state.MyAccountReducer.isSignedIn,
  isAddressSelected: state.CheckoutReducer.isAddressSelected,
  addresses: state.MyAccountReducer.addresses,
});

export const mapDispatchToProps = (dispatch) => ({
  showPopup: (payload) => dispatch(showPopup(ADDRESS_POPUP_ID, payload)),
  requestCustomerData: () =>
    MyAccountDispatcher.then(({ default: dispatcher }) =>
      dispatcher.requestCustomerData(dispatch)
    ),
  estimateEddResponse: (request, type) =>
    MyAccountDispatcher.then(({ default: dispatcher }) =>
      dispatcher.estimateEddResponse(dispatch, request, type)
    ),
  setSelectedAddressID: (val) => dispatch(setSelectedAddressID(val)),
  selectIsAddressSet: (isAddress) =>
    CheckoutDispatcher.selectIsAddressSet(dispatch, isAddress),
  setCheckoutLoader: (currState) =>
    CheckoutDispatcher.setCheckoutLoader(dispatch, currState),
});

export class CheckoutAddressBookContainer extends PureComponent {
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

  static defaultProps = {
    isBilling: false,
    onAddressSelect: () => {},
    onShippingEstimationFieldsChange: () => {}
  };

  containerFunctions = {
    onAddressSelect: this.onAddressSelect.bind(this),
    showCreateNewPopup: this.showCreateNewPopup.bind(this),
  };

  constructor(props) {
    super(props);

    const {
        requestCustomerData,
        customer,
        onAddressSelect,
        isSignedIn,
        setCheckoutLoader,
    } = props;

    if (isSignedIn && !Object.keys(customer).length) {
        requestCustomerData();
    }

    const defaultAddressId = CheckoutAddressBookContainer._getDefaultAddressId(props);

    if (defaultAddressId) {
        setCheckoutLoader(true);
        onAddressSelect(defaultAddressId);
        // this.estimateShipping(defaultAddressId);
    }

    this.state = {
        prevDefaultAddressId: defaultAddressId,
        selectedAddressId: defaultAddressId
    };
}

  static _getDefaultAddressId(props) {
    const { customer, isBilling, shippingAddress, addresses } = props;
    const defaultKey = isBilling ? "default_billing" : "default_shipping";
    const { [defaultKey]: defaultAddressId } = customer;
    const reqObj = JSON.parse(localStorage.getItem("currentSelectedAddress"));

    // if user selected address - from current country
    if(reqObj && (reqObj?.country_code === getCountryFromUrl()) && reqObj.id) {
      return +reqObj.id;
    }

    // if the user has default address selected
    if (defaultAddressId) {
      // check is default address belongs to current store
      const defaultAddress = addresses.find(
        ({ id }) => id === +defaultAddressId
      );
      if (
        defaultAddress &&
        defaultAddress?.country_code === getCountryFromUrl()
      ) {
        return +defaultAddressId;
      }
    }

    // if user added address for current store
    const countryWiseAddresses = addresses
    ?.filter((obj) => obj?.country_code === getCountryFromUrl())
    .sort((a, b) => {
      if (a.default_shipping === true && b.default_shipping !== true) {
        return -1;
      }
      if (a.default_shipping !== true && b.default_shipping === true) {
        return 1;
      }
      return 0;
    });

    if(countryWiseAddresses && countryWiseAddresses.length) {
      if(shippingAddress && shippingAddress.address_id){
        const { address_id } = shippingAddress;
        if(address_id){
          return address_id;
        }else {
          return countryWiseAddresses[0].id;
        }
      }
      return countryWiseAddresses[0].id;
    }

    return 0;
  }

  componentDidMount() {
    const {
      onAddressSelect,
      setSelectedAddressID,
      addresses = [],
      onIdentityNumberChange = () => {},
      onTypeOfIdentityChange = () => {},
    } = this.props;
    const { selectedAddressId } = this.state;
    const selectedAddress = addresses?.filter(
      ({ id }) => id === selectedAddressId
    );
    const typeOfIdentity = selectedAddress?.[0]?.type_of_identity
      ? selectedAddress?.[0]?.type_of_identity
      : 0;
    const identityNumber = selectedAddress?.[0]?.identity_number
      ? selectedAddress?.[0]?.identity_number
      : "";
    onTypeOfIdentityChange(typeOfIdentity);
    onIdentityNumberChange(identityNumber);
    setSelectedAddressID(selectedAddressId);
  }
  componentDidUpdate(prevProps, prevState) {
    const {
      onAddressSelect,
      requestCustomerData,
      isSignedIn,
      customer,
      addresses,
      setSelectedAddressID,
      onIdentityNumberChange = ()=>{},
      onTypeOfIdentityChange = ()=>{}
    } = this.props;
    const { selectedAddressId: prevSelectedAddressId } = prevState;
    const { selectedAddressId } = this.state;
    if (isSignedIn && !Object.keys(customer).length) {
      requestCustomerData();
    }
    if (selectedAddressId !== prevSelectedAddressId) {
      const selectedAddress = addresses?.filter(
        ({ id }) => id === selectedAddressId
      );
      const typeOfIdentity = selectedAddress?.[0]?.type_of_identity
        ? selectedAddress?.[0]?.type_of_identity
        : 0;
      const identityNumber = selectedAddress?.[0]?.identity_number
        ? selectedAddress?.[0]?.identity_number
        : "";
      setSelectedAddressID(selectedAddressId);
      onAddressSelect(selectedAddressId);
      this.estimateShipping(selectedAddressId);
      onTypeOfIdentityChange(typeOfIdentity);
      onIdentityNumberChange(identityNumber);
    }
    if (
      prevProps.addresses !== addresses &&
      addresses.length == 1 &&
      selectedAddressId !== 0
    ) {
      this.estimateShipping(selectedAddressId);
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { prevDefaultAddressId } = state;
    const { selectedAddressId } = props;
    const defaultAddressId = selectedAddressId
      ? selectedAddressId
      : CheckoutAddressBookContainer._getDefaultAddressId(props);

    if (defaultAddressId !== prevDefaultAddressId) {
      return {
        selectedAddressId: defaultAddressId,
        prevDefaultAddressId: defaultAddressId,
      };
    }

    return null;
  }

  onAddressSelect(address) {
    const { id = 0, city, area, country_code } = address;
    const {
      estimateEddResponse,
      edd_info,
      addressCityData,
      isExchange = false,
      onExchangeAddressSelect,
    } = this.props;
    let finalArea = area;
    let finalCity = city;
    this.setState({ selectedAddressId: id });
    if (!isExchange) {
      if (isArabic()) {
        let finalResp = Object.values(addressCityData).filter((cityData) => {
          return cityData.city === city;
        });

        let engAreaIndex = Object.keys(finalResp[0].areas).filter((key) => {
          if (finalResp[0].areas[key] === area) {
            return key;
          }
        });
        let arabicArea = Object.values(finalResp[0].areas_ar).filter(
          (area, index) => {
            if (index === parseInt(engAreaIndex[0])) {
              return area;
            }
          }
        );
        finalArea = arabicArea[0];
        finalCity = finalResp[0].city_ar;
      }
      if (edd_info && edd_info.is_enable) {
        let request = {
          country: country_code,
          city: finalCity,
          area: finalArea,
          courier: null,
          source: null,
        };
        let payload = {};
        if(edd_info?.has_item_level) {
          let items_in_cart = BrowserDatabase.getItem(CART_ITEMS_CACHE_KEY) || [];
          request.intl_vendors=null;
          let items = [];
          items_in_cart.map(item => {
            if(!(item && item.full_item_info && item.full_item_info.cross_border && !edd_info.has_cross_border_enabled)) {
              payload = { sku : item.sku, intl_vendor : edd_info.international_vendors && item.full_item_info.international_vendor && edd_info.international_vendors.indexOf(item.full_item_info.international_vendor)>-1 ? item?.full_item_info?.international_vendor : null}
              payload["qty"] = parseInt(item?.full_item_info?.available_qty);
              payload["cross_border_qty"] = parseInt(item?.full_item_info?.cross_border_qty) ? parseInt(item?.full_item_info?.cross_border_qty): "";
              payload["brand"] = item?.full_item_info?.brand_name;
              items.push(payload);
            }
          })
          request.items = items;
          if(items.length) estimateEddResponse(request, false);
        } else {
          estimateEddResponse(request, false);
        }
      }
    } else {
      onExchangeAddressSelect(id);
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
