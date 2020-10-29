import { getStore } from 'Store';
import CartDispatcher from 'Store/Cart/Cart.dispatcher';
import {
    setIsLoading,
    setStoreCredit,
    updateStoreCreditState
} from 'Store/StoreCredit/StoreCredit.action';
import {
    applyStoreCredit,
    getStoreCredit,
    removeStoreCredit
} from 'Util/API/endpoint/StoreCredit/StoreCredit.enpoint';
import { isSignedIn } from 'Util/Auth';
import Logger from 'Util/Logger';

export const STORE_CREDIT = 'store_credit';

export const ONE_MONTH_IN_SECONDS = 2628000;

export class StoreCreditDispatcher {
    async getStoreCredit(dispatch) {
        try {
            dispatch(setIsLoading(true));

            const { data } = isSignedIn()
                ? await getStoreCredit()
                : {};

            dispatch(setStoreCredit(data));
        } catch (e) {
            Logger.log(e);
        }
    }

    async toggleStoreCredit(dispatch, apply) {
        try {
            dispatch(setIsLoading(true));

            const { Cart: { cartId } } = getStore().getState();

            if (apply) {
                await applyStoreCredit(cartId);
            } else {
                await removeStoreCredit(cartId);
            }

            await CartDispatcher.getCartTotals(dispatch, cartId);
            await this.getStoreCredit(dispatch);

            const result = this.isStoreCreditApplied();

            dispatch(updateStoreCreditState(result));

            return result;
        } catch (e) {
            Logger.log(e);

            return false;
        }
    }
}

export default new StoreCreditDispatcher();
