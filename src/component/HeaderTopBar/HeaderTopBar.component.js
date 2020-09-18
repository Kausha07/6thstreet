import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { withRouter } from 'react-router';

import CountrySwitcher from 'Component/CountrySwitcher';
import InlineCustomerSupport from 'Component/InlineCustomerSupport';
import LanguageSwitcher from 'Component/LanguageSwitcher';
import NavigationAbstract from 'Component/NavigationAbstract/NavigationAbstract.component';
import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';
import isMobile from 'Util/Mobile';

import './HeaderTopBar.style';

class HeaderTopBar extends NavigationAbstract {
    static propTypes = {
        location: PropTypes.object.isRequired
    };

    stateMap = {
        [DEFAULT_STATE_NAME]: {
            support: true,
            cms: true,
            store: true
        }
    };

    state = {
        isOnMobile: false
    };

    renderMap = {
        support: this.renderCustomerSupport.bind(this),
        cms: this.renderCmsBlock.bind(this),
        store: this.renderStoreSwitcher.bind(this)
    };

    static getDerivedStateFromProps(props) {
        const { location } = props;

        return location.pathname !== '/' && isMobile.any() ? {
            isOnMobile: true
        } : {
            isOnMobile: false
        };
    }

    renderCmsBlock() {
        // TODO: find out what is this, render here
        return (
            <div
              key="cms"
              block="HeaderTopBar"
              elem="CmsBlock"
            >
                cms block in header
            </div>
        );
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
        const { isOnMobile } = this.state;

        return (
            <div block="HeaderTopBar" mods={ { isOnMobile } }>
                <div block="HeaderTopBar" elem="ContentWrapper">
                    { this.renderNavigationState() }
                </div>
            </div>
        );
    }
}

export default withRouter(HeaderTopBar);
