import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { isArabic } from "Util/App";
import MyAccountDispatcher from "Store/MyAccount/MyAccount.dispatcher";
import { showNotification } from "Store/Notification/Notification.action";
import { HistoryType, MatchType } from "Type/Common";
import MagentoAPI from "Util/API/provider/MagentoAPI";
import PDPDispatcher from "Store/PDP/PDP.dispatcher";
import { NOTIFY_EMAIL } from "../PDPAddToCart/PDPAddToCard.config";
import { ONE_MONTH_IN_SECONDS } from "Util/Request/QueryDispatcher";
import BrowserDatabase from "Util/BrowserDatabase";

import MyAccountExchangeCreate from "./MyAccountExchangeCreate.component";

export const mapStateToProps = (state) => ({
  product: state.PDP.product,
  locale: state.AppState.locale,
  customer: state.MyAccountReducer.customer,
  guestUserEmail: state.MyAccountReducer.guestUserEmail,
});

export const mapDispatchToProps = (dispatch) => ({
  showErrorMessage: (message) => dispatch(showNotification("error", message)),
  showNotification: (type, message) =>
    dispatch(showNotification(type, message)),
  setGuestUserEmail: (email) =>
    MyAccountDispatcher.setGuestUserEmail(dispatch, email),
  sendNotifyMeEmail: (data) => PDPDispatcher.sendNotifyMeEmail(data),
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
    sendNotifyMeEmail: this.sendNotifyMeEmail.bind(this),
    onAvailableProductSelect: this.onAvailableProductSelect.bind(this),
    onItemClick: this.onItemClick.bind(this),
    setAvailableProduct: this.setAvailableProduct.bind(this),
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
    isOutOfStock: {},
    notifyMeSuccess: false,
    notifyMeLoading: false,
    isArabic: isArabic(),
    prevAlsoAvailable: [],
    exchangeReason: [],
    products: {},
    disabledStatus: true,
    disabledStatusArr: {},
    availableProducts: {},
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
      isOutOfStock,
    } = this.state;

    this.setState(({ selectedSizeCodes }) => ({
      selectedSizeCodes: { ...selectedSizeCodes, [itemId]: { ...item, value } },
      isOutOfStock: {
        ...isOutOfStock,
        [itemId]: outOfStockVal,
      },
      notifyMeSuccess: false,
    }));
  }

  onSizeTypeSelect(type) {
    this.setState({
      selectedSizeType: type.target.value,
    });
  }

  onAvailableProductSelect(id, itemId) {
    const {
      selectedAvailProduct: { [itemId]: item },
      selectedAvailProduct,
    } = this.state;
    if (
      selectedAvailProduct[itemId] &&
      selectedAvailProduct[itemId].id === id
    ) {
      this.setState(({ selectedAvailProduct }) => ({
        selectedAvailProduct: {
          ...selectedAvailProduct,
          [itemId]: false,
        },
      }));
    } else {
      this.setState(({ selectedAvailProduct }) => ({
        selectedAvailProduct: {
          ...selectedAvailProduct,
          [itemId]: { ...item, id },
        },
      }));
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
      disabledStatusArr,
    } = this.state;

    this.setState(({ selectedItems }) => ({
      selectedItems: { ...selectedItems, [itemId]: { ...item, reasonId } },
    }));
    let itemArr = disabledStatusArr;
    delete itemArr[itemId];
    this.setState({
      reasonId: reasonId,
      disabledStatusArr: itemArr,
    });
  }

  sendNotifyMeEmail(email, itemId) {
    const { locale, sendNotifyMeEmail, showNotification, customer } =
      this.props;
    const { selectedSizeCodes, products } = this.state;
    let data = {
      email,
      sku: selectedSizeCodes[itemId].value || products[itemId].sku,
      locale,
    };

    this.setState({ notifyMeLoading: true });

    sendNotifyMeEmail(data).then((response) => {
      if (response && response.success) {
        if (!(customer && customer.email)) {
          BrowserDatabase.setItem(email, NOTIFY_EMAIL, ONE_MONTH_IN_SECONDS);
        }
        //if success
        if (response.message) {
          showNotification("error", response.message);
          this.setState({
            notifyMeSuccess: false,
            isOutOfStock: true,
          });
        } else {
          this.setState({
            notifyMeSuccess: true,
            isOutOfStock: true,
          });

          if (customer && customer.id) {
            //if user is logged in then change email
            const loginEvent = new CustomEvent("userLogin");
            window.dispatchEvent(loginEvent);
          }
          setTimeout(() => {
            this.setState({
              notifyMeSuccess: false,
              isOutOfStock: true,
            });
          }, 4000);
        }
      } else {
        //if error
        showNotification("error", __("Something went wrong."));
      }
      this.setState({ notifyMeLoading: false });
    });
  }

  setAvailableProduct(products, itemId) {
    const { availableProducts } = this.state;
    this.setState({
      availableProducts: { ...availableProducts, [itemId]: products },
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
      availableProducts = {},
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
            exchangeable_qty
          } = items.find(({ item_id }) => item_id === order_item_id) || {};
          const { id } =
            exchange_reasons.find(({ id }) => id === reasonId) || {};
          let availProduct = null;

          if (
            selectedAvailProduct[order_item_id] &&
            selectedAvailProduct[order_item_id].id !== false
          ) {
            if (Object.keys(availableProducts).length > 0) {
              Object.values(availableProducts).filter((product) => {
                Object.values(product).map((entry) => {
                  if (entry.sku === selectedAvailProduct[order_item_id]["id"]) {
                    availProduct = entry;
                  }
                });
              });
            }
          }
          const { simple_products: productStock } =
            selectedAvailProduct[order_item_id] &&
            selectedAvailProduct[order_item_id].id !== false
              ? availProduct
              : products[order_item_id];

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
            finalSizeValue = productStock[finalSize]
              ? productStock[finalSize].size[`${size["label"].toLowerCase()}`]
              : size["value"];
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
            exchange_qty: +exchangeable_qty,
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
