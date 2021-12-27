// TODO update this import when renamed
import {
  SET_PLP_DATA,
  SET_PLP_INIT_FILTERS,
  SET_PLP_LOADING,
  SET_PLP_PAGE,
  SET_PLP_WIDGET_DATA,
  UPDATE_PLP_INIT_FILTERS,
} from "./PLP.action";
import { deepCopy } from "../../../packages/algolia-sdk/app/utils";
export const getInitialState = () => ({
  // loading state (controlled by PLP container)
  isLoading: true,
  // actual data (pages, filters, options)
  pages: {},
  lastSelectedKey: null,
  lastSelectedValue: null,
  filters: {},
  meta: {},
  options: {},
  // initial data (filters, options)
  initialFilters: {},
  initialOptions: {},
  plpWidgetData: [],
});

export const formatFilters = (filters = {}) =>
  Object.entries(filters).reduce((acc, [key, filter]) => {
    const { data = [] } = filter;

    // skip filters with no options
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
  _initialFilters,
  lastSelectedKey,
  lastSelectedValue
) => {
  let combineFilterData = _initialFilters;
  let lastSelectKey = lastSelectedKey
    ? lastSelectedKey
    : localStorage.getItem("lastSelectedKey");
  if (lastSelectKey) {
    Object.keys(filters).map((key) => {
      if (key !== "categories.level1" && key !== lastSelectKey) {
        combineFilterData[key] = filters[key];
      }
    });
  } else {
    combineFilterData = filters;
  }
  return combineFilterData;
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
        response: { data: products = {}, meta = {}, filters = {} },
        options: requestedOptions = {},
        isInitial,
      } = action;
      const { page: initialPage } = requestedOptions;
      const {
        filters: stateInitialFilters,
        lastSelectedKey,
        lastSelectedValue,
      } = state;
      // const combinedFilters = combineFilters(
      //   filters,
      //   stateInitialFilters,
      //   lastSelectedKey,
      //   lastSelectedValue
      // );
      return {
        ...state,
        filters: filters,
        // filters: combinedFilters,
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
