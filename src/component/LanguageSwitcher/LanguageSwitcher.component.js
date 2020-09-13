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

    render() {
        return (
            <div block="LanguageSwitcher">
                { this.renderLanguageSelect() }
            </div>
        );
    }
}

export default LanguageSwitcher;
