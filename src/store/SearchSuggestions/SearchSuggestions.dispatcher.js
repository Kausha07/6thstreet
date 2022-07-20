import { getStore } from "Store";
import { setSearchSuggestions } from "Store/SearchSuggestions/SearchSuggestions.action";
import { getCustomQuerySuggestions } from "Util/API/endpoint/Suggestions/Suggestions.create";
import { formatProductSuggestions } from "Util/API/endpoint/Suggestions/Suggestions.format";
import Algolia from "Util/API/provider/Algolia";
import { getGenderInArabic } from "Util/API/endpoint/Suggestions/Suggestions.create";
import { isArabic } from "Util/App";
const PRODUCT_RESULT_LIMIT = 8;
const QUERY_SUGGESTION_LIMIT = 5;

export class SearchSuggestionsDispatcher {
  async requestSearchSuggestions(
    search,
    sourceIndexName,
    sourceQuerySuggestionIndex,
    dispatch
  ) {
    const {
      AppState: { gender, country },
    } = getStore().getState();
    let queryID = null;

    try {
      const productData = await new Algolia().getPLP(
        isArabic()
          ? {
              q: search,
              page: 0,
              limit: PRODUCT_RESULT_LIMIT,
              gender: getGenderInArabic(gender),
              // query: search,
              // limit: PRODUCT_RESULT_LIMIT,
              // gender: getGenderInArabic(gender),
              // addAnalytics: false,
            }
          : {
              // query: search,
              // limit: PRODUCT_RESULT_LIMIT,
              gender: gender,
              // addAnalytics: false,
              q: search,
              page: 0,
              limit: PRODUCT_RESULT_LIMIT,
              // gender: gender,
            }
      );

      // if you need search analytics then uncomment it (default automatically tracks it) UPDATE: causing wrong data.

      // var data = localStorage.getItem("customer");
      // let userData = JSON.parse(data);
      // let userToken;
      //   if (userData?.data?.id) {
      //   userToken = userData.data.id;
      // }
      // const objectIDs = productData.data.map(item => item.objectID);
      // await new Algolia().logAlgoliaAnalytics(
      //   'view',
      //   VIEW_SEARCH_RESULTS_ALGOLIA,
      //   {
      //     search_item: search,
      //     items: productData.data,
      //     list: "Search Results",
      //   },
      //   { objectIDs, queryID: productData.queryID,userToken: userToken ? `user-${userToken}`: getUUIDToken(),  },
      //   );

      // const { hits: categorySuggestions } = await new Algolia({
      //     index: `enterprise_magento_${ lang }_categories`
      // }).getSuggestions({
      //     query: search,
      //     limit: CATEGORY_RESULT_LIMIT
      // });

      // const { hits: productSuggestions } = await new Algolia({
      //     index: `enterprise_magento_${ lang }_products`
      // }).getSuggestions({
      //     query: search,
      //     limit: PRODUCT_RESULT_LIMIT
      // });

      // In case anyone needs desktop data (use this!)
      // const lang = language === 'en' ? 'english' : 'arabic';
      var searchQuery = search;
      // This if condition implements PWA 2423 for Bahrain, Oman & Qatar
      if(searchQuery.match(new RegExp(gender, "i")) === null && country.match(/bh|om|qa/i)) {
        searchQuery = `${search} ${isArabic() ? getGenderInArabic(gender) : gender} `;
      }

      const data = await new Algolia({
        index: sourceQuerySuggestionIndex,
      }).autocompleteSearch(
        isArabic()
          ? {
              query: searchQuery,
              limit: QUERY_SUGGESTION_LIMIT,
            }
          : {
              query: searchQuery,
              limit: QUERY_SUGGESTION_LIMIT,
            }
      );
      const defaultHit = {
        query: search,
        count: "",
      };

      var querySuggestions = [defaultHit];
      if(country.match(/bh|om|qa/i)){
        querySuggestions = data?.hits || [defaultHit];
      }
      
      else {
        querySuggestions =
        data?.hits?.length > 0
        ? getCustomQuerySuggestions(data?.hits, sourceIndexName)
        : [defaultHit];
      }


      
      if (data && data.queryID) {
        queryID = data.queryID;
      } else {
        queryID = productData?.queryID ? productData?.queryID : null;
      }
      const results = formatProductSuggestions(productData);
      dispatch(
        setSearchSuggestions(search, results, queryID, querySuggestions)
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      dispatch(setSearchSuggestions(search));
    }
  }
}

export default new SearchSuggestionsDispatcher();
