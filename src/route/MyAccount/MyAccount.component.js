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
import { isArabic } from 'Util/App';
import { deleteAuthorizationToken } from 'Util/Auth';
import isMobile from 'Util/Mobile';
import { RETURN_ITEM_LABEL } from "Component/MyAccountOrderView/MyAccountOrderView.config.js"
export class MyAccount extends SourceMyAccount {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleSignOut = this.handleSignOut.bind(this);
        this.returnItemButtonClick = this.returnItemButtonClick.bind(this)
    }

    static propTypes = {
        activeTab: activeTabType.isRequired,
        tabMap: tabMapType.isRequired,
        changeActiveTab: PropTypes.func.isRequired,
        onSignIn: PropTypes.func.isRequired,
        onSignOut: PropTypes.func.isRequired,
        isSignedIn: PropTypes.bool.isRequired,
        mobileTabActive: PropTypes.bool.isRequired,
        setMobileTabActive: PropTypes.func.isRequired
    };

    state = {
        isArabic: isArabic()
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

    handleTabChange(key) {
        const { changeActiveTab, mobileTabActive, setMobileTabActive } = this.props;

        setMobileTabActive(!mobileTabActive);
        changeActiveTab(key);
    }

    openTabMenu() {
        const { mobileTabActive, setMobileTabActive } = this.props;

        setMobileTabActive(!mobileTabActive);
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

    returnItemButtonClick() {
        const { history } = this.props;

        history.push("/my-account/my-orders");
    }

    renderDesktop() {
        const {
            activeTab,
            tabMap,
            changeActiveTab,
            isSignedIn,
        } = this.props;
        const { pathname = '' } = location;

        const { isArabic } = this.state;

        if (!isSignedIn) {
            return this.renderLoginOverlay();
        }

        const TabContent = this.renderMap[activeTab];
        // eslint-disable-next-line no-unused-vars
        const { name, alternativePageName, alternateName } = tabMap[activeTab];
        const returnTitle = activeTab === RETURN_ITEM ? __('Return Statement') : null;
        const isCancel = pathname.includes('/return-item/cancel');
        const isReturnButton = pathname === "/my-account/return-item"
        return (
            <ContentWrapper
                label={__('My Account page')}
                wrapperMix={{ block: 'MyAccount', elem: 'Wrapper', mods: { isArabic } }}
            >
                <MyAccountTabList
                    tabMap={tabMap}
                    activeTab={activeTab}
                    changeActiveTab={changeActiveTab}
                    onSignOut={this.handleSignOut}
                />
                <div block="MyAccount" elem="TabContent" mods={{ isArabic }}>
                    {alternativePageName === 'Club Apparel Loyalty' || name === 'Club Apparel Loyalty'
                        ? null : !isReturnButton ? (
                            <h1 block="MyAccount" elem="Heading">
                                {isCancel ? alternateName : alternativePageName
                                    || (returnTitle || name)}
                            </h1>
                        ) : <div block="MyAccount" elem="HeadingBlock">
                                <h1 block="MyAccount" elem="Heading">
                                    {alternativePageName
                                        || (returnTitle || name)}
                                </h1>
                                <button block="MyAccount" elem="ReturnButton" onClick={this.returnItemButtonClick}>{RETURN_ITEM_LABEL}</button>
                            </div>}
                    <TabContent />
                </div>
            </ContentWrapper>
        );
    }

    renderMobile() {
        const {
            activeTab,
            tabMap,
            isSignedIn,
            mobileTabActive
        } = this.props;

        const { isArabic } = this.state;

        const hiddenTabContent = mobileTabActive ? 'Active' : 'Hidden';
        const hiddenTabList = mobileTabActive ? 'Hidden' : 'Active';

        if (!isSignedIn) {
            return this.renderLoginOverlay();
        }
        const { pathname = '' } = location;

        const TabContent = this.renderMap[activeTab];
        const { alternativePageName, name, alternateName } = tabMap[activeTab];
        const isCancel = pathname.includes('/return-item/cancel');
        return (
            <ContentWrapper
                label={__('My Account page')}
                wrapperMix={{ block: 'MyAccount', elem: 'Wrapper', mods: { isArabic } }}
            >
                <MyAccountMobileHeader
                    onClose={this.handleClick}
                    isHiddenTabContent={hiddenTabContent === 'Active'}
                    alternativePageName={alternativePageName}
                    name={isCancel ? alternateName : name}
                />
                <div block={hiddenTabList}>
                    <MyAccountTabList
                        tabMap={tabMap}
                        activeTab={activeTab}
                        changeActiveTab={this.handleTabChange}
                        onSignOut={this.handleSignOut}
                    />
                </div>
                <div block={hiddenTabContent}>
                    <div block="MyAccount" elem="TabContent">
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
