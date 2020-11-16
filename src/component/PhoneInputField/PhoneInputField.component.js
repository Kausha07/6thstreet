import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import CountryMiniFlag from 'Component/CountryMiniFlag';
import Field from 'Component/Field';
import {
    COUNTRY_CODES_FOR_PHONE_VALIDATION,
    PHONE_CODES
} from 'Component/MyAccountAddressForm/MyAccountAddressForm.config';
import { isArabic } from 'Util/App';

import './PhoneInputField.style';

class PhoneInputField extends PureComponent {
    static propTypes = {
        country: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        const { country } = props;

        this.state = {
            isArabic: isArabic(),
            phoneValue: [],
            selectedCountry: country
        };
    }

    renderCurrentPhoneCode(country_id) {
        return PHONE_CODES[country_id];
    }

    handleSelectChange = (e) => {
        const countries = Object.keys(PHONE_CODES);

        const countiresMapped = countries.reduce((acc, country) => {
            if (e === this.renderCurrentPhoneCode(country)) {
                acc.push(country);
            }

            return acc;
        }, []);

        this.setState({ selectedCountry: countiresMapped[0], phoneValue: [] });
    };

    renderOption = (country) => ({
        id: country,
        label: this.renderCurrentPhoneCode(country),
        value: this.renderCurrentPhoneCode(country)
    });

    renderPhone() {
        const { selectedCountry, isArabic, phoneValue } = this.state;
        const countries = Object.keys(PHONE_CODES);
        const maxlength = COUNTRY_CODES_FOR_PHONE_VALIDATION[selectedCountry]
            ? '9' : '8';

        return (
            <div
              block="PhoneInputField"
              elem="Phone"
              mods={ { isArabic } }
            >
                <Field
                  type="select"
                  id="countryPhoneCode"
                  name="countryPhoneCode"
                  onChange={ this.handleSelectChange }
                  selectOptions={ countries.map(this.renderOption) }
                  value={ PHONE_CODES[selectedCountry] }
                />
                <Field
                  mix={ {
                      block: 'PhoneInputField',
                      elem: 'PhoneField'
                  } }
                  validation={ ['notEmpty'] }
                  placeholder="Phone Number"
                  maxlength={ maxlength }
                  pattern="[0-9]*"
                  value={ phoneValue }
                  id="phone"
                  name="phone"
                />
                <CountryMiniFlag mods={ { isArabic } } label={ selectedCountry } />
            </div>
        );
    }

    render() {
        return this.renderPhone();
    }
}

export default PhoneInputField;
