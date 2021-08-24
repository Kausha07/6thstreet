import {
  setPLPData,
  setPLPInitialFilters,
  setPLPLoading,
  setPLPPage,
  setPLPWidget,
} from "Store/PLP/PLP.action";
import Algolia from "Util/API/provider/Algolia";
import Logger from "Util/Logger";
import isMobile from "Util/Mobile";
import BrowserDatabase from "Util/BrowserDatabase";
import { getStaticFile } from "Util/API/endpoint/StaticFiles/StaticFiles.endpoint";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import { HOME_STATIC_FILE_KEY } from "Route/HomePage/HomePage.config";
export class PLPDispatcher {
  async requestProductList(payload, dispatch, state) {
    const { options = {} } = payload;

    if (Object.keys(options).length !== 0) {
      dispatch(setPLPLoading(true));

      // Same as normal options without custom filters, i.e. attributes
      const initialOptions = this._getInitalOptions(options);

      // is inital - assume request is inital, if it matches inital options
      const isInitial =
        JSON.stringify(initialOptions) === JSON.stringify(options);
      const { initialOptions: stateInitialOptions } = state;

      // if this is inital request and the state options differ => load inital options
      if (!isInitial && initialOptions !== stateInitialOptions) {
        try {
          // Load initial filters to combine them with selected filters
          const { filters: initialFilters } = await new Algolia().getPLP(
            initialOptions
          );

          dispatch(setPLPInitialFilters(initialFilters, initialOptions));
        } catch (e) {
          Logger.log(e);
        }
      }

      try {
        const response = await new Algolia().getPLP(options);
        localStorage.setItem("queryID", response.queryID);
        dispatch(setPLPData(response, options, isInitial));
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
      options: { page },
    } = payload;

    try {
      const { data: products } = await new Algolia().getPLP(options);

      dispatch(setPLPPage(products, page));
    } catch (e) {
      Logger.log(e);

      // Needed, so PLPPages container sets "isLoading" to false
      dispatch(setPLPPage({}, page));
    }
  }

  getDevicePrefix() {
    return isMobile.any() ? "m/" : "d/";
  }

  async requestPLPWidgetData(dispatch) {
    const gender = BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
      ? BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
      : "all";

    const devicePrefix = this.getDevicePrefix();
    try {
      const plpData = await getStaticFile(HOME_STATIC_FILE_KEY, {
        $FILE_NAME: `${devicePrefix}${gender}_plp.json`,
      });
      if (Array.isArray(plpData)) {
        dispatch(setPLPWidget(plpData));
      }
    } catch (e) {
      // TODO: handle error
      Logger.log(e);
    }
  }

  updatePlpWidgetData(payload, dispatch) {
    dispatch(setPLPWidget(payload));
  }

  _getInitalOptions(options = {}) {
    // eslint-disable-next-line no-unused-vars
    return Object.entries(options).reduce((acc, [key, value]) => {
      if (["q", "sort", "page"].includes(key) || /categories\./.test(key)) {
        acc[key] = value;
      }

      return acc;
    }, {});
  }
}

export default new PLPDispatcher();
