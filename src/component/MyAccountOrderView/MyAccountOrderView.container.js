import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import {
  STATUS_BEING_PROCESSED,
  STATUS_COMPLETE,
  STATUS_ITEM_CANCELLABLE,
} from "Component/MyAccountOrderListItem/MyAccountOrderListItem.config";
import { HistoryType, MatchType } from "Type/Common";
import { getCountriesForSelect } from "Util/API/endpoint/Config/Config.format";
import { Config } from "Util/API/endpoint/Config/Config.type";
import MagentoAPI from "Util/API/provider/MagentoAPI";

import MyAccountOrderView from "./MyAccountOrderView.component";
import { DISPLAY_DISCOUNT_PERCENTAGE } from "../Price/Price.config";

export const mapStateToProps = (state) => ({
  config: state.AppConfig.config,
  country: state.AppState.country,
});

export const mapDispatchToProps = () => ({});

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
  };

  constructor(props) {
    super(props);

    this.getOrder();
  }

  containerProps = () => {
    const { isLoading, order } = this.state;
    const { history, country } = this.props;

    const displayDiscountPercentage = DISPLAY_DISCOUNT_PERCENTAGE[country];
    return {
      isLoading,
      order,
      history,
      displayDiscountPercentage,
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

  openOrderCancelation() {
    const { history } = this.props;
    const {
      order: { entity_id, status, is_returnable, shipped = [], unship } = {},
    } = this.state;

    // if (
    //   !entity_id ||
    //   !(
    //     STATUS_BEING_PROCESSED.includes(status) ||
    //     (status === STATUS_COMPLETE && is_returnable)
    //   )
    // ) {
    //   return;
    // }

    const is_cancellable = ![
      ...shipped.reduce((acc, { items }) => [...acc, ...items], []),
      ...unship.reduce((acc, { items }) => [...acc, ...items], []),
    ].every((item) => parseInt(item.qty_invoiced, 10) > 0);

    if (!entity_id) {
      return;
    } else if (is_returnable) {
      const url = `/my-account/return-item/create/${entity_id}`;
      history.push(url);
    } else if (STATUS_ITEM_CANCELLABLE.includes(status) && is_cancellable) {
      const url = `/my-account/return-item/cancel/${entity_id}`;
      history.push(url);
    }
    // const url = is_returnable
    //   ? `/my-account/return-item/create/${entity_id}`
    //   : STATUS_ITEM_CANCELLABLE.includes(status) && is_cancellable
    //   ? `/my-account/return-item/cancel/${entity_id}`
    //   : "";
  }

  async getOrder() {
    try {
      const orderId = this.getOrderId();
      const { data: order } = await MagentoAPI.get(`orders/${orderId}`);
      this.setState({ order, isLoading: false });
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
