import { getStore } from 'Store';
import CartDispatcher from 'Store/Cart/Cart.dispatcher';
import {
    setClubApparel,
    setIsLoading,
    updateClubApparelState
} from 'Store/ClubApparel/ClubApparel.action';
import {
    applyPoints,
    getMember,
    linkAccount,
    removePoints,
    verifyOtp
} from 'Util/API/endpoint/ClubApparel/ClubApparel.enpoint';
import { isSignedIn } from 'Util/Auth';
import Logger from 'Util/Logger';

export const CLUB_APPAREL = 'club_apparel';

export const ONE_MONTH_IN_SECONDS = 2628000;

export class ClubApparelDispatcher {
    async getMember(dispatch) {
        try {
            dispatch(setIsLoading(true));

            const { MyAccountReducer: { customer: { id } = {} } = {} } = getStore().getState();
            const { data } = isSignedIn()
                ? await getMember(id)
                : {};

            dispatch(setClubApparel(data));
        } catch (e) {
            Logger.log(e);
        }
    }

    /* eslint-disable-next-line */
    async linkAccount(dispatch, data) {
        try {
            return await linkAccount(data);
        } catch (e) {
            Logger.log(e);
        }
    }

    /* eslint-disable-next-line */
    async verifyOtp(dispatch, data) {
        try {
            return await verifyOtp(data);
        } catch (e) {
            Logger.log(e);
        }
    }

    async toggleClubApparelPoints(dispatch, apply) {
        try {
            dispatch(setIsLoading(true));

            const {
                Cart: { cartId },
                ClubApparelReducer: { clubApparel: { caPoints = 0, caPointsValue = 0 } = {} }
            } = getStore().getState();

            if (apply) {
                await applyPoints(cartId, caPoints, caPointsValue);
            } else {
                await removePoints(cartId);
            }

            await CartDispatcher.getCartTotals(dispatch, cartId);
            await this.getMember(dispatch);

            const result = await this.areClubApparelPointsApplied();

            dispatch(updateClubApparelState(result));

            return result;
        } catch (e) {
            Logger.log(e);

            return false;
        }
    }
}

export default new ClubApparelDispatcher();
