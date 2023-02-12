import PropTypes from "prop-types";
import { PureComponent } from "react";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import Overlay from "SourceComponent/Overlay";
import { SEARCH_OVERLAY } from "Component/Header/Header.config";
import "./SearchOverlay.style";

export class SearchOverlay extends PureComponent {
  static propTypes = {
    onVisible: PropTypes.func,
    showOverlay: PropTypes.func.isRequired,
    hideActiveOverlay: PropTypes.func.isRequired,
    closePopup: PropTypes.func.isRequired,
    handleViewBagClick: PropTypes.func.isRequired,
    isHidden: PropTypes.bool,
  };

  static defaultProps = {
    isHidden: false,
    onVisible: () => {},
  };

  state = {
    isArabic: isArabic(),
    isPopup: false,
  };

  componentDidMount() {
    const { showOverlay } = this.props;
    if (!isMobile.any()) {
      showOverlay(SEARCH_OVERLAY);
    }
  }

  onCloseClick = () => {
    this.setState({ isPopup: true });
  };

  renderItemCount() {
    const { hideActiveOverlay, closePopup } = this.props;

    const svg = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="white"
      >
        <path
          d="M23.954 21.03l-9.184-9.095 9.092-9.174-1.832-1.807-9.09 9.179-9.176-9.088-1.81
                  1.81 9.186 9.105-9.095 9.184 1.81 1.81 9.112-9.192 9.18 9.1z"
        />
      </svg>
    );

    return (
      <div block="CartOverlay" elem="ItemCount">
        <div>{__("My Basket")}</div>
        <button onClick={hideActiveOverlay && closePopup}>{svg}</button>
      </div>
    );
  }

  render() {
    const { onVisible, isHidden, hideActiveOverlay, closePopup } = this.props;
    const { isArabic, isPopup } = this.state;

    return (
      <>
        <button
          block="HeaderCart"
          elem="PopUp"
          mods={{ isHidden }}
          onClick={hideActiveOverlay && closePopup}
        >
          closes popup
        </button>
        <Overlay
          id={SEARCH_OVERLAY}
          onVisible={onVisible}
          mix={{ block: "CartOverlay", mods: { isArabic, isPopup } }}
        >
          {this.renderItemCount()}
        </Overlay>
      </>
    );
  }
}

export default SearchOverlay;
