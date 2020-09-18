// TODO update this import when renamed
import {
    SET_PLP_DATA,
    SET_PLP_INIT_FILTERS,
    SET_PLP_LOADING
} from './PLP.action';

export const getInitialState = () => ({
    pages: {},
    isLoading: true,
    filters: {},
    initialFilters: {},
    options: {}
});

export const formatFilters = (filters) => (
    Object.entries(filters).reduce((acc, [key, filter]) => {
        const { data } = filter;

        // skip filters with no options
        if (data.length === 0) {
            return acc;
        }

        return {
            ...acc,
            [key]: filter
        };
    }, {})
);

export const combineFilters = (filters, _initialFilters) => (
    Object.entries(filters).reduce((acc, [key, filter]) => {
        const { /* selected_filters_count, */ data } = filter;

        // skip filters with no options
        if (data.length === 0) {
            return acc;
        }

        /* // if there is 0 filters selected -> return as is
        if (selected_filters_count === 0) {
            return {
                ...acc,
                [key]: filter
            };
        } */

        // if there is at least one filter selected - return all possible
        const { data: initData } = _initialFilters[key];

        return {
            ...acc,
            [key]: {
                ...filter,
                data: {
                    ...initData,
                    ...data
                }
            }
        };
    }, {})
);

// TODO: implement initial reducer, needed to handle filter count
export const PLPReducer = (state = getInitialState(), action) => {
    const { type } = action;

    switch (type) {
    case SET_PLP_INIT_FILTERS:
        const { initialFilters } = action;

        return {
            ...state,
            initialFilters
        };

    case SET_PLP_DATA:
        const {
            products,
            meta: { page },
            filters,
            options: requestedOptions,
            isInitial
        } = action;

        const { initialFilters: stateInitialFilters } = state;

        const combinedFilters = {
            initialFilters: isInitial ? filters : stateInitialFilters,
            // Always reduce filters if they have no options
            filters: isInitial ? formatFilters(filters) : combineFilters(filters, stateInitialFilters)
        };

        return {
            ...state,
            ...combinedFilters,
            options: requestedOptions,
            pages: {
                [page]: products
            }
        };

    case SET_PLP_LOADING:
        const { isLoading } = action;

        return {
            ...state,
            isLoading
        };

    default:
        return state;
    }
};

export default PLPReducer;
