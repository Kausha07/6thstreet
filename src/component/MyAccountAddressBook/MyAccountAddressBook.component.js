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
        const {
            formContent,
            closeForm,
            openForm,
            customer
        } = this.props;

        return (
            <MyAccountAddressPopup
              formContent={ formContent }
              closeForm={ closeForm }
              openForm={ openForm }
              customer={ customer }
            />
        );
    }

    renderAddress = (address, index) => {
        const { getDefaultPostfix, closeForm, openForm } = this.props;
        const addressNumber = index + 1;
        const postfix = getDefaultPostfix(address);

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
