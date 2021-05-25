const fetch = require('node-fetch');
export default function createAnalyticsAPI(event_name, objectIDs, queryID,search_term,options = {}) {
  const { index } = options;
  const apiKey = index.as.apiKey;
  const applicationID = index.as.applicationID;
  console.log('algolia params',{event_name, objectIDs, queryID,search_term})
  return new Promise((resolve, reject) => {
    fetch(
      `https://insights.algolia.io/1/events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Algolia-API-Key': apiKey,
          'X-Algolia-Application-Id': applicationID
        },
        body: event_name, objectIDs, queryID,search_term,
      }
    )
      .then((response) => {
        console.log('response.status',response.status)
        if (response.status !==200) {
          // throw Error(response.message);
          console.log('Error',response.message)
        }

        return response.json();
      })
      .then((result) => {
        const data = result;
        if (!data) {
          resolve({ data: [] });
        }
      })
      .catch((error) => reject(error));
  });
}