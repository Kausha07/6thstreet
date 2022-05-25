import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";

import { ReturnResolutionType } from "Type/API";

import MyAccountReturnCreateItem from "./MyAccountReturnCreateItem.component";
import Algolia from "Util/API/provider/Algolia";

export const mapStateToProps = (state) => ({
  country: state.AppState.country,
});

export const mapDispatchToProps = () => ({});

export class MyAccountReturnCreateItemContainer extends PureComponent {
  static propTypes = {
    item: PropTypes.shape({
      reason_options: PropTypes.array,
      item_id: PropTypes.string,
      is_returnable: PropTypes.bool.isRequired,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
    onReasonChange: PropTypes.func.isRequired,
    resolutions: PropTypes.arrayOf(ReturnResolutionType),
    country: PropTypes.string.isRequired,
  };

  static defaultProps = {
    resolutions: [],
  };

  state = {
    availableProducts: [],
    alsoAvailable: [],
    isAlsoAvailable: true,
    firstLoad: true,
    isSelected: false,
    sizeObject: {},
    insertedSizeStatus: false,
  };

  getAvailableProducts(product) {
    const alsoAvailable = product["6s_also_available"];
    alsoAvailable.map((productID) =>
      this.getAvailableProduct(productID).then((productData) => {
        let { availableProducts = [] } = this.state;

        if (productData.nbHits === 1) {
          this.setState({
            availableProducts: [...availableProducts, productData.data],
          });
          availableProducts = this.state?.availableProducts || [];
        }

        this.setState({
          isAlsoAvailable: availableProducts.length === 0,
          alsoAvailable,
        });
      })
    );
  }

  async getAvailableProduct(sku) {
    const product = await new Algolia().getProductBySku({ sku });
    return product;
  }

  setSizeData = (product) => {
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

  onAvailSizeSelect({ target }, itemId) {
    const { value } = target;
    const { onSizeSelect, products } = this.props;
    let filteredProduct = products[itemId];
    const { simple_products: productStock } = filteredProduct;
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
    onSizeSelect(value, outOfStockVal, itemId);
  }

  containerFunctions = {
    onClick: this.onClick.bind(this),
    onReasonChange: this.onReasonChange.bind(this),
    onAvailSizeSelect: this.onAvailSizeSelect.bind(this),
  };

  onReasonChange(value) {
    const {
      onReasonChange,
      item: { item_id },
    } = this.props;

    onReasonChange(item_id, value);
  }

  onClick() {
    const {
      onClick,
      item: { item_id, config_sku },
    } = this.props;
    this.setState(({ isSelected: prevIsSelected }) => {
      const isSelected = !prevIsSelected;
      this.getAvailableProduct(config_sku).then((currentProduct) => {
        if (currentProduct) {
          onClick(item_id, isSelected, currentProduct.data);
          this.getAvailableProducts(currentProduct.data);
          this.setSizeData(currentProduct.data);
        }
        return { isSelected };
      });
    });
  }
  onClick() {
    const {
      onClick,
      item: { item_id, config_sku },
    } = this.props;
    this.setState(({ isSelected: prevIsSelected }) => {
      const isSelected = !prevIsSelected;
      this.getAvailableProduct(config_sku).then((currentProduct) => {
        if (currentProduct) {
          if (isSelected) {
            onClick(item_id, isSelected, currentProduct.data);
          } else {
            onClick(item_id, isSelected, null);
          }

          this.getAvailableProducts(currentProduct.data);
          this.setSizeData(currentProduct.data);
        }
      });

      return { isSelected };
    });
  }

  containerProps = () => {
    const { item, reasonId } = this.props;
    const {
      isSelected,
      isAlsoAvailable,
      availableProducts,
      alsoAvailable,
      sizeObject,
    } = this.state;

    return {
      item,
      isSelected,
      reasonId,
      isAlsoAvailable,
      alsoAvailable,
      availableProducts,
      sizeObject,
      resolutions: this.getResolutionOptions(),
      reasonOptions: this.getReasonOptions(),
    };
  };

  getResolutionOptions() {
    const { resolutions = [] } = this.props;

    return resolutions.map(({ id, label }) => ({
      id,
      label,
      value: id + 1,
    }));
  }

  getReasonOptions() {
    const {
      item: { reason_options = [], exchange_reasons = [] },
      isExchange,
    } = this.props;
    let finalReasonList = isExchange ? exchange_reasons : reason_options;
    return finalReasonList.map(({ id, label }) => {
      const value = id.toString();
      return {
        id: value,
        label,
        value,
      };
    });
  }

  render() {
    return (
      <MyAccountReturnCreateItem
        {...this.props}
        {...this.containerFunctions}
        {...this.containerProps()}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyAccountReturnCreateItemContainer);
