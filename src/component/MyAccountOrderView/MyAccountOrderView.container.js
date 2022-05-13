import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import {
  STATUS_BEING_PROCESSED,
  STATUS_COMPLETE,
} from "Component/MyAccountOrderListItem/MyAccountOrderListItem.config";
import { HistoryType, MatchType } from "Type/Common";
import { getCountriesForSelect } from "Util/API/endpoint/Config/Config.format";
import { Config } from "Util/API/endpoint/Config/Config.type";
import MobileAPI from "Util/API/provider/MobileAPI";
import { RETURN_ITEM_LABEL,EXCHANGE_ITEM_LABEL } from "./MyAccountOrderView.config";
import MyAccountOrderView from "./MyAccountOrderView.component";

export const mapStateToProps = (state) => ({
  config: state.AppConfig.config,
  country: state.AppState.country,
  eddResponse: state.MyAccountReducer.eddResponse,
  edd_info: state.AppConfig.edd_info,
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
    entity_id: null,
  };

  constructor(props) {
    super(props);

    this.getOrder();
  }

  containerProps = () => {
    const { isLoading, order } = this.state;
    const { history, country,eddResponse ,edd_info} = this.props;

    return {
      isLoading,
      order,
      history,
      eddResponse,
      edd_info
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
    const { order: { status, is_returnable, is_exchangable } = {}, entity_id } =
      this.state;
    if (
      !entity_id ||
      !(
        STATUS_BEING_PROCESSED.includes(status) ||
        (status === STATUS_COMPLETE && is_returnable) ||
        (status === STATUS_COMPLETE && is_exchangable)
      )
    ) {
      return;
    }
    console.log("muskan3", this.state.order);

    const url =
      status === STATUS_COMPLETE && itemStatus === EXCHANGE_ITEM_LABEL
        ? `/my-account/exchange-item/create/${entity_id}`
        : status === STATUS_COMPLETE || itemStatus === RETURN_ITEM_LABEL
        ? `/my-account/return-item/create/${entity_id}`
        : `/my-account/return-item/cancel/${entity_id}`;

    history.push(url);
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
