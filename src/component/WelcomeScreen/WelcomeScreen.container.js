import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { setCountry, setLanguage } from 'Store/AppState/AppState.action';
import StoreCreditDispatcher from 'Store/StoreCredit/StoreCredit.dispatcher';
import { getCountriesForSelect, getCountryLocaleForSelect } from 'Util/API/endpoint/Config/Config.format';
import { Config } from 'Util/API/endpoint/Config/Config.type';
import { DEV_URLS, URLS } from 'Util/Url/Url.config';

import WelcomeScreen from './WelcomeScreen.component';

export const mapStateToProps = (state) => ({
    config: state.AppConfig.config,
    language: state.AppState.language,
    country: state.AppState.country
});

export const mapDispatchToProps = (dispatch) => ({
    setCountry: (value) => dispatch(setCountry(value)),
    setLanguage: (value) => dispatch(setLanguage(value)),
    updateStoreCredits: () => StoreCreditDispatcher.getStoreCredit(dispatch)
});

class WelcomeScreenContainer extends PureComponent {
    static propTypes = {
        setLanguage: PropTypes.func.isRequired,
        setCountry: PropTypes.func.isRequired,
        updateStoreCredits: PropTypes.func.isRequired,
        config: Config.isRequired,
        language: PropTypes.string.isRequired,
        country: PropTypes.string.isRequired
    };

    containerFunctions = {
        onCountrySelect: this.onCountrySelect.bind(this),
        onLanguageSelect: this.onLanguageSelect.bind(this)
    };

    onCountrySelect(value) {
        const { country, language } = this.props;

        if (country) {
            window.location.href = location.origin.replace(
                country.toLowerCase(),
                value,
                location.href
            );
        } else {
            const locale = `${language}-${value.toLowerCase()}`;

            // TODO: logic use hardcoded URLs. Switch URLS to PROD before GO LIVE
            if (location.href.match('dev')) {
                window.location.href = DEV_URLS[locale];
            } else {
                window.location.href = URLS[locale];
            }
        }
    }

    onLanguageSelect(value) {
        const { country, language, setLanguage } = this.props;

        if (language && country) {
            window.location.href = location.origin.replace(
                language.toLowerCase(),
                value,
                location.href
            );
        } else {
            setLanguage(value);
        }
    }

    containerProps = () => {
        const { country, config, language } = this.props;

        return {
            countrySelectOptions: getCountriesForSelect(config),
            languageSelectOptions: getCountryLocaleForSelect(config, country),
            country,
            language
        };
    };

    render() {
        return (
            <WelcomeScreen
              { ...this.containerFunctions }
              { ...this.containerProps() }
              { ...this.props }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreenContainer);
