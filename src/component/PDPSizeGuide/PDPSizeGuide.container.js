import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { hideActiveOverlay, toggleOverlayByKey } from 'Store/Overlay/Overlay.action';

import PDPSizeGuide from './PDPSizeGuide.component';

export const mapStateToProps = (_state) => ({
    language: _state.AppState.language,
    activeOverlay: _state.OverlayReducer.activeOverlay,
    hideActiveOverlay: _state.OverlayReducer.hideActiveOverlay
});
export const mapDispatchToProps = (_dispatch) => ({
    showOverlay: (overlayKey) => _dispatch(toggleOverlayByKey(overlayKey)),
    hideActiveOverlay: () => _dispatch(hideActiveOverlay())
});

export class PDPSizeGuideContainer extends PureComponent {
    static propTypes = {
        language: PropTypes.string.isRequired,
        showOverlay: PropTypes.func.isRequired,
        activeOverlay: PropTypes.string.isRequired,
        hideActiveOverlay: PropTypes.string.isRequired
    };

    containerProps = () => {
        const { language, activeOverlay } = this.props;
        return { language, activeOverlay };
    };

    containerFunctons = () => {
        const { showOverlay, hideActiveOverlay } = this.props;
        return { showOverlay, hideActiveOverlay };
    };

    render() {
        return (
            <PDPSizeGuide
              { ...this.containerProps() }
              { ...this.containerFunctons() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PDPSizeGuideContainer);
