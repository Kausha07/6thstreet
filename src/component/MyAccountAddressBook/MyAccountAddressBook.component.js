/* eslint-disable react/no-unused-prop-types */
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

import MyAccountAddressForm from 'Component/MyAccountAddressForm';
import MyAccountAddressPopup from 'Component/MyAccountAddressPopup';
import MyAccountAddressTable from 'Component/MyAccountAddressTable';
import { addressType, customerType } from 'Type/Account';

import './MyAccountAddressBook.style';

export class MyAccountAddressBook extends PureComponent {
    static propTypes = {
        customer: customerType.isRequired,
        formContent: PropTypes.bool.isRequired,
        getDefaultPostfix: PropTypes.func.isRequired,
        closeForm: PropTypes.func.isRequired,
        openForm: PropTypes.func.isRequired,
        handleAddress: PropTypes.func.isRequired,
        showCreateNewPopup: PropTypes.func.isRequired,
        payload: PropTypes.shape({
            address: addressType
        }).isRequired
    };

    renderPopup() {
        const { formContent, closeForm, openForm } = this.props;

        return <MyAccountAddressPopup formContent={ formContent } closeForm={ closeForm } openForm={ openForm } />;
    }

    renderAddress = (address, index) => {
        const { getDefaultPostfix, closeForm, openForm } = this.props;
        const addressNumber = index + 1;
        const postfix = getDefaultPostfix(address);
        // console.log(address);

        return (
            <MyAccountAddressTable
              title={ __('Address #%s%s', addressNumber, postfix) }
              showActions
              address={ address }
              key={ addressNumber }
              closeForm={ closeForm }
              openForm={ openForm }
            />
        );
    };

    renderNoAddresses() {
        return (
            <div>
                <p>{ __('You have no configured addresses.') }</p>
            </div>
        );
    }

    renderActions() {
        const { showCreateNewPopup } = this.props;

        return (
            <button
              block="MyAccountAddressBook"
              elem="NewAddress"
              onClick={ showCreateNewPopup }
            >
                { __('new address') }
            </button>
        );
    }

    renderAddressList() {
        const { customer: { addresses = [] } } = this.props;
        if (!addresses.length) {
            return this.renderNoAddresses();
        }

        return addresses.map(this.renderAddress);
    }

    renderAddresForm() {
        const { payload: { address }, handleAddress } = this.props;

        return (
            <MyAccountAddressForm
              address={ address }
              onSave={ handleAddress }
            />
        );
    }

    render() {
        return (
            <div block="MyAccountAddressBook">
                { this.renderAddressList() }
                { this.renderActions() }
                { this.renderPopup() }
            </div>
        );
    }
}

export default MyAccountAddressBook;
