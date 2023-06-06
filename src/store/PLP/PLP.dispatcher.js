import { HOME_STATIC_FILE_KEY } from "Route/HomePage/HomePage.config";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import {
  setPLPData,
  setPLPInitialFilters,
  setPLPLoading,
  setPLPPage,
  setPLPWidget,
  setProductLoading,
  updateNewActiveFilters,
} from "Store/PLP/PLP.action";
import { getStaticFile } from "Util/API/endpoint/StaticFiles/StaticFiles.endpoint";
import Algolia from "Util/API/provider/Algolia";
import BrowserDatabase from "Util/BrowserDatabase";
import Logger from "Util/Logger";
import isMobile from "Util/Mobile";
import { isArabic } from "Util/App";
export class PLPDispatcher {
  async setInitialPLPFilter(payload, dispatch, state) {
    const { initialOptions = {} } = payload;
    try {
      const { filters: initialFilters } = await new Algolia().getPLP(
        initialOptions
      );

      dispatch(setPLPInitialFilters(initialFilters, initialOptions));
    } catch (e) {
      Logger.log(e);
    }
  }

  async requestProductList(payload, dispatch, state) {
    const { options = {} } = payload;

    if (Object.keys(options).length !== 0) {
      dispatch(setPLPLoading(true));
      try {
        let categoryData = {};
        const lang = isArabic() ? "ar" : "en";
        const resp = await getStaticFile("category_data", {
          $FILE_NAME: `/categoryData.json`,
          $LANGUAGE: lang,
        });
        if(resp) {
          categoryData = resp;
        }
        let moreFiltersData = {};
        const more_filter = await getStaticFile("more_filter", {
          $FILE_NAME: `/more_filter.json`,
        });
        if(more_filter) {
          moreFiltersData = more_filter;
        }
        const response = await new Algolia().getPLP(options, categoryData, moreFiltersData);
        localStorage.setItem("queryID", response.queryID);
        dispatch(setProductLoading(false));
        dispatch(updateNewActiveFilters(response?.filters?.categories_without_path?.newActiveFilters || {}))
        dispatch(setPLPInitialFilters(response.filters, options));
        dispatch(setPLPData(response, options, false));
      } catch (e) {
        Logger.log(e);

        // Needed, so PLP container sets "isLoading" to false
        dispatch(setPLPData({}, options, false));
      }
    }
  }

  resetPLPData(dispatch) {
    dispatch(setPLPData({}));
  }

  updateNewActiveFiltersToStore(updatedNewActiveFilters, dispatch) {
    dispatch(updateNewActiveFilters(updatedNewActiveFilters));
  }

  async requestProductListPage(payload, dispatch) {
    const {
      options,
      options: { page },
    } = payload;

    try {
      const { data: products } = await new Algolia().getPLP(options);
      dispatch(setProductLoading(false));
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
      : "women";

    const devicePrefix = this.getDevicePrefix();
    if(gender !== "influencer")
    {
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
