import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import { SelectOptions } from 'Type/Field';

import './CountrySwitcher.style';

class CountrySwitcher extends PureComponent {
    static propTypes = {
        countrySelectOptions: SelectOptions.isRequired,
        onCountrySelect: PropTypes.func.isRequired,
        country: PropTypes.string.isRequired
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

    render() {
        return (
            <div block="CountrySwitcher">
                { this.renderCountrySelect() }
            </div>
        );
    }
}

export default CountrySwitcher;
