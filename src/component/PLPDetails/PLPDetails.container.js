// import PropTypes from 'prop-types';
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import PLPDetails from "./PLPDetails.component";
import Algolia from "Util/API/provider/Algolia";

export const mapStateToProps = (_state) => ({
  // wishlistItems: state.WishlistReducer.productsInWishlist
});

export const mapDispatchToProps = (_dispatch) => ({
  // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class PLPDetailsContainer extends PureComponent {
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
    const { brandDescription, brandImg, brandName } = this.props;
    return {
      brandDescription,
      brandImg,
      brandName,
    };
  };

  async componentDidMount() {
    const data = await new Algolia({
      index: "brands_english",
    }).getBrandsDetails();
    console.log('brand data',data)
  }

  render() {
    return (
      <PLPDetails {...this.containerFunctions} {...this.containerProps()} />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PLPDetailsContainer);
