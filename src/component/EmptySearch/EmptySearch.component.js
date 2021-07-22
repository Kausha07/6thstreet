import PropTypes from "prop-types";
import { PureComponent } from "react";
import { fetchVueData } from "Util/API/endpoint/Vue/Vue.endpoint";
import BrowserDatabase from "Util/BrowserDatabase";
import VueQuery from "../../query/Vue.query";
import Recommendations from "../Recommendations/Recommendations.container";
import "./EmptySearch.style";
import noProduct from "./icons/no_product.png";

class EmptySearch extends PureComponent {
  static propTypes = {
    query: PropTypes.string.isRequired,
  };
  state = {
    products: [],
    isVueData: true,
  };

  getRecommendedProducts() {
    const { gender } = this.props;
    const userData = BrowserDatabase.getItem("MOE_DATA");
    const {
      USER_DATA: { deviceUuid },
    } = userData;
    const query = {
      filters: [],
      num_results: 50,
      mad_uuid: deviceUuid,
    };

    const payload = VueQuery.buildQuery("vue_trending_slider", query, {
      gender,
    });
    fetchVueData(payload)
      .then((resp) => {
        this.setState({
          products: resp.data,
        });
        console.log("vueData", resp.data);
      })
      .catch((err) => {
        console.log("fetchVueData error", err);
      });
  }

  componentDidMount() {
    this.getRecommendedProducts();
  }

  renderSearchQuery() {
    const { query } = this.props;

    return (
      <div block="EmptySearch" elem="SearchQuery">
        {__("You search for: ")}
        <span>{query}</span>
      </div>
    );
  }

  renderStaticContent() {
    return (
      <div block="EmptySearch" elem="StaticContent">
        <img src={noProduct} alt="no product" />
        <p block="EmptySearch" elem="Sorry">
          {__("Sorry, we couldn't find any Product!")}
        </p>
        <p block="EmptySearch" elem="Check">
          {__("Please check the spelling or try searching something else")}
        </p>
      </div>
    );
  }
  renderRecommendationsPages() {
    const { products, isVueData } = this.state;
    return <Recommendations products={products} isVueData={isVueData} />;
  }

  render() {
    return (
      <div block="EmptySearch">
        {this.renderSearchQuery()}
        {/* {this.renderStaticContent()} */}
        {this.renderRecommendationsPages()}
      </div>
    );
  }
}

export default EmptySearch;
