import { PureComponent } from 'react';

import HeaderLogo from 'Component/HeaderLogo';
import WelcomeScreen from 'Component/WelcomeScreen';

import './LocaleWizard.style';

class LocaleWizard extends PureComponent {
    state = {
        isArabic: false
    };

    checkWizardLang = () => {
        const appStateCacheKey = JSON.parse(localStorage.getItem('APP_STATE_CACHE_KEY'));
        this.setState({ isArabic: appStateCacheKey && appStateCacheKey.data.language === 'ar' });
    };

    render() {
        const { isArabic } = this.state;
        return (
            <div block="LocaleWizard">
                <div block="LocaleWizard" elem="Background" />
                <div block="LocaleWizard" elem="ContentWrapper">
                    <div block="LocaleWizard" elem="Logo" mods={ { isArabic } }>
                        <HeaderLogo />
                    </div>
                    <WelcomeScreen checkWizardLang={ this.checkWizardLang } />
                </div>
            </div>
        );
    }
}

export default LocaleWizard;
