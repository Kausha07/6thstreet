import { setPDPData, setPDPLoading } from 'Store/PDP/PDP.action';
import { getProductStock } from 'Util/API/endpoint/Product/Product.enpoint';
import Algolia from 'Util/API/provider/Algolia';
import Logger from 'Util/Logger';
import { getStaticFile } from 'Util/API/endpoint/StaticFiles/StaticFiles.endpoint';
import { setPdpWidgetsData } from '../AppState/AppState.action';

export class PDPDispatcher {
    async requestProduct(payload, dispatch) {
        dispatch(setPDPLoading(true));

        const { options } = payload;

        try {
            const response = await new Algolia().getPDP(options);

            dispatch(setPDPData(
                response,
                options
            ));
        } catch (e) {
            Logger.log(e);

            // Needed, so PDP container sets "isLoading" to false
            dispatch(setPDPData({}, options));
        }
    }

    async requestProductBySku(payload, dispatch) {
        dispatch(setPDPLoading(true));

        const { options, options: { sku } } = payload;

        try {
            const response = await new Algolia().getProductBySku({ sku });

            dispatch(setPDPData(
                response,
                options
            ));
        } catch (e) {
            Logger.log(e);

            // Needed, so PDP container sets "isLoading" to false
            dispatch(setPDPData({}, options));
        }
    }

    async getProductStock(dispatch, sku) {
        return getProductStock(sku);
    }

    async requestPdpWidgetData(dispatch) {
        const pdpWidgetData = await getStaticFile('pdp');
        if (pdpWidgetData && pdpWidgetData.widgets) {
            dispatch(setPdpWidgetsData(pdpWidgetData.widgets));
        }
    }
}

export default new PDPDispatcher();
