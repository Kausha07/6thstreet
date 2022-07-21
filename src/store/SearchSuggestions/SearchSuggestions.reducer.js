import { SET_SEARCH_SUGGESTIONS,SET_ALGOLIA_INDEX } from "./SearchSuggestions.action";

export const getInitialState = () => ({
  search: "",
  data: {},
  queryID:"",
  querySuggestions:[],
  algoliaIndex: null,

});

export const SearchSuggestionsReducer = (state = getInitialState(), action) => {
  const { type,algoliaIndex } = action;

  switch (type) {
    case SET_SEARCH_SUGGESTIONS:
      const { search, data, queryID, querySuggestions } = action;
      return {
        ...state,
        search,
        data,
        queryID,
        querySuggestions,
      };
      case SET_ALGOLIA_INDEX:
        return {
          ...state,
          algoliaIndex,
        };

    default:
      return state;
  }
};

export default SearchSuggestionsReducer;
