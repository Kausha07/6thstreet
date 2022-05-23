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
    products: [],
    isAlsoAvailable: true,
    firstLoad: true,
    isSelected: false,
  };

  componentDidMount() {
    const { firstLoad, products = [] } = this.state;

    if (firstLoad && !products.length) {
      this.getAvailableProducts();
    }
  }

  
  getAvailableProducts() {
    const { productsAvailable = [] } = this.props;

    productsAvailable.map((productID) =>
      this.getAvailableProduct(productID).then((productData) => {
        let { products = [] } = this.state;

        if (productData.nbHits === 1) {
          this.setState({ products: [...products, productData.data] });
          products = this.state?.products || [];
        }

        this.setState({ isAlsoAvailable: products.length === 0 });
      })
    );
  }

  
  async getAvailableProduct(sku) {
    const product = await new Algolia().getProductBySku({ sku });

    return product;
  }

  containerFunctions = {
    onClick: this.onClick.bind(this),
    onReasonChange: this.onReasonChange.bind(this),
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
      item: { item_id },
    } = this.props;

    this.setState(({ isSelected: prevIsSelected }) => {
      const isSelected = !prevIsSelected;
      onClick(item_id, isSelected);
      return { isSelected };
    });
  }

  containerProps = () => {
    const { item, reasonId, product } = this.props;
    const { isSelected ,isAlsoAvailable} = this.state;

    return {
      item,
      isSelected,
      reasonId,
      product,
      isAlsoAvailable,
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
      item: { reason_options = [] },
    } = this.props;
    return reason_options.map(({ id, label }) => {
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
