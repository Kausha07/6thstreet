import { getStore } from 'Store';
import CartDispatcher from 'Store/Cart/Cart.dispatcher';
import { showNotification } from 'Store/Notification/Notification.action';
import {
    setMyWallet,
    setIsLoading,
} from 'Store/MyWallet/MyWallet.action';
import {
    applyRewards,
    removeReward,
    getReward,
} from 'Util/API/endpoint/Wallet/Wallet.endpoint';
import { isSignedIn } from 'Util/Auth';
import Logger from 'Util/Logger';

export const MY_WALLET = 'my_wallet';

export const ONE_MONTH_IN_SECONDS = 2628000;

export class MyWalletDispatcher {
    async getReward(dispatch) {
        try {
            dispatch(setIsLoading(true));

            const { data } = isSignedIn()
                ? await getReward()
                : {};

            dispatch(setMyWallet(data));
        } catch (e) {
            Logger.log(e);
        }
    }

    async toggleMyWallet(dispatch, apply) {
        try {
            dispatch(setIsLoading(true));

            const { Cart: { cartId } } = getStore().getState();

            if (apply) {
                await applyRewards(cartId);

                dispatch(showNotification('success', __('Store Credits are applied!')));
            } else {
                await removeReward(cartId);

                dispatch(showNotification('success', __('Store Credits are removed!')));
            }

            await CartDispatcher.getCartTotals(dispatch, cartId);
            await this.getReward(dispatch);

            return true;
        } catch (e) {
            Logger.log(e);

            dispatch(showNotification('error', __('There was an error, please try again later.')));

            return false;
        }
    }
}

export default new MyWalletDispatcher();
