import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import Event, {
  MOE_trackEvent,
  EVENT_FILTER_ATTRIBUTE_VALUE_SELECTED,
  EVENT_FILTER_ATTRIBUTE_VALUE_DESELECTED,
  EVENT_FILTER_SEARCH_VALUE_SELECTED
} from "Util/Event";

export const sendEventAttributeSelected = (multiLevelData, isSearch, searchKey, activeFiltersIds) => {

      const { facet_value, product_count, category_id, category_key } = multiLevelData;

      if( isSearch ) {
        if(!!!activeFiltersIds.includes(category_id)) {

          Event.dispatch(EVENT_FILTER_SEARCH_VALUE_SELECTED, {
            attributeType: "FIXED" ,
            attributeName: facet_value || "",
            attributeValue: category_key || "",
            searchTerm: searchKey || "",
          });
      
          MOE_trackEvent(EVENT_FILTER_SEARCH_VALUE_SELECTED, {
            country: getCountryFromUrl().toUpperCase(),
            language: getLanguageFromUrl().toUpperCase(),
            app6thstreet_platform: "Web",
            attributeType: "FIXED" ,
            attributeName: facet_value || "",
            attributeValue: category_key || "",
            searchTerm: searchKey || "",
          });
        }
      } else {

        if(!!!activeFiltersIds.includes(category_id)) {

          Event.dispatch(EVENT_FILTER_ATTRIBUTE_VALUE_SELECTED, {
            attributeType: "FIXED" ,
            attributeName: facet_value || "",
            attributeValue: category_key || "",
            productCount: product_count || "",
          });
      
          MOE_trackEvent(EVENT_FILTER_ATTRIBUTE_VALUE_SELECTED, {
            country: getCountryFromUrl().toUpperCase(),
            language: getLanguageFromUrl().toUpperCase(),
            app6thstreet_platform: "Web",
            attributeType: "FIXED" ,
            attributeName: facet_value || "",
            attributeValue: category_key || "",
            productCount: product_count || "",
          });

        }else if (activeFiltersIds.includes(category_id)) {

          Event.dispatch(EVENT_FILTER_ATTRIBUTE_VALUE_DESELECTED, {
            attributeType: "FIXED" ,
            attributeName: facet_value || "",
            attributeValue: category_key || "",
          });
      
          MOE_trackEvent(EVENT_FILTER_ATTRIBUTE_VALUE_DESELECTED, {
            country: getCountryFromUrl().toUpperCase(),
            language: getLanguageFromUrl().toUpperCase(),
            app6thstreet_platform: "Web",
            attributeType: "FIXED" ,
            attributeName: facet_value || "",
            attributeValue: category_key || "",
          });
        }

      }
}


export const sendEventMoreAttributeSelected = (option = {}) => {
  const { facet_key, facet_value, is_selected, product_count } = option;
  if(!!!is_selected) {
    Event.dispatch(EVENT_FILTER_ATTRIBUTE_VALUE_SELECTED, {
      attributeType: "CUSTOM" ,
      attributeName: facet_value || "",
      attributeValue: facet_key || "",
      productCount: product_count || "",
    });

    MOE_trackEvent(EVENT_FILTER_ATTRIBUTE_VALUE_SELECTED, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      app6thstreet_platform: "Web",
      attributeType: "CUSTOM" ,
      attributeName: facet_value || "",
      attributeValue: facet_key || "",
      productCount: product_count || "",
    });
    } else {
    Event.dispatch(EVENT_FILTER_ATTRIBUTE_VALUE_DESELECTED, {
      attributeType: "CUSTOM" ,
      attributeName: facet_value || "",
      attributeValue: facet_key || "",
    });

    MOE_trackEvent(EVENT_FILTER_ATTRIBUTE_VALUE_DESELECTED, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      app6thstreet_platform: "Web",
      attributeType: "CUSTOM" ,
      attributeName: facet_value || "",
      attributeValue: facet_key || "",
    });
  }
}

export const getSelectedMoreFiltersFacetValues = (moreActiveFilters = {}, moreFiltersArr = []) => {
  const SelectedMoerFiltersFacetValues = {};

  moreFiltersArr.map((item) => {
    SelectedMoerFiltersFacetValues[item] = [];
  });
  if (moreActiveFilters && moreActiveFilters["categories_without_path"]) {
    const newSelectedFilters = moreActiveFilters["categories_without_path"];
    newSelectedFilters.map((item) => {
      if (item && item.facet_value && item.new_facet_key ) {
        SelectedMoerFiltersFacetValues[item.new_facet_key].push(item.facet_value);
      }
    });
  }
  return SelectedMoerFiltersFacetValues;
};

export const getCategoryIds = (newActiveFilters={}) => {
  const category_ids = [];
  if(newActiveFilters && newActiveFilters["categories_without_path"]) {
    const newSelectedFilters = newActiveFilters["categories_without_path"];
    newSelectedFilters.map((item) => {
      if(item && item.category_id ) {
        category_ids.push(item.category_id);
      }
    });
  }
  return category_ids;
}

export const getSelectedFiltersFacetValues = ( newActiveFilters = {} ) => {
  const SelectedFiltersFacetValues = [];
  if(newActiveFilters && newActiveFilters["categories_without_path"]) {
    const newSelectedFilters = newActiveFilters["categories_without_path"];
    newSelectedFilters.map((item) => {
      if(item && item.facet_value ) {
        SelectedFiltersFacetValues.push(item.facet_value);
      }
    });
  }
  return SelectedFiltersFacetValues;
}

export const getNewActiveFilters = ({
  multiLevelData,
  isDropdown,
  newActiveFilters,
}) => {
  const { category_key, facet_key, is_selected } = multiLevelData;
  const filterArray = newActiveFilters[facet_key] || [];
  const categoryKey = [];
  let updatedActiveFilters = {};

  if (isDropdown) {
    let isAllSelected = true;
    let categoryKeyArray = [];
    Object.entries(multiLevelData.sub_subcategories).map((sub_cat) => {
      if (!!!sub_cat[1].is_selected) {
        isAllSelected = false;
      }
      if (sub_cat[1] && sub_cat[1].category_key) {
        categoryKeyArray.push(sub_cat[1].category_key);
      }
      // if sub_cat also have subSub categories then we have to add them also
      if(sub_cat[1] && sub_cat[1].sub_subcategories) {
        Object.entries(sub_cat[1].sub_subcategories).map((subSubCategory) => {
          if (!!!subSubCategory[1].is_selected) {
            isAllSelected = false;
          }
          if (subSubCategory[1] && subSubCategory[1].category_key) {
            categoryKeyArray.push(subSubCategory[1].category_key);
          }
        });
      }
    });
    if (isAllSelected) {
      const newFilterArray = filterArray.filter((filterObj) => {
        if (!!!categoryKeyArray.includes(filterObj.category_key)) {
          return filterObj;
        }
      });
      updatedActiveFilters = {
        ...newActiveFilters,
        [facet_key]: [...newFilterArray],
      };
      return updatedActiveFilters;
    } else {
      Object.entries(multiLevelData.sub_subcategories).map((sub_cat) => {
        categoryKey.push(sub_cat[1]);
        if (
          sub_cat[1].sub_subcategories &&
          Object.keys(sub_cat[1].sub_subcategories)?.length > 0
        ) {
          Object.entries(sub_cat[1].sub_subcategories).map((sub_subCat) => {
            categoryKey.push(sub_subCat[1]);
          });
        }
      });
      updatedActiveFilters = {
        ...newActiveFilters,
        [facet_key]: filterArray
          ? [...filterArray, ...categoryKey]
          : [...categoryKey],
      };
      return updatedActiveFilters;
    }
  } else {
    if (is_selected) {
      const newFilterArray = filterArray.filter((filterObj) => {
        if (filterObj.category_key != category_key) {
          return filterObj;
        }
      });
      updatedActiveFilters = {
        ...newActiveFilters,
        [facet_key]: [...newFilterArray],
      };
      return updatedActiveFilters;
    } else {
      categoryKey.push(multiLevelData);
      updatedActiveFilters = {
        ...newActiveFilters,
        [facet_key]: filterArray
          ? [...filterArray, ...categoryKey]
          : [...categoryKey],
      };
      return updatedActiveFilters;
    }
  }
};

export const getNewMoreActiveFilters = ({
  option = {},
  moreActiveFilters = {},
}) => {
  const { facet_key, facet_value, is_selected } = option;
  const filterArray = moreActiveFilters[facet_key] || [];
  const categoryKey = [];
  const optionMoreFilter = { ...option, type: "MoreFilter" };
  let newMoreActiveFilters = {};

  if (is_selected) {
    const newFilterArray = filterArray.filter((filterObj) => {
      if (filterObj.facet_value != facet_value) {
        return filterObj;
      }
    });

    newMoreActiveFilters = {
      ...moreActiveFilters,
      [facet_key]: [...newFilterArray],
    };
  } else {
    categoryKey.push(optionMoreFilter);
    newMoreActiveFilters = {
      ...moreActiveFilters,
      [facet_key]: filterArray
        ? [...filterArray, ...categoryKey]
        : [...categoryKey],
    };
  }

  return newMoreActiveFilters;
};

export const toggleIsSelectedOfSubcategories = ( multiLevelData = {} ) => {
  let newMultiLevelData = {...multiLevelData};
  const {sub_subcategories = {}} = newMultiLevelData;
  for( let key in sub_subcategories) {
    const subCategory = sub_subcategories[key];
    subCategory.is_selected = !subCategory.is_selected;
  }
  return newMultiLevelData;
}

export const getIsDataIsSelected = (multiLevelData = {}) => {
  const {sub_subcategories = {}} = multiLevelData;
  for( let key in sub_subcategories) {
    const subCategory = sub_subcategories[key];
    if(subCategory.is_selected) {
      return true;
    }
  }
  return false;
}
