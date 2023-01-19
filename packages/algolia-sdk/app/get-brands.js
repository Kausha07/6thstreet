import { searchParams } from "./config";
import { getIndex } from "./utils";
export default function getBrands(gender = "", options = {}) {
  const { index, client, env } = options;
  let indexName = getIndex("en-ae", env);

  return new Promise((resolve, reject) => {
    const newSearchParams = Object.assign({}, searchParams);
    const queries = [];
    queries.push({
      indexName:indexName,
      params: {
        ...newSearchParams,
        facetFilters: [[`gender: ${gender}`],[`in_stock:1`]],
      },
    });
    client.search(queries, (err, res = {}) => {
      const brands = res?.results[0]?.facets["brand_name"]
      if (err) {
        return reject(err);
      }
      return resolve({ data: Object.keys(brands) });
    })
  });
}
