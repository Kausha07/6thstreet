import { PureComponent } from 'react';
import { isArabic } from 'Util/App';

import './LocaleWizard.style';

class WelcomeHomePage extends PureComponent {
    state = {
        isArabic: false
    };

    render() {
        const { isArabic } = this.state;
        return (
            <div block="WelcomeHomePage">
                <div block="WelcomeHomePage" elem="Background" />
                <div block="WelcomeHomePage" elem="ContentWrapper">
                    <div block="WelcomeHomePage" elem="Logo" mods={ { isArabic } }>
                        hi
                    </div>
                </div>
            </div>
        );
    }
}

export default WelcomeHomePage;
