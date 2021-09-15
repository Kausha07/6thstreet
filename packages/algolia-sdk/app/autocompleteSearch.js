export default async function autocompleteSearch(params, options) {
  return new Promise((resolve, reject) => {
    const { index, ...queryOptions } = options;
    console.log("params", params);
    index.search(
      {
        query: params.query,
        hitsPerPage: params.limit,
        clickAnalytics: true,
        ...queryOptions,
      },
      (err, data = {}) => {
        if (err) {
          return reject(err);
        }

        return resolve(data);
      }
    );
  });
}
