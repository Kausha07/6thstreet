import { UrlRewritesQuery as SourceUrlRewritesQuery } from 'SourceQuery/UrlRewrites.query';

/**
 * UrlRewrites Query
 * @class UrlRewritesQuery
 */
export class UrlRewritesQuery extends SourceUrlRewritesQuery {
    _getUrlResolverFields() {
        return [
            'type',
            'id'
        ];
    }
}

export default new UrlRewritesQuery();
