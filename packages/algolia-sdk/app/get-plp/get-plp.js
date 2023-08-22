import Url from "url-parse";
import {
  CURRENCY_STRIP_INSIGNIFICANT_ZEROS,
  NUMERIC_FILTERS,
  searchParams as defaultSearchParams,
  SIZE_FILTERS,
  VISIBLE_FILTERS,
  VISIBLE_GENDERS,
  MORE_FILTERS,
} from "../config";
import { translate } from "../config/translations";
import {
  deepCopy,
  formatNewInTag,
  getAlgoliaFilters,
  getMasterAlgoliaFilters,
  getAddtionalFacetsFilters,
  getCurrencyCode,
  getIndex,
  getMoreFacetFilters,
} from "../utils";
import { intersectArrays } from "../utils/arr";
import {
  formatPrice,
  getFacetLabel,
  getFacetSlug,
  getIndexBySort,
  getLabel,
} from "../utils/filters";
import { getQueryValues } from "../utils/query";
import {
  makeCategoriesLevel1Filter,
  makeCategoriesWithoutPathFilter,
  makeCategoriesMoreFilter,
} from "./categories";

const getPriceRangeData = ({ currency, lang }) => {
  const priceRangeData = {};
  let multiplier = 100;

  if (!CURRENCY_STRIP_INSIGNIFICANT_ZEROS.includes(currency)) {
    multiplier = 10;
  }

  for (let i = 0; i <= 8; i += 1) {
    const start = i * multiplier;
    const end = start + multiplier;
    const facetValue = `gte${start},lte${end}`;

    priceRangeData[facetValue] = {
      label: `${formatPrice(start, currency)} - ${formatPrice(end, currency)}`,
      facet_key: `price.${currency}.default`,
      facet_value: facetValue,
      is_selected: false,
    };

    if (i === 8) {
      const greaterThanFacetValue = `gte${end}`;
      priceRangeData[greaterThanFacetValue] = {
        label: `${formatPrice(end, currency)} ${translate("and_above", lang)}`,
        facet_key: `price.${currency}.default`,
        facet_value: greaterThanFacetValue,
        is_selected: false,
      };
    }
  }

  return priceRangeData;
};

const getNewPriceRangeData = ({ facets_stats, currency, lang }) => {
  let newPriceRangeData = {};
  if(facets_stats && facets_stats[`price.${currency}.default`]){
    newPriceRangeData = {...facets_stats[`price.${currency}.default`]};
  }
  return newPriceRangeData;
}

const getDiscountData = ({ currency, lang }) => {
  const discountData = {};
  for (let i = 10; i <= 70; i += 10) {
    const facetValue = `gte${i}`;
    discountData[facetValue] = {
      label: `${i}% ${translate("and_above", lang)}`,
      facet_key: "discount",
      facet_value: `gte${i}`,
      is_selected: false,
    };
  }

  return discountData;
};

const getNewDiscountData = ({ facets_stats, currency, lang }) => {
  let newDiscountData = {};
  if(facets_stats && facets_stats["discount"]) {
    newDiscountData = {...facets_stats["discount"]};
  }
  return newDiscountData;
}

const getIsPriceFilterAvaialbe = ( newfacetStats={}, currency ) => {
  if(newfacetStats && newfacetStats[`price.${currency}.default`]) {
    const { min, max } = newfacetStats[`price.${currency}.default`];
    if(min === max) {
      return false;
    }
  }
  return true;
}

const getIsDiscount = ( newfacetStats={} ) => {
  if(newfacetStats && newfacetStats.discount ) {
    const { min, max } = newfacetStats.discount;
    if(min === 0 && max === 0 || min === max) {
      return false;
    }
  }
  return true;
}

const formatFacetData = ({ allFacets, facetKey }) => {
  const data = allFacets[facetKey];

  return Object.keys(data).reduce((acc, facetValue) => {
    acc[facetValue] = {
      facet_value: facetValue,
      facet_key: facetKey,
      label: getFacetLabel(facetValue),
      is_selected: false,
      product_count: data[facetValue],
    };

    return acc;
  }, {});
};

const filterKeys = ({ allFacets, keys }) => {
  let filteredKeys = [];

  keys.forEach((key) => {
    if (allFacets[key]) {
      filteredKeys = [...filteredKeys, key];
    }
  });

  return filteredKeys;
};

function getMoreFilters (facets, query, moreFiltersData ) {
  const moreFilters = makeCategoriesMoreFilter({
    facets,
    query,
    moreFiltersData,
  })
  return moreFilters;
}

function getMinMax(str)  {
  const numbers = str.split(',')
    .map((value) => value.replace(/[^\d.]/g, '')) // Allow decimal point in addition to digits
    .filter((value) => value !== '') // Remove empty strings
    .map(Number); // Convert the extracted numbers to numeric values

  return numbers;
}

function getSliderFilters (queryParams, locale, facets_stats, newfacetStats) {
  const [lang, country] = locale.split("-");
  const currency = getCurrencyCode(country);
  const sliderFilters = {};
  if (queryParams && queryParams.discount) {
    const minMax = getMinMax(queryParams.discount);
    sliderFilters.discount = {
      discount: queryParams.discount,
      min: minMax[0],
      max: minMax[1],
      isDiscountFilterApplyed: true,
    }
  } else if(facets_stats && facets_stats.discount) {
    sliderFilters.discount = {
      min: facets_stats?.discount?.min,
      max: facets_stats?.discount?.max,
      isDiscountFilterApplyed: false,
    }
  }

  // below values are for start and end points of discount slider 
  if(newfacetStats && newfacetStats.discount) {
    sliderFilters.discount = {
      ...sliderFilters.discount,
      minValue: newfacetStats?.discount?.min,
      maxValue: newfacetStats?.discount?.max,
    }    
  }
  // below code is for price slider
  if (queryParams && queryParams[`price.${currency}.default`]) {
    const minMax = getMinMax(queryParams[`price.${currency}.default`]);
    sliderFilters.price = {
      price: queryParams[`price.${currency}.default`],
      min: minMax[0],
      max: minMax[1],
      isPriceFilterApplyed: true,
    }
  } else if (facets_stats && facets_stats[`price.${currency}.default`]) {
    sliderFilters.price = {
      min: facets_stats[`price.${currency}.default`]?.min,
      max: facets_stats[`price.${currency}.default`]?.max,
      isPriceFilterApplyed: false,
    }
  }
  // below values are for start and end points of the price slider 
  if(newfacetStats && newfacetStats[`price.${currency}.default`]) {
    sliderFilters.price = {
      ...sliderFilters.price,
      minValue: newfacetStats[`price.${currency}.default`]?.min,
      maxValue: newfacetStats[`price.${currency}.default`]?.max,
    }
  }
  return sliderFilters;
}

function getFilters({
  locale,
  facets,
  raw_facets,
  query,
  additionalFilter,
  categoryData,
  facets_stats,
  moreFiltersData,
  newfacetStats,
  prodCountFacets,
}) {
  const [lang, country] = locale.split("-");
  const currency = getCurrencyCode(country);

  const filtersObject = {};

  // Sort
  filtersObject.sort = {
    label: translate("sort_by", lang),
    category: "sort",
    is_radio: true,
    selected_filters_count: 0,
    data: {
      recommended: {
        label: translate("our_picks", lang),
        facet_key: "sort",
        facet_value: "recommended",
        is_selected: false,
      },
      latest: {
        label: translate("latest", lang),
        facet_key: "sort",
        facet_value: "latest",
        is_selected: false,
      },
      discount: {
        label: translate("highest_discount", lang),
        facet_key: "sort",
        facet_value: "discount",
        is_selected: false,
      },
      price_low: {
        label: translate("price_low", lang),
        facet_key: "sort",
        facet_value: "price_low",
        is_selected: false,
      },
      price_high: {
        label: translate("price_high", lang),
        facet_key: "sort",
        facet_value: "price_high",
        is_selected: false,
      },
    },
  };

  filtersObject.categories_without_path = makeCategoriesWithoutPathFilter({
    facets,
    query,
    categoryData,
    prodCountFacets,
  });

  // Facet filters
  const visibleFacetsKeys = filterKeys({
    allFacets: facets,
    keys: VISIBLE_FILTERS,
  });

  visibleFacetsKeys.forEach((facetKey) => {
    const slug = getFacetSlug(facetKey);
    const data = formatFacetData({ allFacets: facets, facetKey });

    filtersObject[slug] = {
      label: getLabel(facetKey, lang),
      category: slug,
      is_radio: false,
      selected_filters_count: 0,
      data,
    };
  });

  // Size filters
  const sizeFacetsKeys = filterKeys({ allFacets: facets, keys: SIZE_FILTERS });
  let sizesObject = {
    label: getLabel("sizes", lang),
    category: "sizes",
    is_radio: false,
    selected_filters_count: 0,
    data: {},
  };

  sizeFacetsKeys.forEach((facetKey) => {
    const facetData = formatFacetData({ allFacets: facets, facetKey });
    sizesObject = {
      ...sizesObject,
      data: {
        ...sizesObject.data,
        [facetKey]: {
          facet_key: facetKey,
          label: getLabel(facetKey, lang),
          selected_filters_count: 0,
          subcategories: facetData,
        },
      },
    };
  });

  if (Object.keys(sizesObject.data).length > 0) {
    filtersObject.sizes = sizesObject;
  }

  // Price range
  filtersObject[`price.${currency}.default`] = {
    label: translate("price_range", lang),
    category: `price.${currency}.default`,
    is_radio: true,
    selected_filters_count: 0,
    data: getPriceRangeData({ currency, lang }),
    newPriceRangeData: getNewPriceRangeData({ facets_stats, currency, lang }),
    isPriceFilterAvailable: getIsPriceFilterAvaialbe(facets_stats, currency),
  };

  // Discount
  filtersObject.discount = {
    label: translate("discount", lang),
    category: "discount",
    is_radio: true,
    selected_filters_count: 0,
    data: getDiscountData({ lang }),
    newDiscountData: getNewDiscountData({ facets_stats, currency, lang }),
    isDiscount: getIsDiscount(facets_stats),
  };

  filtersObject["categories.level1"] = makeCategoriesLevel1Filter({
    facets,
    query,
  });

  const _filtersUnselected = deepCopy(filtersObject);

  // Update filtersObject based on query
  // Marking the selected filters
  Object.keys(query).forEach((facetKey) => {
    let facetValues = [query[facetKey]];

    if (!NUMERIC_FILTERS.includes(facetKey)) {
      facetValues = query[facetKey].split(",");
    }

    const category = facetKey.includes("size")
      ? filtersObject.sizes
      : filtersObject[facetKey];

    if (category != null) {
      facetValues.forEach((facetValue) => {
        if (category.data[facetValue]) {
          category.data[facetValue].is_selected = true;
          category.selected_filters_count += 1;
        }

        // marking the selected subcategories filters
        if (facetKey === "categories_without_path") {
          const cat = facetValue;
          if (
            category.data[cat] &&
            category.data[cat].subcategories[facetValue]
          ) {
            category.data[cat].selected_filters_count += 1;
            category.data[cat].subcategories[facetValue].is_selected = true;
            category.selected_filters_count += 1;
          }
        }

        // marking the sizes filters
        if (facetKey.includes("size")) {
          if (category.data[facetKey].subcategories[facetValue]) {
            category.selected_filters_count += 1;
            category.data[facetKey].selected_filters_count += 1;
            category.data[facetKey].subcategories[
              facetValue
            ].is_selected = true;
          }
        }
      });
    }
  });
  let finalFilterObj = filtersObject;
  if (additionalFilter) {
    Object.keys(facets).map((facet) => {
      finalFilterObj = {
        [facet]: filtersObject[facet],
      };
    });
  }
  return {
    filters: finalFilterObj,
    _filtersUnselected,
  };
}

/*
Removes `category` facets for:
- other genders than the selected ones
- 'Outlet'
*/

const filterOutCategoryValues = ({
  values = {},
  facetGender = {},
  queryGender = "",
  lang = "en",
}) => {
  const queryGenderValues = queryGender ? queryGender.split(",") : [];
  const facetGenderValues = Object.keys(facetGender);
  const genders = intersectArrays(queryGenderValues, facetGenderValues, {
    matchFunc: (v) => (i) => i === v,
  });

  return Object.keys(values).reduce((acc, key) => {
    let keepValue = true;

    if (genders.length) {
      keepValue = !!genders.find((genderValue) => {
        /*
Women and Men -> Women /// Shoes
Men /// Shoes

Kids -> Kids /// Girl /// Shoes
Kids /// Boy /// Shoes
Kids /// Baby Girl /// Shoes
Kids /// Baby Boy /// Shoes
*/

        if (VISIBLE_GENDERS.KIDS[genderValue]) {
          if (lang === "ar") {
            return key.match(`أطفال ///`);
          } else {
            return key.match(`Kids ///`);
          }
        }

        if (VISIBLE_GENDERS.OTHER[genderValue]) {
          return key.match(`${genderValue} ///`);
        }

        return false;
      });
    }

    // Remove "Outlet"
    if (key.match("Outlet") || key.match("Influencers") || key.match("SEO")) {
      keepValue = false;
    }

    if (keepValue) {
      acc[key] = values[key];
    }

    return acc;
  }, {});
};

const filterOutGenderValues = ({ values, query }) => {
  const queryValues = getQueryValues({ query, path: "gender" });

  return Object.keys(values).reduce((acc, key) => {
    let keepValue = true;
    if (!VISIBLE_GENDERS.KIDS[key] && !VISIBLE_GENDERS.OTHER[key]) {
      keepValue = false;
    }

    if (!!Object.keys(queryValues).length && !queryValues[key]) {
      keepValue = false;
    }

    if (keepValue) {
      acc[key] = values[key];
    }

    return acc;
  }, {});
};

const isCategoryFacet = (facetKey) =>
  // Avoid processing 'categories.level0'
  facetKey.match(/categories\.level([1-9]\d*)/);
const _formatFacets = ({ facets, queryParams }) => {
  const { gender, locale } = queryParams;
  const [lang] = locale.split("-");

  return Object.entries(facets).reduce((acc, [facetKey, facetValue]) => {
    if (isCategoryFacet(facetKey)) {
      acc[facetKey] = filterOutCategoryValues({
        values: { ...facetValue },
        facetGender: facets?.gender,
        queryGender: gender,
        lang,
      });

      return acc;
    }

    // if (facetKey === "gender") {
    //   acc[facetKey] = filterOutGenderValues({
    //     values: { ...facetValue },
    //     query: queryParams,
    //   });

    //   return acc;
    // }

    acc[facetKey] = facetValue;
    return acc;
  }, {});
};

function getPLP(URL, options = {}, params = {}, categoryData={}, moreFiltersData={} ) {
  const { client, env } = options;
  const moreFiltersArr = moreFiltersData?.more_filter || [];
    // data should get update - data is from json file.
    const newSearchParamsMoreFilters = {
      ...defaultSearchParams,
      facets: [...defaultSearchParams.facets, ...moreFiltersArr],
    };

  return new Promise((resolve, reject) => {
    const parsedURL = new Url(URL, true);
    const queryParams = parsedURL.query;

    const { q = "", page = 0, limit = 16, locale } = queryParams;

    if (!locale) {
      return reject(new Error("Invalid locale"));
    }

    // Get index to search in
    let indexName = getIndex(queryParams.locale, env);
    if (queryParams.sort) {
      indexName = getIndexBySort(queryParams.sort, env, queryParams.locale);
    }
    const index = client.initIndex(indexName);

    // Build search query
    const { facetFilters, numericFilters, newFacetFilters } = getAlgoliaFilters(queryParams, moreFiltersData);
    const  moreFacetFilters = getMoreFacetFilters(queryParams, moreFiltersData);
    const query = {
      indexName: indexName,
      params: {
        ...newSearchParamsMoreFilters,
        facetFilters: newFacetFilters?.length
        ? [...facetFilters, newFacetFilters, ...moreFacetFilters]
        : [...facetFilters, ...moreFacetFilters],
        numericFilters,
        query: q,
        page,
        hitsPerPage: limit,
        clickAnalytics: true,
      },
    };
    let initialFacetFilter = deepCopy(facetFilters);
    let initialFilterArg;
    let filterOption = [];
    initialFacetFilter.map((entry, index) => {
      if (
        entry[0].split(":")[0].includes("categories.level") ||
        entry[0].split(":")[0].includes("brand_name") ||
        entry[0].split(":")[0].includes("gender")
      ) {
        filterOption[index] = entry[0].split(":")[0];
      }
    });

    let isGender = false;
    if (initialFacetFilter.length === 1) {
      initialFilterArg = initialFacetFilter[0];
    } else if (initialFacetFilter.length > 1) {
      if (
        filterOption.findIndex(
          (element) => element && element.includes("categories.level")
        ) !== -1
      ) {
        initialFilterArg = initialFacetFilter[0];
      } else if (filterOption.includes("brand_name")) {
        initialFilterArg =
          initialFacetFilter[filterOption.indexOf("brand_name")];
      } else if (filterOption.includes("gender")) {
        initialFilterArg = initialFacetFilter[filterOption.indexOf("gender")];
        isGender = true;
      }
    }
    const additionalFacets = getAddtionalFacetsFilters(queryParams);
    const queryCopy = {
      params: {
        ...newSearchParamsMoreFilters,
        facetFilters: isGender ? [...additionalFacets] : [initialFilterArg, ...additionalFacets],
        numericFilters,
        query: q,
        page,
        hitsPerPage: limit,
        clickAnalytics: true,
      },
      indexName: indexName,
    };

    let selectedFilterArr = [];
    let exceptFilter = ["page", "q", "sort", "discount", "visibility_catalog"];
    Object.keys(params).map((option) => {
      if (!exceptFilter.includes(option)) {
        selectedFilterArr.push(option);
      }
    });

    let queries = [];
    queries.push(query);

    // To get the correct count of facets
    const queryProdCount = {
      indexName: indexName,
      params: {
        ...newSearchParamsMoreFilters,
        facetFilters: getMasterAlgoliaFilters(queryParams),
        numericFilters,
        query: q,
        page,
        hitsPerPage: limit,
        clickAnalytics: true,
      },
    };
    queries.push(queryProdCount);

    // To get correct position of sliders
    const querySliderPosition = {
      indexName: indexName,
      params: {
        ...newSearchParamsMoreFilters,
        facetFilters: newFacetFilters?.length
        ? [...facetFilters, newFacetFilters, ...moreFacetFilters]
        : [...facetFilters, ...moreFacetFilters],
        numericFilters: [],  //passing empty for discount/price range
        query: q,
        page,
        hitsPerPage: limit,
        clickAnalytics: true,
      },
    };
    queries.push(querySliderPosition);

    if (selectedFilterArr.length > 0) {
      selectedFilterArr.map((filter) => {
        let finalFacetObj = [];
        facetFilters.map((facetfilter) => {
          if (
            selectedFilterArr.includes(facetfilter[0].split(":")[0]) &&
            facetfilter[0].split(":")[0] !== filter
          ) {
            finalFacetObj.push(facetfilter);
          }
        });
        // to get correct More filter options we need to pass APPLIED More filters in multi queries also.
        moreFacetFilters.map((moreFacetfilter) => {          
          if (
            selectedFilterArr.includes(moreFacetfilter[0].split(":")[0]) &&
            moreFacetfilter[0].split(":")[0] !== filter
          ) {
            finalFacetObj.push(moreFacetfilter);
          }
        });
        // if user is applying more filters then to get correct result
        //  we are passing category ids along with it.
        if(moreFiltersArr.includes(filter)) {
          newFacetFilters.map((newFacetFilter) => {
            if (
              selectedFilterArr.includes(newFacetFilter.split(":")[0]) &&
              newFacetFilter.split(":")[0] !== filter
            ) {
              let idsFilter = [newFacetFilter]
              finalFacetObj.push(idsFilter);
            }
          });
        }
        let searchParam = JSON.parse(JSON.stringify(defaultSearchParams));
        searchParam["facets"] = [filter];
        queries.push({
          indexName: indexName,
          params: {
            ...searchParam,
            facetFilters: finalFacetObj,
            numericFilters,
            query: q,
            page,
            hitsPerPage: limit,
            clickAnalytics: true,
          },
        });
      });
    }
    queries.push(queryCopy);
    client.search(queries, (err, res = {}) => {
      if (err) {
        return reject(err);
      }

      const { hits, facets, nbHits, nbPages, hitsPerPage, queryID } =
        res.results[0];

      let finalFiltersData = deepCopy(res.results[0]);
      // if page is Influencer page then we should show correct categories from the result[1]
      let isInfluencer = false;
      if( params['categories.level2'] ) {
        const levels = params['categories.level2'].split(" /// ");
        isInfluencer =  levels[0] === 'Influencers' ? true : false;
      }

      if (Object.values(res.results).length > 1) {
        Object.entries(res.results).map((result, index) => {
          if (index > 2 && index < Object.values(res.results).length - 1) {
            Object.entries(result[1].facets).map((entry) => {
              if( !isInfluencer || (entry[0] != "categories.level2" && isInfluencer) ) {
                finalFiltersData.facets[[entry[0]]] = entry[1];
              }
            });
          } else if (index === 1) {
            // getting category data from result of [1] - passing here all other selected filters except from category filter
            for (let key = 0; key <= 4; key++) {
              if (result[1].facets[`categories.level${key}`]) {
                finalFiltersData.facets[`categories.level${key}`] =
                  result[1].facets[`categories.level${key}`];
              }
            }
          }
        });
      }
      let facets_stats = {};
      let newfacetStats = {};
      // below data is for current user selection
      if ( res && res.results[0] && res.results[0].facets_stats  ) {
        facets_stats = res.results[0].facets_stats;
      }
      // below data is for start and end posion of slider 
      if(res && res.results[2] && res.results[2].facets_stats) {
        newfacetStats = res.results[2].facets_stats;
      }
      // for get the count of the facets
      let prodCountFacets = {};
      if(res && res.results[1] && res.results[1] && res.results[1].facets) {
        prodCountFacets = res.results[1].facets;
      }
      const facetsFilter = deepCopy(finalFiltersData.facets);
      const { filters, _filtersUnselected } = getFilters({
        locale,
        facets: _formatFacets({ facets: facetsFilter, queryParams }),
        raw_facets: facets,
        query: queryParams,
        additionalFilter: false,
        categoryData,
        facets_stats,
        moreFiltersData,
        newfacetStats,
        prodCountFacets,
      });
      const moreFilters = getMoreFilters(finalFiltersData.facets, queryParams, moreFiltersData);
      const sliderFilters = getSliderFilters(queryParams, locale, facets_stats, newfacetStats );

      const output = {
        sliderFilters,
        moreFilters,
        facets,
        data: hits.map(formatNewInTag),
        filters,
        meta: {
          page: res.page,
          limit: hitsPerPage,
          hits_count: nbHits,
          page_count: nbPages,
          query: queryParams,
        },
        _filters_unselected: _filtersUnselected,
        queryID,
      };

      return resolve(output);
    });
  });
}

export { getPLP };
