import ContactHelp from "Component/ContactHelp";
import ContentWrapper from "Component/ContentWrapper";
import Image from "Component/Image";
import Link from "Component/Link";
import MyAccountAddressBook from "Component/MyAccountAddressBook";
import WalletAndPayments from "Component/WalletsAndPayments";
import MyAccountClubApparel from "Component/MyAccountClubApparel";
import MyAccountDashboard from "Component/MyAccountDashboard";
import MyAccountMobileHeader from "Component/MyAccountMobileHeader";
import MyAccountMyOrders from "Component/MyAccountMyOrders";
import MyAccountMyWishlist from "Component/MyAccountMyWishlist";
import MyAccountReferralTab from "Component/MyAccountReferralTab";
import MyAccountVipCustomer from "Component/MyAccountVipCustomer";
import MyWalletHomeBase from "Component/MyWallet/MyWalletHomeBase";
// import Referral from "./../../component/Referral/Referral";
import {
  RETURN_ITEM_LABEL,
  RETURN__EXCHANGE_ITEM_LABEL,
} from "Component/MyAccountOrderView/MyAccountOrderView.config.js";
import MyAccountReturns from "Component/MyAccountReturns";
import MyAccountStoreCredit from "Component/MyAccountStoreCredit";
import MyAccountTabList from "Component/MyAccountTabList";
import SettingsScreen from "Component/SettingsScreen";
import PropTypes from "prop-types";
import { Fragment } from "react";
import { MyAccount as SourceMyAccount } from "SourceRoute/MyAccount/MyAccount.component";
import {
  activeTabType,
  ADDRESS_BOOK,
  CLUB_APPAREL,
  CONTACT_HELP,
  DASHBOARD,
  MY_ORDERS,
  MY_WISHLIST,
  RETURN_ITEM,
  EXCHANGE_ITEM,
  SETTINGS_SCREEN,
  STORE_CREDIT,
  WALLET_PAYMENTS,
  tabMapType,
  REFERRAL_SCREEN,
  VIP_CUSTOMER,
  MY_WALLET,
} from "Type/Account";
import {
  exchangeReturnState,
  returnState,
  tabMap,
  tabMap2,
  storeCreditState,
  clubApparelState,
  vipCustomerState,
} from "./MyAccount.container";
import { isArabic } from "Util/App";
import { deleteAuthorizationToken } from "Util/Auth";
import BrowserDatabase from "Util/BrowserDatabase";
import isMobile from "Util/Mobile";
import { TIER_DATA } from "./../../component/MyAccountClubApparel/MyAccountClubApparel.config";
import box from "./icons/box.png";
import referIcon from "./icons/refer.png";
import help from "./icons/help.png";
import calogo from "./icons/calogo.png";
import infoIcon from "./icons/infobold.png";
import { ADD_ADDRESS } from "Component/MyAccountAddressPopup/MyAccountAddressPopup.config";
import Event, {
  EVENT_GTM_NEW_AUTHENTICATION,
  EVENT_ACCOUNT_ORDERS_CLICK,
  EVENT_ACCOUNT_RETURNS_CLICK,
  EVENT_ACCOUNT_ADDRESS_BOOK_CLICK,
  EVENT_ACCOUNT_PROFILE_CLICK,
  EVENT_ACCOUNT_CLUB_APPAREL_CLICK,
  EVENT_ACCOUNT_SETTINGS_CLICK,
  EVENT_ACCOUNT_CUSTOMER_SUPPORT_CLICK,
  EVENT_MOE_RETURN_AN_ITEM_CLICK,
  EVENT_ACCOUNT_PAYMENT_CLICK,
  EVENT_ACCOUNT_SECTION_REFERRAL_TAB_CLICK,
  MOE_trackEvent,
} from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import supportIcon from "./icons/support.png";
import OrdersIcon from "./icons/box-vip.png";

export class MyAccount extends SourceMyAccount {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.returnItemButtonClick = this.returnItemButtonClick.bind(this);
  }

  static propTypes = {
    activeTab: activeTabType.isRequired,
    tabMap: tabMapType.isRequired,
    changeActiveTab: PropTypes.func.isRequired,
    onSignIn: PropTypes.func.isRequired,
    onSignOut: PropTypes.func.isRequired,
    isSignedIn: PropTypes.bool.isRequired,
    mobileTabActive: PropTypes.bool.isRequired,
    setMobileTabActive: PropTypes.func.isRequired,
    setCurrentTabActive: PropTypes.func.isRequired,
  };

  state = {
    isArabic: isArabic(),
    isMobile: isMobile.any(),
  };

  renderMap = {
    [STORE_CREDIT]: MyAccountStoreCredit,
    [CLUB_APPAREL]: MyAccountClubApparel,
    [DASHBOARD]: MyAccountDashboard,
    [MY_ORDERS]: MyAccountMyOrders,
    [RETURN_ITEM]: MyAccountReturns,
    [EXCHANGE_ITEM]: MyAccountReturns,
    [MY_WISHLIST]: MyAccountMyWishlist,
    [ADDRESS_BOOK]: MyAccountAddressBook,
    [WALLET_PAYMENTS]: WalletAndPayments,
    [CONTACT_HELP]: ContactHelp,
    [SETTINGS_SCREEN]: SettingsScreen,
    [REFERRAL_SCREEN]: MyAccountReferralTab,
    [VIP_CUSTOMER]: MyAccountVipCustomer,
    [MY_WALLET]: MyWalletHomeBase,
  };

  linksMap = [
    {
      title: __("Download The App"),
      items: [
        {
          id_app: "App1",
          app_store:
            "https://static.6media.me/static/version1600320971/frontend/6SNEW/6snew/en_US/images/apple-store-badge.svg",
          app_onclick:
            "https://apps.apple.com/ro/app/6thstreet-com/id1370217070",
          id_google: "Google1",
          google_play:
            "https://static.6media.me/static/version1600320042/frontend/6SNEW/6snew/en_US/images/google-play-badge.svg",
          google_onclick:
            "https://play.google.com/store/apps/details?id=com.apparel.app6thstreet",
          id_gallery: "Gallery1",
          app_gallery:
            "https://6thstreetmobileapp-eu-c.s3.eu-central-1.amazonaws.com/resources/20190121/en-ae/d/icon_huaweiappgallery.svg",
          gallery_onclick: "https://appgallery.huawei.com/#/app/C102324663",
          header: __("Follow the latest trends"),
        },
      ],
    },
  ];

  renderAppColumn() {
    return this.linksMap.map((column) => (
      <div block="FooterMain" elem="LastColumn" key={column.title}>
        <h4 block="FooterMain" elem="FooterHeading">
          {column.title}
        </h4>
        <div block="FooterMain" elem="Nav">
          {column.items.map((items, i) => (
            <Fragment key={`last_main_footer_column_${i}`}>
              <div block="FooterMain" elem="WrapperFirst">
                <div block="MobileFooterMain">
                  <Link to={items.app_onclick} key={items.id_app}>
                    <Image
                      lazyLoad={true}
                      src={items.app_store}
                      alt="app store download"
                    />
                  </Link>
                  <Link to={items.google_onclick} key={items.id_google}>
                    <Image
                      lazyLoad={true}
                      src={items.google_play}
                      alt="google play download"
                    />{" "}
                  </Link>
                  <Link to={items.gallery_onclick} key={items.id_gallery}>
                    <Image
                      lazyLoad={true}
                      src={items.app_gallery}
                      alt="app gallery download"
                      className="appGallery"
                    />
                  </Link>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    ));
  }

  componentDidUpdate() {
    const { isMobile } = this.state;
    if (isMobile && document?.body?.style?.position == "fixed") {
      document.body.style.position = "static";
    }
  }

  componentWillUnmount() {
    const { isMobile } = this.state;
    if (isMobile) {
      document.getElementsByClassName(
        "PageWrapper-Content"
      )[0].style.background = "";
      document.body.style.position = "";
    }
  }

  sendEvents(event) {
    const { newSignUpEnabled } = this.props;
    if (newSignUpEnabled) {
      const eventData = {
        name: event,
        prevScreen: this.getPageType() || "",
      };
      Event.dispatch(EVENT_GTM_NEW_AUTHENTICATION, eventData);
    } else {
      MOE_trackEvent(event, {
        country: getCountryFromUrl().toUpperCase(),
        language: getLanguageFromUrl().toUpperCase(),
        ...(event == EVENT_MOE_RETURN_AN_ITEM_CLICK && {
          screen_name: "Return List",
        }),
        app6thstreet_platform: "Web",
      });
    }
  }

  getPageType() {
    const { urlRewrite, currentRouteName } = window;

    if (currentRouteName === "url-rewrite") {
      if (typeof urlRewrite === "undefined") {
        return "";
      }

      if (urlRewrite.notFound) {
        return "notfound";
      }

      return (urlRewrite.type || "").toLowerCase();
    }

    return (currentRouteName || "").toLowerCase();
  }

  handleTabChange(key) {
    const {
      changeActiveTab,
      mobileTabActive,
      setMobileTabActive,
      setCurrentTabActive,
    } = this.props;
    setMobileTabActive(!mobileTabActive);
    setCurrentTabActive(true);
    changeActiveTab(key);
    const MoeEvent =
      key == "dashboard"
        ? EVENT_ACCOUNT_PROFILE_CLICK
        : key == "my-orders"
        ? EVENT_ACCOUNT_ORDERS_CLICK
        : key == "settings"
        ? EVENT_ACCOUNT_SETTINGS_CLICK
        : key == "address-book"
        ? EVENT_ACCOUNT_ADDRESS_BOOK_CLICK
        : key == "return-item"
        ? EVENT_ACCOUNT_RETURNS_CLICK
        : key == "club-apparel"
        ? EVENT_ACCOUNT_CLUB_APPAREL_CLICK
        : key == "wallet-payments"
        ? EVENT_ACCOUNT_PAYMENT_CLICK
        : key == "referral"
        ? EVENT_ACCOUNT_SECTION_REFERRAL_TAB_CLICK
        : "";
    if (MoeEvent) {
      this.sendEvents(MoeEvent);
    }
  }

  openTabMenu() {
    const {
      mobileTabActive,
      setMobileTabActive,
      setCurrentTabActive,
      history,
    } = this.props;
    // history.push("/my-account");
    history.goBack();
    setMobileTabActive(!mobileTabActive);
    setCurrentTabActive(false);
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
    history.push("/");
  }

  returnItemButtonClick() {
    const { history } = this.props;
    history.push("/my-account/my-orders");
    this.sendEvents(EVENT_MOE_RETURN_AN_ITEM_CLICK);
  }

  renderDesktop() {
    const {
      activeTab,
      changeActiveTab,
      isSignedIn,
      exchangeTabMap,
      is_exchange_enabled = false,
      customer,
      IsReferralEnabled,
      isClubApparelEnabled,
      IsVipCustomerEnabled,
      isWalletEnabled,
    } = this.props;
    const isVipCustomer =
      (IsVipCustomerEnabled && customer && customer?.vipCustomer) || false;
    const { pathname = "" } = location;

    if (!isWalletEnabled) {
      delete tabMap[MY_WALLET];
    }

    let newTabMap = is_exchange_enabled
      ? {
          ...(!isWalletEnabled && storeCreditState),
          ...(isVipCustomer && { ...vipCustomerState }),
          ...(isClubApparelEnabled && clubApparelState),
          ...tabMap,
          ...exchangeReturnState,
          ...tabMap2,
        }
      : {
          ...(!isWalletEnabled && storeCreditState),
          ...(isVipCustomer && { ...vipCustomerState }),
          ...(isClubApparelEnabled && clubApparelState),
          ...tabMap,
          ...returnState,
          ...tabMap2,
        };
    const { isArabic } = this.state;

    if (!isSignedIn) {
      const { history } = this.props;
      return history.push("/");
    }

    if (!IsReferralEnabled) {
      delete tabMap[REFERRAL_SCREEN];
    }
    const TabContent = this.renderMap[activeTab];
    // eslint-disable-next-line no-unused-vars

    let finalTab;
    if (newTabMap[activeTab]) {
      finalTab = newTabMap[activeTab];
    } else if (exchangeTabMap[activeTab]) {
      finalTab = exchangeTabMap[activeTab];
    }
    const { name, alternativePageName, alternateName } = finalTab;
    const pickUpAddress =
      pathname === "/my-account/return-item/pick-up-address";

    const returnTitle =
      activeTab === RETURN_ITEM
        ? pickUpAddress
          ? __("Select Pick Up Address")
          : __("Return Statement")
        : activeTab === EXCHANGE_ITEM
        ? __("Exchange Statement")
        : null;
    const isCancel = pathname.includes("/return-item/cancel");
    const isReturnButton = pathname === "/my-account/return-item";
    return (
      <ContentWrapper
        label={__("My Account page")}
        wrapperMix={{ block: "MyAccount", elem: "Wrapper", mods: { isArabic } }}
      >
        <div block="MyAccount" elem="TabListAndReferral">
          <MyAccountTabList
            tabMap={newTabMap}
            activeTab={activeTab === EXCHANGE_ITEM ? RETURN_ITEM : activeTab}
            changeActiveTab={changeActiveTab}
            onSignOut={this.handleSignOut}
          />
          {/* {customer && (
            <Referral referralCodeValue={customer.referral_coupon} />
          )} */}
        </div>
        <div block="MyAccount" elem="TabContent" mods={{ isArabic }}>
          {alternativePageName === "Club Apparel Loyalty" ||
          name === "Club Apparel Loyalty" ||
          name == __("Refer & Earn") ||
          name == __("Your VIP Perks") ? null : !isReturnButton ? (
            <h1 block="MyAccount" elem="Heading">
              {isCancel
                ? alternateName
                : alternativePageName || returnTitle || name}
            </h1>
          ) : (
            <div block="MyAccount" elem="HeadingBlock">
              <h1 block="MyAccount" elem="Heading">
                {isReturnButton
                  ? is_exchange_enabled
                    ? __("Return/Exchange Statement")
                    : __("Return Statement")
                  : alternativePageName || returnTitle || name}
              </h1>
              <button
                block="MyAccount"
                elem="ReturnButton"
                onClick={this.returnItemButtonClick}
              >
                {is_exchange_enabled
                  ? RETURN__EXCHANGE_ITEM_LABEL
                  : RETURN_ITEM_LABEL}
              </button>
            </div>
          )}
          <TabContent />
        </div>
      </ContentWrapper>
    );
  }

  renderMobile() {
    const {
      customer,
      activeTab,
      isSignedIn,
      mobileTabActive,
      setMobileTabActive,
      exchangeTabMap,
      payload,
      is_exchange_enabled,
      config,
      IsReferralEnabled,
      isClubApparelEnabled,
      IsVipCustomerEnabled,
      history: { location },
      isWalletEnabled,
    } = this.props;
    const { isArabic, isMobile } = this.state;
    const isVipCustomer =
      (IsVipCustomerEnabled && customer && customer?.vipCustomer) || false;
    const isVip = isVipCustomer ? true : false;
    if (
      isVipCustomer &&
      activeTab == "dashboard" &&
      isMobile &&
      location.pathname === "/my-account"
    ) {
      document.getElementsByClassName(
        "PageWrapper-Content"
      )[0].style.background = "linear-gradient(180deg, #e7d8fc 0%, #fff 100%)";
    } else {
      document.getElementsByClassName(
        "PageWrapper-Content"
      )[0].style.background = "none";
    }

    if (!isWalletEnabled) {
      delete tabMap[MY_WALLET];
    }
    if (!IsReferralEnabled) {
      delete tabMap[REFERRAL_SCREEN];
    }
    let newTabMap = is_exchange_enabled
      ? {
          ...(!isWalletEnabled && storeCreditState),
          ...(isVipCustomer && { ...vipCustomerState }),
          ...(isClubApparelEnabled && clubApparelState),
          ...tabMap,
          ...exchangeReturnState,
          ...tabMap2,
        }
      : {
          ...(!isWalletEnabled && storeCreditState),
          ...(isVipCustomer && { ...vipCustomerState }),
          ...(isClubApparelEnabled && clubApparelState),
          ...tabMap,
          ...returnState,
          ...tabMap2,
        };
    const showProfileMenu =
      location.pathname.match("\\/my-account").input === "/my-account";
    let hiddenTabContent, hiddenTabList;
    if (showProfileMenu) {
      hiddenTabList = "Active";
      hiddenTabContent = "Hidden";
    } else {
      hiddenTabList = "Hidden";
      hiddenTabContent = "Active";
    }
    if (!isSignedIn) {
      return this.renderLoginOverlay();
    }

    const { pathname = "" } = location;

    const TabContent = this.renderMap[activeTab];
    let finalTab;
    if (newTabMap[activeTab]) {
      finalTab = newTabMap[activeTab];
    } else if (exchangeTabMap[activeTab]) {
      finalTab = exchangeTabMap[activeTab];
    }
    const { name, alternativePageName, alternateName } = finalTab;
    const isCancel = pathname.includes("/return-item/cancel");
    const isPickUpAddress =
      pathname === "/my-account/return-item/pick-up-address";
    const customerData = BrowserDatabase.getItem("customer");
    const firstname =
      customer && customerData.firstname ? customerData.firstname : null;
    const payloadKey = Object.keys(payload)[0];
    const validateWhatsapp = config?.whatsapp_chatbot_phone
      ? config.whatsapp_chatbot_phone.replaceAll(/[^A-Z0-9]/gi, "")
      : null;
    const whatsappChat = `https://wa.me/${validateWhatsapp}`;
    return (
      <ContentWrapper
        label={__("My Account page")}
        wrapperMix={{
          block: "MyAccount",
          elem: "Wrapper",
          mods: { isArabic, isVip },
        }}
      >
        {!(isPickUpAddress && payloadKey && payload[payloadKey].title) && (
          <MyAccountMobileHeader
            onClose={this.handleClick}
            isHiddenTabContent={hiddenTabContent === "Active"}
            alternativePageName={alternativePageName}
            name={
              isPickUpAddress
                ? "Select Pick Up Address"
                : isCancel
                ? alternateName
                : name
            }
          />
        )}

        <div block={hiddenTabList}>
          <div block="UserBlock">
            <span>{__("Hello, ")}</span>
            <span block="UserName">{firstname}</span>
          </div>
          <div block="MobileCards" mods={{ isClubApparelEnabled }}>
            {isClubApparelEnabled ? (
              <div block="CaCardsContainer">
                <div block="InfoIconBlock">
                  <Image block="InfoIcon" src={infoIcon} alt={"Club Apparel"} />
                </div>
                <div block="CardsIconBlock">
                  <Image block="CardsIcon" src={calogo} alt={"apparel"} />
                </div>
                {/* tier image to be added once we got the background image REF: https://projects.invisionapp.com/d/main?origin=v7#/console/17341759/362923026/preview?scrollOffset=23294#project_console */}
                {this.props.clubApparel?.accountLinked ? (
                  <button
                    onClick={() => this.handleTabChange("club-apparel")}
                    block="AccountLinked"
                  >
                    <div block="AccountLinkedTextBlock">
                      <span block="ClubApparelImgBlock">
                        <Image
                          block="ClubApparelImg"
                          src={
                            TIER_DATA[
                              this.props.clubApparel?.memberDetails?.memberTier
                            ]?.img
                          }
                          alt={"apparel"}
                        />
                      </span>
                      <span block="TierName">
                        {" "}
                        {this.props.clubApparel?.memberDetails?.memberTier} TIER
                      </span>
                      <span block="pointDetails">
                        <span block="pointsValue">
                          {this.props.clubApparel?.caPointsValue}
                        </span>{" "}
                        {this.props.clubApparel?.currency}
                      </span>
                    </div>
                  </button>
                ) : (
                  <button onClick={() => this.handleTabChange("club-apparel")}>
                    {__("Link Now")}
                  </button>
                )}
              </div>
            ) : (
              <div block="CardsContainer referralContainer">
                <Image block="CardsIcon" src={referIcon} alt={"box"} />
                <div block="CardTitle"> {__("Refer & Earn")} </div>
                <span>{__("Invite a friend")}</span>
                <button onClick={() => this.handleTabChange("referral")}>
                  {__("View")}
                </button>
              </div>
            )}
            {isVipCustomer ? (
              <>
                <div block="CardsContainer isVIP">
                  <Image block="CardsIcon" src={OrdersIcon} alt={"Orders"} />
                  <div block="CardTitle"> {__("My Orders")} </div>
                  <button onClick={() => this.handleTabChange("my-orders")}>
                    {__("Track")}
                  </button>
                </div>
                <div block="CardsContainer helpContainer isVIP">
                  <Image block="CardsIcon" src={supportIcon} alt={"Support"} />
                  <div block="CardTitle"> {__("My Agent")} </div>
                  <span>{__("Mon - Sat")}</span>
                  <span block="timing">({__("9am - 9pm")})</span>
                  <a
                    onClick={() => {
                      this.sendEvents(EVENT_ACCOUNT_CUSTOMER_SUPPORT_CLICK);
                    }}
                    className="chat-button"
                    href="tel:048142666"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {__("Call")}
                  </a>
                </div>
              </>
            ) : (
              <>
                <div block="CardsContainer">
                  <Image block="CardsIcon" src={box} alt={"box"} />
                  <div block="CardTitle"> {__("My Orders")} </div>
                  <button onClick={() => this.handleTabChange("my-orders")}>
                    {__("View")}
                  </button>
                </div>
                <div block="CardsContainer helpContainer">
                  <Image block="CardsIcon" src={help} alt={"help"} />
                  <div block="CardTitle">{__("Help Center 24/7")}</div>
                  <span>{__("Online")}</span>
                  <a
                    onClick={() => {
                      this.sendEvents(EVENT_ACCOUNT_CUSTOMER_SUPPORT_CLICK);
                    }}
                    className="chat-button"
                    href={`${whatsappChat}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {__("Live Chat")}
                  </a>
                </div>
              </>
            )}
          </div>
          <MyAccountTabList
            tabMap={newTabMap}
            activeTab={activeTab === EXCHANGE_ITEM ? RETURN_ITEM : activeTab}
            changeActiveTab={this.handleTabChange}
            onSignOut={this.handleSignOut}
          />
          {/* {customer && (
            <Referral referralCodeValue={customer.referral_coupon} />
          )} */}
          <div>{isMobile ? this.renderAppColumn() : null}</div>
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
    const { isMobile } = this.state;
    return isMobile ? this.renderMobile() : this.renderDesktop();
  }
}

export default MyAccount;
