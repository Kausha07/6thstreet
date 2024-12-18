import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";

import WebUrlParser from "Util/API/helper/WebUrlParser";

import PLPPagePlaceholder from "./PLPPagePlaceholder.component";

export const mapStateToProps = (_state) => ({
  // wishlistItems: state.WishlistReducer.productsInWishlist
  gender: _state.AppState.gender,
});

export const mapDispatchToProps = (_dispatch) => ({
  // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class PLPPagePlaceholderContainer extends PureComponent {
  static propTypes = {
    pageIndex: PropTypes.string.isRequired,
    isFirst: PropTypes.bool,
  };

  state = {
    wasRequested: false,
  };

  containerFunctions = {
    onVisibilityChange: this.onVisibilityChange.bind(this),
  };

  containerProps = () => {
    // isDisabled: this._getIsDisabled()
    const { isFirst } = this.props;
    return { isFirst };
  };

  onVisibilityChange(isVisible) {
    // TODO: implement page pre-load
    const { pageIndex } = this.props;
    const { wasRequested } = this.state;
    if (isVisible && !wasRequested) {
      // if this page appears first time -> do request
      this.setState({ wasRequested: true });
      WebUrlParser.setPage(pageIndex);
    }
    if(this.props.gender === "influencer" && window.location.pathname.includes("Collection"))
    {
      this.props.setPageVisibility(pageIndex);
    } 
  }

  render() {
    return (
      <PLPPagePlaceholder
        {...this.containerFunctions}
        {...this.containerProps()}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PLPPagePlaceholderContainer);
