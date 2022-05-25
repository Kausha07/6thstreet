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
    selectedSizeCodes: {},
    selectedSizeType: "eu",
    selectedAvailProduct: "",
    isOutOfStock: false,
    isArabic: isArabic(),
    prevAlsoAvailable: [],
    exchangeReason: [],
    products: {},
  };

  componentDidMount() {
    this.getExchangableItems();
  }

  containerProps = () => {
    const { history } = this.props;
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
    };
  };

  onSizeSelect(value, outOfStockVal, itemId) {
    const {
      selectedSizeCodes: { [itemId]: item },
    } = this.state;

    this.setState(({ selectedSizeCodes }) => ({
      selectedSizeCodes: { ...selectedSizeCodes, [itemId]: { ...item, value } },
      isOutOfStock: outOfStockVal,
    }));
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

  setOrderItem = (product, itemId, isSelected) => {
    const { products } = this.state;
    if (isSelected) {
      this.setState({
        products: {
          ...products,
          [itemId]: false,
        },
      });
    } else {
      this.setState({
        products: {
          ...products,
          [itemId]: product,
        },
      });
    }
  };
  onItemClick(itemId, isSelected, product) {
    this.setState(({ selectedItems }) => {
      if (!isSelected) {
        // eslint-disable-next-line no-unused-vars
        this.setOrderItem(product, itemId, true);
        const { [itemId]: _, ...newSelectedItems } = selectedItems;
        return { selectedItems: newSelectedItems };
      }

      this.setOrderItem(product, itemId, false);
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

    const {
      selectedItems = {},
      items,
      selectedSizeCodes,
      products = {},
    } = this.state;
    const payload = {
      parent_order_id: this.getOrderId(),
      items: Object.entries(selectedItems).map(
        ([order_item_id, { reasonId }]) => {
          const {
            size = {},
            config_sku,
            exchange_reasons,
            item_id,
          } = items.find(({ item_id }) => item_id === order_item_id) || {};
          const { label = "" } =
            exchange_reasons.find(({ id }) => id === reasonId) || {};
          const { simple_products: productStock } = products[order_item_id];
          let currentSizeCode = "";
          Object.keys(selectedSizeCodes).filter((sizeCode) => {
            if (sizeCode === order_item_id) {
              currentSizeCode = selectedSizeCodes[sizeCode]["value"];
            }
          });
          let sizeValue =
            productStock[currentSizeCode].size[
              `${size["label"].toLowerCase()}`
            ];
          return {
            parent_order_item_id: order_item_id,
            exchange_sku: currentSizeCode,
            exchange_csku: config_sku,
            options: [
              {
                option_id: size["label"].toUpperCase(),
                option_value: sizeValue,
              },
            ],
            exchange_qty: 1,
            exchange_reason: label,
          };
        }
      ),
    };
    this.setState({ isLoading: true });
    console.log("muskan----->", payload);

    // const res = {
    //   order_id: order_id,
    //   increment_id: increment_id,
    //   created_at: created_at,
    //   rma_increment_id: '23444241',
    //   items: {
    //     "10000869-BLACK": {
    //       original_price: 299,
    //       price: "209.0000"
    //     },
    //     "DSW-428998-BRIGHT-MULTI": {
    //       original_price: 125,
    //       price: "9.0000"
    //     }
    //   }
    // }
    // MagentoAPI.post("exchange/create-order", payload)
    //   .then(({ data: { id, order_id } }) => {
    //     history.push(`/my-account/exchange-item/create/success/${order_id}`);
    //   })
    //   .catch(() => {
    //     showErrorMessage(__("Error appeared while requesting a exchange"));
    //     this.setState({ isLoading: false });
    //   });
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
