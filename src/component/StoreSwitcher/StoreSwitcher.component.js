import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import { SelectOptions } from 'Type/Field';

import './StoreSwitcher.style';

class StoreSwitcher extends PureComponent {
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
              id="locale-wizard-country"
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
            <div block="StoreSwitcher">
                { __('Country') }
                { this.renderCountrySelect() }
            </div>
        );
    }
}

export default StoreSwitcher;
