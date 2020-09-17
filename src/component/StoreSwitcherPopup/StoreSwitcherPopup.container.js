import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { hideActiveOverlay, toggleOverlayByKey } from 'Store/Overlay/Overlay.action';

import StoreSwitcherPopup, { STORE_POPUP_ID } from './StoreSwitcherPopup.component';

export const mapDispatchToProps = (dispatch) => ({
    showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
    hideActiveOverlay: () => dispatch(hideActiveOverlay())
});

class StoreSwitcherPopupContainer extends PureComponent {
    static propTypes = {
        showOverlay: PropTypes.func.isRequired
    };

    componentDidMount() {
        const { showOverlay } = this.props;

        showOverlay(STORE_POPUP_ID);
    }

    render() {
        return (
            <StoreSwitcherPopup
              { ...this.props }
            />
        );
    }
}

export default StoreSwitcherPopupContainer;
