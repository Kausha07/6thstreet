import { searchParams } from "./config";
import { formatNewInTag, formatResult } from "./utils";
import { userToken } from "Util/User/userToken";

export default function searchBy(
  { query = "", gender = "", limit = 4, addAnalytics = false },
  options = {}
) {
  const { index } = options;
  const tags = addAnalytics ? ["PWA", "Search"] : ["PWA", "PLP"];
  return new Promise((resolve, reject) => {
    const newSearchParams = Object.assign({}, searchParams);
    newSearchParams.hitsPerPage = limit;

    if (gender !== "") {
      newSearchParams.facetFilters = [[`gender: ${gender}`]];
    }

    index.search(
      {
        query,
        ...newSearchParams,
        clickAnalytics: true,
        analyticsTags: tags,
        userToken: userToken(),
      },
      (err, data = {}) => {
        if (err) {
          return reject(err);
        }
        const result = formatResult(data);
        result.data = result.data.map((item) => {
          return formatNewInTag(item);
        });
        return resolve(result);
      }
    );
  });
}
