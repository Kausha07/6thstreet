import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { hideActiveOverlay, toggleOverlayByKey } from 'Store/Overlay/Overlay.action';

import ChangePhonePopup from './ChangePhonePopup.component';
import { CHANGE_PHONE_POPUP } from './ChangePhonePopup.config';

export const mapDispatchToProps = (dispatch) => ({
    showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
    hideActiveOverlay: () => dispatch(hideActiveOverlay())
});

export class ChangePhonePopupContainer extends PureComponent {
    static propTypes = {
        showOverlay: PropTypes.func.isRequired
    };

    componentDidMount() {
        const { showOverlay } = this.props;
        console.log('mount');
        showOverlay(CHANGE_PHONE_POPUP);
    }

    render() {
        return (
            <ChangePhonePopup
              { ...this.props }
            />
        );
    }
}

export default connect(null, mapDispatchToProps)(ChangePhonePopupContainer);
