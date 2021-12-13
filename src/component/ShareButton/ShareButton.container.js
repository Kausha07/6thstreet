import PropTypes from "prop-types";
import { PureComponent } from "react";

import ShareButton from "./ShareButton.component";

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

  async _initiateShare() {
    const { title, text, url } = this.props;

    await window.navigator.share({
      title,
      text,
      url,
    });
  }

  render() {
    if (!window.navigator.share) {
      return null;
    }

    const { children, ...rest } = this.props;
    return (
      <ShareButton initiateShare={this._initiateShare.bind(this)} {...rest}>
        {children}
      </ShareButton>
    );
  }
}

export default ShareButtonContainer;
