// import PropTypes from 'prop-types';
import { PureComponent } from "react";
import { connect } from "react-redux";

import { MatchType } from "Type/Common";
import MagentoAPI from "Util/API/provider/MagentoAPI";

import MyAccountExchangeView from "./MyAccountExchangeView.component";

export const mapStateToProps = (_state) => ({
  customer: _state.MyAccountReducer.customer,
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
    RmaIncrementId: null,
    orderItemGroups: [],
  };

  constructor(props) {
    super(props);

    this.getReturn();
  }

  containerProps = () => {
    const {
      order_id,
      order_increment_id,
      orderIncrementId,
      orderItemGroups,
      RmaIncrementId,
      date,
      items,
      isLoading,
      status,
    } = this.state;
    const { customer, exchangeSuccess } = this.props;
    return {
      orderId: order_id,
      orderNumber: order_increment_id,
      returnNumber: RmaIncrementId,
      orderIncrementId,
      orderItemGroups,
      RmaIncrementId,
      items,
      date,
      isLoading,
      status,
      customer,
      exchangeSuccess,
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
      const {
        data: {
          order_id,
          order_increment_id,
          date,
          status,
          items,
          increment_id: RmaIncrementId,
        },
      } = await MagentoAPI.get(`returns/${exchangeId}`);
      let orderIncrementId = 0;
      let orderItemGroups = [];
     
      if (exchangeSuccess) {
        const {
          data: { increment_id, groups },
        } = await MagentoAPI.get(`orders/${order_id}`);
        orderIncrementId = increment_id;
        orderItemGroups = groups;
      }
      this.setState({
        order_id,
        order_increment_id,
        orderIncrementId,
        RmaIncrementId,
        orderItemGroups,
        date,
        items,
        isLoading: false,
        status,
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
