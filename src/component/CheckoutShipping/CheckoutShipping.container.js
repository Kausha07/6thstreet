/* eslint-disable no-unused-vars */
import {
  ADDRESS_POPUP_ID,
  ADD_ADDRESS,
} from "Component/MyAccountAddressPopup/MyAccountAddressPopup.config";
import PropTypes from "prop-types";
import VueIntegrationQueries from "Query/vueIntegration.query";
import { connect } from "react-redux";
import { CheckoutShippingContainer as SourceCheckoutShippingContainer } from "SourceComponent/CheckoutShipping/CheckoutShipping.container";
import { resetCart } from "Store/Cart/Cart.action";
import CartDispatcher from "Store/Cart/Cart.dispatcher";
import CheckoutDispatcher from "Store/Checkout/Checkout.dispatcher";
import MyAccountDispatcher from "Store/MyAccount/MyAccount.dispatcher";
import { showNotification } from "Store/Notification/Notification.action";
import { showPopup } from "Store/Popup/Popup.action";
import { trimAddressFields } from "Util/Address";
import { trimCustomerAddressCheckout } from "Util/checkoutAddress"
import { capitalize, isArabic } from "Util/App";
import { getUUID, isSignedIn } from "Util/Auth";
import BrowserDatabase from "Util/BrowserDatabase";
import { VUE_PLACE_ORDER } from "Util/Event";
import { getCountryFromUrl } from "Util/Url/Url";
import { getStoreAddress } from "../../util/API/endpoint/Product/Product.enpoint";
import { camelCase } from "Util/Common";
import {CART_ITEMS_CACHE_KEY} from "../../store/Cart/Cart.reducer";
import { setNewAddressClicked } from "Store/MyAccount/MyAccount.action";
export const MyAccountDispatcherDefalut = import(
  /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
  "Store/MyAccount/MyAccount.dispatcher"
);

export const mapDispatchToProps = (dispatch) => ({
  showPopup: (payload) => dispatch(showPopup(ADDRESS_POPUP_ID, payload)),
  showNotification: (type, message) =>
    dispatch(showNotification(type, message)),
  validateAddress: (address) =>
    CheckoutDispatcher.validateAddress(dispatch, address),
  // eslint-disable-next-line max-len
  estimateShipping: (address, isValidted = false) =>
    CheckoutDispatcher.estimateShipping(dispatch, address, isValidted),
  dispatch,
  estimateEddResponse: (request, type) =>
    MyAccountDispatcher.estimateEddResponse(dispatch, request, type),
  setNewAddressFromClick: (val) => dispatch(setNewAddressClicked(val)),
  updateAddress: (address_id, address) =>
    CheckoutDispatcher.updateAddress(dispatch, address_id, address),
  requestCustomerData: () =>
    MyAccountDispatcherDefalut.then(({ default: dispatcher }) =>
      dispatcher.requestCustomerData(dispatch)
    ),
  setCheckoutLoader: (currState) =>
    CheckoutDispatcher.setCheckoutLoader(dispatch, currState),
});

export const mapStateToProps = (state) => ({
  customer: state.MyAccountReducer.customer,
  addresses: state.MyAccountReducer.addresses,
  eddResponse: state.MyAccountReducer.eddResponse,
  edd_info: state.AppConfig.edd_info,
  addressCityData: state.MyAccountReducer.addressCityData,
  totals: state.CartReducer.cartTotals,
  addressLoader: state.MyAccountReducer.addressLoader,
  addNewAddressClicked: state.MyAccountReducer.addNewAddressClicked,
  international_shipping_fee: state.AppConfig.international_shipping_fee,
  config: state.AppConfig.config,
  vwoData: state.AppConfig.vwoData,
  isAddressSelected: state.CheckoutReducer.isAddressSelected,
  checkoutLoader: state.CheckoutReducer.checkoutLoader,
});

export class CheckoutShippingContainer extends SourceCheckoutShippingContainer {
  static propTypes = {
    ...SourceCheckoutShippingContainer.propTypes,
    guestEmail: PropTypes.string,
    showPopup: PropTypes.func.isRequired,
    validateAddress: PropTypes.func.isRequired,
    shippingAddress: PropTypes.object.isRequired,
    estimateShipping: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    addNewAddressClicked: PropTypes.bool,
  };

  containerFunctions = {
    onShippingSuccess: this.onShippingSuccess.bind(this),
    onShippingError: this.onShippingError.bind(this),
    checkClickAndCollect: this.checkClickAndCollect.bind(this),
    onAddressSelect: this.onAddressSelect.bind(this),
    onUpdateAddress: this.onUpdateAddress.bind(this),
    setCurrentAddress: this.setCurrentAddress.bind(this),
    handleClickNCollectPayment: this.handleClickNCollectPayment.bind(this),
    onShippingMethodSelect: this.onShippingMethodSelect.bind(this),
    showCreateNewPopup: this.showCreateNewPopup.bind(this),
    notSavedAddress: this.notSavedAddress.bind(this),
    onIdentityNumberChange: this.props.onIdentityNumberChange,
    onTypeOfIdentityChange: this.props.onTypeOfIdentityChange,
    onMailingAddressTypeChange: this.props?.onMailingAddressTypeChange,
  };

  constructor(props) {
    super(props); 
    this.state = {
      currentAddress: {},
    }
  }
  
  static defaultProps = {
    guestEmail: "",
  };
  
  onAddressSelect(id) {
    this.setState({ selectedCustomerAddressId: id }, () => {
      this.onAddressSelectNewCheckoutFlow();
    });
  }

  setCurrentAddress(currentAddress) {
    this.setState({ currentAddress: currentAddress });
  }

  onUpdateAddress() {
    const { currentAddress } = this.state
    const { id } = currentAddress;

    if(id){
      this.setState({ selectedCustomerAddressId: id }, () => {
        this.onShippingSuccess(currentAddress, true);
      });
    }else {
      this.onShippingSuccess(currentAddress, true);
    }
  }

  onAddressSelectNewCheckoutFlow = async () => {
    const fields = this.getAddressById(this.state.selectedCustomerAddressId);
    if(fields) {
      this.onShippingSuccess(fields);
    }
  }

  async handleClickNCollectPayment(fields) {
    const {
      totals: { items = [] },
    } = this.props;
    let storeNo = items[0]?.extension_attributes?.click_to_collect_store;
    const getStoreAddressResponse = await getStoreAddress(storeNo);
    let addressField = getStoreAddressResponse.data;
    let inputFields = {
      city: camelCase(addressField?.city || ""),
      country_id: addressField?.country,
      firstname: fields?.firstname,
      guest_email: fields?.guest_email,
      lastname: fields?.lastname,
      phonecode: fields?.phonecode,
      postcode: camelCase(addressField?.area || ""),
      region_id: camelCase(addressField?.area || ""),
      street: addressField?.address,
      telephone: fields?.telephone,
      type_of_identity: this.props?.type_of_identity || 0,
      identity_number: this.props?.identity_number || ""
    };
    this.onShippingSuccess(inputFields);
  }

  getAddressById(addressId) {
    const { addresses } = this.props;
    const address = addresses.find(({ id }) => id === addressId);
    return (address);
  }

  openForm() {
    this.setState({ formContent: true });
  }

  showCreateNewPopup() {
    const { showPopup, setNewAddressFromClick } = this.props;
    this.openForm();
    showPopup({
      action: ADD_ADDRESS,
      title: __("Add new address"),
      address: {},
      onUpdateAddress: this.onUpdateAddress.bind(this),
      setCurrentAddress: this.setCurrentAddress.bind(this),
    });
    setNewAddressFromClick(true);
  }

  notSavedAddress() {
    const { addresses } = this.props;

    if (addresses.length === 0) {
      return true;
    }

    return !addresses.find(
      ({ country_code = null }) => country_code === getCountryFromUrl()
    );
  }

  validateAddress(address = {}) {
    const {
      country_id = "",
      region_id,
      region,
      city,
      telephone = "",
      street,
      phonecode = "",
      postcode,
      type_of_identity,
      identity_number,
      country_code = "",
      area = "",
      phone = "",
    } = address;
    const { validateAddress, mailing_address_type, } = this.props;
    return validateAddress({
      area: area ? area : region ?? postcode,
      city,
      country_code: country_id || country_code,
      phone: phone? phone : phonecode + telephone,
      postcode: region ?? postcode ?? area,
      region: region ?? postcode ?? area,
      street: Array.isArray(street) ? street[0] : street,
      type_of_identity: type_of_identity || this.props?.type_of_identity,
      identity_number: identity_number || this.props?.identity_number,
      mailing_address_type: mailing_address_type || ""
    });
  }

  checkClickAndCollect() {
    const {
      totals: { items = [] },
    } = this.props;
    let newItemList = items.filter((item) => {
      return item.extension_attributes;
    });
    if (newItemList.length === items.length) {
      return true;
    }
    return false;
  }

  estimateShipping(address = {}, isValidted) {
    const { estimateShipping, setLoading } = this.props;
    const {
      country_id,
      region_id,
      city,
      telephone = "",
      street,
      phonecode = "",
      type_of_identity,
      identity_number,
      country_code = "",
      area = "",
      phone = "",
    } = address;
    setLoading(true);

    const NewAddressObj = {
      country_code: country_id || country_code,
      street,
      region: region_id ?? area,
      area: region_id ?? area,
      city,
      postcode: region_id ?? area,
      phone: phonecode + telephone ?? phone,
      telephone: phonecode + telephone ?? phone,
      type_of_identity: type_of_identity || this.props.type_of_identity,
      identity_number: identity_number || this.props.identity_number,
    };

    const canEstimate = !Object.values(NewAddressObj).some(
      (item) => item === undefined
    );

    if (!canEstimate) {
      return;
    }

    /* eslint-disable */
    delete address.region_id;

    return estimateShipping(
      NewAddressObj,
      isValidted
    );
  }

  isEmptyObject = (objectName) => {
    return (
      objectName &&
      Object.keys(objectName).length === 0 &&
      objectName.constructor === Object
    );
  };

  onShippingSuccess(fields, isAddressesUpdating = false) {

    if( (!fields && isSignedIn()) || this.isEmptyObject(fields)) {
      return;
    }

    const { selectedCustomerAddressId, selectedShippingMethod } = this.state;
    const {
      setLoading,
      showNotification,
      dispatch,
      estimateEddResponse,
      eddResponse,
      edd_info,
      addressCityData,
    } = this.props;
    setLoading(true);
    const shippingAddress = selectedCustomerAddressId && !isAddressesUpdating
      ? this.getAddressById(selectedCustomerAddressId)
      : trimAddressFields(fields);
    const addressForValidation =
      isSignedIn() && !this.checkClickAndCollect() ? shippingAddress : fields;
    if (!this.checkClickAndCollect()) {
      const validationResult = this.validateAddress(addressForValidation);
      if (!validationResult) {
        showNotification("error", __("Something went wrong."));
      }

      validationResult.then((response) => {
        const { success } = response;
        if (edd_info && edd_info.is_enable) {
          if (!isSignedIn() || (isSignedIn() && !eddResponse)) {
            const { country_id, city, postcode, country_code="", area="" } = addressForValidation;
            let request = {
              country: country_id ?? country_code,
              courier: null,
              source: null,
            };
            if (isArabic()) {
              let finalResp = Object.values(addressCityData).filter(
                (cityData) => {
                  return cityData.city === city;
                }
              );

              let engAreaIndex = Object.keys(finalResp[0].areas).filter(
                (key) => {
                  if (finalResp[0].areas[key] === postcode) {
                    return key;
                  }
                }
              );
              let arabicArea = Object.values(finalResp[0].areas_ar).filter(
                (area, index) => {
                  if (index === parseInt(engAreaIndex[0])) {
                    return area;
                  }
                }
              );
              request["area"] = arabicArea[0] ?? area;
              request["city"] = finalResp[0].city_ar;
            } else {
              request["area"] = postcode ?? area;
              request["city"] = city;
            }
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
        }

        if (success && !selectedShippingMethod) {
          const estimationResult = this.estimateShipping(
            addressForValidation,
            true
          );

          if (!estimationResult) {
            setLoading(false);
            showNotification("error", __("Something went wrong."));
            dispatch(resetCart());
            CartDispatcher.getCart(dispatch);
            return true;
          }

          estimationResult.then((response) => {
            if (typeof response !== "undefined") {
              const { data = [] } = response;

              if (data.length !== 0) {
                const { available } = data ? data[0] : { available: false };

                if (available) {
                  this.setState(
                    {
                      selectedShippingMethod: response.data[0],
                    },
                    () => this.processDelivery(fields, isAddressesUpdating)
                  );
                } else {
                  const { error } = response;
                  this.handleError(error);
                }
              } else {
                setLoading(false);
                showNotification(
                  "error",
                  __("We can't ship products to selected address")
                );
              }
            } else {
              setLoading(false);
            }
          });
        } else if (success) {
          this.processDelivery(fields, isAddressesUpdating);
        } else {
          this.handleError(response);
        }
      });
    } else {
      if (edd_info && edd_info.is_enable) {
        if (!isSignedIn() || (isSignedIn() && !eddResponse)) {
          const { country_id, city, postcode, country_code="", area="" } = addressForValidation;
          let request = {
            country: country_id ?? country_code,
            courier: null,
            source: null,
          };
          if (isArabic()) {
            let finalResp = Object.values(addressCityData).filter(
              (cityData) => {
                return cityData.city === city;
              }
            );

            let engAreaIndex = Object.keys(finalResp[0].areas).filter((key) => {
              if (finalResp[0].areas[key] === postcode) {
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
            request["area"] = arabicArea[0] ?? area;
            request["city"] = finalResp[0].city_ar;
          } else {
            request["area"] = postcode ?? area;
            request["city"] = city;
          }
          let payload = {};
          if(edd_info?.has_item_level) {
            let items_in_cart = BrowserDatabase.getItem(CART_ITEMS_CACHE_KEY) || [];
            request.intl_vendors=null;
            let items = [];
            items_in_cart.map(item => {
              payload = { sku : item.sku, intl_vendor : edd_info.international_vendors && item.full_item_info.international_vendor && edd_info.international_vendors.indexOf(item.full_item_info.international_vendor)>-1 ? item?.full_item_info?.international_vendor : null}
              payload["qty"] = parseInt(item?.full_item_info?.available_qty);
              payload["cross_border_qty"] = parseInt(item?.full_item_info?.cross_border_qty) ? parseInt(item?.full_item_info?.cross_border_qty): "";
              payload["brand"] = item?.full_item_info?.brand_name;
              items.push(payload);
            });
            request.items = items;
            if(items.length) estimateEddResponse(request, false);
          } else {
            estimateEddResponse(request, false);
          }
        }
      }
      if (!selectedShippingMethod) {
        const estimationResult = this.estimateShipping(
          addressForValidation,
          true
        );

        if (!estimationResult) {
          setLoading(false);
          showNotification("error", __("Something went wrong."));
          dispatch(resetCart());
          CartDispatcher.getCart(dispatch);
          return true;
        }

        estimationResult.then((response) => {
          if (typeof response !== "undefined") {
            const { data = [] } = response;

            if (data.length !== 0) {
              const { available } = data ? data[0] : { available: false };

              if (available) {
                this.setState(
                  {
                    selectedShippingMethod: response.data[0],
                  },
                  () => this.processDelivery(fields, isAddressesUpdating)
                );
              } else {
                const { error } = response;
                this.handleError(error);
              }
            } else {
              setLoading(false);
              showNotification(
                "error",
                __("We can't ship products to selected address")
              );
            }
          } else {
            setLoading(false);
          }
        });
      } else {
        this.processDelivery(fields, isAddressesUpdating);
      }
    }
  }

  handleError(response) {
    const { showNotification, setLoading } = this.props;

    const { parameters, message = "" } = response;
    const formattedParams = parameters ? capitalize(parameters[0]) : "Address";

    showNotification("error", `${message}`);
    setLoading(false);
  }

  processDelivery(fields, isAddressesUpdating = false) {
    const {
      saveAddressInformation,
      customer: { email },
      totals,
      mailing_address_type,
    } = this.props;
    const { guest_email: guestEmail } = fields;
    const isCTC = this.checkClickAndCollect();
    const { selectedCustomerAddressId, selectedShippingMethod } = this.state;

    if (!selectedShippingMethod) {
      return;
    }

    const shippingAddress =
      selectedCustomerAddressId && !this.checkClickAndCollect() && !isAddressesUpdating
        ? this.getAddressById(selectedCustomerAddressId)
        : trimAddressFields(fields);
    const {
      city,
      street,
      country_id,
      telephone,
      postcode,
      type_of_identity = this.props?.type_of_identity || 0,
      identity_number = this.props?.identity_number || "",
      country_code = "",
      area = "",
      phone = "",
    } = shippingAddress;

    const shippingAddressMapped = {
      ...shippingAddress,
      street: Array.isArray(street) ? street[0] : street,
      area: postcode ?? area,
      country_code: country_id ?? country_code,
      phone: telephone ?? phone,
      email: isSignedIn() ? email : guestEmail,
      region: city,
      region_id: 0,
      address_id: isCTC ? null : selectedCustomerAddressId,
      type_of_identity: type_of_identity,
      identity_number: identity_number,
      mailing_address_type: mailing_address_type,
    };
    // on checkout page, set update identity-number and type_of_identity store in the respective address
    if (this.props?.isIdentityNumberModified && isSignedIn()) {
      const updatedAddress = {
        firstname: shippingAddress?.firstname,
        lastname: shippingAddress?.lastname,
        street: shippingAddress?.street,
        city: shippingAddress?.city,
        area: postcode ?? area,
        phone:shippingAddress?.telephone ?? phone,
        country_code: shippingAddress?.country_id ?? country_code,
        default_shipping: shippingAddress?.default_shipping,
        identity_number: identity_number,
        type_of_identity: type_of_identity,
        id: selectedCustomerAddressId,
        mailing_address_type: mailing_address_type,
      };
      try {
        const newPromise = new Promise((resolve, reject) => {
          resolve(
            this.props.updateAddress(selectedCustomerAddressId, updatedAddress)
          );
        }).then(() => {
          this.props?.requestCustomerData();
        });
      } catch (error) {
        console.error(error);
      }
    }

    const {
      carrier_code: shipping_carrier_code,
      method_code: shipping_method_code,
    } = selectedShippingMethod;
    if (
      shippingAddressMapped.phone &&
      shippingAddressMapped.phonecode &&
      !shippingAddressMapped.phone.includes("+")
    ) {
      shippingAddressMapped.phone =
        shippingAddressMapped.phonecode + shippingAddressMapped.phone;
    }
    if (
      shippingAddressMapped.telephone &&
      shippingAddressMapped.phonecode &&
      !shippingAddressMapped.telephone.includes("+")
    ) {
      shippingAddressMapped.telephone =
        shippingAddressMapped.phonecode + shippingAddressMapped.telephone;
    }
    const data = {
      billing_address: shippingAddressMapped,
      shipping_address: shippingAddressMapped,
      shipping_carrier_code,
      shipping_method_code,
    };

    // if user is guest user then set adddress in localstorage for get shipment
    if(!isSignedIn()) {
      localStorage.setItem(
        "currentSelectedAddress",
        JSON.stringify(shippingAddressMapped)
      );
    }

    // Vue call
    const customerData = BrowserDatabase.getItem("customer");
    const userID = customerData && customerData.id ? customerData.id : null;
    const locale = VueIntegrationQueries.getLocaleFromUrl();
    totals?.items?.map((item) => {
      VueIntegrationQueries.vueAnalayticsLogger({
        event_name: VUE_PLACE_ORDER,
        params: {
          event: VUE_PLACE_ORDER,
          pageType: "checkout_payment",
          currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
          clicked: Date.now(),
          sourceProdID: item?.full_item_info?.config_sku,
          sourceCatgID: item?.full_item_info?.category,
          prodQty: item?.full_item_info?.qty,
          prodPrice: item?.full_item_info?.price,
          uuid: getUUID(),
          referrer: window.location.href,
          url: window.location.href,
          userID: userID,
        },
      });
    });
    saveAddressInformation(data);
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckoutShippingContainer);
