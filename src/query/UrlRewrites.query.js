import { UrlRewritesQuery as SourceUrlRewritesQuery } from 'SourceQuery/UrlRewrites.query';
import { Field } from 'Util/Query';

/**
 * UrlRewrites Query
 * @class UrlRewritesQuery
 */
export class UrlRewritesQuery extends SourceUrlRewritesQuery {

    getDataField() {
        return new Field('data')
            .addFieldList(this.getDataFields());
    }

    getDataFields() {
        return [
            'url',
            'brand_name',
            'brand_html',
            'brand_logo',
        ];
    }

    getNumericFiltersField() {
        return new Field('numericFilters')
            .addFieldList(this.getNumericFiltersFields());
    }

    getNumericFiltersFields() {
        return [
            'discount'
        ];
    }

    _getUrlResolverFields() {
        return [
            'type',
            'id',
            this.getDataField()
        ];
    }
}

export default new UrlRewritesQuery();
