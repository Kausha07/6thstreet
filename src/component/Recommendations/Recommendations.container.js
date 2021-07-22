import { PureComponent } from "react";
import { connect } from "react-redux";
import Recommendations from "./Recommendations.component";

export const mapStateToProps = (_state) => ({
  // wishlistItems: state.WishlistReducer.productsInWishlist
});

export const mapDispatchToProps = (_dispatch) => ({
  // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class RecommendationsContainer extends PureComponent {
  // componentDidMount() {
  //   this.getRecommendedProducts();
  // }
  containerProps = () => {
    const { products, isVueData } = this.props;
    console.log("products", products);
    return { products, isVueData };
  };

  render() {
    return (
      <Recommendations
        {...this.containerFunctions}
        {...this.containerProps()}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecommendationsContainer);
