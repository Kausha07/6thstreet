export const getSelectedMoreFiltersFacetValues = (moreActiveFilters = {}) => {
  const SelectedMoerFiltersFacetValues = [];
  if (moreActiveFilters && moreActiveFilters["categories_without_path"]) {
    const newSelectedFilters = moreActiveFilters["categories_without_path"];
    newSelectedFilters.map((item) => {
      if (item && item.facet_value) {
        SelectedMoerFiltersFacetValues.push(item.facet_value);
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
