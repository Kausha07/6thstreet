/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import Loader from 'Component/Loader';
import { CheckoutAddressTable as SourceCheckoutAddressTable }
    from 'SourceComponent/CheckoutAddressTable/CheckoutAddressTable.component';
import { isArabic } from 'Util/App';

import './CheckoutAddressTable.style.scss';

export class CheckoutAddressTable extends SourceCheckoutAddressTable {
    state = {
        isArabic: isArabic()
    };

    renderCard() {
        const {
            address: {
                default_billing,
                firstname,
                lastname,
                street,
                city,
                country_id,
                region: {
                    region
                }
            },
            isSelected
        } = this.props;

        const def = default_billing === true ? 'default' : ' ';
        const countryId = `(${country_id})`;

        return (
            <div
              block="MyAccountAddressCard"
              mods={ { isSelected } }
              onClick={ this.onAddressClick }
            >
                <div block="MyAccountAddressCard" elem="Default">{ def }</div>
                <div block="MyAccountAddressCard" elem="Name">
                    { firstname }
                    { ' ' }
                    { lastname }
                </div>
                <div block="MyAccountAddressCard" elem="Street">{ street }</div>
                <div block="MyAccountAddressCard" elem="City">
                    { region }
                    { ' - ' }
                    { city }
                    { ' - ' }
                    { countryId }
                </div>
                <div block="MyAccountAddressCard" elem="Phone">{ this.getPhone() }</div>
            </div>
        );
    }

    render() {
        const { countries, mix } = this.props;
        const { isArabic } = this.state;

        return (
            <div block="MyAccountAddressTable" mods={ { isArabic } } mix={ mix }>
                <Loader isLoading={ !countries.length } />
                { this.renderCard() }
                { this.renderActions() }
            </div>
        );
    }
}

export default CheckoutAddressTable;
