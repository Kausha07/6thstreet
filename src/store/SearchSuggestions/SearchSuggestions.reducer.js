import {
  SET_SEARCH_SUGGESTIONS,
  SET_ALGOLIA_INDEX,
  SET_SEARCH_SUGGESTIONS_PRODUCTS_QUERY_ID,
} from "./SearchSuggestions.action";

export const getInitialState = () => ({
  search: "",
  data: {},
  queryID: "",
  querySuggestions: [],
  algoliaIndex: null,
  gender: "",
  country: "",
  searchSuggestionsProdQID : "",
});

export const SearchSuggestionsReducer = (state = getInitialState(), action) => {
  const { type } = action;

  switch (type) {
    case SET_SEARCH_SUGGESTIONS:
      const { search, data, queryID, querySuggestions, gender, country } =
        action;
      return {
        ...state,
        search,
        data,
        queryID,
        querySuggestions,
        gender,
        country,
      };
    case SET_ALGOLIA_INDEX:
      const { algoliaIndex } = action;
      return {
        ...state,
        algoliaIndex,
      };
    case SET_SEARCH_SUGGESTIONS_PRODUCTS_QUERY_ID:
      const {searchSuggestionsProdQID} = action;
      return {
        ...state,
        searchSuggestionsProdQID,
      };

    default:
      return state;
  }
};

export default SearchSuggestionsReducer;
