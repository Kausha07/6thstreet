import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { setLanguage } from 'Store/AppState/AppState.action';
import { getCountryLocaleForSelect } from 'Util/API/endpoint/Config/Config.format';
import { Config } from 'Util/API/endpoint/Config/Config.type';

import LanguageSwitcher from './LanguageSwitcher.component';

export const mapStateToProps = (state) => ({
    config: state.AppConfig.config,
    language: state.AppState.language,
    country: state.AppState.country
});

export const mapDispatchToProps = (dispatch) => ({
    setLanguage: (value) => dispatch(setLanguage(value))
});

export class LanguageSwitcherContainer extends PureComponent {
    static propTypes = {
        setLanguage: PropTypes.func.isRequired,
        config: Config.isRequired,
        language: PropTypes.string.isRequired,
        country: PropTypes.string.isRequired
    };

    containerFunctions = {
        onLanguageSelect: this.onLanguageSelect.bind(this)
    };

    onLanguageSelect(value) {
        const { setLanguage } = this.props;
        setLanguage(value);
        window.location.reload();
    }

    containerProps = () => {
        const {
            language,
            config,
            country
        } = this.props;

        return {
            languageSelectOptions: getCountryLocaleForSelect(config, country),
            language
        };
    };

    render() {
        return (
            <LanguageSwitcher
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSwitcherContainer);
