import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import isMobile from "Util/Mobile";

import {
  hideActiveOverlay,
  toggleOverlayByKey,
} from "Store/Overlay/Overlay.action";
import ShareButton from "./ShareButton.component";
import SharePopup from "Component/SharePopup";

import { SHARE_POPUP_ID } from "Component/SharePopup/SharePopup.config";

export const mapDispatchToProps = (dispatch) => ({
  showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
  hideOverlay: () => dispatch(hideActiveOverlay()),
});

class ShareButtonContainer extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    children: PropTypes.node,
  };

  static defaultProps = {
    children: null,
  };

  state = {
    openShareOverlay: false
  }

  showShareOverlay = () => {
    const { showOverlay } = this.props;
    this.setState(
      {openShareOverlay: true},
      () => showOverlay(SHARE_POPUP_ID)
    );
  }

  hideShareOverlay = () => {
    const { hideOverlay } = this.props;
    this.setState(
      {openShareOverlay: false},
      hideOverlay
    );
  }


  async _initiateShare() {
    const isDesktop = !(isMobile.any() || isMobile.tablet());
    if(isDesktop) {
      this.showShareOverlay();
    }
    else if(window.navigator.share){
      const { title, text, url } = this.props;

      await window.navigator.share({
        title,
        text,
        url,
      });
    }
  };

  render() {
    const { openShareOverlay } = this.state;
    const { children, ...rest } = this.props;
    const isDesktop = !(isMobile.any() || isMobile.tablet());
    return (
      <>
        {
          isDesktop
          ?       
          <SharePopup
            showShareOverlay={this.showShareOverlay}
            hideShareOverlay={this.hideShareOverlay}
            openSharePopup={open}
            {...rest}
          />
          :
          null
        }
        <ShareButton
          initiateShare={this._initiateShare.bind(this)}
          openShareOverlay={openShareOverlay}
          {...rest}>
          {children}
        </ShareButton>
      </>
    );
  }
}

export default connect(null, mapDispatchToProps)(ShareButtonContainer);
