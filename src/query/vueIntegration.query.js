import { Field } from "Util/Query";
import { LOCALES } from "Util/Url/Url.config";
import MobileAPI from "Util/API/provider/MobileAPI";
import isMobile from "Util/Mobile";

export const SPAM_PROTECTION_DELAY = 200;
export const SPAM_PROTECTION_DELAY_PAGEVIEW =1000;

export class VueIntegrationQueries {
  /**
   * log vue analytics query
   * @return {Field}
   */

  lastEventTime = {};

  spamProtection(delay, type = "default") {
    const previousEventTime = this.lastEventTime[type] || 0;
    this.lastEventTime[type] = Date.now();
    return previousEventTime + delay > this.lastEventTime[type];
  }

  async vueAnalayticsLogger(payload) {
    const { event_name = "", params: {pageType= ""} ={} } = payload;
    const key = pageType? `${event_name}_${pageType}` : event_name;
    const delay = event_name === "pageView" ? SPAM_PROTECTION_DELAY_PAGEVIEW : SPAM_PROTECTION_DELAY
    if (this.spamProtection(delay, key)) {
      return;
    }
    const newParams = {...payload?.params, Platform: isMobile.any() ? "PWA" : "Desktop" }
    const locale = this.getLocaleFromUrl();
    try {
      await MobileAPI.post(`/vue/analytics`, { ...payload, params: newParams });
    }
    catch(err){
      console.error("Error", err);
    }
  }

  getLocaleFromUrl() {
    return LOCALES.reduce((acc, locale) => {
      if (location.host.includes(locale)) {
        acc.push(locale);
      }

      return acc;
    }, []).toString();
  }

  getCurrencyCodeFromLocale(locale) {
    switch (locale) {
      case "en-ae":
        return "en_AED";
      case "ar-ae":
        return "ar_AED";
      case "en-sa":
        return "en_SAR";
      case "ar-sa":
        return "ar_SAR";
      case "en-kw":
        return "en_KWD";
      case "ar-kw":
        return "ar_KWD";
      case "en-qa":
        return "en_QAR";
      case "ar-qa":
        return "ar_QAR";
      case "en-om":
        return "en_OMR";
      case "ar-om":
        return "ar_OMR";
      case "en-bh":
        return "en_BHD";
      case "ar-bh":
        return "ar_BHD";
    }
  }

  getWidgetTypeMapped(widgetType, pageType) {
    const WIDGET_MAP = [
      {"name":"vue_visually_similar_slider", "value" : 0},
      {"name":"vue_browsing_history_slider", "value": 1},
      {"name":"vue_trending_slider" , "value":3},
      {"name":"vue_recently_viewed_slider" , "value":7},
      {"name":"vue_top_picks_slider" , "value":11},
      {"name":"vue_style_it_slider", "value":9},
      {"name":"vue_compact_style_it_slider" , "value":"9a"}
    ];
    const getWidgetID = WIDGET_MAP.find(item => item.name === widgetType)?.value;
    // const widgetID = `${getWidgetID}_${pageType}`;
    return getWidgetID;
  }

}
export default new VueIntegrationQueries();
