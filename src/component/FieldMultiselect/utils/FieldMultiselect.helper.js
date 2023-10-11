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
