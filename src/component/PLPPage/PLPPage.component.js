import ProductItem from "Component/ProductItem";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Products } from "Util/API/endpoint/Product/Product.type";
import { EVENT_PRODUCT_LIST_IMPRESSION } from "Component/GoogleTagManager/events/ProductImpression.event";
import Event from "Util/Event";
import "./PLPPage.style";
import isMobile from "Util/Mobile";
import { getIsFilters } from "Component/PLPAddToCart/utils/PLPAddToCart.helper";

let gtmProdArr = [];
class PLPPage extends PureComponent {
  static propTypes = {
    products: Products.isRequired,
    impressions: Products.isRequired,
  };

  getPLPListName() {
    const pageUrl = new URL(window.location.href);
    if (pageUrl.pathname == "/catalogsearch/result/") {
      const getSearchQuery = pageUrl.search.includes("&")
        ? pageUrl.search.split("&")
        : pageUrl.search;
      const searchParameter = getSearchQuery[0]
        ? getSearchQuery[0].replace("?q=", "")
        : getSearchQuery.includes("?q=")
        ? getSearchQuery.replace("?q=", "")
        : getSearchQuery;
      const formatSearchParam =
        searchParameter && searchParameter.includes("+")
          ? searchParameter.replaceAll("+", " ")
          : searchParameter;
      return `Search PLP - ${formatSearchParam}`;
    } else if (pageUrl.pathname.includes(".html")) {
      const pagePath = pageUrl.pathname.split(".html");
      const pageName = pagePath[0] ? pagePath[0].replaceAll("/", " ") : "";
      return `PLP -${pageName}`;
    } else {
      return null;
    }
  }

  sendProductImpression = (product) => {
    const { newActiveFilters = {}, activeFilters = {} } = this.props;
    const isFilters = getIsFilters(newActiveFilters, activeFilters) || false;
    gtmProdArr.push([product]);
    const product_numbers = isMobile.any() ? 4 : 6;
    if (gtmProdArr.length > product_numbers - 1) {
      let clubbedProducts = gtmProdArr.slice(0, product_numbers);
      gtmProdArr.splice(0, product_numbers);
      let prodImpression = [];
      for (var i = 0; i < clubbedProducts.length; i++) {
        for (var j = 0; j < clubbedProducts[i].length; j++) {
          let categoryListName = { list: this.getPLPListName() };
          let clubbedData = {
            ...clubbedProducts[i][j][0],
            ...categoryListName,
            isFilters: isFilters,
          };
          prodImpression.push(clubbedData);
        }
      }
      Event.dispatch(EVENT_PRODUCT_LIST_IMPRESSION, prodImpression);
    }
  };

  renderProduct = (product, index, qid) => {
    const { sku } = product;
    const {
      renderMySignInPopup,
      newActiveFilters = {},
      activeFilters = {},
      products,
    } = this.props;
    const isFilters = getIsFilters(newActiveFilters, activeFilters) || false;
    const sendImpressionOnBundle = products.length > 5 ? true : false;
    return (
      <ProductItem
        position={index}
        product={product}
        key={sku}
        pageType="plp"
        page="plp"
        renderMySignInPopup={renderMySignInPopup}
        qid={qid}
        lazyLoad={false}
        sendProductImpression={this.sendProductImpression}
        isFilters={isFilters}
        sendImpressionOnBundle={sendImpressionOnBundle}
      />
    );
  };

  renderProducts() {
    const { products = [], impressions = [] } = this.props;
    impressions.forEach((item, index) => {
      Object.assign(item, {
        product_Position: index + 1,
      });
    });
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
