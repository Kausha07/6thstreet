import { getStore } from 'Store';
import { setSearchSuggestions } from 'Store/SearchSuggestions/SearchSuggestions.action';
import { formatProductSuggestions } from 'Util/API/endpoint/Suggestions/Suggestions.format';
import Algolia from 'Util/API/provider/Algolia';
import { isArabic } from 'Util/App';

const PRODUCT_RESULT_LIMIT = 8;

export class SearchSuggestionsDispatcher {
    async requestSearchSuggestions(search, dispatch) {
        const { AppState: { gender } } = getStore().getState();

        try {
            const productData = await new Algolia().searchBy(
                isArabic()
                    ? {
                        query: search,
                        limit: PRODUCT_RESULT_LIMIT
                    }
                    : {
                        gender,
                        query: search,
                        limit: PRODUCT_RESULT_LIMIT
                    }
            );

            // In case anyone needs desktop data (use this!)
            // const lang = language === 'en' ? 'english' : 'arabic';

            // const { hits: searchSuggestions } = await new Algolia({
            //     index: `enterprise_magento_${ lang }_suggestions`
            // }).getSuggestions({
            //     query: search,
            //     limit: SEARCH_RESULT_LIMIT
            // });

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

            // console.log(
            //     searchSuggestions,
            //     categorySuggestions,
            //     productSuggestions
            // );

            const results = formatProductSuggestions(productData);

            dispatch(setSearchSuggestions(
                search,
                results
            ));
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            dispatch(setSearchSuggestions(search));
        }
    }
}

export default new SearchSuggestionsDispatcher();
