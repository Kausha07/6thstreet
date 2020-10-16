import { connect } from 'react-redux';

import {
    CheckoutAddressBookContainer as SourceCheckoutAddressBookContainer,
    mapDispatchToProps,
    mapStateToProps
} from 'SourceComponent/CheckoutAddressBook/CheckoutAddressBook.container';

export const MyAccountDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/MyAccount/MyAccount.dispatcher'
);

export class CheckoutAddressBookContainer extends SourceCheckoutAddressBookContainer {
    estimateShipping(addressId) {
        const {
            onShippingEstimationFieldsChange,
            customer: { addresses = [] }
        } = this.props;

        const address = addresses.find(({ id }) => id === addressId);

        if (!address) {
            return;
        }

        const {
            city,
            country_id,
            postcode,
            telephone,
            street: streetObj,
            region: {
                region_id,
                region
            } = {}
        } = address;

        if (!country_id) {
            return;
        }

        const street = streetObj[0];

        onShippingEstimationFieldsChange({
            city,
            country_code: country_id,
            region_id,
            area: region,
            postcode,
            phone: telephone,
            street,
            telephone: telephone.substring('4')
        });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutAddressBookContainer);
