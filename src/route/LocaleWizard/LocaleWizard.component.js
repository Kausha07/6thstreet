import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import { SelectOptions } from 'Type/Field';

import './LocaleWizard.style';

class LocaleWizard extends PureComponent {
    static propTypes = {
        onLanguageSelect: PropTypes.func.isRequired,
        onCountrySelect: PropTypes.func.isRequired,
        languageSelectOptions: SelectOptions.isRequired,
        countrySelectOptions: SelectOptions.isRequired,
        country: PropTypes.string,
        language: PropTypes.string
    };

    static defaultProps = {
        country: '',
        language: ''
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

    renderLanguageSelect() {
        const {
            languageSelectOptions,
            onLanguageSelect,
            language
        } = this.props;

        return (
            <Field
              id="language-wizard-country"
              name="language"
              type="select"
              placeholder={ __('Choose language') }
              selectOptions={ languageSelectOptions }
              value={ language }
              onChange={ onLanguageSelect }
            />
        );
    }

    render() {
        return (
            <>
                { this.renderCountrySelect() }
                { this.renderLanguageSelect() }
            </>
        );
    }
}

export default LocaleWizard;
