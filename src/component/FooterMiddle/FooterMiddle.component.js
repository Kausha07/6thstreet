import { Fragment, PureComponent } from 'react';

import CountrySwitcher from 'Component/CountrySwitcher';
import HeaderAccount from 'Component/HeaderAccount';
import InlineCustomerSupport from 'Component/InlineCustomerSupport';
import LanguageSwitcher from 'Component/LanguageSwitcher';
import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';

import './FooterMiddle.style';

class FooterMiddle extends PureComponent {
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

    renderCustomerSupport() {
        return (
                <InlineCustomerSupport key="support" />
        );
    }

    renderAccount() {
        return (
            <HeaderAccount
              key="account"
            />
        );
    }

    renderStoreSwitcher() {
        return (
            <Fragment key="store-switcher">
                <LanguageSwitcher />
                <CountrySwitcher />
            </Fragment>
        );
    }

    render() {
        return (
            <div block="FooterMiddle">
                { this.renderCustomerSupport() }
                { this.renderAccount() }
                { this.renderStoreSwitcher() }
            </div>
        );
    }
}

export default FooterMiddle;
