/* eslint-disable @scandipwa/scandipwa-guidelines/create-config-files */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
// import MyAccountOverlay from 'Component/MyAccountOverlay';
// import Popup from 'Component/Popup';
import StoreSwitcherPopup from 'Component/StoreSwitcherPopup';
import { SelectOptions } from 'Type/Field';

import './CountrySwitcher.style';

export const STORE_POPUP_ID = 'storePopupId';

class CountrySwitcher extends PureComponent {
    static propTypes = {
        countrySelectOptions: SelectOptions.isRequired,
        payload: PropTypes.shape({
            text: PropTypes.string
        }).isRequired,
        // onCountrySelect: PropTypes.func.isRequired,
        // onClickSwitcher: PropTypes.func.isRequired,
        country: PropTypes.string.isRequired
    };

    // renderContent() {
    //     const { payload: { text = 'No text was passed' } } = this.props;
    //     return (
    //         <Popup>
    //             <Html content={ text } />
    //             <div>Helloo</div>
    //         </Popup>
    //     );
    // }

    onClickSwitcher() {
        console.log('click');
        return <StoreSwitcherPopup />;
    }

    renderCountrySelect() {
        const {
            countrySelectOptions,
            country
        } = this.props;

        console.log(this.props);
        return (
            <Field
              id="language-switcher-country"
              name="country"
              type="select"
              placeholder={ __('Choose country') }
              selectOptions={ countrySelectOptions }
              value={ country }
            //   onChange={ onCountrySelect }
              onClick={ this.onClickSwitcher }
            />
        );
    }

    getCurrentCountry() {
        const {
            country,
            countrySelectOptions
        } = this.props;

        const countryName = countrySelectOptions.filter((obj) => obj.id === country);
        return countryName[0].label;
    }

    renderStoreButton() {
        const country = this.getCurrentCountry();

        return (
            <button
                /* eslint-disable-next-line */
              onClick={ this.onClickSwitcher }
            >
                <span>
                    { country }
                </span>
            </button>
        );
    }

    render() {
        return (
            <div block="CountrySwitcher">
                { this.renderCountrySelect() }
                { this.renderStoreButton() }
            </div>
        );
    }
}

export default CountrySwitcher;
