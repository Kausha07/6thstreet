import {
  autocompleteSearch,
  getBrands,
  getPDP,
  getPLP,
  getPopularBrands,
  getProductBySku,
  getSuggestions,
  getTopSearches,
  getWishlistProduct,
  init,
  logAlgoliaAnalytics,
  searchBy,
  getBrandsDetails
} from "./app";
import { getIndex } from "./app/utils";

const AlgoliaSDK = {
  client: null,
  index: null,
  env: process.env.REACT_APP_ALGOLIA_ENV,

  init: (appID, adminKey) => {
    AlgoliaSDK.client = init(appID, adminKey);
  },

  setIndex: (locale, env, index = "") => {
    const indexName = getIndex(locale, env);
    AlgoliaSDK.index = AlgoliaSDK.client.initIndex(index || indexName);
    AlgoliaSDK.env = env;
  },

  getPLP: (URL,params) =>
    getPLP(URL, { client: AlgoliaSDK.client, env: AlgoliaSDK.env },params),
  getPDP: (params) => getPDP(params, { index: AlgoliaSDK.index }),
  searchBy: (params) => searchBy(params, { index: AlgoliaSDK.index }),
  getSuggestions: (params) =>
    getSuggestions(params, { index: AlgoliaSDK.index }),
  autocompleteSearch: (params) =>
    autocompleteSearch(params, { index: AlgoliaSDK.index }),
    getBrandsDetails: (params) =>
    getBrandsDetails(params, { index: AlgoliaSDK.index }),
  getTopSearches: () => getTopSearches({ index: AlgoliaSDK.index }),
  getPopularBrands: (limit) =>
    getPopularBrands(limit, { index: AlgoliaSDK.index }),
  getBrands: (gender) => getBrands(gender, { index: AlgoliaSDK.index }),
  getWishlistProduct: (idsArray) => getWishlistProduct(idsArray, { index: AlgoliaSDK.index }),
  getProductBySku: (params) =>
    getProductBySku(params, { index: AlgoliaSDK.index }),
  logAlgoliaAnalytics: (
    event_type,
    event_name,
    objectIDs,
    queryID,
    userToken,
    position
  ) =>
    logAlgoliaAnalytics(
      event_type,
      event_name,
      objectIDs,
      queryID,
      userToken,
      position,
      {
        index: AlgoliaSDK.index,
      }
    ),
};

export default AlgoliaSDK;
