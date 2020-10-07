import Loader from 'Component/Loader';
import {
    MyAccountAddressTable as MyAccountAddressSourceTable
} from 'SourceComponent/MyAccountAddressTable/MyAccountAddressTable.component';

import pencil from './icons/pencil.svg';
import trash from './icons/trash.svg';

import './MyAccountAddressTable.extended.style';

class MyAccountAddressTable extends MyAccountAddressSourceTable {
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
