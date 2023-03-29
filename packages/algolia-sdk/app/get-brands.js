import { searchParams } from "./config";
export default function getBrands(gender = "", options = {}) {
  const { index, client, env } = options;
  return new Promise((resolve, reject) => {
    const newSearchParams = Object.assign({}, searchParams);
    const queries = [];
    if (gender === "Boy,Girl" || gender === "أولاد,بنات") {
      newSearchParams.facetFilters = [
        [`gender: ${gender.split(",")[0]}`],
        [`gender: ${gender.split(",")[1]}`],
        [`in_stock:1`]
      ];
    } else {
      newSearchParams.facetFilters = [[`gender: ${gender}`],[`in_stock:1`]];
    }

    queries.push({
      indexName: index.indexName,
      params: newSearchParams
    });
    client.search(queries, (err, res = {}) => {
      const brands = res?.results[0]?.facets["brand_name"];
      if (err) {
        return reject(err);
      }
      return resolve({ data: brands ? Object.keys(brands) : [] });
    });
  });
}
