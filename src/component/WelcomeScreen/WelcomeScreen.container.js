import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { setCountry, setLanguage } from 'Store/AppState/AppState.action';
import StoreCreditDispatcher from 'Store/StoreCredit/StoreCredit.dispatcher';
import { getCountriesForSelect, getCountryLocaleForSelect } from 'Util/API/endpoint/Config/Config.format';
import { Config } from 'Util/API/endpoint/Config/Config.type';
import { getAuthorizationToken, getMobileAuthorizationToken } from 'Util/Auth';
import { setCrossSubdomainCookie } from 'Util/Url/Url';
import { URLS } from 'Util/Url/Url.config';

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
        checkWizardLang: PropTypes.func,
        config: Config.isRequired,
        language: PropTypes.string.isRequired,
        country: PropTypes.string.isRequired
    };

    static defaultProps = {
        checkWizardLang: () => {}
    };

    containerFunctions = {
        onCountrySelect: this.onCountrySelect.bind(this),
        onLanguageSelect: this.onLanguageSelect.bind(this)
    };

    getCustomerData() {
        const mobileToken = getMobileAuthorizationToken();
        const authToken = getAuthorizationToken();

        if (mobileToken && authToken) {
            const params = `mobileToken=${mobileToken}&authToken=${authToken}`;

            return btoa(params);
        }

        return '';
    }

    onCountrySelect(value) {
        const { country, language } = this.props;

        console.log('***', this.getCustomerData());
        if (country) {
            setCrossSubdomainCookie('authData', this.getCustomerData(), '1');

            // window.location.href = location.origin.replace(
            //     country.toLowerCase(),
            //     value,
            //     location.href
            // );
        } else {
            const locale = `${language}-${value.toLowerCase()}`;

            window.location.href = URLS[locale];
        }
    }

    onLanguageSelect(value) {
        const {
            country,
            language,
            setLanguage,
            checkWizardLang
        } = this.props;

        if (language && country) {
            window.location.href = location.origin.replace(
                language.toLowerCase(),
                value,
                location.href
            );
        } else {
            setLanguage(value);
        }

        checkWizardLang();
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
