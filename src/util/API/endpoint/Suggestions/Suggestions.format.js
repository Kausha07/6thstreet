import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import BrowserDatabase from "Util/BrowserDatabase";

const { gender } = BrowserDatabase.getItem(APP_STATE_CACHE_KEY) || {};

const BRANDS_RESULT_LIMIT = 4;

const getBrandsArrayFromFacets = ({ facets = {} }) => {
  try {
    if (!facets.brand_name) {
      return [];
    }

    return Object.keys(facets.brand_name || {})
      .map((item) => ({ brand_name: item, count: facets.brand_name[item] }))
      .slice(0, BRANDS_RESULT_LIMIT);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return [];
  }
};

// eslint-disable-next-line import/prefer-default-export
export const formatProductSuggestions = (rawData) => {
  const data = {
    brands: getBrandsArrayFromFacets(rawData),
    products: rawData.data,
  };

  return data;
};

export const formatQuery = (query) => {
  let avoidFilter = gender;
  if (
    query.toUpperCase().includes("GIRL") ||
    query.toUpperCase().includes("BOY") ||
    query.toUpperCase().includes("GIRLS") ||
    query.toUpperCase().includes("BOYS") ||
    query.toUpperCase().includes("BABY BOY") ||
    query.toUpperCase().includes("BABY GIRL")
  )
    avoidFilter = "kids";
  else if (gender === "all") return query;

  let regex = new RegExp("\\b" + gender + "\\b", "i");
  return query
    .replace(regex, "")
    .replace(/^\s+|\s+$/g, "")
    .replace(/\s+/g, " ");
};
