import { Field } from "Util/Query";
import { LOCALES } from "Util/Url/Url.config";
export class VueIntegrationQueries {
  /**
   * log vue analytics query
   * @return {Field}
   */

  async vueAnalayticsLogger(payload) {
    const locale = this.getLocaleFromUrl();
    return new Promise((resolve, reject) => {
      fetch(`/api/vue/analytics?locale=${locale}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-App-Version": "2.27.0",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (response.status !== 200) {
            // throw Error(response.statusText);
            console.log("Error", response.statusText);
          }
          return response.json();
        })
        .catch((error) => reject(error));
    });
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

  getWidgetTypeMapped(widgetType) {
    const WIDGET_MAP = {
      "vue_visually_similar_slider": 0,
      "vue_browsing_history_slider": 1,
      "vue_trending_slider": 3,
      "vue_recently_viewed_slider": 7,
      "vue_top_picks_slider": 11,
      "vue_style_it_slider": 9,
      "vue_compact_style_it_slider": "9a"
     };
  }
}
export default new VueIntegrationQueries();
