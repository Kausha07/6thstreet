import PropTypes from 'prop-types';

import ContentWrapper from 'Component/ContentWrapper';
import MyAccountAddressBook from 'Component/MyAccountAddressBook';
import MyAccountClubApparel from 'Component/MyAccountClubApparel';
import MyAccountDashboard from 'Component/MyAccountDashboard';
import MyAccountMobileHeader from 'Component/MyAccountMobileHeader';
import MyAccountMyOrders from 'Component/MyAccountMyOrders';
import MyAccountMyWishlist from 'Component/MyAccountMyWishlist';
import MyAccountReturns from 'Component/MyAccountReturns';
import MyAccountStoreCredit from 'Component/MyAccountStoreCredit';
import MyAccountTabList from 'Component/MyAccountTabList';
import { MyAccount as SourceMyAccount } from 'SourceRoute/MyAccount/MyAccount.component';
import {
    activeTabType,
    ADDRESS_BOOK,
    CLUB_APPAREL,
    DASHBOARD,
    MY_ORDERS,
    MY_WISHLIST,
    RETURN_ITEM,
    STORE_CREDIT,
    tabMapType
} from 'Type/Account';
import { deleteAuthorizationToken } from 'Util/Auth';
import isMobile from 'Util/Mobile';

import { ReactComponent as Close } from './icons/x-close.svg';

export class MyAccount extends SourceMyAccount {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleSignOut = this.handleSignOut.bind(this);
    }

    static propTypes = {
        activeTab: activeTabType.isRequired,
        tabMap: tabMapType.isRequired,
        changeActiveTab: PropTypes.func.isRequired,
        onSignIn: PropTypes.func.isRequired,
        onSignOut: PropTypes.func.isRequired,
        isSignedIn: PropTypes.bool.isRequired
    };

    renderMap = {
        [STORE_CREDIT]: MyAccountStoreCredit,
        [CLUB_APPAREL]: MyAccountClubApparel,
        [DASHBOARD]: MyAccountDashboard,
        [MY_ORDERS]: MyAccountMyOrders,
        [RETURN_ITEM]: MyAccountReturns,
        [MY_WISHLIST]: MyAccountMyWishlist,
        [ADDRESS_BOOK]: MyAccountAddressBook
    };

    state = {
        mobTabActive: true
    };

    handleTabChange(key) {
        const { changeActiveTab } = this.props;
        this.setState(({ mobTabActive }) => ({ mobTabActive: !mobTabActive }));
        changeActiveTab(key);
    }

    openTabMenu() {
        this.setState(({ mobTabActive }) => ({ mobTabActive: !mobTabActive }));
    }

    handleClick(e) {
        e.preventDefault();
        this.openTabMenu();
    }

    handleSignOut() {
        const { onSignOut } = this.props;
        onSignOut();
        deleteAuthorizationToken();
        const { history } = this.props;
        history.push('/');
    }

    renderDesktop() {
        const {
            activeTab,
            tabMap,
            changeActiveTab,
            isSignedIn
        } = this.props;

        if (!isSignedIn) {
            return this.renderLoginOverlay();
        }

        const TabContent = this.renderMap[activeTab];
        const { name, alternativePageName } = tabMap[activeTab];
        return (
            <ContentWrapper
              label={ __('My Account page') }
              wrapperMix={ { block: 'MyAccount', elem: 'Wrapper' } }
            >
                <MyAccountTabList
                  tabMap={ tabMap }
                  activeTab={ activeTab }
                  changeActiveTab={ changeActiveTab }
                  onSignOut={ this.handleSignOut }
                />
                <div block="MyAccount" elem="TabContent">
                    <h1 block="MyAccount" elem="Heading">{ alternativePageName || name }</h1>
                    <TabContent />
                </div>
            </ContentWrapper>
        );
    }

    renderMobile() {
        const {
            activeTab,
            tabMap,
            isSignedIn
        } = this.props;

        const { mobTabActive } = this.state;

        const hiddenTabContent = mobTabActive ? 'Active' : 'Hidden';
        const hiddenTabList = mobTabActive ? 'Hidden' : 'Active';

        if (!isSignedIn) {
            return this.renderLoginOverlay();
        }

        const TabContent = this.renderMap[activeTab];
        const { alternativePageName, name } = tabMap[activeTab];
        return (
            <ContentWrapper
              label={ __('My Account page') }
              wrapperMix={ { block: 'MyAccount', elem: 'Wrapper' } }
            >
                <MyAccountMobileHeader />
                <div block={ hiddenTabList }>
                    <MyAccountTabList
                      tabMap={ tabMap }
                      activeTab={ activeTab }
                      changeActiveTab={ this.handleTabChange }
                      onSignOut={ this.handleSignOut }
                    />
                    <div block="TermsAndPrivacy">
                        Terms and conditions and
                        <a id="privacy-link" href="https://en-ae.6thstreet.com/privacy-policy"> privacy policy</a>
                    </div>
                </div>
                { hiddenTabContent === 'Active' ? (
                    <button
                      elem="Button"
                      block="Cross-button"
                      onClick={ this.handleClick }
                    >
                        <Close />
                    </button>
                ) : ('') }
                <div block={ hiddenTabContent }>
                    <div block="MyAccount" elem="TabContent">
                        <h1 block="MyAccount" elem="Heading">{ alternativePageName || name }</h1>
                        <TabContent />
                    </div>
                </div>
            </ContentWrapper>
        );
    }

    renderContent() {
        return isMobile.any() ? this.renderMobile() : this.renderDesktop();
    }
}

export default MyAccount;
