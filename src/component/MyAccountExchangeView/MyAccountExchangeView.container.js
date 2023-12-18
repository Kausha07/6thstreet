// import PropTypes from 'prop-types';
import { PureComponent } from "react";
import { connect } from "react-redux";

import { MatchType } from "Type/Common";
import MagentoAPI from "Util/API/provider/MagentoAPI";

import MyAccountExchangeView from "./MyAccountExchangeView.component";
import MobileAPI from "Util/API/provider/MobileAPI";

export const mapStateToProps = (_state) => ({
  customer: _state.MyAccountReducer.customer,
  edd_info: _state.AppConfig.edd_info,
});

export const mapDispatchToProps = (_dispatch) => ({
  // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class MyAccountExchangeViewContainer extends PureComponent {
  static propTypes = {
    match: MatchType.isRequired,
  };

  containerFunctions = {
    // getData: this.getData.bind(this)
  };

  state = {
    isLoading: true,
    order_id: null,
    order_increment_id: null,
    date: null,
    items: [],
    orderIncrementId: null,
    parentOrderIncrementId: null,
    orderItemGroups: [],
  };

  constructor(props) {
    super(props);

  }

  componentDidMount(){
    this.getReturn();
  }

  containerProps = () => {
    const {
      order_id,
      order_increment_id,
      orderIncrementId,
      parentOrderIncrementId,
      orderItemGroups,
      date,
      items,
      isLoading,
      status,
    } = this.state;
    const { customer, exchangeSuccess, edd_info, } = this.props;
    return {
      orderId: order_id,
      orderNumber: order_increment_id,
      returnNumber: localStorage.getItem('RmaId'),
      orderIncrementId,
      parentOrderIncrementId,
      orderItemGroups,
      items,
      date,
      isLoading,
      status,
      customer,
      exchangeSuccess,
      edd_info,
    };
  };

  getExchangeId() {
    const { match: { params: { exchange: exchangeItem } = {} } = {} } =
      this.props;
    return exchangeItem;
  }

  async getReturn() {
    const { exchangeSuccess } = this.props;
    try {
      const exchangeId = this.getExchangeId();
      let resData = {};
      if (!exchangeSuccess) {
        const { data } = await MobileAPI.get(`returns/${exchangeId}`);
        resData = data;
      }
      const {
        order_id,
        order_increment_id,
        date,
        status,
        items,
        increment_id: RmaIncrementId,
      } = resData || {};
      if (exchangeSuccess) {
        const { data } = await MobileAPI.get(`orders/${exchangeId}`);
        resData = data;
      }
      const {
        increment_id: orderIncrementId,
        parent_increment_id: parentOrderIncrementId,
        groups: orderItemGroups,
        order_id: ordersId,
        created_at: orderDate,
        status: orderStatus,
      } = resData || {};
      this.setState({
        order_id: order_id || ordersId,
        order_increment_id,
        orderIncrementId,
        parentOrderIncrementId,
        orderItemGroups,
        date: date || orderDate,
        items,
        isLoading: false,
        status: status || orderStatus,
      });
    } catch (e) {
      this.setState({ isLoading: false });
    }
  }

  render() {
    return (
      <MyAccountExchangeView
        {...this.containerFunctions}
        {...this.containerProps()}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyAccountExchangeViewContainer);
