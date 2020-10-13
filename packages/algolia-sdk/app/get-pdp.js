import { formatResult, formatNewInTag } from './utils';
import { searchParams } from './config';

function getProduct(id, highlights, options) {
    const { index } = options;

    return new Promise((resolve, reject) => {
        // if (!index || !id) {
        //     return reject('No index or id provided');
        // }

        // const newSearchParams = Object.assign({}, searchParams);
        // newSearchParams.hitsPerPage = 1;
        // newSearchParams.attributesToHighlight = highlights;
        // newSearchParams.attributesToRetrieve = '*';

        index.search(
            '',
            { filters: `objectID:${id}` },
            (error, data) => {
                if (error) {
                    return reject(error);
                }

                if (!!data.nbHits) {
                    data.hits = data.hits[0];
                } else {
                    data.hits = null;
                }

                const result = formatResult(data);

                return resolve({
                    ...result,
                    data: formatData(result.data)
                });
            }
        );
    });
}

function formatData(productData) {
    const data = formatNewInTag(productData);

    // format highlighted attributes
    const { _highlightResult, ...rest } = data;

    if (!_highlightResult) {
        return {
            highlighted_attributes: null,
            ...rest
        };
    }

    const highlighted_attributes = Object.keys(_highlightResult)
        .map((key) => {
            return {
                key,
                value: _highlightResult[key]['value']
            };
        })
        .filter((item) => {
            return item !== undefined && item.value !== undefined;
        });

    return {
        highlighted_attributes,
        ...rest
    };
}

function getProductVariants(skuList = [], highlights, options) {
    return Promise.all(
        skuList.map(async (sku) => {
            const product = await getProduct(sku, highlights, options);
            return product.data ? product.data : {};
        })
    );
}

export default async function getPDP(
    { id = '', highlights = '*' },
    options = {}
) {
    const product = await getProduct(id, highlights, options);
    const { sku } = product;

    let variantSKUs =
        product.data && product.data['6s_also_available']
            ? product.data['6s_also_available']
            : [];

    if (variantSKUs.length > 0) {
        variantSKUs = [...variantSKUs, sku];
        product.data['variants'] = await getProductVariants(
            variantSKUs,
            highlights,
            options
        );
    }

    return product;
}
