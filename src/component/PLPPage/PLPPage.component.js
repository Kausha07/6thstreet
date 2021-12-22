// import PropTypes from 'prop-types';
import ProductItem from "Component/ProductItem";
import VueIntegrationQueries from "Query/vueIntegration.query";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Products } from "Util/API/endpoint/Product/Product.type";
import { getUUID } from "Util/Auth";
import BrowserDatabase from "Util/BrowserDatabase";
import Event, { EVENT_GTM_IMPRESSIONS_PLP, VUE_PAGE_VIEW } from "Util/Event";
import "./PLPPage.style";

class PLPPage extends PureComponent {
  static propTypes = {
    products: Products.isRequired,
    impressions: Products.isRequired,
  };

  componentDidMount() {
    const { prevPath = null, impressions } = this.props;
    const category = this.getCategory();
    const locale = VueIntegrationQueries.getLocaleFromUrl();
    VueIntegrationQueries.vueAnalayticsLogger({
      event_name: VUE_PAGE_VIEW,
      params: {
        event: VUE_PAGE_VIEW,
        pageType: "plp",
        currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
        clicked: Date.now(),
        uuid: getUUID(),
        referrer: prevPath ? prevPath : null,
        url: window.location.href,
      },
    });

    Event.dispatch(EVENT_GTM_IMPRESSIONS_PLP, { impressions, category });
  }

  getCategory() {
    return BrowserDatabase.getItem("CATEGORY_NAME") || "";
  }

  renderProduct = (product, index, qid) => {
    const { sku } = product;
    const { renderMySignInPopup } = this.props;
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
        prevPath={window.location.href}
        lazyLoad={false}
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
