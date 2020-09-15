import { Fragment } from 'react';

import CountrySwitcher from 'Component/CountrySwitcher';
import InlineCustomerSupport from 'Component/InlineCustomerSupport';
import LanguageSwitcher from 'Component/LanguageSwitcher';
import NavigationAbstract from 'Component/NavigationAbstract/NavigationAbstract.component';
import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';

import './HeaderTopBar.style';

class HeaderTopBar extends NavigationAbstract {
    stateMap = {
        [DEFAULT_STATE_NAME]: {
            support: true,
            cms: true,
            store: true
        }
    };

    renderMap = {
        support: this.renderCustomerSupport.bind(this),
        cms: this.renderCmsBlock.bind(this),
        store: this.renderStoreSwitcher.bind(this)
    };

    renderCmsBlock() {
        // TODO: find out what is this, render here
        return <div block="HeaderTopBar" elem="CmsBlock">cms block in header</div>;
    }

    renderCustomerSupport() {
        return (
            <InlineCustomerSupport key="support" />
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
            <div block="HeaderTopBar">
                { this.renderNavigationState() }
            </div>
        );
    }
}

export default HeaderTopBar;
