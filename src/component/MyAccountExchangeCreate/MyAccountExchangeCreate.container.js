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
    sizeObject: {},
    selectedSizeCode: "",
    selectedSizeType: "eu",
    selectedAvailProduct: "",
    isOutOfStock: false,
    isArabic: isArabic(),
    alsoAvailable: [],
    prevAlsoAvailable: [],
    exchangeReason: [],
  };

  componentDidMount() {
    this.setSizeData();
    this.getExchangableItems();
  }

  static getDerivedStateFromProps(props, state) {
    const { product } = props;

    const { alsoAvailable, prevAlsoAvailable } = state;

    const derivedState = {};

    if (prevAlsoAvailable !== product["6s_also_available"]) {
      Object.assign(derivedState, {
        alsoAvailable: product["6s_also_available"],
        prevAlsoAvailable: alsoAvailable !== undefined ? alsoAvailable : null,
      });
    }
    return Object.keys(derivedState).length ? derivedState : null;
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

  setSizeData = () => {
    const { product } = this.props;

    if (product.simple_products !== undefined) {
      const { simple_products, size_eu } = product;

      const filteredProductKeys = Object.keys(simple_products)
        .reduce((acc, key) => {
          const {
            size: { eu: productSize },
          } = simple_products[key];
          acc.push([size_eu.indexOf(productSize), key]);
          return acc;
        }, [])
        .sort((a, b) => {
          if (a[0] < b[0]) {
            return -1;
          }
          if (a[0] > b[0]) {
            return 1;
          }
          return 0;
        })
        .reduce((acc, item) => {
          acc.push(item[1]);
          return acc;
        }, []);

      const filteredProductSizeKeys = Object.keys(
        product.simple_products[filteredProductKeys[0]].size || {}
      );

      let object = {
        sizeCodes: filteredProductKeys || [],
        sizeTypes: filteredProductSizeKeys?.length ? ["eu", "uk", "us"] : [],
      };

      const allSizes = Object.entries(simple_products).reduce((acc, size) => {
        const sizeCode = size[0];
        const { quantity } = size[1];

        if (quantity !== null && quantity !== undefined) {
          acc.push(sizeCode);
        }

        return acc;
      }, []);

      object.sizeCodes = allSizes;

      if (
        filteredProductKeys.length <= 1 &&
        filteredProductSizeKeys.length === 0
      ) {
        this.setState({
          insertedSizeStatus: false,
          sizeObject: object,
        });
        return;
      }

      if (
        filteredProductKeys.length > 1 &&
        filteredProductSizeKeys.length === 0
      ) {
        const object = {
          sizeCodes: [filteredProductKeys[1]],
          sizeTypes: filteredProductSizeKeys,
        };

        this.setState({
          insertedSizeStatus: false,
          sizeObject: object,
        });
        return;
      }

      this.setState({
        sizeObject: object,
      });
      return;
    }
    this.setState({
      insertedSizeStatus: false,
      sizeObject: {
        sizeCodes: [],
        sizeTypes: [],
      },
    });
    return;
  };

  onSizeSelect({ target }) {
    const { value } = target;
    const {
      product: { simple_products: productStock },
    } = this.props;
    const { isOutOfStock } = this.state;
    let outOfStockVal = isOutOfStock;
    if (productStock && productStock[value]) {
      const selectedSize = productStock[value];
      if (
        selectedSize["quantity"] !== undefined &&
        selectedSize["quantity"] !== null &&
        (typeof selectedSize["quantity"] === "string"
          ? parseInt(selectedSize["quantity"], 0) === 0
          : selectedSize["quantity"] === 0)
      ) {
        outOfStockVal = true;
      } else {
        outOfStockVal = false;
      }
    }
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
