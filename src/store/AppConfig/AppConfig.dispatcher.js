import { setAppConfig, setABTestingConfig, setVWOConfig } from 'Store/AppConfig/AppConfig.action';
import { getCities, getConfig, getBottomNavigationConfig, getABTestingConfig } from 'Util/API/endpoint/Config/Config.endpoint';
import { getCountryFromUrl } from "Util/Url";
import BrowserDatabase from "Util/BrowserDatabase";
import { getUUID, setUUID } from "Util/Auth";
import { v4 as uuidv4 } from "uuid";
import Logger from 'Util/Logger';

export class AppConfigDispatcher {

    getUserVWOVariation = async (
    customer,
    abTestingConfig = {}
    ) => {
    let userId = customer?.id ? customer?.id : getUUID();
    // If user is not loged in and UUID is also not created then below code will run
    if (!userId) {
        setUUID(uuidv4());
        userId = getUUID();
    }
    
    const siteWideCampaignName = abTestingConfig?.SiteWideCoupon?.campaignName || "feature_test_sitewide_coupon";
    const countryCode = getCountryFromUrl();
    const options = {countryCode};
    const SiteWideCoupon = {};

    // Get Logged in User Variations from VWO tool
    try {
        if (userId && vwoClientInstance) {
    
            // isFeature Enbaled se sara kam krna or 
            const isFeatureEnabled = 
                vwoClientInstance.isFeatureEnabled(siteWideCampaignName, userId, options);

                //  may be will read coupon code from here
            const enable_sitewide_coupon = 
                vwoClientInstance.getFeatureVariableValue(siteWideCampaignName, 'enable_sitewide_coupon', userId, options);
    
            SiteWideCoupon.isFeatureEnabled = isFeatureEnabled;
            SiteWideCoupon.enable_sitewide_coupon = enable_sitewide_coupon;
            return {SiteWideCoupon};
        }
    } catch (e) {
        console.error("vwo varition error", e);
    }
    }

    async getAppConfig(dispatch) {
        try {
            const customer = BrowserDatabase.getItem("customer") || {};
            const bottomNavigationConfig = await getBottomNavigationConfig();
            const config = await getConfig();
            const gtmConfig = this.getGtmConfig();
            const abTestingConfigData = await getABTestingConfig();
            const appConfig = { ...config, ...gtmConfig, bottomNavigationConfig };
            const vwoData =  await this.getUserVWOVariation(customer, abTestingConfigData ) || null;
            dispatch(setAppConfig(appConfig));
            dispatch(setABTestingConfig(abTestingConfigData));
            vwoData ? dispatch(setVWOConfig(vwoData)) : null;
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
