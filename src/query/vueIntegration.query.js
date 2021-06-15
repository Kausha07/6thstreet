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
            throw Error(response.statusText);
            // console.log("Error", response.statusText);
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
}
export default new VueIntegrationQueries();
