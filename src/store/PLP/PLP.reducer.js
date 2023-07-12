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
  SET_PREV_PRODUCT_SKU,
  SET_LAST_HOME_ITEM,
  SET_PREV_PATH,
  SET_BRAND_URL,
  UPDATE_NEW_ACTIVE_FILTERS,
  UPDATE_SLIDER_FILTERS,
  CURRENT_SLIDER_STATE,
} from "./PLP.action";
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
  prevProductSku: "",
  lastHomeItem: "",
  lastHomeItemScrollPosition: 0,
  prePath: "",
  brand_url:"",
  newActiveFilters: {},
  sliderFilters: {},
  currentSliderState: {
    discoutrange: {currentMin:0, currentMax:0},
    priceRange: {currentMin:0, currentMax:0}
  },
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

export const combineFilters = (completeFilter = {}, restFilter = []) => {
  let mainFilterData = completeFilter;
  restFilter.map((filter, index) => {
    Object.entries(filter).map((entry) => {
      mainFilterData[entry[0]] = entry[1];
    });
  });

  return mainFilterData;
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

    case SET_PREV_PRODUCT_SKU:
      const { sku } = action;
      return {
        ...state,
        prevProductSku: sku,
      };

    case SET_LAST_HOME_ITEM:
      const { item } = action;
      return {
        ...state,
        lastHomeItem: item,
      };

      case SET_PREV_PATH:
      const { prevPath } = action;
      return {
        ...state,
        prevPath: prevPath,
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
          finalFiltersData,
          moreFilters = {},
        },
        options: requestedOptions = {},
        isInitial,
      } = action;
      const { page: initialPage = 0 } = requestedOptions;
      return {
        ...state,
        filters: filters,
        // filters: combineFilters(filters, finalFiltersData),
        options: requestedOptions,
        meta,
        pages: {
          [initialPage]: products,
        },
        isLoading:false,
        moreFilters,
      };

    case SET_PLP_LOADING:
      const { isLoading } = action;

      return {
        ...state,
        isLoading,
      };

    case SET_BRAND_URL:
      const { brand_url } = action;
        return {
          ...state,
          brand_url,
        };

    case UPDATE_NEW_ACTIVE_FILTERS:
      const { updatedNewActiveFilters } = action;
        return {
          ...state,
          newActiveFilters: updatedNewActiveFilters
        };

    case UPDATE_SLIDER_FILTERS:
      const { updatedSliderFilters } = action;
      return {
        ...state,
        sliderFilters: updatedSliderFilters
      };

    case CURRENT_SLIDER_STATE:
      const { updatedCurrentSliderState } = action;
      return {
        ...state,
        currentSliderState: updatedCurrentSliderState
      };
    
    default:
      return state;
  }
};

export default PLPReducer;
