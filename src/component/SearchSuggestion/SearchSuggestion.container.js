import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import SearchSuggestionDispatcher from "Store/SearchSuggestions/SearchSuggestions.dispatcher";
import { getStaticFile } from "Util/API/endpoint/StaticFiles/StaticFiles.endpoint";
import Algolia from "Util/API/provider/Algolia";
import { isArabic } from "Util/App";
import { getLocaleFromUrl } from "Util/Url/Url";
import AlgoliaSDK from "../../../packages/algolia-sdk";
import SearchSuggestion from "./SearchSuggestion.component";

export const mapStateToProps = (state) => ({
  requestedSearch: state.SearchSuggestions.search,
  data: state.SearchSuggestions.data,
  gender: state.AppState.gender,
  queryID: state.SearchSuggestions.queryID,
  querySuggestions: state.SearchSuggestions.querySuggestions,
});

export const mapDispatchToProps = (dispatch) => ({
  requestSearchSuggestions: (search) => {
    SearchSuggestionDispatcher.requestSearchSuggestions(
      search,
      sourceIndexName,
      sourceQuerySuggestionIndex,
      dispatch
    );
  },
});
let sourceIndexName;
let sourceQuerySuggestionIndex;
export class SearchSuggestionContainer extends PureComponent {
  static propTypes = {
    requestSearchSuggestions: PropTypes.func.isRequired,
    requestedSearch: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
    data: PropTypes.shape({
      brands: PropTypes.array,
      products: PropTypes.array,
    }).isRequired,
    closeSearch: PropTypes.func.isRequired,
    queryID: PropTypes.string,
    querySuggestions: PropTypes.array,
  };

  static getDerivedStateFromProps(props, state) {
    const { search } = props;
    const { prevSearch } = state;

    if (search !== prevSearch) {
      SearchSuggestionContainer.requestSearchSuggestions(props);
      return { prevSearch: search };
    }

    return null;
  }

  static requestSearchSuggestions(props) {
    const { search, requestSearchSuggestions } = props;

    if (!search) {
      return;
    }

    requestSearchSuggestions(search);
  }

  constructor(props) {
    super(props);

    this.state = {
      prevSearch: props.search,
      trendingBrands: [],
      trendingTags: [],
      topSearches: [],
    };

    // TODO: please render this component only once. Otherwise it is x3 times the request

    SearchSuggestionContainer.requestSearchSuggestions(props);
    this.requestTrendingInformation();
    this.requestTopSearches();
  }

  getAlgoliaIndex(countryCodeFromUrl, lang) {
    if (lang === "english") {
      switch (countryCodeFromUrl) {
        case "en-ae":
          return "stage_magento_english_products_query_suggestions";
        case "en-bh":
          return "stage_magento_en_bh_products_query_suggestions";
        case "en-kw":
          return "stage_magento_en_kw_products_query_suggestions";
        case "en-om":
          return "stage_magento_en_om_products_query_suggestions";
        case "en-qa":
          return "stage_magento_en_qa_products_query_suggestions";
        case "en-sa":
          return "stage_magento_en_sa_products_query_suggestions";
      }
    } else {
      switch (countryCodeFromUrl) {
        case "ar-ae":
          return "stage_magento_arabic_products_query_suggestions";
        case "ar-bh":
          return "stage_magento_ar_bh_products_query_suggestions";
        case "ar-kw":
          return "stage_magento_ar_kw_products_query_suggestions";
        case "ar-om":
          return "stage_magento_ar_om_products_query_suggestions";
        case "ar-qa":
          return "stage_magento_ar_qa_products_query_suggestions";
        case "ar-sa":
          return "stage_magento_ar_sa_products_query_suggestions";
      }
    }
  }

  componentDidMount() {
    sourceIndexName = AlgoliaSDK.index.indexName;
    const countryCodeFromUrl = getLocaleFromUrl();
    const lang = isArabic() ? "arabic" : "english";
    sourceQuerySuggestionIndex = this.getAlgoliaIndex(countryCodeFromUrl, lang);
  }

  async requestTrendingInformation() {
    const { gender } = this.props;

    try {
      const data = await Promise.all([
        getStaticFile("search_trending_brands"),
        getStaticFile("search_trending_tags"),
        // getStaticFile("search_trending_products"),
      ]);
      this.setState({
        trendingBrands: data[0][gender],
        trendingTags: data[1][gender],
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  async requestTopSearches() {
    const topSearches = await new Algolia().getTopSearches();
    this.setState({
      topSearches: topSearches?.data?.filter((ele) => ele !== "") || [],
    });
  }

  containerProps = () => {
    const { trendingBrands, trendingTags, topSearches } = this.state;
    const { search, data, closeSearch, queryID, querySuggestions } = this.props;
    const { brands = [], products = [] } = data;

    const isEmpty = search === "";
    const inNothingFound = brands.length + products.length === 0;

    return {
      searchString: search,
      brands,
      products,
      inNothingFound,
      isEmpty,
      isActive: true, // TODO: implement
      isLoading: this.getIsLoading(),
      trendingBrands,
      trendingTags,
      closeSearch,
      queryID,
      querySuggestions,
      topSearches,
    };
  };
  containerFunctions = {
    hideActiveOverlay: this.props.hideActiveOverlay,
  };

  getIsLoading() {
    const { requestedSearch, search } = this.props;

    if (!search) {
      return false;
    }

    return requestedSearch !== search;
  }

  render() {
    return (
      <SearchSuggestion
        {...this.containerFunctions}
        {...this.containerProps()}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchSuggestionContainer);
