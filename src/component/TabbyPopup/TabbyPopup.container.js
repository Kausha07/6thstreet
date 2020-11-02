import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { hideActiveOverlay, toggleOverlayByKey } from 'Store/Overlay/Overlay.action';

import TabbyPopup from './TabbyPopup.component';
import { TABBY_POPUP_ID } from './TabbyPopup.config';

export const mapDispatchToProps = (dispatch) => ({
    showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
    hideActiveOverlay: () => dispatch(hideActiveOverlay())
});

export class TabbyPopupContainer extends PureComponent {
    static propTypes = {
        tabbyWebUrl: PropTypes.string.isRequired,
        showOverlay: PropTypes.func.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired
    };

    componentDidMount() {
        const { showOverlay } = this.props;

        showOverlay(TABBY_POPUP_ID);
    }

    render() {
        return (
            <TabbyPopup
              { ...this.props }
            />
        );
    }
}

export default connect(null, mapDispatchToProps)(TabbyPopupContainer);
