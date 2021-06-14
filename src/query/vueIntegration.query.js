import BrowserDatabase from "Util/BrowserDatabase";
import { Field } from "Util/Query";
import { LOCALES } from "Util/Url/Url.config";
export class VueIntegrationQueries {
  /**
   * log vue analytics query
   * @return {Field}
   */
  async vueAnalayticsLogger(payload) {
    const locale = this.getLocaleFromUrl();
    const currencyCode = this.getCurrencyCodeFromLocale(locale);
    console.log("currency code", currencyCode);
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
          console.log("response", response);
          if (response.status !== 200) {
            // throw Error(response.message);
            console.log("Error", response.statusText);
          }
          return response.json();
        })
        .catch((error) => reject(error));
    });
  }

  getCountryCurrencyCode() {
    const {
      config: { countries },
    } = BrowserDatabase.getItem("APP_CONFIG_CACHE_KEY");
    const { currency } = countries[this.getCountryFromUrl()];
    return currency;
  }

  getCountryFromUrl() {
    const locale = this.getLocaleFromUrl();
    console.log("locale", locale);
    if (locale) {
      return locale.substring("3", "5").toUpperCase();
    }

    return "";
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
    }
  }
}
export default new VueIntegrationQueries();
