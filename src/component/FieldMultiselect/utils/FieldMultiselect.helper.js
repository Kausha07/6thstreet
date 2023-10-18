export const URL_REWRITE = "url-rewrite";

export const getSelectedCategoryLevelOneFilter = (filters = {}) => {
    let selectCategoryLevelOneFilter = "noMatchForCategoryLevelOne";
    Object.entries(filters).map((key) => {
        if (key[0] === "categories.level1") {
            if(key[1]?.data) {
                Object.entries(key[1].data).map((CategoryLevelOne) => {
                    if(CategoryLevelOne[1]?.is_selected) {
                        selectCategoryLevelOneFilter = CategoryLevelOne[1]?.label;
                    }
                });
            }
        }
    });
    return selectCategoryLevelOneFilter;
}

export const getLevelsFromCategoryKey = (key) => {
  const levels = key.split(" /// ");
  const kidsTransaltions = ["Kids", "أطفال"];
  const l0 = levels[0];
  const offset = !kidsTransaltions.includes(l0) ? 0 : 1;
  const l1 = levels[offset + 1];
  const l2 = levels[offset + 2];
  const l3 = levels[offset + 3];
  const l4 = levels[offset + 4];

  return {
    l0,
    l1,
    l2,
    l3,
    l4,
  };
};

export const getActiveFiltersIds = (newActiveFilters) => {
    let idsArray = [];
    const activeCategoryWithoutPath = newActiveFilters?.categories_without_path || [];
    if(activeCategoryWithoutPath && activeCategoryWithoutPath.length) {
      activeCategoryWithoutPath.map((item) => {item?.category_id ? idsArray.push(item.category_id) : null })
    }
    return idsArray;
}

export const getAttributeName = (category, currency) => {
    switch (category) {
        case "categories_without_path":
            return "Categories";
        
        case "brand_name":
            return "Brands";

        case "colorfamily":
            return "Colours";

        case "in_stock":
            return "By Stock";

        case `price.${currency}.default`:
            return "Price Range";
    
        default:
            return category;
    }
}
