import PropTypes from "prop-types";
import { PureComponent } from "react";
import { withRouter } from "react-router";

import { isArabic } from "Util/App";
import MyAccountOverlay from "Component/MyAccountOverlay";

import "./HeaderWishlist.style";

class HeaderWishlist extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    isBottomBar: PropTypes.bool.isRequired,
    isWishlist: PropTypes.bool.isRequired,
    wishListItems: PropTypes.array.isRequired,
    isMobile: PropTypes.bool,
    isSignedIn: PropTypes.bool.isRequired,
    showNotification: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isMobile: false,
    showPopup: true,
    signInPopUp: "",
  };

  state = {
    isArabic: isArabic(),
  };

  routeChangeWishlist = () => {
    const { history, isSignedIn, showNotification } = this.props;

    if (isSignedIn) {
      history.push("/my-account/my-wishlist");
    } else {
      this.renderMySignInPopup()
    }
  };

  closePopup = () => {
    this.setState({ signInPopUp: "" });
  };

  renderMySignInPopup() {
    const { showPopup } = this.state;
    const popUpElement = (
      <MyAccountOverlay isPopup={showPopup} closePopup={this.closePopup} />
    );

    this.setState({ signInPopUp: popUpElement });
    return popUpElement;
  }

  render() {
    const {
      isBottomBar,
      isWishlist,
      isMobile,
      wishListItems = [],
    } = this.props;
    const { isArabic,signInPopUp } = this.state;
    const itemsCount = wishListItems.length;

    return (
      <div
        block="HeaderWishlist"
        mods={{ isWishlist }}
        mix={{
          block: "HeaderWishlist",
          mods: { isBottomBar },
          mix: {
            block: "HeaderWishlist",
            mods: { isArabic },
            mix: {
              block: "HeaderWishlist",
              mods: { isMobile },
            },
          },
        }}
      >
        <button
          onClick={this.routeChangeWishlist}
          type="button"
          block="HeaderWishlist"
          elem="Button"
        >
          <div
            block="HeaderWishlist"
            elem="Count"
            mods={{ have: !!itemsCount }}
          >
            {itemsCount}
          </div>
          <span
            block="HeaderWishlist"
            elem="Heart"
            mods={{ isBlack: !!itemsCount }}
          />
        </button>
        {signInPopUp}
        <label htmlFor="WishList">{__("Wishlist")}</label>
      </div>
    );
  }
}

export default withRouter(HeaderWishlist);
