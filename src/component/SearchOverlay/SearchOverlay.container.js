import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import {
  hideActiveOverlay,
  toggleOverlayByKey,
} from "Store/Overlay/Overlay.action";
import SearchOverlay from "./SearchOverlay.component";



export const mapDispatchToProps = (dispatch) => ({
  showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
  hideActiveOverlay: () => dispatch(hideActiveOverlay()),
});

export class searchOverlayContainer extends PureComponent {
  static propTypes = {
    showOverlay: PropTypes.func.isRequired,
    isPopup: PropTypes.bool.isRequired,
    hideActiveOverlay: PropTypes.func.isRequired,
    closePopup: PropTypes.func.isRequired,
  };

  handleViewBagClick() {
    const {
      hideActiveOverlay,
      closePopup,
    } = this.props;
    hideActiveOverlay();
    closePopup();
  }
 

  render() {
    return (
      <SearchOverlay
        {...this.props}
        {...this.state}
      />
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(searchOverlayContainer);
