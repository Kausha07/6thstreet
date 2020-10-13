import {
    setStoreCredit
} from 'Store/StoreCredit/StoreCredit.action';
import {
    getStoreCredit
} from 'Util/API/endpoint/StoreCredit/StoreCredit.enpoint';
import Logger from 'Util/Logger';

export const STORE_CREDIT = 'store_credit';

export const ONE_MONTH_IN_SECONDS = 2628000;

export class StoreCreditDispatcher {
    async getStoreCredit(dispatch) {
        try {
            const { data } = await getStoreCredit();

            dispatch(setStoreCredit(data));
        } catch (e) {
            Logger.log(e);
        }
    }
}

export default new StoreCreditDispatcher();
