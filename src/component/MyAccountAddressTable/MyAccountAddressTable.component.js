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

import KeyValueTable from 'Component/KeyValueTable';
import Loader from 'Component/Loader';
import { addressType } from 'Type/Account';
import { MixType } from 'Type/Common';

import pencil from './icons/pencil.svg';
import trash from './icons/trash.svg';

import './MyAccountAddressTable.style';

export class MyAccountAddressTable extends KeyValueTable {
    static propTypes = {
        mix: MixType,
        getFormatedRegion: PropTypes.func.isRequired,
        address: addressType.isRequired,
        showActions: PropTypes.bool,
        showAdditionalFields: PropTypes.bool,
        onEditClick: PropTypes.func.isRequired,
        onDeleteClick: PropTypes.func.isRequired,
        countries: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string,
                id: PropTypes.string,
                available_regions: PropTypes.arrayOf(
                    PropTypes.shape({
                        code: PropTypes.string,
                        name: PropTypes.string,
                        id: PropTypes.number
                    })
                )
            })
        ).isRequired
    };

    static defaultProps = {
        showAdditionalFields: false,
        showActions: false,
        mix: {}
    };

    renderActions() {
        const {
            onEditClick,
            onDeleteClick,
            showActions,
            address: { default_billing, default_shipping }
        } = this.props;

        const isDeleteAllowed = default_shipping || default_billing;

        if (!showActions) {
            return null;
        }

        return (
            <>
                <button
                  onClick={ onEditClick }
                >
                    <img
                      block="MyAccountAddressTable"
                      elem="Icon"
                      mods={ { pencil: true } }
                      alt="pencil"
                      src={ pencil }
                    />
                </button>
                <button
                  mods={ { isHollow: true } }
                  onClick={ onDeleteClick }
                  disabled={ isDeleteAllowed }
                  title={ isDeleteAllowed ? __('Can not delete - address is set as default.') : 'Delete this address' }
                >
                    <img
                      block="MyAccountAddressTable"
                      elem="Icon"
                      mods={ { trash: true } }
                      alt="trash"
                      src={ trash }
                    />
                </button>
            </>
        );
    }

    renderCard() {
        const {
            address: {
                default_billing,
                firstname,
                lastname,
                street,
                city,
                country_id,
                telephone
            }
        } = this.props;

        const def = default_billing === true ? 'default' : 'not';
        const countryId = `(${country_id})`;

        return (
            <div block="MyAccountAddressCard">
                <div block="MyAccountAddressCard" elem="Default">{ def }</div>
                <div block="MyAccountAddressCard" elem="Name">
                    { firstname }
                    { ' ' }
                    { lastname }
                </div>
                <div block="MyAccountAddressCard" elem="Street">{ street }</div>
                <div block="MyAccountAddressCard" elem="City">
                    { city }
                    -
                    { countryId }
                </div>
                <div block="MyAccountAddressCard" elem="Phone">{ telephone }</div>
            </div>
        );
    }

    render() {
        const { countries, mix } = this.props;

        return (
            <div block="MyAccountAddressTable" mix={ mix }>
                <Loader isLoading={ !countries.length } />
                { this.renderCard() }
                { this.renderActions() }
            </div>
        );
    }
}

export default MyAccountAddressTable;
