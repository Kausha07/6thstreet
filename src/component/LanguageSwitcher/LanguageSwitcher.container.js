import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { getCountryLocaleForSelect } from 'Util/API/endpoint/Config/Config.format';
import { Config } from 'Util/API/endpoint/Config/Config.type';

import LanguageSwitcher from './LanguageSwitcher.component';

export const mapStateToProps = (state) => ({
    config: state.AppConfig.config,
    language: state.AppState.language,
    country: state.AppState.country
});

export class LanguageSwitcherContainer extends PureComponent {
    static propTypes = {
        config: Config.isRequired,
        language: PropTypes.string.isRequired,
        country: PropTypes.string.isRequired
    };

    containerFunctions = {
        onLanguageSelect: this.onLanguageSelect.bind(this)
    };

    onLanguageSelect(value) {
        const { language } = this.props;

        window.location.href = location.href.replace(
            language.toLowerCase(),
            value,
            location.href
        );
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

export default connect(mapStateToProps, null)(LanguageSwitcherContainer);
