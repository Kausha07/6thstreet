import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import StoreCreditDispatcher from 'Store/StoreCredit/StoreCredit.dispatcher';
import { getCountriesForSelect, getCountryLocaleForSelect } from 'Util/API/endpoint/Config/Config.format';
import { Config } from 'Util/API/endpoint/Config/Config.type';

import WelcomeScreen from './WelcomeScreen.component';

export const mapStateToProps = (state) => ({
    config: state.AppConfig.config,
    language: state.AppState.language,
    country: state.AppState.country
});

export const mapDispatchToProps = (dispatch) => ({
    updateStoreCredits: () => StoreCreditDispatcher.getStoreCredit(dispatch)
});

class WelcomeScreenContainer extends PureComponent {
    static propTypes = {
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
        const { country } = this.props;

        window.location.href = location.href.replace(
            country.toLowerCase(),
            value,
            location.href
        );
    }

    onLanguageSelect(value) {
        const { language } = this.props;

        window.location.href = location.href.replace(
            language.toLowerCase(),
            value,
            location.href
        );
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
