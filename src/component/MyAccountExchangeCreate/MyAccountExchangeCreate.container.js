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
    checkIsDisabled: this.checkIsDisabled.bind(this),
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
    selectedAvailProduct: {},
    isOutOfStock: false,
    isArabic: isArabic(),
    prevAlsoAvailable: [],
    exchangeReason: [],
    products: {},
    disabledStatus: true,
    disabledStatusArr: {},
  };

  componentDidMount() {
    this.getExchangableItems();
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedItems, selectedAvailProduct, selectedSizeCodes, reasonId } =
      this.state;
    const {
      selectedItems: prevSelectedItems,
      selectedAvailProduct: prevSelectedAvailProduct,
      selectedSizeCodes: prevSelectedSizeCodes,
      reasonId: prevReasonId,
    } = prevState;
    if (
      JSON.stringify(selectedItems) !== JSON.stringify(prevSelectedItems) ||
      JSON.stringify(selectedAvailProduct) !==
        JSON.stringify(prevSelectedAvailProduct) ||
      JSON.stringify(selectedSizeCodes) !==
        JSON.stringify(prevSelectedSizeCodes) ||
      reasonId !== prevReasonId
    ) {
      this.checkIsDisabled();
    }
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

  getSelectedReason = (item) => {
    const { selectedItems } = this.state;
    let selectedReasonId = "";
    selectedReasonId = selectedItems[item]["reasonId"];
    return selectedReasonId;
  };

  checkIsDisabled() {
    const {
      selectedSizeCodes,
      selectedItems,
      selectedAvailProduct,
      products,
      disabledStatusArr: stateDisabledStatusArr,
    } = this.state;
    const selectedItemsLength = Object.keys(selectedItems).length;
    if (selectedItemsLength === 0) {
      this.setState({
        disabledStatus: true,
      });
    } else {
      Object.keys(products).map((item) => {
        if (this.getSelectedReason(item) === "37309") {
          if (selectedAvailProduct[item] && !stateDisabledStatusArr[item]) {
            this.setState({
              disabledStatusArr: { ...stateDisabledStatusArr, [item]: true },
              disabledStatus: false,
            });
          }
        } else if (
          this.getSelectedReason(item) === "37310" ||
          this.getSelectedReason(item) === "37311"
        ) {
          if (selectedSizeCodes[item] && !stateDisabledStatusArr[item]) {
            this.setState({
              disabledStatus: false,
              disabledStatusArr: { ...stateDisabledStatusArr, [item]: true },
            });
          }
        }
      });
    }
  }

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

  onAvailableProductSelect(event, itemId) {
    const id = event.target.id;
    const {
      selectedAvailProduct: { [itemId]: item },
    } = this.state;

    this.setState(({ selectedAvailProduct }) => ({
      selectedAvailProduct: {
        ...selectedAvailProduct,
        [itemId]: { ...item, id },
      },
    }));
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
    });
  }

  onFormSubmit() {
    const { history, showErrorMessage } = this.props;

    const {
      selectedItems = {},
      items,
      selectedSizeCodes,
      products = {},
      selectedAvailProduct,
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
          const { label = "", id } =
            exchange_reasons.find(({ id }) => id === reasonId) || {};
          const { simple_products: productStock } = products[order_item_id];
          let currentSizeCode = "";
          if (selectedSizeCodes[order_item_id]) {
            currentSizeCode = selectedSizeCodes[order_item_id]["value"];
          } else {
            Object.entries(productStock).filter((product) => {
              let itemCityCode = size["label"];
              if (
                product[1]["size"][`${itemCityCode.toLowerCase()}`] ===
                size["value"]
              ) {
                currentSizeCode = product[0];
              }
            });
          }

          let finalCsku =
            selectedAvailProduct[item_id] && selectedAvailProduct[item_id]["id"]
              ? selectedAvailProduct[item_id]["id"]
              : null;
          let finalSize =
            selectedSizeCodes[item_id] && selectedSizeCodes[item_id]["value"]
              ? selectedSizeCodes[item_id]["value"]
              : null;
          let finalSizeValue = null;
          if (finalSize) {
            finalSizeValue =
              productStock[finalSize].size[`${size["label"].toLowerCase()}`];
          } else {
            finalSizeValue = size["value"];
          }

          return {
            parent_order_item_id: order_item_id,
            exchange_sku: currentSizeCode,
            exchange_csku: finalCsku ? finalCsku : config_sku,
            options: [
              {
                option_id: size["label"].toUpperCase(),
                option_value: finalSizeValue,
              },
            ],
            exchange_qty: 1,
            exchange_reason: id,
          };
        }
      ),
    };
    this.setState({ isLoading: true });
    MagentoAPI.post("exchange/create-order", payload)
      .then(({ order_id, rma_increment_id }) => {
        localStorage.setItem("RmaId", rma_increment_id);
        history.push(`/my-account/exchange-item/create/success/${order_id}`);
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
