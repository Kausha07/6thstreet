import { searchParams } from "./config";
import { formatNewInTag, formatResult } from "./utils";

export default function searchBy(
  { query = "", gender = "", limit = 4 },
  options = {}
) {
  const { index } = options;
  const tags = ["PWA_search"];
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
      },
      {
        analyticsTags: tags,
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
