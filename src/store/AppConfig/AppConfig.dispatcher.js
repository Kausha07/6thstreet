import { setAppConfig, setHomePagePersonalisationConfig } from 'Store/AppConfig/AppConfig.action';
import { getCities, getConfig, getBottomNavigationConfig, getHomePagePersonalisationConfig } from 'Util/API/endpoint/Config/Config.endpoint';
import Logger from 'Util/Logger';

export class AppConfigDispatcher {
    async getAppConfig(dispatch) {
        try {
            const bottomNavigationConfig = await getBottomNavigationConfig();
            const config = await getConfig();
            const gtmConfig = this.getGtmConfig();
            const HompagePersonalisationConfig = await getHomePagePersonalisationConfig();
            const appConfig = { ...config, ...gtmConfig, bottomNavigationConfig };
            dispatch(setAppConfig(appConfig));
            dispatch(setHomePagePersonalisationConfig(HompagePersonalisationConfig));
        } catch (e) {
            Logger.log(e);
        }
    }

    getGtmConfig() {
        return {
            gtm: {
                gtm_id: process.env.REACT_APP_GTM_ID,
                enabled: process.env.REACT_APP_GTM_ENABLED === 'true'
            }
        };
    }

    /* eslint-disable-next-line */
    async getCities(dispatch, locale) {
        try {
            return await getCities(locale);
        } catch (e) {
            Logger.log(e);
        }
    }
}

export default new AppConfigDispatcher();
