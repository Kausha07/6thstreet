export const SET_PLP_DATA = 'SET_PLP_DATA';
export const SET_PLP_LOADING = 'SET_PLP_LOADING';
export const SET_PLP_INIT_FILTERS = 'SET_PLP_INIT_FILTERS';
export const SET_PLP_PAGE = 'SET_PLP_PAGE';

export const setPLPPage = (
    pageProducts,
    page
) => ({
    type: SET_PLP_PAGE,
    pageProducts,
    page
});

export const setPLPData = (
    products,
    filters,
    options,
    isInitial
) => ({
    type: SET_PLP_DATA,
    products,
    filters,
    options,
    isInitial
});

export const setPLPLoading = (isLoading) => ({
    type: SET_PLP_LOADING,
    isLoading
});

export const setPLPInitialFilters = (initialFilters, initialOptions) => ({
    type: SET_PLP_INIT_FILTERS,
    initialFilters,
    initialOptions
});
