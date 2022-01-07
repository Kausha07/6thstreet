import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { getCountryLocaleForSelect } from 'Util/API/endpoint/Config/Config.format';
import { Config } from 'Util/API/endpoint/Config/Config.type';
import { setCountry, setLanguageForWelcome} from 'Store/AppState/AppState.action'
import LanguageSwitcher from './LanguageSwitcher.component';

export const mapStateToProps = (state) => ({
    config: state.AppConfig.config,
    language: state.AppState.language,
    country: state.AppState.country
});

export const mapDispatchToProps = (dispatch) => ({
    setCountry: (value) => dispatch(setCountry(value)),
    setLanguageForWelcome: (value) => dispatch(setLanguageForWelcome(value)),});

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
        const { language = '' } = this.props;


        if(window.location.href.includes('en-') || window.location.href.includes('ar-')){
            window.location.href = location.href.replace(
                language.toLowerCase(),
                value,
                location.href
            );
        }
        else{
            this.props.setLanguageForWelcome(value)
        }
    }

    containerProps = () => {
        const {
            language,
            config,
            country,
            welcomePagePopup
        } = this.props;

        return {
            languageSelectOptions: getCountryLocaleForSelect(config, country),
            language,
            welcomePagePopup
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
