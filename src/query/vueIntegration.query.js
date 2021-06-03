import { Field } from "Util/Query";

export class VueIntegrationQueries {
  /**
   * log vue analytics query
   * @return {Field}
   */
    vueAnalayticsLogger(payload) {
    return new Promise((resolve, reject) => {
      fetch(`/api/vue/analytics?locale=en-ae'`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-App-Version": "2.27.0",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          console.log('response',response)
          if (response.status !== 200) {
            // throw Error(response.message);
            console.log("Error", response.statusText);
          }
          return response.json();
        })
        .catch((error) => reject(error));
    });
  }
}

export default new VueIntegrationQueries();
