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

        return (
            <button
                /* eslint-disable-next-line */
              onClick={ () => onLanguageSelect(buttonLabelObject[0].id) }
            >
                <span>
                    { buttonLabelObject[0].label }
                </span>
            </button>
        );
    }

    render() {
        return (
            <div block="LanguageSwitcher">
                { this.renderLanguageSelect() }
                { this.renderLanguageButton() }
            </div>
        );
    }
}

export default LanguageSwitcher;
