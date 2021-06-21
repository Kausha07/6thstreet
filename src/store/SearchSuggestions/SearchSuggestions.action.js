export const SET_SEARCH_SUGGESTIONS = "SET_SEARCH_SUGGESTIONS";

export const setSearchSuggestions = (search, data, queryID) => ({
  type: SET_SEARCH_SUGGESTIONS,
  search,
  data,
  queryID,
});
