/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ADD_ADDRESS, ADDRESS_POPUP_ID } from 'Component/MyAccountAddressPopup/MyAccountAddressPopup.config';
import {
    CheckoutShippingContainer as SourceCheckoutShippingContainer
} from 'SourceComponent/CheckoutShipping/CheckoutShipping.container';
import CheckoutDispatcher from 'Store/Checkout/Checkout.dispatcher';
import { showNotification } from 'Store/Notification/Notification.action';
import { showPopup } from 'Store/Popup/Popup.action';
import { trimAddressFields } from 'Util/Address';
import { capitalize } from 'Util/App';
import { isSignedIn } from 'Util/Auth';

export const mapDispatchToProps = (dispatch) => ({
    showPopup: (payload) => dispatch(showPopup(ADDRESS_POPUP_ID, payload)),
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    validateAddress: (address) => CheckoutDispatcher.validateAddress(dispatch, address),
    // eslint-disable-next-line max-len
    estimateShipping: (address, isValidted = false) => CheckoutDispatcher.estimateShipping(dispatch, address, isValidted)
});

export const mapStateToProps = (state) => ({
    customer: state.MyAccountReducer.customer
});

export class CheckoutShippingContainer extends SourceCheckoutShippingContainer {
    static propTypes = {
        ...SourceCheckoutShippingContainer.propTypes,
        guestEmail: PropTypes.string,
        showPopup: PropTypes.func.isRequired,
        validateAddress: PropTypes.func.isRequired,
        shippingAddress: PropTypes.object.isRequired,
        estimateShipping: PropTypes.func.isRequired,
        setLoading: PropTypes.func.isRequired
    };

    containerFunctions = {
        onShippingSuccess: this.onShippingSuccess.bind(this),
        onShippingError: this.onShippingError.bind(this),
        onAddressSelect: this.onAddressSelect.bind(this),
        onShippingMethodSelect: this.onShippingMethodSelect.bind(this),
        showCreateNewPopup: this.showCreateNewPopup.bind(this)
    };

    static defaultProps = {
        guestEmail: ''
    };

    openForm() {
        this.setState({ formContent: true });
    }

    showCreateNewPopup() {
        const { showPopup } = this.props;

        this.openForm();
        showPopup({
            action: ADD_ADDRESS,
            title: __('Add new address'),
            address: {}
        });
    }

    validateAddress(address) {
        const {
            country_id,
            region_id,
            region,
            city,
            telephone = '',
            street,
            phonecode = ''
        } = address;
        const { validateAddress } = this.props;

        return validateAddress({
            area: region ?? region_id,
            city,
            country_code: country_id,
            phone: phonecode + telephone,
            postcode: region ?? region_id,
            region: region ?? region_id,
            street: Array.isArray(street) ? street[0] : street
        });
    }

    estimateShipping(address, isValidted) {
        const { estimateShipping, setLoading } = this.props;
        const {
            country_id,
            region_id,
            city,
            telephone = '',
            street,
            phonecode = ''
        } = address;

        setLoading();

        const canEstimate = !Object.values(address).some((item) => item === undefined);

        if (!canEstimate) {
            return;
        }

        /* eslint-disable */
        delete address.region_id;

        return estimateShipping({
            country_code: country_id,
            street,
            region: region_id,
            area: region_id,
            city,
            postcode: region_id,
            phone: phonecode + telephone,
            telephone
        }, isValidted);
    }

    onShippingSuccess(fields) {
        const {
            selectedCustomerAddressId,
            selectedShippingMethod
        } = this.state;
        const { setLoading, showNotification } = this.props;
        const shippingAddress = selectedCustomerAddressId
            ? this._getAddressById(selectedCustomerAddressId)
            : trimAddressFields(fields);
        const addressForValidation = isSignedIn() ? shippingAddress : fields;
        const validationResult = this.validateAddress(addressForValidation);

        if (!validationResult) {
            showNotification('error', __('Something went wrong.'))
        }

        validationResult.then((response) => {
            const { success } = response;

            if (success && !selectedShippingMethod) {
                const estimationResult = this.estimateShipping(addressForValidation, true);
                
                if (!estimationResult) {
                    showNotification('error', __('Something went wrong.'))
                }
                
                estimationResult.then((response) => {
                    if (typeof response !== 'undefined') {
                        const { data = [] } = response;

                        if (data.length !== 0) {
                            const { available } = data ? data[0] : { available: false };

                            if (available) {
                                this.setState({
                                    selectedShippingMethod: response.data[0]
                                }, () => this.processDelivery(fields));
                            } else {
                                const { error } = response;
                                this.handleError(error);
                            }
                        } else {
                            setLoading(false);
                            showNotification('error', __('We can\'t ship products to selected address'))
                        }
                        
                    } else {
                        setLoading(false);
                    }
                });
            } else if (success) {
                this.processDelivery(fields);
            } else {
                this.handleError(response);
            }
        });
    }

    handleError(response) {
        const { showNotification, setLoading } = this.props;

        const { parameters, message = '' } = response;
        const formattedParams = parameters ? capitalize(parameters[0]) : 'Address';

        showNotification('error', `${ formattedParams } ${ __('is not valid') }. ${ message }`);
        setLoading(false);
    }

    processDelivery(fields) {
        const { saveAddressInformation, customer: { email } } = this.props;
        const { guest_email: guestEmail } = fields;

        const {
            selectedCustomerAddressId,
            selectedShippingMethod
        } = this.state;

        if (!selectedShippingMethod) {
            return;
        }

        const shippingAddress = selectedCustomerAddressId
            ? this._getAddressById(selectedCustomerAddressId)
            : trimAddressFields(fields);

        const {
            region_id,
            region,
            street,
            country_id,
            telephone,
            postcode
        } = shippingAddress;

        const shippingAddressMapped = {
            ...shippingAddress,
            street: Array.isArray(street) ? street[0] : street,
            area: region ?? region_id ?? postcode,
            country_code: country_id,
            phone: telephone,
            email: isSignedIn() ? email : guestEmail,
            region: region ?? region_id ?? postcode,
            region_id: 0
        };

        const {
            carrier_code: shipping_carrier_code,
            method_code: shipping_method_code
        } = selectedShippingMethod;

        const data = {
            billing_address: shippingAddressMapped,
            shipping_address: shippingAddressMapped,
            shipping_carrier_code,
            shipping_method_code
        };

        saveAddressInformation(data);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutShippingContainer);
