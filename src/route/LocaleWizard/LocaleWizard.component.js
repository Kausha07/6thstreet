import { PureComponent } from 'react';

import CountrySwitcher from 'Component/CountrySwitcher';
import LanguageSwitcher from 'Component/LanguageSwitcher';

import './LocaleWizard.style';

class LocaleWizard extends PureComponent {
    renderCountrySelect() {
        return (
            <CountrySwitcher />
        );
    }

    renderLanguageSelect() {
        return (
            <LanguageSwitcher />
        );
    }

    render() {
        return (
            <>
                { this.renderCountrySelect() }
                { this.renderLanguageSelect() }
            </>
        );
    }
}

export default LocaleWizard;
