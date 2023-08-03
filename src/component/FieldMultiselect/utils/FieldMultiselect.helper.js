export const URL_REWRITE = "url-rewrite";
import BrowserDatabase from "Util/BrowserDatabase";
import { isArabic } from "Util/App";

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

export const getIsOptionVisible = (option) => {
    const { facet_key, facet_value } = option;
    const currentAppState = BrowserDatabase?.getItem("APP_STATE_CACHE_KEY");

    // for colour, in_stock and sort filter should work as it is.
    if(facet_key === "colorfamily" || facet_key === "sort" || facet_key === "in_stock") {
        return true;
    }

    // if PLP is BRAND PLP then no other brand options should be visible in brand filter
    if(facet_key === "brand_name") {
        return true;
    }

    // If user access PLP with gender selected then no other gender option should be 
    // visible to the user
    if(facet_key === "gender") {
        // if the gender is kids then other option like boy, girl, and baby will also displayed to the user
        if(currentAppState?.gender === "kids" ) {
            // in kids Men and Women gender options should NOT be visible.
            if(isArabic() && (facet_value === "نساء" || facet_value === "رجال" ) ){
                return false;
            } else if(facet_value?.toLowerCase() === "men" || facet_value?.toLowerCase() === "women") {
                return false;
            }
            return true;
        }

        if(currentAppState?.gender !== "home" && currentAppState?.gender !== "all" ) {
            const urlGender = location?.pathname?.trim()?.split("/")[1];
            if(isArabic()) {
                const arabicGenderValues = {
                    women: "نساء",
                    men: "رجال",
                }
                const ArbicGenderValue = arabicGenderValues[currentAppState?.gender?.toLowerCase()]
                if(facet_value === ArbicGenderValue) {
                    return true;
                }else return false;
            }
            if(facet_value?.toLowerCase() ===  currentAppState?.gender?.toLowerCase() || 
            facet_value?.toLowerCase() === urlGender?.toLocaleLowerCase()) {
                return true;
            }else return false;
        }

        return true;
    }
    return true;
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
