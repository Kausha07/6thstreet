import {
    setPLPData,
    setPLPInitialFilters,
    setPLPLoading,
    setPLPPage
} from 'Store/PLP/PLP.action';
import Algolia from 'Util/API/provider/Algolia';
import Logger from 'Util/Logger';

export class PLPDispatcher {
    async requestProductList(payload, dispatch, state) {
        const { options } = payload;

        if (Object.keys(options).length !== 0) {
            dispatch(setPLPLoading(true));

            // Same as normal options without custom filters, i.e. attributes
            const initialOptions = this._getInitalOptions(options);

            // is inital - assume request is inital, if it matches inital options
            const isInitial = JSON.stringify(initialOptions) === JSON.stringify(options);
            const { initialOptions: stateInitialOptions } = state;

            // if this is inital request and the state options differ => load inital options
            if (!isInitial && initialOptions !== stateInitialOptions) {
                try {
                // Load initial filters to combine them with selected filters
                    const { filters: initialFilters } = await new Algolia().getPLP(initialOptions);
                    // console.log('initialFilters', initialFilters);
                    dispatch(setPLPInitialFilters(
                        initialFilters,
                        initialOptions
                    ));
                } catch (e) {
                    Logger.log(e);
                }
            }

            try {
                const response = await new Algolia().getPLP(options);
                // console.log('response', response);
                dispatch(setPLPData(
                    response,
                    options,
                    isInitial
                ));
            } catch (e) {
                Logger.log(e);

                // Needed, so PLP container sets "isLoading" to false
                dispatch(setPLPData({}, options, isInitial));
            }
        }
    }

    async requestProductListPage(payload, dispatch) {
        const {
            options,
            options: { page }
        } = payload;

        try {
            const {
                data: products
            } = await new Algolia().getPLP(options);

            dispatch(setPLPPage(
                products,
                page
            ));
        } catch (e) {
            Logger.log(e);

            // Needed, so PLPPages container sets "isLoading" to false
            dispatch(setPLPPage({}, page));
        }
    }

    _getInitalOptions(options) {
        // eslint-disable-next-line no-unused-vars
        return Object.entries(options).reduce((acc, [key, value]) => {
            if (
                ['q', 'sort', 'page'].includes(key)
                || /categories\./.test(key)
            ) {
                acc[key] = value;
            }

            return acc;
        }, {});
    }
}

export default new PLPDispatcher();
