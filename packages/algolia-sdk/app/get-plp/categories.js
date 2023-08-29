import { getQueryValues, getQueryValuesMoreFilters } from "../utils/query";
import { sum } from "../utils/num";
import { sortKeys } from "../utils/obj";
import { translate } from "../config/translations";
import { MORE_FILTERS } from "../config"
import { getFinalProdCountObj } from "../utils/getProdCount";

/*
  Note
  Without categories_without_path complete,
  there's NO WAY to filter by all L1 category when a combination of genders is selected (eg. Women, Men, Boy)
*/

const _getLevelsFromCategoryKey = ({ key }) => {
  const levels = key.split(" /// ");
  const kidsTransaltions = [translate("kids", "en"), translate("kids", "ar")];

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

const getOptions = (obj, newkey, query, arrMoreFilters) => {
  const formatedQuery = getQueryValuesMoreFilters(query, arrMoreFilters);
  const outputObj = {};
  for (let key in obj) {
    if(key !== false && key !== "false") {
      outputObj[key] = {
        facet_key: "categories_without_path",
        new_facet_key: newkey || "",  // using this key is for params
        facet_value: key,
        label: key,
        product_count: obj[key],
        is_selected: formatedQuery[key] ? true : false,
      };
    }
  }
  return {options: outputObj}
}

const getIsEmptyFilter = (moreFilterObj ={}) => {
  const { options = {} } = moreFilterObj;
  if (Object.keys(options).length === 0) {
    return true
  }
  return false;
}

const getOptionsMoreFilters = (facets, queryValues, moreFiltersData, query) => {
  const option = {};
  const arrMoreFilters = moreFiltersData?.more_filter || [];
  const moreFiltersTraslation = moreFiltersData?.more_filter_traslation || {};
  arrMoreFilters.map((item, index) => {
    option[item] = facets[item];
  });
  for (let key in option ) {    
    if(option[key] !== undefined) {
      option[key] = getOptions(option[key], key, query, arrMoreFilters);
      option[key].moreFiltersTraslation = {...moreFiltersTraslation[key]}
    }
    // if More filter is empty or only contains False value then it should get hide
    const isEmptyFilter = getIsEmptyFilter(option[key]);
    if(isEmptyFilter) {
      option[key] = undefined;
    }
  }
  return option;
}

const getIsSelected = ( categoryIdsArray, filterObj ) => {
  if( filterObj && filterObj.category_id ) {
    if ( categoryIdsArray.includes(filterObj.category_id) ) {
      return true;
    }else {
      return false;
    }
  }
  return false;
}

const _getCategoryLevel2Data = ({
  facetKey,
  categoriesLevel2,
  categoriesLevel3,
  categoriesLevel4,
  categoriesWithoutPath,
  query,
  categoryData,
  prodCountFacets,
}) => {
  let totalSelectedFiltersCount = 0;

let prodCountObj = {};
Object.entries(prodCountFacets).map((entry, index) => {
  if (
    entry[0] === "categories.level2" ||
    entry[0] === "categories.level3" ||
    entry[0] === "categories.level4"
  ) {
    prodCountObj = { ...prodCountObj, ...entry[1] };
  }
});

  /*
    Both 'categories.level2' and 'categories.level3' are needed because

    For Women|Men, you can get the L2 category from 'categories.level2':
    Men /// Accessories /// Hats
    Women /// Accessories /// Hats
    => Hats

    But for Kids, there's an additional 'Kids' prefix in 'categories.level2':
    Kids /// Girl /// Accessories
    => ??

    And you can only the L1 category.

    So, we use 'categories.level3' too
    Kids /// Girl /// Accessories /// Hats
    => Hats

    And merge the two category levels together
  */
  let regex = new RegExp("\\s///\\s|\\s", "gm");
  const finalProdCountObj = getFinalProdCountObj(prodCountObj);
  const categoryIds = query?.categoryIds || "";
  let categoryIdsArray = categoryIds === "" ? [] : categoryIds.split(",");
  if (categoryIdsArray.length) {
    categoryIdsArray = categoryIdsArray.map(Number);
  }
  const categoriesMerge = {
    ...categoriesLevel2,
    ...categoriesLevel3,
    ...categoriesLevel4,
  };
  const selectedFiltersArray = []
  const avoidDuplicates = [];
  const isCategoryIds = categoryIdsArray.length ? true : false;
  const queryValues = getQueryValues({ query, path: facetKey });
  let data = Object.entries(categoriesMerge).reduce(
    (acc, [key, productCount]) => {
      const {
        l1: l1Key,
        l2: l2Key,
        l3: l3Key,
        l1,
        l2,
        l3,
        l4,
      } = _getLevelsFromCategoryKey({ key });
      // let l2 = query["categories.level2"] ? l3Key : l2Key; code for l2 and l3 logic
      // let l1 = query["categories.level2"] ? l2Key : l1Key;

      // TODO: Add proper logger
      if (l2 && categoriesWithoutPath && !categoriesWithoutPath[l2] && __DEV__) {
        console.warn("No categories_without_path for", l2);
      }
      let categoryKey= key.replace (regex, '_');
      if (l2 && categoriesWithoutPath && categoriesWithoutPath[l2] ) {
        let category_id = null;
        if(key && categoryKey && categoryData && categoryData[categoryKey]) {
          category_id = parseInt(categoryData[categoryKey]);
        }
        if (!acc[l1]) {
          acc[l1] = {
            label: l1,
            facet_key: facetKey,
            facet_value: l1,
            selected_filters_count: 0,
            product_count: 0,
            subcategories: {},
          };
        }

        // is L2, L3 or L4
        let currentCategoryLevel;
        if(l4){
          currentCategoryLevel = "L4";
        }else if(l3) {
          currentCategoryLevel = "L3";
        }else {
          currentCategoryLevel = "L2"
        }

        // Total product count per category
        acc[l1].product_count = sum(acc[l1].product_count, productCount);

        acc[l1].subcategories[l2] = {
          facet_value: l2,
          facet_key: facetKey,
          label: l2,
          is_selected: false,
          isDropdown: acc[l1]?.subcategories[l2] ? acc[l1]?.subcategories[l2].isDropdown : false,
          product_count:
            currentCategoryLevel === "L2"
              ? finalProdCountObj[categoryKey] || categoriesWithoutPath[l2]
              : acc[l1]?.subcategories[l2]?.product_count,
          category_key:
            currentCategoryLevel === "L2"
              ? categoryKey
              : acc[l1]?.subcategories[l2]?.category_key,
          category_id:
            currentCategoryLevel === "L2"
              ? category_id
              : acc[l1]?.subcategories[l2]?.category_id,
          productCountMsite: categoriesWithoutPath[l2],
          sub_subcategories: {...acc[l1].subcategories[l2]?.sub_subcategories},
        };

        if(l3 && categoriesWithoutPath && categoriesWithoutPath[l3]) {
          acc[l1].subcategories[l2].isDropdown = true;
          acc[l1].subcategories[l2].sub_subcategories[l3] = {
            facet_value: l3,
            facet_key: facetKey,
            label: l3,
            is_selected: false,
            isDropdown: false,
            product_count: finalProdCountObj[categoryKey] || productCount,
            category_level: "L3",
            category_key:
              currentCategoryLevel === "L3"
                ? categoryKey
                : acc[l1].subcategories[l2]?.sub_subcategories[l3]?.category_key,
            category_id:
              currentCategoryLevel === "L3"
                ? category_id
                : acc[l1].subcategories[l2]?.sub_subcategories[l3]?.category_id,
            sub_subcategories: {...acc[l1].subcategories[l2]?.sub_subcategories[l3]?.sub_subcategories}
          };
          if(l4 && categoriesWithoutPath && categoriesWithoutPath[l4]) {
            acc[l1].subcategories[l2].sub_subcategories[l3].isDropdown = true;
            acc[l1].subcategories[l2].sub_subcategories[l3].sub_subcategories[l4] = {
              facet_value: l4,
              facet_key: facetKey,
              label: l4,
              is_selected: false,
              isDropdown: false,
              product_count: finalProdCountObj[categoryKey] || productCount,
              category_level: "L4",
              category_key: categoryKey,
              category_id,
            }
          }
        }

        // Mark selected filters, using the query params
        if (queryValues[l2]) {
          if (acc[l1].selected_filters_count === 0) {
            totalSelectedFiltersCount += 1;
          }
          acc[l1].selected_filters_count += 1;
          const isSelected = getIsSelected(categoryIdsArray, acc[l1].subcategories[l2]);
          if(isSelected) {
            if(!!!avoidDuplicates.includes(category_id) && currentCategoryLevel === "L2"){
              selectedFiltersArray.push(acc[l1].subcategories[l2] );
              avoidDuplicates.push(category_id);
            }
          }
          // below condition is for Msite only 
          if(!isCategoryIds) {
            if(!!!avoidDuplicates.includes(category_id) && currentCategoryLevel === "L2"){
              selectedFiltersArray.push(acc[l1].subcategories[l2] );
              avoidDuplicates.push(category_id);
            }
          }
          acc[l1].subcategories[l2].is_selected = isCategoryIds ? isSelected : true;
        }
        // Mark selected filters, using the query params - for L3 categories
        if(l3 && queryValues[l3]) {
          if(acc[l1].selected_filters_count === 0) {
            totalSelectedFiltersCount += 1;
          }
          acc[l1].selected_filters_count += 1;
          if (
            acc[l1] &&
            acc[l1].subcategories[l2] &&
            acc[l1].subcategories[l2].sub_subcategories[l3]
          ) {
            const isSelected = getIsSelected(categoryIdsArray, acc[l1].subcategories[l2].sub_subcategories[l3]);
            if(isSelected) {
              if(!!!avoidDuplicates.includes(category_id) && currentCategoryLevel === "L3"){
                selectedFiltersArray.push(acc[l1].subcategories[l2].sub_subcategories[l3] );
                avoidDuplicates.push(category_id);
              }
            }
            acc[l1].subcategories[l2].sub_subcategories[l3].is_selected = isSelected;
          }
        }
        // Mark selected filters, using the query params - for L4 categories
        if(l4 && queryValues[l4]) {
          if(acc[l1].selected_filters_count === 0) {
            totalSelectedFiltersCount += 1;
          }
          acc[l1].selected_filters_count += 1;
          if (
            acc[l1] &&
            acc[l1].subcategories[l2] &&
            acc[l1].subcategories[l2].sub_subcategories[l3] &&
            acc[l1].subcategories[l2].sub_subcategories[l3].sub_subcategories[l4]
          ) {
            const isSelected = getIsSelected(categoryIdsArray, acc[l1].subcategories[l2].sub_subcategories[l3].sub_subcategories[l4]);
            if(isSelected) {
              selectedFiltersArray.push(acc[l1].subcategories[l2].sub_subcategories[l3].sub_subcategories[l4] );
            }
            acc[l1].subcategories[l2].sub_subcategories[l3].sub_subcategories[l4].is_selected = isSelected;
          }
        }
      }

      return acc;
    },
    {}
  );

  const newActiveFilters = {
    [facetKey]: selectedFiltersArray
  }
  // Sort by product_count in category
  data = sortKeys(data, (obj1, obj2) => {
    const [, a] = obj1;
    const [, b] = obj2;
    return b.product_count - a.product_count;
  });
  return [data, totalSelectedFiltersCount, newActiveFilters];
};

const _getCategoryLevel1Data = ({
  facetKey,
  categoriesLevel1,
  categoriesLevel2,
  query,
}) => {
  let totalSelectedFiltersCount = 0;

  const queryValues = getQueryValues({ query, path: facetKey });

  /*
    Same as above, we need both 'categories.level1' and 'categories.level2'
    to get the L1 category
  */
  const categoriesMerge = {
    ...categoriesLevel1,
    ...categoriesLevel2,
  };

  let data = Object.entries(categoriesMerge).reduce(
    (acc, [key, productCount]) => {
      const { l1, l2 } = _getLevelsFromCategoryKey({ key });

      // Take L1 into account, but ignore all L2s
      if (l1 && !l2) {
        acc[key] = {
          label: l1,
          facet_key: facetKey,
          facet_value: key,
          is_selected: false,
          product_count: sum(acc[key]?.product_count, productCount),
        };

        // Mark selected filters, using the query params
        if (queryValues[key]) {
          totalSelectedFiltersCount += 1;
          acc[key].is_selected = true;
        }
      }

      return acc;
    },
    {}
  );

  return [data, totalSelectedFiltersCount];
};

const makeCategoriesWithoutPathFilter = ({ facets, query, categoryData, prodCountFacets }) => {
  const facetKey = "categories_without_path";
  // let categoriesLevel2Data = query["categories.level2"]
  //   ? {}
  //   : facets["categories.level2"];
  const [data, totalSelectedFiltersCount, newActiveFilters] = _getCategoryLevel2Data({
    facetKey,
    categoriesLevel2: facets["categories.level2"],
    categoriesLevel3: facets["categories.level3"],
    categoriesLevel4: facets["categories.level4"],
    categoriesWithoutPath: facets.categories_without_path,
    query,
    categoryData,
    prodCountFacets,
  });
  return {
    label: __("Categories"),
    category: facetKey,
    is_radio: false,
    is_nested: true,
    selected_filters_count: totalSelectedFiltersCount,
    data,
    newActiveFilters,
  };
};

const makeCategoriesLevel1Filter = ({ facets, query }) => {
  const facetKey = "categories.level1";
  const [data, totalSelectedFiltersCount] = _getCategoryLevel1Data({
    facetKey,
    categoriesLevel1: facets["categories.level1"],
    categoriesLevel2: facets["categories.level2"],
    query,
  });

  return {
    label: "Categories Level 1",
    category: facetKey,
    is_radio: false,
    selected_filters_count: totalSelectedFiltersCount,
    data,
  };
};

const makeCategoriesMoreFilter = ({facets, query, moreFiltersData}) => {
  const facetKey = "categories_without_path";
  const queryValues = getQueryValues({ query, path: facetKey });
  const moreFilters = {};
  const moreFiltersArr = moreFiltersData?.more_filter || [];
  moreFilters.moreFiltersArr = moreFiltersArr;
  moreFilters.option = getOptionsMoreFilters(facets, queryValues, moreFiltersData, query);
  moreFilters.moreFilters_selected_filters_count = 0;
  return moreFilters;
}

export { makeCategoriesWithoutPathFilter, makeCategoriesLevel1Filter, makeCategoriesMoreFilter };
