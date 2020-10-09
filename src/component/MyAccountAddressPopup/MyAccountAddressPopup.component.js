/* eslint-disable react/prop-types */
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

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Loader from 'Component/Loader';
import MyAccountAddressTable from 'Component/MyAccountAddressTable';
import MyAccountDeliveryAddressForm from 'Component/MyAccountDeliveryAddressForm';
// import Popup from 'Component/Popup';
import { addressType } from 'Type/Account';

import {
    ADD_ADDRESS, ADDRESS_POPUP_ID, DELETE_ADDRESS, EDIT_ADDRESS
} from './MyAccountAddressPopup.config';

import './MyAccountAddressPopup.style';

export class MyAccountAddressPopup extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        handleAddress: PropTypes.func.isRequired,
        handleDeleteAddress: PropTypes.func.isRequired,
        payload: PropTypes.shape({
            action: PropTypes.oneOf([
                EDIT_ADDRESS,
                DELETE_ADDRESS,
                ADD_ADDRESS
            ]),
            address: addressType
        }).isRequired
    };

    state = {
        defaultChecked: false
    };

    componentDidUpdate(prevProps, _) {
        const { payload } = this.props;
        const { payload: prevPayload } = prevProps;

        if (Object.keys(payload).length > 0 && Object.keys(prevPayload).length > 0) {
            const { address: { id } } = payload;
            const { address: { id: prevId } } = prevPayload;

            if (id !== prevId) {
                this.checkAddressChange();
            }
        }
    }

    isDefaultShipping() {
        const { payload: { address } } = this.props;
        const defaultAddressId = JSON.parse(localStorage.getItem('customer')).data.default_shipping;
        return Number(address.id) === Number(defaultAddressId);
    }

    changeDefaultShipping = () => {
        const { defaultChecked } = this.state;

        this.setState({ defaultChecked: !defaultChecked });
    };

    checkAddressChange() {
        this.setState({ defaultChecked: this.isDefaultShipping() });
    }

    renderNewAddressForm() {
        const { payload: { address }, handleAddress, customer } = this.props;
        const { defaultChecked } = this.state;

        return (
            <MyAccountDeliveryAddressForm
              newForm
              address={ address }
              onSave={ handleAddress }
              customer={ customer }
              defaultChecked={ defaultChecked }
              changeDefaultShipping={ this.changeDefaultShipping }
            />
        );
    }

    renderAddressForm() {
        const { payload: { address }, handleAddress, customer } = this.props;
        const { defaultChecked } = this.state;

        return (
            <MyAccountDeliveryAddressForm
              address={ address }
              onSave={ handleAddress }
              customer={ customer }
              defaultChecked={ defaultChecked }
              changeDefaultShipping={ this.changeDefaultShipping }
            />
        );
    }

    renderDeleteNotice() {
        const { payload: { address }, handleDeleteAddress } = this.props;

        return (
            <>
                <p>{ __('Are you sure you want to delete this address?') }</p>
                <div block="MyAccountAddressPopup" elem="Address">
                    <MyAccountAddressTable address={ address } title={ __('Address details') } />
                </div>
                <button block="button primary" onClick={ handleDeleteAddress }>
                    { __('Yes, delete address') }
                </button>
            </>
        );
    }

    renderContent() {
        const { payload: { action } } = this.props;

        switch (action) {
        case EDIT_ADDRESS:
            return this.renderAddressForm();
        case ADD_ADDRESS:
            return this.renderNewAddressForm();
        case DELETE_ADDRESS:
            return this.renderDeleteNotice();
        default:
            return null;
        }
    }

    render() {
        const { isLoading, formContent } = this.props;

        return (
            <div
              id={ ADDRESS_POPUP_ID }
              clickOutside={ false }
              mix={ { block: 'MyAccountAddressPopup' } }
            >
                <Loader isLoading={ isLoading } />
                { formContent ? this.renderContent() : null }
            </div>
        );
    }
}

export default MyAccountAddressPopup;
