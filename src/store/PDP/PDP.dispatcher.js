import { setPDPData, setPDPLoading } from 'Store/PDP/PDP.action';
import Algolia from 'Util/API/provider/Algolia';
import Logger from 'Util/Logger';

export class PDPDispatcher {
    async requestProduct(payload, dispatch) {
        dispatch(setPDPLoading(true));

        const { options } = payload;

        try {
            const response = await Algolia.getPDP(options);

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
}

export default new PDPDispatcher();
