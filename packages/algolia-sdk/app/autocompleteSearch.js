import { userToken } from "Util/User/userToken";
export default async function autocompleteSearch(params, options) {
  return new Promise((resolve, reject) => {
    const { index, ...queryOptions } = options;
    index.search(
      {
        query: params.query,
        hitsPerPage: params.limit,
        clickAnalytics: true,
        ...queryOptions,
        userToken: userToken(),
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
