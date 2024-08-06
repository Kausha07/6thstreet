import { setAppConfig, setABTestingConfig, setVWOConfig } from 'Store/AppConfig/AppConfig.action';
import { getCities, getConfig, getBottomNavigationConfig, getABTestingConfig } from 'Util/API/endpoint/Config/Config.endpoint';
import { getCountryFromUrl } from "Util/Url";
import BrowserDatabase from "Util/BrowserDatabase";
import { getUUID, setUUID } from "Util/Auth";
import { v4 as uuidv4 } from "uuid";
import Logger from 'Util/Logger';
import isMobile from "Util/Mobile";

export class AppConfigDispatcher {

    getUserVWOVariation = async (
    customer,
    abTestingConfig = {},
    config= {},
    ) => {
    let userId = customer?.id ? customer?.id : getUUID();
    // If user is not loged in and UUID is also not created then below code will run
    if (!userId) {
        setUUID(uuidv4());
        userId = getUUID();
    }
    
    const siteWideCampaignName = abTestingConfig?.SiteWideCoupon?.campaignName || "swc";
    const HPPCampaignName = abTestingConfig?.HPP?.campaignName || "hpp";
    const newPDPCompaignName = abTestingConfig?.NewPDP?.campaignName || "new-PDP";
    const expressCampaignName = abTestingConfig?.Express?.campaignName || "ExpressDeliveryUAE";
    const countryCode = getCountryFromUrl()?.toLowerCase();
    const userAgent = window?.navigator?.userAgent;
    // const ipResponse = await fetch('https://api.ipify.org/?format=json'');
    // const ipAddressData = await ipResponse.json();
    // console.log("===>",ipAddressData);
    const options =  {
        customVariables: {
            country_code: countryCode,
            platform: isMobile.any() ? 'msite' : 'desktop',
            source: 'PWA',
            user_id: userId,
            is_loggedin: customer?.id ? true : false,
            userAgent: userAgent
        },
        variationTargetingVariables: {
            country_code: countryCode,
            platform: isMobile.any() ? 'msite' : 'desktop',
            source: 'PWA',
            user_id: userId,
            is_loggedin: customer?.id ? true : false,
            userAgent: userAgent,
        },
        userAgent: userAgent,
        // userIpAddress: ipAddressData?.ip
    }
    let SiteWideCoupon = {};
    let HPP = {};

    // if sitewide is disabled from default.json then do not call VWO for sitewide
    const country = getCountryFromUrl();
    const isSiteWideCall = config?.countries?.[country]?.isSidewideCouponEnabled || false;
    const getSitewideConfigVwo = abTestingConfig?.SiteWideCoupon?.getConfigVwo || false;

    const getVwoDataNewPDP = () => {
        const isEnable = config?.countries?.[country]?.new_design || false;
        const callVwo = abTestingConfig?.NewPDP?.getConfigVwo || false; 
        let defaultVariationName = abTestingConfig?.NewPDP?.defaultVariant;
        let campaignName = abTestingConfig?.NewPDP?.campaignName;
        let isNewPDPEnable =  defaultVariationName === "c" ? false : true ;
        let result = {
            variationName: defaultVariationName,
            vwo: '0',
            campaignName,
            isFeatureEnabled: isNewPDPEnable
        };
        if(isEnable && callVwo) {
            const variationName = window.vwoClientInstance?.activate(
                campaignName,
                `${userId}`,
                options
              );
              result = {
                variationName: variationName ? variationName : defaultVariationName,
                vwo: variationName ? '1': '0',
                campaignName,
                isFeatureEnabled: variationName ? variationName === "c" ? false : true : isNewPDPEnable
              }
        }
        return result;
    }

    const getVwoDataExpressDelivery = () => {
        const isEnable = config?.countries?.[country]?.isExpressDelivery || false;
        const callVwo = abTestingConfig?.Express?.getConfigVwo || false;
        let defaultVariationName =
          abTestingConfig?.Express?.defaultVariant || "c";
        let campaignName =
          abTestingConfig?.Express?.campaignName || "ExpressDeliveryUAE";
        let isExpressDeliveryEnable = defaultVariationName !== "c" ? true : false;
  
        let result = {
          variationName: defaultVariationName,
          vwo: "0",
          campaignName,
          isFeatureEnabled:
            defaultVariationName === "c"
              ? false
              : abTestingConfig?.Express?.variable?.[0]?.defaultValue,
        };
  
        if (isEnable && callVwo) {
          const isFeatureEnabled = vwoClientInstance.isFeatureEnabled(
            campaignName,
            `${userId}`,
            options
          );
  
          const variationName = vwoClientInstance.getVariationName(
            campaignName,
            `${userId}`,
            options
          );
  
          result = {
            variationName: variationName ? variationName : defaultVariationName,
            vwo: variationName ? "1" : "0",
            campaignName,
            isFeatureEnabled: variationName
              ? variationName === "c"
                ? false
                : true
              : abTestingConfig?.Express?.variable?.[0]?.defaultValue,
          };
        }
        return result;
      };
    // Get Logged in User Variations from VWO tool
    try {
        if (userId && window.vwoClientInstance) {
            if(isSiteWideCall) {
                if(getSitewideConfigVwo) {
                    const sitewideVariationName = 
                        window.vwoClientInstance?.getVariation(siteWideCampaignName, `${userId}`, options);
                    const isFeatureEnabled = 
                        window.vwoClientInstance?.isFeatureEnabled(siteWideCampaignName, `${userId}`, options);
                    const enableSitewideCoupon = 
                        window.vwoClientInstance?.getFeatureVariableValue(siteWideCampaignName, 'enable', `${userId}`, options);
                
                    SiteWideCoupon = {
                        isFeatureEnabled: sitewideVariationName ? enableSitewideCoupon ? enableSitewideCoupon : false : abTestingConfig?.SiteWideCoupon?.variable?.[0]?.defaultValue ||  false,
                        enableSitewideCoupon,
                        variationName: sitewideVariationName || abTestingConfig?.SiteWideCoupon?.defaultVariant || "c",
                        vwo: sitewideVariationName ? '1' : '0',
                        campaignName: siteWideCampaignName,
                    };
                } else {
                    SiteWideCoupon = {
                        isFeatureEnabled: abTestingConfig?.SiteWideCoupon?.variable?.[0]?.defaultValue || false,
                        enableSitewideCoupon: abTestingConfig?.SiteWideCoupon?.variable?.[0]?.defaultValue || false,
                        variationName: abTestingConfig?.SiteWideCoupon?.defaultVariant || "c",
                        vwo: '0',
                        campaignName: siteWideCampaignName,
                    };
                }  
            } else {
                SiteWideCoupon = {
                    isFeatureEnabled: isSiteWideCall && !getSitewideConfigVwo && abTestingConfig?.SiteWideCoupon?.variable?.[0]?.defaultValue ,
                    enableSitewideCoupon: abTestingConfig?.SiteWideCoupon?.variable?.[0]?.defaultValue,
                    variationName: abTestingConfig?.SiteWideCoupon?.defaultVariant || "c",
                    vwo: '0',
                    campaignName: siteWideCampaignName,
                };
            }

            const HPPvariationName = window.vwoClientInstance?.activate(
              HPPCampaignName,
              `${userId}`,
              options
            );
            
            HPP = {
                variationName: HPPvariationName ? HPPvariationName : abTestingConfig?.HPP?.defaultValue,
                vwo: HPPvariationName ? '1' : '0',
                campaignName: HPPCampaignName,
            }
            let NewPDP = getVwoDataNewPDP();
            let Express = getVwoDataExpressDelivery();

            const pushData = {
                [siteWideCampaignName]: {
                    "vwo":  SiteWideCoupon.vwo,
                    "val": SiteWideCoupon.variationName
                },
                [HPPCampaignName]: {
                    "vwo": HPP.vwo,
                    "val": `${HPP.variationName}` === "1" ? 'c' : `v${HPP.variationName - 1}`
                },
                [NewPDP.campaignName] : {
                    "vwo": NewPDP.vwo,
                    "val": NewPDP.variationName
                },
                [Express.campaignName] : {
                    "vwo": Express.vwo,
                    "val": Express.variationName,
                }
            }
            console.log("vwo event",{ ...pushData, ...options.customVariables, userAgent });
            window.vwoClientInstance?.push({ ...pushData, ...options.customVariables, userAgent }, `${userId}`);
            return { SiteWideCoupon, HPP, NewPDP, Express };
        } else {
            return {
                SiteWideCoupon : {
                    isFeatureEnabled: false,
                    enableSitewideCoupon: false,
                    variationName: abTestingConfig?.SiteWideCoupon?.defaultVariant || "c",
                    vwo: '0',
                    campaignName: siteWideCampaignName,
                },
                HPP : {
                    variationName: abTestingConfig?.HPP?.defaultValue,
                    vwo: '0',
                    campaignName: HPPCampaignName,
                },
                NewPDP : {
                    variationName: abTestingConfig?.NewPDP?.variationName,
                    vwo: '0',
                    campaignName: newPDPCompaignName
                },
                Express : {
                    variationName: abTestingConfig?.Express?.variationName,
                    vwo: '0',
                    campaignName: expressCampaignName,
                    isFeatureEnabled: false,
                } 
            }
        }
    } catch (e) {
        console.error("vwo varition error", e);
    }
    }

    async getAppConfig(dispatch) {
        try {
            const countryCode = getCountryFromUrl().toLowerCase();
            const customer = BrowserDatabase.getItem("customer") || {};
            const bottomNavigationConfig = await getBottomNavigationConfig();
            const config = await getConfig();
            const gtmConfig = this.getGtmConfig();
            const abTestingConfigData = await getABTestingConfig();
            const abTestingConfigDataCountrySpecific = abTestingConfigData?.[countryCode] || abTestingConfigData;
            const appConfig = { ...config, ...gtmConfig, bottomNavigationConfig };
            const vwoData =  await this.getUserVWOVariation(customer, abTestingConfigDataCountrySpecific, config ) || null;
            dispatch(setAppConfig(appConfig));
            dispatch(setABTestingConfig(abTestingConfigDataCountrySpecific));
            vwoData ? dispatch(setVWOConfig(vwoData)) : null;
        } catch (e) {
            Logger.log(e);
        }
    }

    // this function run at the time of user sign in or sign out
    async updateVWOData(dispatch, config={}) {
        try {
            const countryCode = getCountryFromUrl().toLowerCase();
            const customer = BrowserDatabase.getItem("customer") || {};
            const abTestingConfigData = await getABTestingConfig();
            const abTestingConfigDataCountrySpecific = abTestingConfigData?.[countryCode] || abTestingConfigData;
            const vwoData =  await this.getUserVWOVariation(customer, abTestingConfigDataCountrySpecific, config ) || null;
            dispatch(setABTestingConfig(abTestingConfigDataCountrySpecific));
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
