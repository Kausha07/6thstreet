import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { isArabic } from "Util/App";

import { showNotification } from "Store/Notification/Notification.action";
import { HistoryType, MatchType } from "Type/Common";
import MagentoAPI from "Util/API/provider/MagentoAPI";

import MyAccountExchangeCreate from "./MyAccountExchangeCreate.component";

export const mapStateToProps = () => ({});

export const mapDispatchToProps = (dispatch) => ({
  showErrorMessage: (message) => dispatch(showNotification("error", message)),
});

export class MyAccountExchangeCreateContainer extends PureComponent {
  static propTypes = {
    match: MatchType.isRequired,
    history: HistoryType.isRequired,
    showErrorMessage: PropTypes.func.isRequired,
  };

  containerFunctions = {
    onFormSubmit: this.onFormSubmit.bind(this),
    onSizeSelect: this.onSizeSelect.bind(this),
    onSizeTypeSelect: this.onSizeTypeSelect.bind(this),
    onAvailableProductSelect: this.onAvailableProductSelect.bind(this),
    onItemClick: this.onItemClick.bind(this),
    onReasonChange: this.onReasonChange.bind(this),
    handleDiscardClick: this.onDiscardClick.bind(this),
  };

  state = {
    selectedItems: {},
    isLoading: true,
    incrementId: "",
    items: [],
    resolutionId: null,
    reasonId: 0,
    selectedSizeCode: "",
    selectedSizeType: "eu",
    selectedAvailProduct: "",
    isOutOfStock: false,
    isArabic: isArabic(),
    prevAlsoAvailable: [],
    exchangeReason: [],
  };

  componentDidMount() {
    // this.setSizeData();
    this.getExchangableItems();
  }

  containerProps = () => {
    const { history, product } = this.props;
    const {
      isLoading,
      incrementId,
      items,
      selectedItems = {},
      resolutions,
      resolutionId,
      reasonId,
    } = this.state;

    return {
      isLoading,
      incrementId,
      items,
      selectedNumber: Object.keys(selectedItems).length,
      history,
      resolutions,
      resolutionId,
      reasonId,
      product,
    };
  };

  onSizeSelect(value, outOfStockVal) {
    this.setState({
      selectedSizeCode: value,
      isOutOfStock: outOfStockVal,
    });
  }

  onSizeTypeSelect(type) {
    this.setState({
      selectedSizeType: type.target.value,
    });
  }

  onAvailableProductSelect(event) {
    const { selectedAvailProduct } = this.state;
    if (selectedAvailProduct === event.target.id) {
      this.setState({
        selectedAvailProduct: "",
      });
    } else {
      this.setState({
        selectedAvailProduct: event.target.id,
      });
    }
  }

  onDiscardClick() {
    const { history } = this.props;
    const orderId = this.getOrderId();
    history.push(`/my-account/my-orders/${orderId}`);
  }

  getOrderId() {
    const { match: { params: { order } = {} } = {} } = this.props;

    return order;
  }

  getExchangableItems() {
    const {
      location: { state },
    } = this.props;
    if (state && state.orderDetails) {
      const { groups = [], increment_id } = state.orderDetails;
      let filteredItems = [];
      groups.map((group) => {
        group.items.map((item) => {
          if (item.is_exchangeable) {
            filteredItems.push(item);
          }
        });
      });
      this.setState({
        items: filteredItems,
        incrementId: increment_id,
        isLoading: false,
      });
    }
  }

  onItemClick(itemId, isSelected) {
    this.setState(({ selectedItems }) => {
      if (!isSelected) {
        // eslint-disable-next-line no-unused-vars
        const { [itemId]: _, ...newSelectedItems } = selectedItems;
        return { selectedItems: newSelectedItems };
      }

      return { selectedItems: { ...selectedItems, [itemId]: false } };
    });
  }

  onReasonChange(itemId, reasonId) {
    const {
      selectedItems: { [itemId]: item },
    } = this.state;

    this.setState(({ selectedItems }) => ({
      selectedItems: { ...selectedItems, [itemId]: { ...item, reasonId } },
    }));

    this.setState({
      reasonId: reasonId,
      selectedSizeCode: "",
      selectedSizeType: "eu",
      selectedAvailProduct: "",
    });
  }

  onFormSubmit() {
    const { history, showErrorMessage } = this.props;
    const { selectedItems = {}, items, resolutionId } = this.state;
    const payload = {
      order_id: this.getOrderId(),
      items: Object.entries(selectedItems).map(
        ([order_item_id, { reasonId, resolutionIdd }]) => {
          const { qty_shipped = 0 } =
            items.find(({ item_id }) => item_id === order_item_id) || {};

          return {
            order_item_id,
            qty_requested: qty_shipped,
            resolution: {
              id: resolutionId,
              data: null,
            },
            reason: {
              id: reasonId,
              data: null,
            },
          };
        }
      ),
    };
    this.setState({ isLoading: true });

    MagentoAPI.post("exchange/request", payload)
      .then(({ data: { id } }) => {
        history.push(`/my-account/exchange-item/create/success/${id}`);
      })
      .catch(() => {
        showErrorMessage(__("Error appeared while requesting a exchange"));
        this.setState({ isLoading: false });
      });
  }

  render() {
    return (
      <MyAccountExchangeCreate
        {...this.state}
        {...this.props}
        {...this.containerFunctions}
        {...this.containerProps()}
      />
    );
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MyAccountExchangeCreateContainer)
);
