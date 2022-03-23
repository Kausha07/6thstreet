import ProductItem from "Component/ProductItem";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Products } from "Util/API/endpoint/Product/Product.type";
import "./PLPPage.style";

class PLPPage extends PureComponent {
  static propTypes = {
    products: Products.isRequired,
    impressions: Products.isRequired,
  };
  sendProductImpression = (product) => {
    console.log("MY PRODUCT", product);
  };
  renderProduct = (product, index, qid) => {
    const { sku } = product;
    const { renderMySignInPopup, sendProductImpression } = this.props;
    return (
      <ProductItem
        position={index}
        product={product}
        key={sku}
        pageType="plp"
        page="plp"
        renderMySignInPopup={renderMySignInPopup}
        pageType="plp"
        qid={qid}
        lazyLoad={false}
        sendProductImpression={sendProductImpression}
      />
    );
  };

  renderProducts() {
    const { products = [] } = this.props;
    var qid = null;
    if (new URLSearchParams(window.location.search).get("qid")) {
      qid = new URLSearchParams(window.location.search).get("qid");
    } else {
      qid = localStorage.getItem("queryID");
    }
    return products.map((i, index) => this.renderProduct(i, index + 1, qid));
  }

  render() {
    return (
      <div block="PLPPage">
        <ul block="ProductItems">{this.renderProducts()}</ul>
      </div>
    );
  }
}

export default withRouter(connect()(PLPPage));
