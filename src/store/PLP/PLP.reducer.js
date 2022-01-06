// TODO update this import when renamed
import {
  SET_PLP_DATA,
  SET_PLP_INIT_FILTERS,
  SET_PLP_LOADING,
  SET_PLP_PAGE,
  RESET_PLP_PAGE,
  SET_LOADING,
  SET_PLP_WIDGET_DATA,
  UPDATE_PLP_INIT_FILTERS,
} from "./PLP.action";
import { deepCopy } from "../../../packages/algolia-sdk/app/utils";
export const getInitialState = () => ({
  // loading state (controlled by PLP container)
  isLoading: true,
  productLoading: true,
  pages: {},
  lastSelectedKey: null,
  lastSelectedValue: null,
  filters: {},
  meta: {},
  options: {},
  initialFilters: {},
  initialOptions: {},
  plpWidgetData: [],
});

export const formatFilters = (filters = {}) =>
  Object.entries(filters).reduce((acc, [key, filter]) => {
    const { data = [] } = filter;

    if (data.length === 0) {
      return acc;
    }

    return {
      ...acc,
      [key]: filter,
    };
  }, {});

export const combineFilters = (
  filters = {},
  allFilters = {},
  requestedOptions = {}
) => {
  let finalFilters = filters;
  let selectedFilterArr = [];
  let exceptFilter = ["categories.level1", "page", "q", " visibility_catalog"];
  Object.keys(requestedOptions).map((option) => {
    if (!exceptFilter.includes(option)) {
      selectedFilterArr.push(option);
    }
  });
  Object.entries(filters).map((filter) => {
    if (!selectedFilterArr.includes(filter[0]) && allFilters[filter[0]]) {
      finalFilters = {
        ...finalFilters,
        [filter[0]]: allFilters[filter[0]],
      };
    }
  });
  return finalFilters;
};

// TODO: implement initial reducer, needed to handle filter count
export const PLPReducer = (state = getInitialState(), action) => {
  const { type } = action;
  switch (type) {
    case SET_PLP_WIDGET_DATA:
      const { plpWidgetData } = action;
      return {
        ...state,
        plpWidgetData,
      };
    case SET_PLP_PAGE:
      const { pageProducts, page } = action;

      const { pages: prevPages } = state;

      return {
        ...state,
        pages: {
          ...prevPages,
          [page]: pageProducts,
        },
      };
    case RESET_PLP_PAGE:
      return {
        ...state,
        pages: {},
      };

    case SET_LOADING:
      return {
        ...state,
        productLoading: action.isLoading,
      };

    case UPDATE_PLP_INIT_FILTERS:
      const { updatedFilters, facet_key, facet_value } = action;
      return {
        ...state,
        filters: updatedFilters,
        lastSelectedKey: facet_key,
        lastSelectedValue: facet_value,
      };

    case SET_PLP_INIT_FILTERS:
      const { initialFilters, initialOptions } = action;

      return {
        ...state,
        initialFilters: initialFilters,
        initialOptions: initialOptions,
      };

    case SET_PLP_DATA:
      const {
        response: {
          data: products = {},
          meta = {},
          filters = {},
          allFilters = {},
        },
        options: requestedOptions = {},
        isInitial,
      } = action;
      const { page: initialPage } = requestedOptions;

      return {
        ...state,
        filters: filters,
        // filters:combineFilters(filters, allFilters, requestedOptions),
        options: requestedOptions,
        meta,
        pages: {
          [initialPage]: products,
        },
      };

    case SET_PLP_LOADING:
      const { isLoading } = action;

      return {
        ...state,
        isLoading,
      };

    default:
      return state;
  }
};

export default PLPReducer;
