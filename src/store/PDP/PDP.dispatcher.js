import {
  setPDPData,
  setPDPClickAndCollect,
  setPDPLoading,
} from "Store/PDP/PDP.action";
import {
  sendNotifyMeEmail,
  isClickAndCollectAvailable,
  getClickAndCollectStores,
} from "Util/API/endpoint/Product/Product.enpoint";
import { getStaticFile } from "Util/API/endpoint/StaticFiles/StaticFiles.endpoint";
import Algolia from "Util/API/provider/Algolia";
import Logger from "Util/Logger";
import { setPdpWidgetsData } from "../AppState/AppState.action";

export class PDPDispatcher {
  async requestProduct(payload, dispatch) {
    dispatch(setPDPLoading(true));

    const { options } = payload;
    try {
      const response = await new Algolia().getPDP(options);

      dispatch(setPDPData(response, options));
    } catch (e) {
      Logger.log(e);

      // Needed, so PDP container sets "isLoading" to false
      dispatch(setPDPData({}, {}));
    }
  }
  async resetProduct(payload, dispatch) {
    // remove product from state if not pdp
    dispatch(setPDPData({}, {}));
  }

  async requestProductBySku(payload, dispatch) {
    dispatch(setPDPLoading(true));

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
      console.log(error);
    }
  }

  async sendNotifyMeEmail(data) {
    return sendNotifyMeEmail(data);
  }
}

export default new PDPDispatcher();
