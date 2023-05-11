import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from 'react-redux';

import Algolia from "Util/API/provider/Algolia";
import PDPAlsoAvailable from "./PDPAlsoAvailable.component";

export const mapStateToProps = (state) => ({
  isFetchFromAlgolia:
    state.AppConfig.config.countries[state.AppState.country]['catalogue_from_algolia'],
  relatedProducts: state.PDP.product.relatedProducts
});

export class PDPAlsoAvailableContainer extends PureComponent {
  static propTypes = {
    productsAvailable: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  state = {
    products: [],
    isAlsoAvailable: true,
  };

  componentDidMount() {
    const { products = [] } = this.state;
    const { isFetchFromAlgolia,relatedProducts } = this.props;
    if (isFetchFromAlgolia && !products.length) {
      this.getAvailableProducts();
    }else if(!isFetchFromAlgolia){
      this.setState({ products: relatedProducts });
      this.setState({ isAlsoAvailable: relatedProducts?.length === 0 });
    }
  }

  async getAvailableProduct(sku) {
    const product = await new Algolia().getProductBySku({ sku })
    return product;
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

  render() {
    return (
      <PDPAlsoAvailable
        renderMySignInPopup={this.props.renderMySignInPopup}
        {...this.state}
      />
    );
  }
}

export default connect(mapStateToProps, null)(PDPAlsoAvailableContainer);
