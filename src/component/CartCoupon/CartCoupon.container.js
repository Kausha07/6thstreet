import { connect } from 'react-redux';

import { CartCouponContainer as SourceCartCouponContainer } from 'SourceComponent/CartCoupon/CartCoupon.container';
import CartDispatcher from 'Store/Cart/Cart.dispatcher';

export const mapDispatchToProps = (dispatch) => ({
    applyCouponToCart: (couponCode) => CartDispatcher.applyCouponCode(dispatch, couponCode),
    removeCouponFromCart: (data={}) => CartDispatcher.removeCouponCode(dispatch, data)
});

export const mapStateToProps = (state) => ({
    isSignedIn: state.MyAccountReducer.isSignedIn,
    config: state.AppConfig.config,
  });

export default connect(mapStateToProps, mapDispatchToProps)(SourceCartCouponContainer);
