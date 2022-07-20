import { SET_SEARCH_SUGGESTIONS } from "./SearchSuggestions.action";

export const getInitialState = () => ({
  search: "",
  data: {},
  queryID:"",
  querySuggestions:[],

});

export const SearchSuggestionsReducer = (state = getInitialState(), action) => {
  const { type } = action;

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

    default:
      return state;
  }
};

export default SearchSuggestionsReducer;
