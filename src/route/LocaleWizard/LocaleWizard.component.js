import { PureComponent } from 'react';

import HeaderLogo from 'Component/HeaderLogo';
import WelcomeScreen from 'Component/WelcomeScreen';

import './LocaleWizard.style';

class LocaleWizard extends PureComponent {
    render() {
        return (
            <div block="LocaleWizard">
                <div block="LocaleWizard" elem="ContentWrapper">
                    <div block="LocaleWizard" elem="Logo">
                        <HeaderLogo />
                    </div>
                    <WelcomeScreen />
                </div>
            </div>
        );
    }
}

export default LocaleWizard;
