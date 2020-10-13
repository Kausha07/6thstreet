export default function getSuggestions(
    {
        query = '',
        limit = 3
    },
    options = {}
) {
    const { index } = options;

    return new Promise((resolve, reject) => {
        index.search(
            {
                query,
                hitsPerPage: limit
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
