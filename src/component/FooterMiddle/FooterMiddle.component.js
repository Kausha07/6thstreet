import { Fragment, PureComponent } from 'react';

import CountrySwitcher from 'Component/CountrySwitcher';
import HeaderAccount from 'Component/HeaderAccount';
import InlineCustomerSupport from 'Component/InlineCustomerSupport';
import LanguageSwitcher from 'Component/LanguageSwitcher';
import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';

import './FooterMiddle.style';

class FooterMiddle extends PureComponent {
    state = {
        isCheckout: false
    };

    stateMap = {
        [DEFAULT_STATE_NAME]: {
            support: true,
            account: true,
            store: true
        }
    };

    renderMap = {
        support: this.renderCustomerSupport.bind(this),
        account: this.renderAccount.bind(this),
        store: this.renderStoreSwitcher.bind(this)
    };

    static getDerivedStateFromProps() {
        return location.pathname.match(/checkout/)
            ? { isCheckout: true }
            : { isCheckout: false };
    }

    renderCustomerSupport() {
        return (
            <div block="FooterMiddle" elem="CustomerSupport">
                <InlineCustomerSupport key="support" />
            </div>
        );
    }

    renderAccount() {
        return (
        <div block="FooterMiddle" elem="FooterAccount">
            <HeaderAccount
              key="account"
            />
        </div>
        );
    }

    renderStoreSwitcher() {
        return (
            <div block="FooterMiddle" elem="StoreSwitcher">
            <Fragment key="store-switcher">
                <LanguageSwitcher />
                <CountrySwitcher />
            </Fragment>
            </div>
        );
    }

    render() {
        const { isCheckout } = this.state;

        return (
            <div block="FooterMiddle" mods={ { isCheckout } }>
                <div block="FooterMiddle" elem="Layout" mods={ { isCheckout } }>
                    { this.renderCustomerSupport() }
                    { this.renderAccount() }
                    { this.renderStoreSwitcher() }
                </div>
            </div>
        );
    }
}

export default FooterMiddle;
