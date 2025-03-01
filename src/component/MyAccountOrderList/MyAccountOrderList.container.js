/* eslint-disable no-magic-numbers */
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { MyAccountReturnCreateListContainer as SourceComponent } from "Component/MyAccountReturnCreateList/MyAccountReturnCreateList.container";
import MyAccountDispatcher from "Store/MyAccount/MyAccount.dispatcher";
import { showNotification } from "Store/Notification/Notification.action";

import MyAccountOrderList from "./MyAccountOrderList.component";

import Event, { MOE_trackEvent, EVENT_MYORDERPAGE_VISIT } from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import browserHistory from "Util/History";
import { setLastLimit } from "Store/MyAccount/MyAccount.action";

export const mapStateToProps = (state) => ({
  eddResponse: state.MyAccountReducer.eddResponse,
  myOrderLastOffsetLimit: state.MyAccountReducer.myOrderLastOffsetLimit,
});

export const mapDispatchToProps = (dispatch) => ({
  showErrorNotification: (error) => dispatch(showNotification("error", error)),
  getOrders: (limit, offset) => MyAccountDispatcher.getOrders(limit, offset),
  setLastLimit: (Lastlimit) => dispatch(setLastLimit(Lastlimit)),
});

export class MyAccountOrderListContainer extends SourceComponent {
  static propTypes = {
    ...SourceComponent.propTypes,
    getOrders: PropTypes.func.isRequired,
  };

  state = {
    limit: 15,
    nextOffset: 0,
    orders: [],
    isGetNewOrders: true,
    currentOffset: 0,
  };

  componentDidMount() {
    const { limit } = this.state;
    this.setState({ isLoading: true });

    this.getOrderList(limit);

    window.addEventListener("scroll", this.handleScroll);
    Event.dispatch(EVENT_MYORDERPAGE_VISIT, {
      page: "Orders",
    });

    MOE_trackEvent(EVENT_MYORDERPAGE_VISIT, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      app6thstreet_platform: "Web",
      page: "Orders",
    });

    let prevLocation;
    let finalPrevLocation;
    browserHistory.listen((nextLocation) => {
      finalPrevLocation = prevLocation;
      prevLocation = nextLocation;

      if (!finalPrevLocation?.pathname?.includes("/my-account/my-orders/")) {
        this.props.setLastLimit({ id: null, currentOffset: 0 });
      }
    });
  }

  handleScroll = () => {
    const { isMobile, limit, isLoading, isGetNewOrders } = this.state;
    const windowHeight =
      "innerHeight" in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const { body } = document;
    const html = document.documentElement;
    const footerHeight = !isMobile ? 300 : 0;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;

    if (
      windowBottom + footerHeight >= docHeight &&
      !isLoading &&
      isGetNewOrders
    ) {
      this.setState({ isLoading: true }, () => this.getOrderList(limit));
      this.props.setLastLimit({ id: null, currentOffset: 0 });
    }
  };

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  containerProps = () => {
    const { orders, isLoading, requestInProgress, currentOffset } = this.state;
    const { eddResponse } = this.props;
    return { orders, isLoading, requestInProgress, eddResponse, currentOffset };
  };

  getOrderList(limit = 15) {
    const { getOrders, showErrorNotification } = this.props;
    const { orders, nextOffset, isLoading } = this.state;

    this.setState({ requestInProgress: true });
    const finalOffset =
      this.props?.myOrderLastOffsetLimit?.currentOffset && !isLoading
        ? 0
        : nextOffset;
    const finalLimit =
      this.props?.myOrderLastOffsetLimit?.currentOffset && !isLoading
        ? this.props?.myOrderLastOffsetLimit?.currentOffset
        : limit;

    getOrders(finalLimit, finalOffset)
      .then(({ data, meta }) => {
        this.setState({
          orders: data ? [...orders, ...data] : orders,
          nextOffset: (meta && meta.next_offset) || 0,
          isLoading: false,
          requestInProgress: false,
          limit,
          isGetNewOrders: !!meta.next_offset,
        });
        this.setState({
          currentOffset: meta?.next_offset,
        });
      })
      .catch(() => {
        showErrorNotification(__("Error appeared while fetching orders"));
        this.setState({
          isLoading: false,
          requestInProgress: false,
          isGetNewOrders: false,
        });
      });
  }

  render() {
    return <MyAccountOrderList {...this.containerProps()} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyAccountOrderListContainer);
