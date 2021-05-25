import {
  createAnalyticsAPI,
  getBrands,
  getPDP,
  getPLP,
  getPopularBrands,
  getProductBySku,
  init,
  searchBy
} from "./app";
import { getIndex } from "./app/utils";

const AlgoliaSDK = {
  client: null,
  index: null,
  env: "production",

  init: (appID, adminKey) => {
    AlgoliaSDK.client = init(appID, adminKey);
  },

  setIndex: (locale, env, index = "") => {
    const indexName = getIndex(locale, env);
    AlgoliaSDK.index = AlgoliaSDK.client.initIndex(index || indexName);
    AlgoliaSDK.env = env;
  },

  getPLP: (URL) =>
    getPLP(URL, { client: AlgoliaSDK.client, env: AlgoliaSDK.env }),
  getPDP: (params) => getPDP(params, { index: AlgoliaSDK.index }),
  searchBy: (params) => searchBy(params, { index: AlgoliaSDK.index }),
  // getSuggestions: (params) => getSuggestions(params, { index: AlgoliaSDK.index }),
  getPopularBrands: (limit) =>
    getPopularBrands(limit, { index: AlgoliaSDK.index }),
  getBrands: (gender) => getBrands(gender, { index: AlgoliaSDK.index }),
  getProductBySku: (params) =>
    getProductBySku(params, { index: AlgoliaSDK.index }),
  createAnalyticsAPI: (event_name,objectIDs,queryID, search_term) =>
    createAnalyticsAPI(event_name,objectIDs,queryID,search_term,{ index: AlgoliaSDK.index }),
};

export default AlgoliaSDK;
