import StoreCredit from "Component/StoreCredit";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  BreadcrumbsDispatcher,
  mapDispatchToProps as sourceMapDispatchToProps,
  mapStateToProps as sourceMapStateToProps,
  MyAccountContainer as SourceMyAccountContainer,
  MyAccountDispatcher,
} from "SourceRoute/MyAccount/MyAccount.container";
import { updateMeta } from "Store/Meta/Meta.action";
import { setIsMobileTabActive } from "Store/MyAccount/MyAccount.action";
import StoreCreditDispatcher from "Store/StoreCredit/StoreCredit.dispatcher";
import {
  ADDRESS_BOOK,
  CLUB_APPAREL,
  // CONTACT_HELP,
  SETTINGS_SCREEN,
  DASHBOARD,
  MY_ORDERS,
  MY_WISHLIST,
  RETURN_ITEM,
  STORE_CREDIT,
} from "Type/Account";
import { MY_ACCOUNT_URL } from "./MyAccount.config";
import isMobile from "Util/Mobile";

export { BreadcrumbsDispatcher, MyAccountDispatcher };

export const mapStateToProps = (state) => ({
  ...sourceMapStateToProps(state),
  mobileTabActive: state.MyAccountReducer.mobileTabActive,
});

export const mapDispatchToProps = (dispatch) => ({
  ...sourceMapDispatchToProps(dispatch),
  setMobileTabActive: (value) => dispatch(setIsMobileTabActive(value)),
  setMeta: (meta) => dispatch(updateMeta(meta)),
  updateStoreCredit: () => StoreCreditDispatcher.getStoreCredit(dispatch),
});

export const tabMap = {
  [STORE_CREDIT]: {
    url: "/storecredit/info",
    name: <StoreCredit />,
    alternativePageName: __("Balance"),
    linkClassName: "StoreCreditLink",
  },
  [CLUB_APPAREL]: {
    url: "/club-apparel",
    name: __("Club Apparel Loyalty"),
  },
  [DASHBOARD]: {
    url: "/dashboard",
    name: __("My Profile"),
  },
  [MY_ORDERS]: {
    url: "/my-orders",
    name: __("My Orders"),
  },
  [RETURN_ITEM]: {
    url: "/return-item",
    name: __("My Returns"),
    alternateName: __("Cancel an item"),
  },
  [MY_WISHLIST]: {
    url: "/my-wishlist",
    name: __("My wishlist"),
  },
  [ADDRESS_BOOK]: {
    url: "/address-book",
    name: __("My Address Book"),
  },
  // [SETTINGS_SCREEN]: {
  //   url: "/settings",
  //   name: __("Settings"),
  // },
  // [CONTACT_HELP]: {
  //   url: "/contact-help",
  //   name: __("Contact & Help"),
  // },
};

export const mobileTabMap = {
  [STORE_CREDIT]: {
    url: "/storecredit/info",
    name: <StoreCredit />,
    alternativePageName: __("Balance"),
    linkClassName: "StoreCreditLink",
  },
  // [CLUB_APPAREL]: {
  //   url: "/club-apparel",
  //   name: __("Club Apparel Loyalty"),
  // },
  [DASHBOARD]: {
    url: "/dashboard",
    name: __("My Profile"),
  },
  // [MY_ORDERS]: {
  //   url: "/my-orders",
  //   name: __("My Orders"),
  // },
  [RETURN_ITEM]: {
    url: "/return-item",
    name: __("My Returns"),
    alternateName: __("Cancel an item"),
  },
  [MY_WISHLIST]: {
    url: "/my-wishlist",
    name: __("My wishlist"),
  },
  [ADDRESS_BOOK]: {
    url: "/address-book",
    name: __("My Address Book"),
  },
  [SETTINGS_SCREEN]: {
    url: "/settings",
    name: __("Settings"),
  },
  // [CONTACT_HELP]: {
  //   url: "/contact-help",
  //   name: __("Contact & Help"),
  // },
};

export class MyAccountContainer extends SourceMyAccountContainer {
  static propTypes = {
    ...SourceMyAccountContainer.propTypes,
    mobileTabActive: PropTypes.bool.isRequired,
    setMobileTabActive: PropTypes.func.isRequired,
    setMeta: PropTypes.func.isRequired,
    updateStoreCredit: PropTypes.func.isRequired,
  };

  tabMap = isMobile.any() ? mobileTabMap : tabMap ;

  componentDidMount() {
    const { setMeta, updateStoreCredit } = this.props;

    updateStoreCredit();
    setMeta({ title: __("My Account") });
  }

  updateBreadcrumbs() {
    const { updateBreadcrumbs } = this.props;
    const { activeTab } = this.state;
    const { url, name, alternativePageName } = tabMap[activeTab];

    updateBreadcrumbs([
      { url: `${MY_ACCOUNT_URL}${url}`, name: alternativePageName || name },
      { name: __("My Account"), url: `${MY_ACCOUNT_URL}/${DASHBOARD}` },
      { name: __("Home"), url: "/" },
    ]);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountContainer);
