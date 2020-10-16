/* eslint-disable quote-props */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import CountryMiniFlag from 'Component/CountryMiniFlag';
import Field from 'Component/Field';
import { isArabic } from 'Util/App';

import './PhoneCountryCodeField.style';

class PhoneCountryCodeField extends PureComponent {
    static propTypes = {
        label: PropTypes.string.isRequired
    };

    state = {
        isArabic: isArabic()
    };

    renderCountryPhoneCodeField() {
        const {
            label
        } = this.props;

        const { isArabic } = this.state;

        const countryPhoneCodeValues = {
            'AE': '+971',
            'SA': '+966',
            'QA': '+974',
            'OM': '+968',
            'BH': '+973',
            'KW': '+965'
        };

        return (
            <div block="PhoneCountryCodeField" mods={ { isArabic } }>
                <CountryMiniFlag label={ label } />
                <Field
                  type="text"
                  id="phoneCountryCode"
                  isDisabled
                  placeholder={ countryPhoneCodeValues[label] }
                />
            </div>
        );
    }

    render() {
        return this.renderCountryPhoneCodeField();
    }
}

export default PhoneCountryCodeField;
