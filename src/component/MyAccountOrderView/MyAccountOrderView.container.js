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
import {
  RETURN_ITEM_LABEL,
} from "./MyAccountOrderView.config";
import MyAccountOrderView from "./MyAccountOrderView.component";
import {
  ADDRESS_POPUP_ID,
} from "Component/MyAccountAddressPopup/MyAccountAddressPopup.config";
import { showPopup } from "Store/Popup/Popup.action";

export const mapStateToProps = (state) => ({
  config: state.AppConfig.config,
  country: state.AppState.country,
  eddResponse: state.MyAccountReducer.eddResponse,
  edd_info: state.AppConfig.edd_info,
});

export const mapDispatchToProps = (dispatch) => ({
  showPopup: (payload) => dispatch(showPopup(ADDRESS_POPUP_ID, payload)),
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

  openOrderCancelation(itemStatus = '') {
    const { history,showPopup } = this.props;
    const { order: { status, is_returnable } = {}, entity_id } = this.state;

    if (
      !entity_id ||
      !(
        STATUS_BEING_PROCESSED.includes(status) ||
        (status === STATUS_COMPLETE && is_returnable)
      )
    ) {
      return;
    }

    const url = `/my-account/return-item/cancel/${entity_id}`;
    
    if(status === STATUS_COMPLETE || itemStatus === RETURN_ITEM_LABEL){
      showPopup({});
      history.push("/my-account/return-item/pick-up-address",{orderId : entity_id});
    }else{
      history.push(url);
    }
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
