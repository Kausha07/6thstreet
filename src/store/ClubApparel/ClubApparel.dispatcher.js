import {
    getMember,
    linkAccount,
    verifyOtp
} from 'Util/API/endpoint/ClubApparel/ClubApparel.enpoint';
import Logger from 'Util/Logger';

export class ClubApparelDispatcher {
    /* eslint-disable-next-line */
    async getMember(dispatch, userId) {
        try {
            return await getMember({ userId });
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
}

export default new ClubApparelDispatcher();
