import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";

import SearchSuggestionDispatcher from "Store/SearchSuggestions/SearchSuggestions.dispatcher";

import Algolia from "Util/API/provider/Algolia";
import { isArabic } from "Util/App";
import browserHistory from "Util/History";
import { setPrevPath } from "Store/PLP/PLP.action";
import { getLocaleFromUrl } from "Util/Url/Url";
import CDN from "../../util/API/provider/CDN";
import {
  TRENDING_BRANDS_ENG,
  TRENDING_BRANDS_AR,
} from "../../util/Common/index";

import {
  hideActiveOverlay,
  toggleOverlayByKey,
} from "Store/Overlay/Overlay.action";

import SearchOverlay from "./SearchOverlay.component";

export const mapStateToProps = (state) => ({
  requestedSearch: state.SearchSuggestions.search,
  data: state.SearchSuggestions.data,
  gender: state.AppState.gender,
  queryID: state.SearchSuggestions.queryID,
  querySuggestions: state.SearchSuggestions.querySuggestions,
  prevPath: state.PLP.prevPath,
  algoliaIndex: state.SearchSuggestions.algoliaIndex,
  suggestionEnabled: state.AppConfig.suggestionEnabled,
});

export const mapDispatchToProps = (dispatch) => ({
  showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
  hideActiveOverlay: () => dispatch(hideActiveOverlay()),
  requestSearchSuggestions: (search) => {
    SearchSuggestionDispatcher.requestSearchSuggestions(
      search,
      sourceIndexName,
      dispatch
    );
  },
  setPrevPath: (prevPath) => dispatch(setPrevPath(prevPath)),
});

let sourceIndexName;
export class searchOverlayContainer extends PureComponent {
  static propTypes = {
    requestSearchSuggestions: PropTypes.func.isRequired,
    requestedSearch: PropTypes.string.isRequired,
    showOverlay: PropTypes.func.isRequired,
    isPopup: PropTypes.bool.isRequired,
    hideActiveOverlay: PropTypes.func.isRequired,
    closePopup: PropTypes.func.isRequired,
    queryID: PropTypes.string,
    querySuggestions: PropTypes.array,
    algoliaIndex: PropTypes.object.isRequired,
    gender: PropTypes.string.isRequired,
    data: PropTypes.shape({
      brands: PropTypes.array,
      products: PropTypes.array,
    }).isRequired,
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
    if (!search || search.length <= 2) {
      return;
    }
    requestSearchSuggestions(search);
  }

  constructor(props) {
    super(props);

    this.state = {
      prevSearch: props.search,
      recentSearches: [],
      typingTimeout: 0,
      isArabic: isArabic(),
      newTrendingBrands: [],
    };
    this.requestSearchSuggestions(props);
    this.requestRecentSearches();
  }

  componentDidMount() {
    const { gender, algoliaIndex } = this.props;
    sourceIndexName = algoliaIndex?.indexName;
    this.requestTrendingBrandsJsonInfo();
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
      this.requestSearchSuggestions(this.props);
    }
  }

  handleViewBagClick() {
    const { hideActiveOverlay, closePopup } = this.props;
    hideActiveOverlay();
    closePopup();
  }

  getNewTrendingBrands = async (resp) => {
    if (resp && resp.data) {
      let TrendingBrandsData = resp.data;
      let trendingBrandsList =
        TrendingBrandsData.find((item) => item?.key === "trending_brands")
          ?.items || [];
      this.setState({
        newTrendingBrands: trendingBrandsList,
      });
    }
  };

  requestTrendingBrandsJsonInfo = async () => {
    const { gender } = this.props;
    const locale = getLocaleFromUrl();
    const [lang, country] = locale.trim().split("-");
    let url = `resources/20191010_staging/${country}/search/v1/trending_${gender}.json`;
    if (process.env.REACT_APP_FOR_JSON === "production") {
      url = `resources/20190121/${country}/search/v1/trending_${gender}.json`;
    }

    try {
      const resp = await CDN.get(url);
      if (resp) {
        this.getNewTrendingBrands(resp);
      }
    } catch (error) {
      console.error(error);
    }
  };

  requestSearchSuggestions(props) {
    const { search, requestSearchSuggestions } = props;
    if (!search || search.length <= 2) {
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

  containerProps = () => {
    const { recentSearches } = this.state;
    const {
      search,
      data,
      querySuggestions,
      queryID,
      suggestionEnabled,
      prevPath,
    } = this.props;
    const isEmpty = search === "";
    const inNothingFound = data?.brands?.length + data?.products?.length === 0;
    return {
      searchString: search,
      products: data?.products || [],
      queryID,
      querySuggestions,
      isActive: true,
      isLoading: this.getIsLoading(),
      recentSearches,
      prevPath,
      suggestionEnabled,
      isEmpty,
      inNothingFound,
    };
  };

  containerFunctions = {
    hideActiveOverlay: this.props.hideActiveOverlay,
    setPrevPath: this.props.setPrevPath,
  };

  requestRecentSearches = async () => {
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
  };

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

  getIsLoading() {
    const { requestedSearch, search } = this.props;
    if (!search) {
      return false;
    }
    return requestedSearch !== search;
  }

  render() {
    return (
      <SearchOverlay
        {...this.props}
        {...this.state}
        {...this.containerFunctions}
        {...this.containerProps()}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(searchOverlayContainer);
