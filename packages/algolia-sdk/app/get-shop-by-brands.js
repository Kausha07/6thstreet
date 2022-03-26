export default async function getShopByBrands(params, options) {
  return new Promise((resolve, reject) => {
    const { index,client, ...queryOptions} = options;
    let genderForQuery = "";
    if(params.gender) {
      if(params.gender === "kids") {
        genderForQuery = [[`gender:Boy`,`gender:Girl`]];
      } else 
      genderForQuery = [[`gender: ${params.gender}`]]
    }
    const queryCopy = {
      params: {
        query: params.query,
        facetFilters: genderForQuery,
        page: 1,
        hitsPerPage: params.limit        
      },      
      indexName: options.index.indexName
    };

    let queries = [];
    queries.push({      
      params: {
        query: params.query,
        facetFilters: genderForQuery,
        page: 0,
        hitsPerPage: params.limit
      },      
      indexName: options.index.indexName
    });
    queries.push(queryCopy);
    client.search(queries, (err, response = {}) => {
      if (err) {
        return reject(err);
      }      
      return resolve(response.results);
    });
  });
}
