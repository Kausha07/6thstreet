import { setAppConfig } from 'Store/AppConfig/AppConfig.action';
import { getConfig } from 'Util/API/endpoint/Config/Config.endpoint';

export class AppConfigDispatcher {
    async getAppConfig(dispatch) {
        const config = await getConfig();
        dispatch(setAppConfig(config));
    }
}

export default new AppConfigDispatcher();
