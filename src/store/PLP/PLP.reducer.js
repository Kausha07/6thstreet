// TODO update this import when renamed
import {
    SET_PLP_DATA,
    SET_PLP_INIT_FILTERS,
    SET_PLP_LOADING,
    SET_PLP_PAGE
} from './PLP.action';

export const getInitialState = () => ({
    // loading state (controlled by PLP container)
    isLoading: true,
    // actual data (pages, filters, options)
    pages: {},
    filters: {},
    meta: {},
    options: {},
    // initial data (filters, options)
    initialFilters: {},
    initialOptions: {}
});

export const formatFilters = (filters = {}) => (
    Object.entries(filters).reduce((acc, [key, filter]) => {
        const { data = [] } = filter;

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

export const combineFilters = (filters = {}, _initialFilters) => (
    Object.entries(filters).reduce((acc, [key, filter]) => {
        const { /* selected_filters_count, */ data = [] } = filter;

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

        let combData;
        if(key === 'in_stock'){
            combData = {
                ...data
            }
        }else{
            combData = {
                ...initData,
                ...data
            }
        }
        return {
            ...acc,
            [key]: {
                ...filter,
                data:combData
            }
        };
    }, {})
);

// TODO: implement initial reducer, needed to handle filter count
export const PLPReducer = (state = getInitialState(), action) => {
    const { type } = action;

    switch (type) {
    case SET_PLP_PAGE:
        const {
            pageProducts,
            page
        } = action;

        const {
            pages: prevPages
        } = state;

        return {
            ...state,
            pages: {
                ...prevPages,
                [page]: pageProducts
            }
        };

    case SET_PLP_INIT_FILTERS:
        const {
            initialFilters,
            initialOptions
        } = action;

        return {
            ...state,
            initialFilters,
            initialOptions
        };

    case SET_PLP_DATA:
        const {
            response: {
                data: products = {},
                meta = {},
                filters = {}
            },
            options: requestedOptions = {},
            isInitial
        } = action;

        const { page: initialPage } = requestedOptions;
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
            meta,
            pages: {
                [initialPage]: products
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
