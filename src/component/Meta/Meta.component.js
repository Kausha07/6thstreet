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

    renderHreflang = ({ hreflang, href }, i) => (
        <link rel="alternate" hrefLang={ hreflang } href={ href } key={ i } />
    );

    renderHreflangs() {
        const { hreflangs = [] } = this.props;

        if (!hreflangs.length) {
            return null;
        }

        return hreflangs.map(this.renderHreflang);
    }

    renderMeta() {
        const { metadata = [] } = this.props;
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
