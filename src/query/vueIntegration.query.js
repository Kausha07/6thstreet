import { Field } from "Util/Query";

export class VueIntegrationQueries {
  /**
   * Get apple pay config query
   * @return {Field}
   */
    vuePDPView(payload) {
        console.log('payload', payload);
    return new Promise((resolve, reject) => {
      fetch(`/api/vue/analytics?locale=en-ae'`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-App-Version": "2.27.0",
        //   "X-Algolia-Application-Id": applicationID,
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (response.status !== 200) {
            // throw Error(response.message);
            console.log("Error", response.message);
          }
          return response.json();
        })
        .catch((error) => reject(error));
    });
  }
}

export default new VueIntegrationQueries();
