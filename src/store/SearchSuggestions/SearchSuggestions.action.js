export const SET_SEARCH_SUGGESTIONS = 'SET_SEARCH_SUGGESTIONS';

export const setSearchSuggestions = (search, data) => ({
    type: SET_SEARCH_SUGGESTIONS,
    search,
    data
});
