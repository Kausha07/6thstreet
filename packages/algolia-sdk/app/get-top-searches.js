const fetch = require("node-fetch");

export default async function getTopSearches(options = {}) {
  const { index } = options;
  const indexName = index.indexName;
  const apiKey = index.as.apiKey;
  const applicationID = index.as.applicationID;
  try {
    return new Promise((resolve, reject) => {
      // Multiply limit by 2 because there are duplicated values
      fetch(
        `https://analytics.algolia.com/2/searches?index=${indexName}&limit=5&tags=PWA_Search`,
        {
          headers: {
            "X-Algolia-API-Key": apiKey,
            "X-Algolia-Application-Id": applicationID,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }

          return response.json();
        })
        .then((result) => {
          console.log("top searches in package", result);
          const data = result.searches;
          if (!data) {
            resolve({ data: [] });
          }
          resolve({ data: data });
        })
        .catch((error) => reject(error));
    });
  } catch (e) {
    console.log(e.response);
  }
}
