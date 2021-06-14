import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { hideActiveOverlay, toggleOverlayByKey } from 'Store/Overlay/Overlay.action';

import PDPMixAndMatchProductSizePopup from './PDPMixAndMatchProductSizePopup.component';

import { PDP_MIX_AND_MATCH_POPUP_ID } from './PDPMixAndMatchProductSizePopup.config';

export const mapDispatchToProps = (dispatch) => ({
  showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
  hideActiveOverlay: () => dispatch(hideActiveOverlay())
});

export class PPDPMixAndMatchProductSizePopupContainer extends PureComponent {

  static propTypes = {
    product: PropTypes.object.isRequired,
    onSizeTypeSelect: PropTypes.func.isRequired,
    onSizeSelect: PropTypes.func.isRequired,
    selectedSizeCode: PropTypes.string.isRequired,
    selectedSizeType: PropTypes.string.isRequired,
    addToCart: PropTypes.func.isRequired,
    routeChangeToCart: PropTypes.func.isRequired,
    showOverlay: PropTypes.func.isRequired,
    hideActiveOverlay: PropTypes.func.isRequired,
    togglePDPMixAndMatchProductSizePopup: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { showOverlay } = this.props;
    showOverlay(PDP_MIX_AND_MATCH_POPUP_ID);
  }

  render() {
      return (
        <PDPMixAndMatchProductSizePopup { ...this.props } />
      );
  }
}

export default connect(null, mapDispatchToProps)(PPDPMixAndMatchProductSizePopupContainer);
