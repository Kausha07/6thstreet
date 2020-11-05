import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    mapStateToProps as sourceMapStateToProps,
    MetaContainer as SourceMetaContainer
} from 'SourceComponent/Meta/Meta.container';

export const mapStateToProps = (state) => ({
    ...sourceMapStateToProps(state),
    hreflangs: state.MetaReducer.hreflangs
});

export class MetaContainer extends SourceMetaContainer {
    static propTypes = {
        ...SourceMetaContainer.propTypes,
        hreflangs: PropTypes.arrayOf(
            PropTypes.shape({
                hreflang: PropTypes.string,
                href: PropTypes.string
            })
        )
    };

    static defaultProps = {
        ...SourceMetaContainer.defaultProps,
        hreflangs: []
    };
}

export default connect(mapStateToProps)(MetaContainer);
