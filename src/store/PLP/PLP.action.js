export const SET_PLP_DATA = 'SET_PLP_DATA';
export const SET_PLP_LOADING = 'SET_PLP_LOADING';
export const SET_PLP_INIT_FILTERS = 'SET_PLP_INIT_FILTERS';

export const setPLPData = (
    products,
    meta,
    filters,
    options,
    isInitial
) => ({
    type: SET_PLP_DATA,
    products,
    meta,
    filters,
    options,
    isInitial
});

export const setPLPLoading = (isLoading) => ({
    type: SET_PLP_LOADING,
    isLoading
});

export const setPLPInitialFilters = (initialFilters) => ({
    type: SET_PLP_INIT_FILTERS,
    initialFilters
});
