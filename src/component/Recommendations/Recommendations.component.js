import ProductItem from "Component/ProductItem";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { Products } from "Util/API/endpoint/Product/Product.type";
import "./PLPPage.style";

class Recommendations extends PureComponent {
  static propTypes = {
    products: Products.isRequired,
    isVueData: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    //
  }

  renderProduct = (product, index, qid) => {
    // debugger
    const { sku, price } = product;
    const { isVueData } = this.props;
    return (
      <ProductItem
        position={index}
        product={product}
        key={sku}
        page="plp"
        qid={qid}
        isVueData={isVueData}
      />
    );
  };

  renderProducts() {
    const { products = [] } = this.props;
    var qid = null;
    return products.map((i, index) => this.renderProduct(i, index + 1, qid));
  }

  render() {
    return <div block="PLPPage">{this.renderProducts()}</div>;
  }
}

export default Recommendations;
