import { setAppConfig } from 'Store/AppConfig/AppConfig.action';
import { getCities, getConfig } from 'Util/API/endpoint/Config/Config.endpoint';
import Logger from 'Util/Logger';

export class AppConfigDispatcher {
    async getAppConfig(dispatch) {
        try {
            const config = await getConfig();
            dispatch(setAppConfig(config));
        } catch (e) {
            Logger.log(e);
        }
    }

    /* eslint-disable-next-line */
    async getCities(dispatch) {
        try {
            return await getCities();
        } catch (e) {
            Logger.log(e);
        }
    }
}

export default new AppConfigDispatcher();
