import Loader from "Component/Loader";
import { connect } from "react-redux";
import MyAccountOrderListItem from "Component/MyAccountOrderListItem";
import { MyAccountReturnCreateList as SourceComponent } from "Component/MyAccountReturnCreateList/MyAccountReturnCreateList.component";
import isMobile from "Util/Mobile";

import "./MyAccountOrderList.style";

export const mapStateToProps = (state) => ({
  myOrderLastOffsetLimit: state.MyAccountReducer.myOrderLastOffsetLimit,
});

class MyAccountOrderList extends SourceComponent {
  constructor(props) {
    super(props);
    this.orderItemRefs = {};
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.orders !== null &&
      prevProps.orders !== this.props.orders &&
      this.props?.myOrderLastOffsetLimit?.id
    ) {
      this.scrollToOrder(this.props?.myOrderLastOffsetLimit?.id);
    }
  }

  scrollToOrder = (orderId) => {
    const orderRef = this.orderItemRefs?.[orderId];
    if (orderRef) {
      setTimeout(() => {
        const elementRect = orderRef.getBoundingClientRect();
        const elementTop = elementRect.top + window.scrollY;
        const headerOffset = isMobile.any() ? 70 : 160;
        const scrollToOffset = elementTop - headerOffset;
        window.scrollTo({ top: scrollToOffset, behavior: "smooth" });
      }, 100);
    }
  };

  renderOrder = (order) => {
    const { increment_id } = order;
    const { eddResponse } = this.props;
    return (
      <div ref={(ref) => (this.orderItemRefs[increment_id] = ref)}>
        <MyAccountOrderListItem
          order={order}
          eddResponse={eddResponse}
          key={increment_id}
          currentOffset={this.props.currentOffset}
          increment_id={increment_id}
        />
      </div>
    );
  };

  renderNoOrders() {
    return <p>{__("No orders")}</p>;
  }

  renderOrders() {
    const { orders = [], isLoading } = this.props;

    if (!orders.length && isLoading) {
      return null;
    }

    if (!orders.length && !isLoading) {
      return this.renderNoOrders();
    }

    return orders.map(this.renderOrder);
  }

  renderLoader() {
    const { isLoading } = this.props;

    return <Loader isLoading={isLoading} />;
  }

  renderMoreItems() {
    const { requestInProgress } = this.props;

    if (requestInProgress) {
      return (
        <div block="MyAccountOrderList" elem="MoreOrders">
          Loading more orders...
        </div>
      );
    }

    return null;
  }

  render() {
    return (
      <div block="MyAccountOrderList">
        {this.renderOrders()}
        {this.renderLoader()}
        {this.renderMoreItems()}
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(MyAccountOrderList);
