import PropTypes from 'prop-types';

import ContentWrapper from 'Component/ContentWrapper';
import MyAccountAddressBook from 'Component/MyAccountAddressBook';
import MyAccountClubApparel from 'Component/MyAccountClubApparel';
import MyAccountDashboard from 'Component/MyAccountDashboard';
import MyAccountMyOrders from 'Component/MyAccountMyOrders';
import MyAccountMyWishlist from 'Component/MyAccountMyWishlist';
import MyAccountReturns from 'Component/MyAccountReturns';
import MyAccountTabList from 'Component/MyAccountTabList';
import StoreCredit from 'Component/StoreCredit';
import { MyAccount as SourceMyAccount } from 'SourceRoute/MyAccount/MyAccount.component';
import {
    activeTabType,
    ADDRESS_BOOK,
    CLUB_APPAREL,
    DASHBOARD,
    MY_ORDERS,
    MY_WISHLIST,
    RETURN_ITEM,
    tabMapType
} from 'Type/Account';
import isMobile from 'Util/Mobile';

import { ReactComponent as Close } from './icons/x-close.svg';

export class MyAccount extends SourceMyAccount {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
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
        [CLUB_APPAREL]: MyAccountClubApparel,
        [DASHBOARD]: MyAccountDashboard,
        [MY_ORDERS]: MyAccountMyOrders,
        [RETURN_ITEM]: MyAccountReturns,
        [MY_WISHLIST]: MyAccountMyWishlist,
        [ADDRESS_BOOK]: MyAccountAddressBook
    };

    state = {
        mobTabActive: false
    };

    componentDidUpdate(prevProps) {
        const { activeTab } = this.props;
        if (isMobile.any() !== null && prevProps.activeTab !== activeTab) {
            this.openTabContent(this);
        }
    }

    openTabContent() {
        this.setState({ mobTabActive: true });
    }

    openTabMenu() {
        this.setState({ mobTabActive: false });
    }

    handleClick(e) {
        e.preventDefault();
        this.openTabMenu();
    }

    renderDesktop() {
        const {
            activeTab,
            tabMap,
            changeActiveTab,
            isSignedIn,
            onSignOut
        } = this.props;

        if (!isSignedIn) {
            return this.renderLoginOverlay();
        }

        const TabContent = this.renderMap[activeTab];
        const { name } = tabMap[activeTab];
        return (
            <ContentWrapper
              label={ __('My Account page') }
              wrapperMix={ { block: 'MyAccount', elem: 'Wrapper' } }
            >
                <StoreCredit />
                <MyAccountTabList
                  tabMap={ tabMap }
                  activeTab={ activeTab }
                  changeActiveTab={ changeActiveTab }
                  onSignOut={ onSignOut }
                />
                <div block="MyAccount" elem="TabContent">
                    <h1 block="MyAccount" elem="Heading">{ name }</h1>
                    <TabContent />
                </div>
            </ContentWrapper>
        );
    }

    renderMobile() {
        const {
            activeTab,
            tabMap,
            changeActiveTab,
            isSignedIn,
            onSignOut
        } = this.props;

        const { mobTabActive } = this.state;

        const hiddenTabContent = mobTabActive ? 'Active' : 'Hidden';
        const hiddenTabList = mobTabActive ? 'Hidden' : 'Active';

        if (!isSignedIn) {
            return this.renderLoginOverlay();
        }

        const TabContent = this.renderMap[activeTab];
        const { name } = tabMap[activeTab];
        return (
            <ContentWrapper
              label={ __('My Account page') }
              wrapperMix={ { block: 'MyAccount', elem: 'Wrapper' } }
            >
                <div block={ hiddenTabList }>
                    <MyAccountTabList
                      tabMap={ tabMap }
                      activeTab={ activeTab }
                      changeActiveTab={ changeActiveTab }
                      onSignOut={ onSignOut }
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
                        <h1 block="MyAccount" elem="Heading">{ name }</h1>
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
