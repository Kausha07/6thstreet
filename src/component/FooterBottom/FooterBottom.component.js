import NavigationAbstract from 'Component/NavigationAbstract/NavigationAbstract.component';

import './FooterBottom.style';

class FooterBottom extends NavigationAbstract {
    getCurrentYear() {
        return new Date().getFullYear();
    }

    renderCopyright() {
        return (
        <div block="FooterBottom" elem="Copyright">
            Copyright &#169;&nbsp;
            { this.getCurrentYear() }
            &nbsp;
            6TH STREET. All rights reserved.
        </div>
        );
    }

    renderHyperlinks() {
        return (
        <div block="FooterBottom" elem="Hyperlinks">
            <a href="cookie">COOKIE POLICY</a>
            &nbsp;/&nbsp;
            <a href="terms">TERMS &amp; CONDITIONS</a>
            &nbsp;/&nbsp;
            <a href="privacy-policy">Privacy</a>
        </div>
        );
    }

    renderPaymentIcons() {
        return (
            <div block="FooterBottom" elem="PaymentIcons" />
        );
    }

    render() {
        return (
            <div block="FooterBottom">
                { this.renderCopyright() }
                { this.renderHyperlinks() }
                { this.renderPaymentIcons() }
            </div>
        );
    }
}

export default FooterBottom;
