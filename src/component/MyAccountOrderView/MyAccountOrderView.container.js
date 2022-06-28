import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import {
  STATUS_BEING_PROCESSED,
  STATUS_COMPLETE,
  STATUS_SUCCESS
} from "Component/MyAccountOrderListItem/MyAccountOrderListItem.config";
import { HistoryType, MatchType } from "Type/Common";
import { getCountriesForSelect } from "Util/API/endpoint/Config/Config.format";
import { Config } from "Util/API/endpoint/Config/Config.type";
import MobileAPI from "Util/API/provider/MobileAPI";
import {
  RETURN_ITEM_LABEL,
  EXCHANGE_ITEM_LABEL,
  CANCEL_ORDER_LABEL,
} from "./MyAccountOrderView.config";
import MyAccountOrderView from "./MyAccountOrderView.component";
import MagentoAPI from "Util/API/provider/MagentoAPI";
import { showNotification } from "Store/Notification/Notification.action";

export const mapStateToProps = (state) => ({
  config: state.AppConfig.config,
  country: state.AppState.country,
  eddResponse: state.MyAccountReducer.eddResponse,
  edd_info: state.AppConfig.edd_info,
});

export const mapDispatchToProps = () => ({
  showErrorMessage: (message) => dispatch(showNotification("error", message)),
});

export class MyAccountOrderViewContainer extends PureComponent {
  static propTypes = {
    match: MatchType.isRequired,
    config: Config.isRequired,
    history: HistoryType.isRequired,
    country: PropTypes.string.isRequired,
  };

  containerFunctions = {
    getCountryNameById: this.getCountryNameById.bind(this),
    openOrderCancelation: this.openOrderCancelation.bind(this),
  };

  state = {
    isLoading: true,
    order: null,
    entity_id: null,
  };

  constructor(props) {
    super(props);

    this.getOrder();
  }

  containerProps = () => {
    const { isLoading, order } = this.state;
    const { history, country, eddResponse, edd_info } = this.props;

    return {
      isLoading,
      order,
      history,
      eddResponse,
      edd_info,
    };
  };

  getCountryNameById(countryId) {
    const { config } = this.props;
    const countries = getCountriesForSelect(config);

    return (countries.find(({ id }) => id === countryId) || {}).label || "";
  }

  getOrderId() {
    const { match: { params: { order } = {} } = {} } = this.props;
    return order;
  }

  openOrderCancelation(itemStatus = "") {
    const { history } = this.props;
    const {
      order: { status, is_returnable, is_exchangeable } = {},
      order,
      entity_id,
    } = this.state;
    if (itemStatus === CANCEL_ORDER_LABEL) {
      this.cancelExchangeOrder(order);
    } else {
      if (
        !entity_id ||
        !(
          STATUS_BEING_PROCESSED.includes(status) ||
          (status === STATUS_COMPLETE && is_returnable) ||
          (status === STATUS_COMPLETE && is_exchangeable)
        )
      ) {
        return;
      }

      const url =
        (status === STATUS_COMPLETE ||  STATUS_SUCCESS.includes(status)) && itemStatus === EXCHANGE_ITEM_LABEL
          ? `/my-account/exchange-item/create/${entity_id}`
          : status === STATUS_COMPLETE || itemStatus === RETURN_ITEM_LABEL
            ? `/my-account/return-item/create/${entity_id}`
            : `/my-account/return-item/cancel/${entity_id}`;

      history.push(url, { orderDetails: order });
    }
  }

  cancelExchangeOrder(order) {
    const { increment_id, groups } = order;
    const allItems = [
      ...groups.reduce((acc, { items }) => [...acc, ...items], []),
    ];
    const { showErrorMessage, history } = this.props;
    const payload = {
      order_id: increment_id,
      items: allItems.map((item) => {
        const { item_id, qty } = item;
        return {
          item_id: item_id,
          qty: qty,
          reason: "Exchange Cancel",
        };
      }),
      return_to_store_credit: 0,
    };
    this.setState({ isLoading: true });

    MagentoAPI.post("recan/commitRecan", payload)
      .then((response) => {
        if (!!!response?.success) {
          if (typeof response === "string") {
            this.setState({ isLoading: false });
            showErrorMessage(response);
          } else {
            showErrorMessage(
              __("Error appeared while requesting a cancelation")
            );
          }
        } else {
          this.getOrder()
        }
      })
      .catch(() => {
        showErrorMessage(__("Error appeared while requesting a cancelation"));
        this.setState({ isLoading: false });
      });
  }

  async getOrder() {
    try {
      const orderId = this.getOrderId();
      const { data: order } = await MobileAPI.get(`orders/${orderId}`);
      this.setState({ order, isLoading: false, entity_id: orderId });
    } catch (e) {
      this.setState({ isLoading: false });
    }
  }

  render() {
    return (
      <MyAccountOrderView
        {...this.containerFunctions}
        {...this.containerProps()}
      />
    );
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MyAccountOrderViewContainer)
);
