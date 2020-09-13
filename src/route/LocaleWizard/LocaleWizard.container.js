import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { setCountry, setLanguage } from 'Store/AppState/AppState.action';
import {
    getCountriesForSelect,
    getCountryLocaleForSelect
} from 'Util/API/endpoint/Config/Config.format';
import { Config } from 'Util/API/endpoint/Config/Config.type';

import LocaleWizard from './LocaleWizard.component';

export const mapStateToProps = (state) => ({
    config: state.AppConfig.config,
    country: state.AppState.country,
    language: state.AppState.language
});

export const mapDispatchToProps = (dispatch) => ({
    setCountry: (value) => dispatch(setCountry(value)),
    setLanguage: (value) => dispatch(setLanguage(value))
});

// TODO: rework, using StoreSwitcher and LanguageSwitcher
export class LocaleWizardContainer extends PureComponent {
    static propTypes = {
        setLanguage: PropTypes.func.isRequired,
        setCountry: PropTypes.func.isRequired,
        config: Config.isRequired,
        country: PropTypes.string,
        language: PropTypes.string
    };

    static defaultProps = {
        country: '',
        language: ''
    };

    containerFunctions = {
        onLanguageSelect: this.onLanguageSelect.bind(this),
        onCountrySelect: this.onCountrySelect.bind(this)
    };

    onLanguageSelect(value) {
        const { setLanguage } = this.props;
        setLanguage(value);
    }

    onCountrySelect(value) {
        const { setCountry } = this.props;
        setCountry(value);
    }

    containerProps = () => {
        const {
            country,
            language,
            config
        } = this.props;

        return {
            countrySelectOptions: getCountriesForSelect(config),
            languageSelectOptions: getCountryLocaleForSelect(config, country),
            country,
            language
        };
    };

    getIsReady() {
        const { country, language } = this.props;

        // Country and language have to be selected
        if (!country || !language) {
            return false;
        }

        return true;
    }

    render() {
        return (
            <LocaleWizard
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LocaleWizardContainer);
