import {
    setPLPData,
    setPLPInitialFilters,
    setPLPLoading
} from 'Store/PLP/PLP.action';
import Algolia from 'Util/API/provider/Algolia';
import Logger from 'Util/Logger';

export class PLPDispatcher {
    async requestProducts(payload, dispatch) {
        dispatch(setPLPLoading(true));

        const { options } = payload;
        const initOptions = this._getInitalOptions(options);
        const isInitial = JSON.stringify(initOptions) === JSON.stringify(options);

        if (!isInitial) {
            try {
                // Load initial filters to combine them with selected filters
                const { filters } = await Algolia.getPLP(initOptions);
                dispatch(setPLPInitialFilters(filters));
            } catch (e) {
                Logger.log(e);
            }
        }

        try {
            // Try loading PLP, if failed, log error
            // still set options requested into state,
            // done, because we want PLP container
            // to set isLoading to false.
            const {
                data: products,
                meta,
                filters
            } = await Algolia.getPLP(options);

            dispatch(setPLPData(
                products,
                meta,
                filters,
                options,
                isInitial
            ));
        } catch (e) {
            Logger.log(e);
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
