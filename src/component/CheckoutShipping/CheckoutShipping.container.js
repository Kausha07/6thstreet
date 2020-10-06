import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    CheckoutShippingContainer as SourceCheckoutShippingContainer
} from 'SourceComponent/CheckoutShipping/CheckoutShipping.container';
import { trimAddressFields } from 'Util/Address';
import { isSignedIn } from 'Util/Auth';

export const mapStateToProps = (state) => ({
    customer: state.MyAccountReducer.customer
});

export class CheckoutShippingContainer extends SourceCheckoutShippingContainer {
    static propTypes = {
        ...SourceCheckoutShippingContainer.propTypes,
        guestEmail: PropTypes.string
    };

    static defaultProps = {
        guestEmail: ''
    }

    onShippingSuccess(fields) {
        const { saveAddressInformation, customer: { email }, guestEmail } = this.props;

        const {
            selectedCustomerAddressId,
            selectedShippingMethod
        } = this.state;

        const shippingAddress = selectedCustomerAddressId
            ? this._getAddressById(selectedCustomerAddressId)
            : trimAddressFields(fields);

        const shippingAddressMapped = {
            ...shippingAddress,
            street: shippingAddress.street[0],
            area: shippingAddress.region,
            country_code: shippingAddress.country_id,
            phone: shippingAddress.telephone,
            email: isSignedIn() ? email : guestEmail
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

export default connect(mapStateToProps)(CheckoutShippingContainer);
