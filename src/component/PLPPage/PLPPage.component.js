// import PropTypes from 'prop-types';
import ProductItem from "Component/ProductItem";
import { PureComponent } from "react";
import { Products } from "Util/API/endpoint/Product/Product.type";
import BrowserDatabase from "Util/BrowserDatabase";
import Event, { EVENT_GTM_IMPRESSIONS_PLP } from "Util/Event";
import "./PLPPage.style";

class PLPPage extends PureComponent {
  static propTypes = {
    products: Products.isRequired,
    impressions: Products.isRequired,
  };

  componentDidMount() {
    const { impressions } = this.props;
    const category = this.getCategory();

    Event.dispatch(EVENT_GTM_IMPRESSIONS_PLP, { impressions, category });
  }

  getCategory() {
    return BrowserDatabase.getItem("CATEGORY_NAME") || "";
  }

  renderProduct = (product, index, qid) => {
    const { sku, price } = product;
    return (
      <ProductItem
        position={index}
        product={product}
        key={sku}
        page="plp"
        qid={qid}
      />
    );
  };

  renderProducts() {
    const { products = [] } = this.props;
    var qid = new URLSearchParams(window.location.search).get("qid");
    return products.map((i, index) => this.renderProduct(i, index + 1, qid));
  }

  render() {
    return <div block="PLPPage">{this.renderProducts()}</div>;
  }
}

export default PLPPage;
