import { MyAccountTabListItem as SourceMyAccountTabListItem } from "SourceComponent/MyAccountTabListItem/MyAccountTabListItem.component";
import { isArabic } from "Util/App";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { getWalletBalance } from "Util/API/endpoint/Wallet/Wallet.endpoint";
import "./MyAccountTabListItem.component.style.scss";

export const BreadcrumbsDispatcher = import(
  /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
  "Store/Breadcrumbs/Breadcrumbs.dispatcher"
);

export const mapStateToProps = (state) => ({
  breadcrumbs: state.BreadcrumbsReducer.breadcrumbs,
});

export const mapDispatchToProps = (dispatch) => ({
  updateBreadcrumbs: (breadcrumbs) => {
    BreadcrumbsDispatcher.then(({ default: dispatcher }) =>
      dispatcher.update(breadcrumbs, dispatch)
    );
  },
});

export class MyAccountTabListItem extends SourceMyAccountTabListItem {
  state = {
    isArabic: isArabic(),
    totalWalletBalance: null,
  };

  static propTypes = {
    updateBreadcrumbs: PropTypes.func.isRequired,
    breadcrumbs: PropTypes.array.isRequired,
  };

  componentDidMount() {
    const {
      tabEntry: [, { name }],
    } = this.props;
    if (name === __("My Wallet")) {
      this.fetchWalletBalance();
    }
  }

  fetchWalletBalance = async () => {
    try {
      const responseBalance = await getWalletBalance();
      if (responseBalance && responseBalance.success) {
        this.setState({
          totalWalletBalance: responseBalance?.data?.total_balance,
        });
      }
    } catch (error) {}
  };

  updateBreadcrumbs(breadcrumburl, name) {
    const { updateBreadcrumbs } = this.props;

    const breadcrumbs = [
      {
        url: breadcrumburl,
        name: __(name),
      },
      {
        url: "/my-account",
        name: __("My Account"),
      },
      {
        url: "/",
        name: __("Home"),
      },
    ];

    updateBreadcrumbs(breadcrumbs);
  }
  render() {
    const {
      tabEntry: [, { name, linkClassName, className }],
      isActive,
      tabEntry,
      changeActiveTab,
    } = this.props;
    const tabImageId = tabEntry[0];
    const { isArabic, totalWalletBalance } = this.state;
    return (
      <li
        block={
          linkClassName
            ? `MyAccountTabListItem`
            : `MyAccountTabListItem ${className}`
        }
        mods={{ isActive, [linkClassName]: !!linkClassName }}
      >
        <button
          block="MyAccountTabListItem"
          elem="Button"
          mods={{ tabImageId }}
          onClick={() => {
            changeActiveTab(tabEntry[0]);
            this.updateBreadcrumbs(tabEntry[1]?.url, tabEntry[1]?.name);
          }}
          role="link"
        >
          {name === __("Payment Methods") ? (
            <div
              block="MyAccountTabListItem"
              elem="nameElem"
              mods={{ isArabic }}
            >
              <div>{__("Payments")}</div>
              {/* {isMobile.any() ? <StoreCredit /> : null} */}
            </div>
          ) : name === __("My Wallet") ? (
            <span>
              {" "}
              {__("My Wallet")}{" "}
              <span className="WalletBalance"> {totalWalletBalance} </span>
            </span>
          ) : (
            name
          )}
        </button>
      </li>
    );
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MyAccountTabListItem)
);
