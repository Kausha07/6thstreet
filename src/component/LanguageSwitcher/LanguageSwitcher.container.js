import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getCountryLocaleForSelect } from 'Util/API/endpoint/Config/Config.format';
import { Config } from 'Util/API/endpoint/Config/Config.type';
import { setCountry, setLanguageForWelcome} from 'Store/AppState/AppState.action'
import LanguageSwitcher from './LanguageSwitcher.component';
import { EVENT_MOE_SET_LANGUAGE } from "Util/Event";
import { getCountryFromUrl } from "Util/Url/Url";

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
        const { language = '',history } = this.props;
        Moengage.track_event(EVENT_MOE_SET_LANGUAGE, {
            country: getCountryFromUrl().toUpperCase(),
            language: value.toUpperCase() || "",
            app6thstreet_platform: "Web",
          });

        if(window.location.href.includes('en-') || window.location.href.includes('ar-')){
            if(location.pathname.match(/my-account/)) {
                setTimeout(() => { // Delay is for Moengage call to complete
                    window.location.href = location.href.replace(
                        language.toLowerCase(),
                        value,
                        location.href).split("/my-account")[0];
                }, 1000);
                
            }else if(location.pathname.match(/viewall/)){
                setTimeout(() => { // Delay is for Moengage call to complete
                    window.location.href = location.href.replace(
                        language.toLowerCase(),
                        value,
                        location.href).split("/viewall")[0];
                }, 1000);
            } else {                
                setTimeout(() => { // Delay is for Moengage call to complete
                    window.location.href = location.href.replace(
                        language.toLowerCase(),
                        value,
                        location.href
                    );
                }, 1000);
            }
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
            welcomePagePopup,
            isWelcomeMobileView
        } = this.props;

        return {
            languageSelectOptions: getCountryLocaleForSelect(config, country),
            language,
            welcomePagePopup,
            isWelcomeMobileView
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LanguageSwitcherContainer));
