import { searchParams } from './config';
import { formatNewInTag, formatResult } from './utils';

export default function searchBy(
  { query = '', gender = '', limit = 4 },
  options = {}
) {
  const { index } = options;

  return new Promise((resolve, reject) => {
    const newSearchParams = Object.assign({}, searchParams);
    newSearchParams.hitsPerPage = limit;

    if (gender !== '') {
      newSearchParams.facetFilters = [[`gender: ${gender}`]];
    }

    index.search(
      {
        query,
        ...newSearchParams,
        clickAnalytics: true,
      },
      (err, data = {}) => {
        if (err) {
          return reject(err);
        }
        console.log('search data', data);
        const result = formatResult(data);
        result.data = result.data.map((item) => {
          return formatNewInTag(item);
        });
        return resolve(result);
      }
    );
  });
}
