import { connect } from 'react-redux';

import { ADD_ADDRESS, ADDRESS_POPUP_ID } from 'Component/MyAccountAddressPopup/MyAccountAddressPopup.config';
import {
    CheckoutAddressBookContainer as SourceCheckoutAddressBookContainer,
    mapStateToProps
} from 'SourceComponent/CheckoutAddressBook/CheckoutAddressBook.container';
import { showPopup } from 'Store/Popup/Popup.action';

export const MyAccountDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/MyAccount/MyAccount.dispatcher'
);

export const mapDispatchToProps = (dispatch) => ({
    showPopup: (payload) => dispatch(showPopup(ADDRESS_POPUP_ID, payload)),
    requestCustomerData: () => MyAccountDispatcher.then(
        ({ default: dispatcher }) => dispatcher.requestCustomerData(dispatch)
    )
});

export class CheckoutAddressBookContainer extends SourceCheckoutAddressBookContainer {
    showCreateNewPopup() {
        const { showPopup } = this.props;

        this.openForm();
        showPopup({
            action: ADD_ADDRESS,
            title: __('Add new address'),
            address: {}
        });
    }

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
                region_code
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
            area: region_code,
            postcode,
            phone: telephone,
            street,
            telephone: telephone.substring('4')
        });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutAddressBookContainer);
