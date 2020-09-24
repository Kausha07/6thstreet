/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import CountryMiniFlag from 'Component/CountryMiniFlag';
import { SelectOptions } from 'Type/Field';

import './WelcomeScreen.style';

class WelcomeScreen extends PureComponent {
    static propTypes = {
        onCountrySelect: PropTypes.func.isRequired,
        countrySelectOptions: SelectOptions.isRequired,
        languageSelectOptions: SelectOptions.isRequired,
        onLanguageSelect: PropTypes.func.isRequired,
        closePopup: PropTypes.func.isRequired,
        country: PropTypes.string.isRequired,
        language: PropTypes.string.isRequired
    };

    isArabic() {
        return {
            isArabic: JSON.parse(localStorage.getItem('APP_STATE_CACHE_KEY')).data.language === 'ar'
        };
    }

    renderCloseBtn() {
        const {
            closePopup
        } = this.props;

        const svg = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z" /></svg>;
        return (
            <button
              block="WelcomeScreen"
              elem="Close"
              onClick={ closePopup }
            >
                { svg }
            </button>
        );
    }

    renderCountryList() {
        const {
            countrySelectOptions,
            country
        } = this.props;

        const list = countrySelectOptions.map((element) => this.renderListItem(element, country));

        return <ul block="WelcomeScreen" elem="List">{ list }</ul>;
    }

    renderLangBtn(lang) {
        const {
            onLanguageSelect,
            language
        } = this.props;

        const { id, label } = lang;

        const btnType = id === language ? 'primary' : 'secondary';
        const btnBlock = `button ${ btnType}`;

        return (
            <button
              key={ id }
              block="WelcomeScreen"
              elem="LanguageBtn"
              mix={ { block: btnBlock } }
              onClick={ () => onLanguageSelect(id) }
            >
                { label === 'Arabic' ? 'العربية' : label }
            </button>
        );
    }

    renderLanguageButtons() {
        const {
            languageSelectOptions
        } = this.props;

        const buttons = languageSelectOptions.map((lang) => this.renderLangBtn(lang));

        return (
            <div block="WelcomeScreen" elem="ButtonsContainer">
                { buttons }
            </div>
        );
    }

    renderListItem(item, country) {
        const {
            onCountrySelect,
            language
        } = this.props;

        const { id, value } = item;

        const svg = <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path d="M9 22l-10-10.598 2.798-2.859 7.149 7.473 13.144-14.016 2.909 2.806z" /></svg>;
        const check = item.value === country ? <span block="WelcomeScreen" elem="Check">{ svg }</span> : '';

        const currentLangBool = value === country && true;
        const currentLang = language === 'en' ? 'en' : 'ar';

        if (currentLang === 'ar') {
            return (
                <li key={ id }>
                    <button
                      onClick={ () => onCountrySelect(value) }
                      block="WelcomeScreen"
                      elem="CountryBtn"
                      mods={ {
                          isCurrent: currentLangBool,
                          lang: currentLang
                      } }
                    >
                        <CountryMiniFlag label={ id } />
                        { check }
                        { item.label }
                    </button>
                </li>
            );
        }

        return (
            <li key={ id }>
                <button
                  onClick={ () => onCountrySelect(value) }
                  block="WelcomeScreen"
                  elem="CountryBtn"
                  mods={ {
                      isCurrent: currentLangBool,
                      lang: currentLang
                  } }
                >
                    <CountryMiniFlag label={ id } />
                    { item.label }
                    { check }
                </button>
            </li>
        );
    }

    render() {
        return (
            <div block="WelcomeScreen" elem="Content" mods={ { isArabic: this.isArabic() } }>
                { this.renderCloseBtn() }
                <div block="WelcomeScreen" elem="Options">
                    <h1>Welcome</h1>
                    <p>you are shopping in</p>
                    { this.renderLanguageButtons() }
                    { this.renderCountryList() }
                </div>
            </div>
        );
    }
}

export default WelcomeScreen;
