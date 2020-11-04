import PropTypes from 'prop-types';

import {
    Meta as SourceMeta
} from 'SourceComponent/Meta/Meta.component';

export class Meta extends SourceMeta {
    static propTypes = {
        ...SourceMeta.propTypes,
        hreflangs: PropTypes.arrayOf(
            PropTypes.shape({
                hreflang: PropTypes.string,
                href: PropTypes.string
            })
        ).isRequired
    };

    renderHreflangs() {
        const { hreflangs } = this.props;

        if (!hreflangs.length) {
            return null;
        }

        return hreflangs.map(({ hreflang, href }) => (
            <link rel="alternate" hrefLang={ hreflang } href={ href } />
        ));
    }

    renderMeta() {
        const { metadata } = this.props;
        return (
            <>
                { this.renderTitle() }
                { this.renderCanonical() }
                { this.renderHreflangs() }
                { metadata.map((tag) => <meta key={ tag.name || tag.property } { ...tag } />) }
            </>
        );
    }
}

export default Meta;
