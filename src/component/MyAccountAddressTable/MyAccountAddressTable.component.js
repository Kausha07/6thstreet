/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
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

import pencil from './icons/edit_btn.png';
import trash from './icons/trash.png';

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

    state = {
        expand: false
    };

    renderActions() {
        const {
            onEditClick,
            onDeleteClick,
            showActions,
            address: { default_billing, default_shipping }
        } = this.props;
        const { expand } = this.state;

        const isDeleteAllowed = default_shipping || default_billing;

        if (!showActions) {
            return null;
        }

        return (
            <>
                <button
                  block="MyAccountAddressTable"
                  elem="ActionBtn"
                  mods={ { isOpen: expand } }
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
                  block="MyAccountAddressTable"
                  elem="ActionBtn"
                  mods={ { isHollow: true, isOpen: expand } }
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

    toggleCard = () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
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
            <div block="MyAccountAddressCard" onClick={ this.toggleCard }>
                <div block="MyAccountAddressCard" elem="Default">{ def }</div>
                <div block="MyAccountAddressCard" elem="Name">
                    { firstname }
                    { ' ' }
                    { lastname }
                </div>
                <div block="MyAccountAddressCard" elem="Street">{ street }</div>
                <div block="MyAccountAddressCard" elem="City">
                    { city }
                    { ' - ' }
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
