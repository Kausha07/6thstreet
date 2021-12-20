export const SET_PLP_DATA = "SET_PLP_DATA";
export const SET_PLP_LOADING = "SET_PLP_LOADING";
export const SET_PLP_INIT_FILTERS = "SET_PLP_INIT_FILTERS";
export const SET_PLP_PAGE = "SET_PLP_PAGE";
export const SET_PLP_WIDGET_DATA = "SET_PLP_WIDGET_DATA";
export const UPDATE_PLP_INIT_FILTERS = "UPDATE_PLP_INIT_FILTERS";

export const setPLPWidget = (data) => ({
  type: SET_PLP_WIDGET_DATA,
  plpWidgetData: data,
});
export const setPLPPage = (pageProducts, page) => ({
  type: SET_PLP_PAGE,
  pageProducts,
  page,
});

export const setPLPData = (response, options, isInitial) => ({
  type: SET_PLP_DATA,
  response,
  options,
  isInitial,
});

export const setPLPLoading = (isLoading) => ({
  type: SET_PLP_LOADING,
  isLoading,
});

export const setPLPInitialFilters = (initialFilters, initialOptions) => ({
  type: SET_PLP_INIT_FILTERS,
  initialFilters,
  initialOptions,
});

export const updatePLPInitialFilters = (updatedFilters,facet_key,facet_value) => ({
  type: UPDATE_PLP_INIT_FILTERS,
  updatedFilters,
  facet_key,
  facet_value
});