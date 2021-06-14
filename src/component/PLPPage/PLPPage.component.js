// import PropTypes from 'prop-types';
import ProductItem from "Component/ProductItem";
import queryString from "query-string";
import VueIntegrationQueries from "Query/vueIntegration.query";
import { PureComponent } from "react";
import { Products } from "Util/API/endpoint/Product/Product.type";
import { getUUID } from "Util/Auth";
import BrowserDatabase from "Util/BrowserDatabase";
import Event, { EVENT_GTM_IMPRESSIONS_PLP, VUE_PLP_VIEW } from "Util/Event";
import "./PLPPage.style";

class PLPPage extends PureComponent {
  static propTypes = {
    products: Products.isRequired,
    impressions: Products.isRequired,
  };

  componentDidMount() {
    const { impressions } = this.props;
    const category = this.getCategory();
    console.log("plp page rendered");
    const locale = VueIntegrationQueries.getLocaleFromUrl();
    VueIntegrationQueries.vueAnalayticsLogger({
      event_name: VUE_PLP_VIEW,
      params: {
        event: VUE_PLP_VIEW,
        pageType: "plp",
        currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
        clicked: Date.now(),
        uuid: getUUID(),
        referrer: "desktop",
      },
    });

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
    var qid = queryString.parse(window.location.search)?.qid
      ? queryString.parse(window.location.search)?.qid
      : null;
    return products.map((i, index) => this.renderProduct(i, index + 1, qid));
  }

  render() {
    return <div block="PLPPage">{this.renderProducts()}</div>;
  }
}

export default PLPPage;
