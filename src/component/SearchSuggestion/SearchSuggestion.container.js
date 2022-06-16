import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import SearchSuggestionDispatcher from "Store/SearchSuggestions/SearchSuggestions.dispatcher";
import { getStaticFile } from "Util/API/endpoint/StaticFiles/StaticFiles.endpoint";
import { fetchVueData } from "Util/API/endpoint/Vue/Vue.endpoint";
import Algolia from "Util/API/provider/Algolia";
import { isArabic } from "Util/App";
import BrowserDatabase from "Util/BrowserDatabase";
import browserHistory from "Util/History";
import { getLocaleFromUrl } from "Util/Url/Url";
import AlgoliaSDK from "../../../packages/algolia-sdk";
import VueQuery from "../../query/Vue.query";
import SearchSuggestion from "./SearchSuggestion.component";
import { getUUIDToken } from "Util/Auth";
import { setPrevPath } from "Store/PLP/PLP.action";

export const mapStateToProps = (state) => ({
  requestedSearch: state.SearchSuggestions.search,
  data: state.SearchSuggestions.data,
  gender: state.AppState.gender,
  queryID: state.SearchSuggestions.queryID,
  querySuggestions: state.SearchSuggestions.querySuggestions,
  prevPath: state.PLP.prevPath,
  // wishlistData: state.WishlistReducer.items,
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
  setPrevPath: (prevPath) => dispatch(setPrevPath(prevPath)),
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
    // wishlistData: WishlistItems.isRequired,
  };

  static getDerivedStateFromProps(props, state) {
    const { search } = props;
    const { prevSearch } = state;

    if (search !== prevSearch) {
      return { prevSearch: search };
    }

    return null;
  }

  static requestSearchSuggestions(props) {
    const { search, requestSearchSuggestions } = props;

    if (!search) {
      return;
    }

    // requestSearchSuggestions(search);
  }

  constructor(props) {
    super(props);

    this.state = {
      prevSearch: props.search,
      trendingBrands: [],
      trendingTags: [],
      topSearches: [],
      recentSearches: [],
      recommendedForYou: [],
      trendingProducts: [],
      typingTimeout: 0,
    };

    // TODO: please render this component only once. Otherwise it is x3 times the request

    // this.requestSearchSuggestions(props);
    this.requestTrendingInformation();
    this.requestTopSearches();
    this.requestRecentSearches();
  }

  getAlgoliaIndex(countryCodeFromUrl, lang) {
    const algoliaENV =
      process.env.REACT_APP_ALGOLIA_ENV === "staging"
        ? "stage"
        : process.env.REACT_APP_ALGOLIA_ENV === "uat"
        ? "preprod"
        : "enterprise";
    // production will work after resolving index issue.
    if (lang === "english" && process.env.REACT_APP_ALGOLIA_ENV !== "uat") {
      switch (countryCodeFromUrl) {
        case "en-ae":
          return `${algoliaENV}_magento_english_products_query_suggestions`;
        case "en-bh":
          return `${algoliaENV}_magento_en_bh_products_query_suggestions`;
        case "en-kw":
          return `${algoliaENV}_magento_en_kw_products_query_suggestions`;
        case "en-om":
          return `${algoliaENV}_magento_en_om_products_query_suggestions`;
        case "en-qa":
          return `${algoliaENV}_magento_en_qa_products_query_suggestions`;
        case "en-sa":
          return `${algoliaENV}_magento_en_sa_products_query_suggestions`;
      }
    } else if (
      lang !== "english" &&
      process.env.REACT_APP_ALGOLIA_ENV !== "uat"
    ) {
      switch (countryCodeFromUrl) {
        case "ar-ae":
          return `${algoliaENV}_magento_arabic_products_query_suggestions`;
        case "ar-bh":
          return `${algoliaENV}_magento_ar_bh_products_query_suggestions`;
        case "ar-kw":
          return `${algoliaENV}_magento_ar_kw_products_query_suggestions`;
        case "ar-om":
          return `${algoliaENV}_magento_ar_om_products_query_suggestions`;
        case "ar-qa":
          return `${algoliaENV}_magento_ar_qa_products_query_suggestions`;
        case "ar-sa":
          return `${algoliaENV}_magento_ar_sa_products_query_suggestions`;
      }
    } else if (
      lang === "english" &&
      process.env.REACT_APP_ALGOLIA_ENV === "uat"
    ) {
      switch (countryCodeFromUrl) {
        case "en-ae":
          return `${algoliaENV}_english_suggestions`;
        case "en-bh":
          return `${algoliaENV}_en_bh_suggestions`;
        case "en-kw":
          return `${algoliaENV}_en_kw_suggestions`;
        case "en-om":
          return `${algoliaENV}_en_om_suggestions`;
        case "en-qa":
          return `${algoliaENV}_en_qa_suggestions`;
        case "en-sa":
          return `${algoliaENV}_en_sa_suggestions`;
      }
    } else if (
      lang !== "english" &&
      process.env.REACT_APP_ALGOLIA_ENV === "uat"
    ) {
      switch (countryCodeFromUrl) {
        case "ar-ae":
          return `${algoliaENV}_arabic_suggestions`;
        case "ar-bh":
          return `${algoliaENV}_ar_bh_suggestions`;
        case "ar-kw":
          return `${algoliaENV}_ar_kw_suggestions`;
        case "ar-om":
          return `${algoliaENV}_ar_om_suggestions`;
        case "ar-qa":
          return `${algoliaENV}_ar_qa_suggestions`;
        case "ar-sa":
          return `${algoliaENV}_ar_sa_suggestions`;
      }
    }
  }

  async getPdpSearchWidgetData() {
    const { gender } = this.props;
    const userData = BrowserDatabase.getItem("MOE_DATA");
    const query = {
      filters: [],
      num_results: 10,
      mad_uuid: userData?.USER_DATA?.deviceUuid || getUUIDToken(),
    };

    const payload = VueQuery.buildQuery("vue_browsing_history_slider", query, {
      gender,
    });
    fetchVueData(payload)
      .then((resp) => {
        this.setState({
          recommendedForYou: resp.data,
        });
      })
      .catch((err) => {
        console.error("fetchVueData error", err);
      });
  }

  getTrendingProducts() {
    const { gender } = this.props;
    const userData = BrowserDatabase.getItem("MOE_DATA");
    const query = {
      filters: [],
      num_results: 10,
      mad_uuid: userData?.USER_DATA?.deviceUuid || getUUIDToken(),
    };

    const payload = VueQuery.buildQuery("vue_trending_slider", query, {
      gender,
    });
    fetchVueData(payload)
      .then((resp) => {
        this.setState({
          trendingProducts: resp.data,
        });
      })
      .catch((err) => {
        console.error("fetchVueData error", err);
      });
  }

  requestSearchSuggestions(props) {
    const { search, requestSearchSuggestions } = props;
    if (!search || search.length < 3) {
      return;
    }
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    this.setState({
      typingTimeout: setTimeout(() => {
        requestSearchSuggestions(search);
      }, [300]),
    });
  }

  componentDidMount() {
    sourceIndexName = AlgoliaSDK.index.indexName;
    const countryCodeFromUrl = getLocaleFromUrl();
    const lang = isArabic() ? "arabic" : "english";
    sourceQuerySuggestionIndex = this.getAlgoliaIndex(countryCodeFromUrl, lang);
    const { gender } = this.props;
    if (gender !== "home") {
      this.getPdpSearchWidgetData();
    }
    // this.getTrendingProducts();
    document.body.classList.add("isSuggestionOpen");
    const { location } = browserHistory;
    const { closeSearch } = this.props;
    browserHistory.push(`${location.pathname}${location.search}`);
    window.onpopstate = () => {
      closeSearch();
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props?.search !== this.props.prevSearch &&
      prevProps?.search !== this.props?.search
    ) {
      // this.requestSearchSuggestions(this.props);
    }
  }

  componentWillUnmount() {
    document.body.classList.remove("isSuggestionOpen");
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
    let refinedTopSearches = [];
    let searchItem = [];
    await Promise.all(
      topSearches?.data
        ?.filter((ele) => ele !== "")
        .map(async (item) => {
          searchItem.push(item.search);
        })
    );
    if (topSearches?.data) {
      refinedTopSearches = await this.checkForSearchSKU(
        searchItem,
        topSearches.data
      );
    }

    this.setState({
      topSearches: refinedTopSearches || [],
    });
  }

  async requestRecentSearches() {
    let recentSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    let refinedRecentSearches = [];
    let searchItem = [];
    if (recentSearches.length > 0) {
      await Promise.all(
        recentSearches?.map(async (item) => {
          searchItem.push(item.name);
        })
      );
    }
    if (recentSearches.length > 0) {
      refinedRecentSearches = await this.checkForSearchSKU(
        searchItem,
        recentSearches
      );
    }
    this.setState({
      recentSearches: refinedRecentSearches || [],
    });
  }

  checkForSearchSKU = async (searchArr, searchList) => {
    const { data } = await new Algolia().getSearchPLP(searchArr);
    let refinedSearches = [];
    if (data && data.length > 0) {
      data.map((subData, index) => {
        if (subData && subData.hits.length === 1) {
          refinedSearches.push({
            link: subData.hits[0].url,
            ...searchList[index],
          });
        } else {
          refinedSearches.push({ link: null, ...searchList[index] });
        }
      });
    }
    return refinedSearches;
  };

  containerProps = () => {
    const {
      trendingBrands,
      trendingTags,
      topSearches,
      recentSearches,
      recommendedForYou,
      trendingProducts,
    } = this.state;
    const {
      search,
      data,
      closeSearch,
      queryID,
      querySuggestions,
      renderMySignInPopup,
      // wishlistData,
      isPDPSearchVisible,
      prevPath,
    } = this.props;
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
      recentSearches,
      recommendedForYou,
      trendingProducts,
      renderMySignInPopup,
      isPDPSearchVisible,
      prevPath,
      // wishlistData,
    };
  };
  containerFunctions = {
    hideActiveOverlay: this.props.hideActiveOverlay,
    setPrevPath: this.props.setPrevPath,
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
