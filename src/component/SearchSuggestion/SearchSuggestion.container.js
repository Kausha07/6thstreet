import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import SearchSuggestionDispatcher from "Store/SearchSuggestions/SearchSuggestions.dispatcher";
import { getStaticFile } from "Util/API/endpoint/StaticFiles/StaticFiles.endpoint";
import Algolia from "Util/API/provider/Algolia";
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
    SearchSuggestionDispatcher.requestSearchSuggestions(search, dispatch);
  },
});

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
    // this.requestTopSearches();
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
