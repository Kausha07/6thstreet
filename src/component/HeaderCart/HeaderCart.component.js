/* eslint-disable jsx-a11y/control-has-associated-label */
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { withRouter } from "react-router";
import CartOverlay from "SourceComponent/CartOverlay";
import { TotalsType } from "Type/MiniCart";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import "./HeaderCart.style";

class HeaderCart extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    hideActiveOverlay: PropTypes.func.isRequired,
    totals: TotalsType.isRequired,
    isCheckoutAvailable: PropTypes.bool.isRequired,
    showNotification: PropTypes.func.isRequired,
    setMinicartOpen: PropTypes.func.isRequired,
    isMinicartOpen: PropTypes.bool.isRequired,
    showCartPopUp: PropTypes.bool.isRequired,
  };

  state = {
    cartPopUp: "",
    isPopup: true,
    isArabic: isArabic(),
    isOpen: false,
  };

  componentDidUpdate() {
    const { isOpen } = this.state;
    const {
      history: {
        location: { pathname },
      },
      isMinicartOpen,
    } = this.props;

    if (!isMobile.any() && pathname !== "/cart") {
      if (isMinicartOpen && !isOpen) {
        this.renderCartPopUp();
      }
    }
  }

  componentWillUnmount() {
    this.closePopup();
  }

  closePopup = () => {
    const { hideActiveOverlay, setMinicartOpen } = this.props;

    setMinicartOpen(false);
    hideActiveOverlay();
    this.setState({ cartPopUp: "", isOpen: false });
  };

  openPopup = () => {
    const { setMinicartOpen } = this.props;
    const { pathname } = location;

    if (pathname !== "/cart") {
      setMinicartOpen(true);
    }
  };

  renderCartPopUp = () => {
    const { isCheckoutAvailable, showCartPopUp } = this.props;
    const { isPopup } = this.state;

    if (!showCartPopUp) {
      return null;
    }

    const popUpElement = (
      <CartOverlay
        isPopup={isPopup}
        closePopup={this.closePopup}
        isCheckoutAvailable={isCheckoutAvailable}
      />
    );

    this.setState({ cartPopUp: popUpElement, isOpen: true });
  };

  routeChangeCart = () => {
    const {
      history,
      hideActiveOverlay,
      isCheckoutAvailable,
      showNotification,
      totals: { items = [] }
    } = this.props;

    if (!isCheckoutAvailable && items.length !== 0) {
      showNotification(
        "error",
        __("Some products or selected quantities are no longer available")
      );
    }

    hideActiveOverlay();
    history.push({
      pathname: "/cart",
      state: {
        prevPath: window.location.href,
      },
    });
  };

  renderItemCount() {
    const {
      totals: { items = [] },
    } = this.props;

    const itemQuantityArray = items.map((item) => item.qty);
    const totalQuantity = itemQuantityArray.reduce(
      (qty, nextQty) => qty + nextQty,
      0
    );

    if (totalQuantity && totalQuantity !== 0) {
      return (
        <div block="HeaderCart" elem="Count">
          {totalQuantity}
        </div>
      );
    }

    return null;
  }

  render() {
    const { cartPopUp, isArabic } = this.state;
    return (
      <div block="HeaderCart" mods={{ isArabic }}>
        <button
          onClick={
            isMobile.any() || isMobile.tablet()
              ? this.routeChangeCart
              : this.openPopup
          }
          block="HeaderCart"
          elem="Button"
        >
          {this.renderItemCount()}
        </button>
        {cartPopUp}
      </div>
    );
  }
}

export default withRouter(HeaderCart);
