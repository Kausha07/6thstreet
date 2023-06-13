import {
  setPDPData,
  setPDPClickAndCollect,
  setPDPLoading,
  setPDPShowSearch,
  setBrandButtonClick
} from "Store/PDP/PDP.action";
import { getStore } from "Store";

import {
  sendNotifyMeEmail,
  isClickAndCollectAvailable,
  getClickAndCollectStores,
} from "Util/API/endpoint/Product/Product.enpoint";
import { getStaticFile }
  from "Util/API/endpoint/StaticFiles/StaticFiles.endpoint";
import Algolia from "Util/API/provider/Algolia";
import Logger from "Util/Logger";
import { getProductDetailsById, getProductDetailsBySKU }
  from "Util/API/endpoint/Catalogue/Product/Product.endpoint"

import { setPdpWidgetsData } from "../AppState/AppState.action";

export class PDPDispatcher {

  formatNewInTag(productData = {}) {
    const { is_new_in } = productData;
    return {
      ...productData,
      is_new_in: is_new_in === 1 ? true : false,
    };
  };

  formatData(productData) {
    const data = this.formatNewInTag(productData);
    const { _highlightResult, ...rest } = data;
    const highlighted_attributes = []
    if (productData?.name)
      highlighted_attributes.push({ key: 'name', value: productData.name })
    if (productData?.color)
      highlighted_attributes.push({ key: 'color', value: productData.color })
    if (productData?.sku)
      highlighted_attributes.push({ key: 'sku', value: productData.sku })
    if (productData?.brand_name)
      highlighted_attributes.push({ key: 'brand_name', value: productData.brand_name })
    if (productData?.gender)
      highlighted_attributes.push({ key: 'gender', value: productData.gender[0] })
    if (productData?.alternate_name)
      highlighted_attributes.push({ key: 'alternate_name', value: productData.alternate_name })
    console.log("kiranHighlted",highlighted_attributes,rest);
    return {
      highlighted_attributes,
      ...rest,
    };
  }

  async getProductDetailByIdCatalogue(options, dispatch) {
    const locale = getStore().getState().AppState.locale
    if(locale && options?.id) {
      getProductDetailsById(locale, options.id).then((data) => {
        if(data?.brand_name){
          const tempResponse = {}
          tempResponse['data'] = this.formatData(data)
          if(typeof data === 'object' ){
            tempResponse['nbHits'] = 1;
          }else if(typeof data === 'string') {
            tempResponse['nbHits'] = 0;
            tempResponse['data'] = {};
          }
          console.log("kiran7",tempResponse,options);
          dispatch(setPDPData(tempResponse, options));
          dispatch(setPDPLoading(false));
          return tempResponse
        }
      }).catch((error) => {
        Logger.log(error);
        // Needed, so PDP container sets "isLoading" to false
        dispatch(setPDPData({}, {}));
        dispatch(setPDPLoading(false));
      })
    }
  }

  async getProductDetailByIdAlgolia(options, dispatch) {
    try {
      const response = await new Algolia().getPDP(options);
      dispatch(setPDPData(response, options));
      dispatch(setPDPLoading(false));
      return response
    } catch (e) {
      Logger.log(e);
      // Needed, so PDP container sets "isLoading" to false
      dispatch(setPDPData({}, {}));
      dispatch(setPDPLoading(false));
    }
  }

  async requestProduct(payload, dispatch) {
    dispatch(setPDPLoading(true));
    const { options } = payload;
    const store = getStore().getState()
    const isFetchFromAlgolia =
      store.AppConfig.config
        .countries[store.AppState.country]['catalogue_from_algolia']
    console.log("kiranTempResponseFetch",isFetchFromAlgolia)
    return isFetchFromAlgolia
      ? await this.getProductDetailByIdAlgolia(options, dispatch)
      : await this.getProductDetailByIdCatalogue(options, dispatch)
  }

  async resetProduct(payload, dispatch) {
    // remove product from state if not pdp
    dispatch(setPDPData({}, {}));
  }

  async getProductDetailsBySkuAlgolia(payload, dispatch) {
    const {
      options,
      options: { sku },
    } = payload;
    try {
      const response = await new Algolia().getProductBySku({ sku });
      dispatch(setPDPData(response, options));
    } catch (e) {
      Logger.log(e);
      // Needed, so PDP container sets "isLoading" to false
      dispatch(setPDPData({}, options));
    }
  }

  async getProductDetailsBySkuCatalogue(payload, dispatch) {
    const {
      options,
      options: { sku },
    } = payload;
    console.log("kiran10",payload);
    getProductDetailsBySKU(locale, sku).then((data) => {
      const tempResponse = {}
      tempResponse['data'] = this.formatData(data)
      tempResponse['nbHits'] = 1;
      dispatch(setPDPData(tempResponse, options));
      return tempResponse
    }).catch((error) => {
      Logger.log(error);
      // Needed, so PDP container sets "isLoading" to false
      dispatch(setPDPData({}, options));
    })
  }

  async requestProductBySku(payload, dispatch) {
    const store = getStore().getState()
    const isFetchFromAlgolia =
      store.AppConfig.config
        .countries[store.AppState.country]['catalogue_from_algolia']
    dispatch(setPDPLoading(true));
    const {
      options,
      options: { sku },
    } = payload;
    return isFetchFromAlgolia
      ? await this.getProductDetailsBySkuAlgolia(options, dispatch)
      : await this.getProductDetailsBySkuCatalogue(options, dispatch)
  }

  async getClickAndCollectStores(
    brandName,
    sku,
    latitude,
    longitude,
    dispatch
  ) {
    let clickAndCollectStores = [];
    try {
      const isAvailableResponse = await isClickAndCollectAvailable({
        brandName,
        sku,
      });
      if (isAvailableResponse?.data?.isAvailable) {
        const storeListResponse = await getClickAndCollectStores({
          brandName,
          sku,
          latitude,
          longitude,
        });
        clickAndCollectStores = (storeListResponse?.data?.items || []).map(
          (store) => ({
            id: store.storeNo,
            value: store.storeNo,
            label: store.name,
            address: store.address,
            area: store.area,
            city: store.city,
          })
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(setPDPClickAndCollect(clickAndCollectStores));
    }
  }

  async requestPdpWidgetData(dispatch) {
    try {
      const pdpWidgetData = await getStaticFile("pdp");
      if (pdpWidgetData && pdpWidgetData.widgets) {
        dispatch(setPdpWidgetsData(pdpWidgetData.widgets));
      }
    } catch (error) {
      console.error(error);
    }
  }

  async sendNotifyMeEmail(data) {
    return sendNotifyMeEmail(data);
  }

  async setPDPShowSearch(payload, dispatch) {
    const { displaySearch } = payload;
    dispatch(setPDPShowSearch(displaySearch));
  }

  async setBrandButtonClick(payload, dispatch) {
    const { brandButtonClick } = payload;
    dispatch(setBrandButtonClick(brandButtonClick));
  }
}

export default new PDPDispatcher();
