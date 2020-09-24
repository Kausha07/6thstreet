/* eslint-disable fp/no-let */
/* eslint-disable prefer-destructuring */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import { SelectOptions } from 'Type/Field';

import './LanguageSwitcher.style';

class LanguageSwitcher extends PureComponent {
    static propTypes = {
        languageSelectOptions: SelectOptions.isRequired,
        onLanguageSelect: PropTypes.func.isRequired,
        language: PropTypes.string.isRequired
    };

    state = {
        isArabic: false
    };

    static getDerivedStateFromProps() {
        return {
            isArabic: JSON.parse(localStorage.getItem('APP_STATE_CACHE_KEY')).data.language === 'ar'
        };
    }

    getNonSelectedLanguage() {
        const {
            languageSelectOptions,
            language
        } = this.props;

        return languageSelectOptions.filter((obj) => obj.id !== language);
    }

    renderLanguageSelect() {
        const {
            languageSelectOptions,
            onLanguageSelect,
            language
        } = this.props;

        return (
            <Field
              id="language-switcher-language"
              name="language"
              type="select"
              placeholder={ __('Choose language') }
              selectOptions={ languageSelectOptions }
              value={ language }
              onChange={ onLanguageSelect }
            />
        );
    }

    renderLanguageButton() {
        const {
            onLanguageSelect
        } = this.props;

        const buttonLabelObject = this.getNonSelectedLanguage();
        let label = buttonLabelObject[0].label;
        if (label === 'Arabic') {
            label = 'العربية';
        }

        return (
            <button
                /* eslint-disable-next-line */
              onClick={ () => onLanguageSelect(buttonLabelObject[0].id) }
            >
                <span>
                    { label }
                </span>
            </button>
        );
    }

    render() {
        const {
            isArabic
        } = this.state;

        return (
            <div block="LanguageSwitcher" mods={ { isArabic } }>
                { this.renderLanguageSelect() }
                { this.renderLanguageButton() }
            </div>
        );
    }
}

export default LanguageSwitcher;
