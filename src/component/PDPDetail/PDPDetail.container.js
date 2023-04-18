// import PropTypes from 'prop-types';
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import PDPDetail from "./PDPDetail.component";
import PDPDispatcher from "Store/PDP/PDP.dispatcher";

export const mapStateToProps = (_state) => ({
  // wishlistItems: state.WishlistReducer.productsInWishlist
  brandInfoData : _state.PDP.brandInfoData,
  brand_url: _state.PLP.brand_url,
});

export const mapDispatchToProps = (_dispatch) => ({
  // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
  clickBrandButton: (brandButtonClick) =>
    PDPDispatcher.setBrandButtonClick({ brandButtonClick }, _dispatch),
});

export class PDPDetailContainer extends PureComponent {
  static propTypes = {
    brandDeascription: PropTypes.string,
    brandImg: PropTypes.string,
    brandName: PropTypes.string,
  };

  containerFunctions = {
    // getData: this.getData.bind(this)
  };

  containerProps = () => {
    // isDisabled: this._getIsDisabled()
    const { brandDescription, brandImg, brandName, brand_url, brandInfoData } = this.props;
    return {
      brandDescription,
      brandImg,
      brandName,
      brand_url,
      brandInfoData
    };
  };

  brandNameclick = () => {
    const { clickBrandButton } = this.props;
    clickBrandButton(true);
  }
  
  render() {
    return (
      <PDPDetail {...this.containerFunctions} {...this.containerProps()} brandNameclick={ this.brandNameclick } />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PDPDetailContainer);
