import { SET_SEARCH_SUGGESTIONS } from './SearchSuggestions.action';

export const getInitialState = () => ({
    search: '',
    data: {}
});

export const SearchSuggestionsReducer = (state = getInitialState(), action) => {
    const { type } = action;

    switch (type) {
    case SET_SEARCH_SUGGESTIONS:
        const { search, data } = action;

        return {
            ...state,
            search,
            data
        };

    default:
        return state;
    }
};

export default SearchSuggestionsReducer;
