import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import {
  STATUS_BEING_PROCESSED,
  STATUS_COMPLETE,
  STATUS_ABLE_TO_EXCHANGE
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
import {
  ADDRESS_POPUP_ID,
} from "Component/MyAccountAddressPopup/MyAccountAddressPopup.config";
import { showPopup } from "Store/Popup/Popup.action";
import MagentoAPI from "Util/API/provider/MagentoAPI";
import { showNotification } from "Store/Notification/Notification.action";
import { getStarRating } from "Util/API/endpoint/MyAccount/MyAccount.enpoint";
import Event, { MOE_trackEvent, EVENT_ORDERDETAILPAGE_VISIT, EVENT_ORDERDETAILPAGE_CHANNEL } from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl, getQueryParam } from "Util/Url";

export const mapStateToProps = (state) => ({
  config: state.AppConfig.config,
  country: state.AppState.country,
  eddResponse: state.MyAccountReducer.eddResponse,
  edd_info: state.AppConfig.edd_info,
  is_exchange_enabled: state.AppConfig.is_exchange_enabled,
  ctcReturnEnabled:state.AppConfig.ctcReturnEnabled,
  international_shipping_fee: state.AppConfig.international_shipping_fee,
  isProductRatingEnabled: state.AppConfig.isProductRatingEnabled,
  vwoData: state.AppConfig.vwoData,
});

export const mapDispatchToProps = (dispatch) => ({
  showPopup: (payload) => dispatch(showPopup(ADDRESS_POPUP_ID, payload)),
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
    updateRating: this.updateRating.bind(this),
  };

  state = {
    isLoading: true,
    order: null,
    entity_id: null,
    productsRating: {}
  };

  constructor(props) {
    super(props);
    this.getOrder();
  }

  componentDidMount() {

    const channel = getQueryParam("utm_source", location) || "Organic";

    Event.dispatch(EVENT_ORDERDETAILPAGE_VISIT, {
      page: "OrderDetails",
    });

    MOE_trackEvent(EVENT_ORDERDETAILPAGE_VISIT, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      app6thstreet_platform: "Web",
      page: "OrderDetails",
    });
    
    Event.dispatch(EVENT_ORDERDETAILPAGE_CHANNEL, {
      page: "OrderDetails",
      channel: channel,
    });

    MOE_trackEvent(EVENT_ORDERDETAILPAGE_CHANNEL, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      app6thstreet_platform: "Web",
      page: "OrderDetails",
      channel: channel,
    });

  }

  containerProps = () => {
    const { isLoading, order, productsRating } = this.state;
    const {
      history,
      country,
      eddResponse,
      edd_info,
      is_exchange_enabled,
      international_shipping_fee,
      isProductRatingEnabled,
      config,
      vwoData,
    } = this.props;
    const countryCode = getCountryFromUrl();
    const isSidewideCouponEnabled =
      vwoData?.SiteWideCoupon?.isFeatureEnabled || false;

    return {
      isLoading,
      order,
      history,
      eddResponse,
      edd_info,
      is_exchange_enabled,
      international_shipping_fee,
      productsRating,
      isProductRatingEnabled,
      isSidewideCouponEnabled,
    };
  };

  updateRating(sku, rating){
    let ratings = {...this.state.productsRating};
    ratings[sku] = rating;    
    this.setState({productsRating : ratings})
  }
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
    const { history,ctcReturnEnabled = false } = this.props;
    const { order: { status, is_returnable, pickup_address_required } = {}, entity_id, order } = this.state;

    if (itemStatus === CANCEL_ORDER_LABEL) {
      this.cancelExchangeOrder(order);
    } else {
      const url =
        itemStatus === EXCHANGE_ITEM_LABEL
          ? `/my-account/exchange-item/create/${entity_id}`
          : itemStatus === RETURN_ITEM_LABEL
            ? `/my-account/return-item/create/${entity_id}`
            : `/my-account/return-item/cancel/${entity_id}`;
      if (itemStatus === RETURN_ITEM_LABEL) {
        if (pickup_address_required && ctcReturnEnabled) {
          showPopup({});
          history.push("/my-account/return-item/pick-up-address", { orderId: entity_id, orderDetails: order });
        } else {
          history.push(url, { orderDetails: order });
        }
      }
      else {
        history.push(url, { orderDetails: order });
      }
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
      const itemsGroups = (order.groups.filter(group => group.status === "delivery_successful")).map(group => group.items);

      
      let productRatingsResp = {};
      if(this.props.isProductRatingEnabled){
        let productSkuIds = [];
        itemsGroups.map(items => {
          items.map(item => {
            productSkuIds.push(item.sku);
          })
        })
        if(productSkuIds.length > 0){
          await getStarRating({ "product_sku_ids": productSkuIds }).then((resp)=>{
            if(!resp.status){
              productRatingsResp = resp;
            }
          })
        }
        
      }
      
      this.setState({ order, isLoading: false, entity_id: orderId, productsRating: productRatingsResp });
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
