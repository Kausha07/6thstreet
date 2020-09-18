/* eslint-disable @scandipwa/scandipwa-guidelines/create-config-files */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import StoreSwitcherPopup from 'Component/StoreSwitcherPopup';
import { SelectOptions } from 'Type/Field';

import './CountrySwitcher.style';

export const STORE_POPUP_ID = 'storePopupId';

class CountrySwitcher extends PureComponent {
    static propTypes = {
        countrySelectOptions: SelectOptions.isRequired,
        onCountrySelect: PropTypes.func.isRequired,
        payload: PropTypes.shape({
            text: PropTypes.string
        }).isRequired,
        country: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            content: ''
        };
    }

    openPopup = () => {
        const {
            countrySelectOptions,
            country
        } = this.props;

        this.setState({
            content: <StoreSwitcherPopup
              countrySelectOptions={ countrySelectOptions }
              country={ country }
              closePopup={ this.closePopup }
            />
        });
    };

    closePopup = () => {
        this.setState({
            content: ''
        });
    };

    renderCountrySelect() {
        const {
            countrySelectOptions,
            onCountrySelect,
            country
        } = this.props;

        return (
            <Field
              id="language-switcher-country"
              name="country"
              type="select"
              placeholder={ __('Choose country') }
              selectOptions={ countrySelectOptions }
              value={ country }
              onChange={ onCountrySelect }
            />
        );
    }

    getCurrentCountry() {
        const {
            country,
            countrySelectOptions
        } = this.props;

        const countryName = countrySelectOptions.filter((obj) => obj.id === country);
        if (countryName.length > 0) {
            return countryName[0].label;
        }

        return 'SELECT COUNTRY';
    }

    renderStoreButton() {
        const country = this.getCurrentCountry();

        return (
            <button
              block="CountrySwitcher"
              elem="CountryBtn"
                /* eslint-disable-next-line */
              onClick={ this.openPopup  }
            >
                <span>
                    { country }
                </span>
            </button>
        );
    }

    render() {
        const { content } = this.state;
        return (
            <div block="CountrySwitcher">
                { this.renderCountrySelect() }
                { this.renderStoreButton() }
                { content }
            </div>
        );
    }
}

export default CountrySwitcher;
