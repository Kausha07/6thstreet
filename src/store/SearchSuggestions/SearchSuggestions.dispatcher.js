import { getStore } from "Store";
import { setSearchSuggestions,setAlgoliaIndex } from "Store/SearchSuggestions/SearchSuggestions.action";
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

    var searchQuery = search;
      // This if condition implements PWA 2423 for Bahrain, Oman & Qatar
    if(searchQuery.match(new RegExp(gender, "i")) === null && country.match(/bh|om|qa/i)) {
      searchQuery = `${search} ${isArabic() ? getGenderInArabic(gender) : gender} `;
    }

    try {
      const searchData = await new Algolia().getProductForSearchContainer(
        {
          q: search,
          page: 0,
          limit: PRODUCT_RESULT_LIMIT,
          gender: isArabic() ? getGenderInArabic(gender) : gender,
        },
        {
          indexName: sourceQuerySuggestionIndex,
          params: {
            query: searchQuery,
            hitsPerPage: QUERY_SUGGESTION_LIMIT,
            clickAnalytics: true,
          }
        }
      );
      let { productData, suggestionData } = searchData;
      
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
      
      const defaultHit = {
        query: search,
        count: "",
      };

      var querySuggestions = [defaultHit];
      if(country.match(/bh|om|qa/i)){
        querySuggestions = suggestionData?.hits || [defaultHit];
      }
      else {
        querySuggestions =
        suggestionData?.hits?.length > 0
        ? getCustomQuerySuggestions(suggestionData?.hits, sourceIndexName, suggestionData?.query)
        : [defaultHit];
      }
      
      if (suggestionData && suggestionData.queryID) {
        queryID = suggestionData.queryID;
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

  async requestAlgoliaIndex(dispatch) {
    const algoliaIndex = await new Algolia().getIndex();
    dispatch(
      setAlgoliaIndex(algoliaIndex)
    );
  }
}

export default new SearchSuggestionsDispatcher();
