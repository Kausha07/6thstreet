import React from "react";
import "./SideWideCoupon.style";
import CartDispatcher from "Store/Cart/Cart.dispatcher";
import BrowserDatabase from "Util/BrowserDatabase";
import { CART_ID_CACHE_KEY } from "Store/MyAccount/MyAccount.dispatcher";
import { connect } from "react-redux";
import { Coupon } from "Component/Icons/index";
import { isArabic as checkIsArabic } from "Util/App";

export const mapDispatchToProps = (dispatch) => ({
  updateTotals: (cartId) => CartDispatcher.getCartTotals(dispatch, cartId),
  updateSidewideCoupon: (quoteId, flag, is_guest) =>
    CartDispatcher.updateSidewideCoupon(dispatch, quoteId, flag, is_guest),
  getCart: () => CartDispatcher.getCart(dispatch, false, false),
});

export const mapStateToProps = (state) => {
  return {
    totals: state.CartReducer.cartTotals,
    isSignedIn: state.MyAccountReducer.isSignedIn,
  };
};

function SideWideCoupon(props) {
  const {
    handleRemoveCode,
    updateSidewideCoupon,
    totals: { site_wide_applied = 0, site_wide_coupon = "", coupon_code = "" },
    isSignedIn,
  } = props;
  const isArabic = checkIsArabic();

  const handleSideWideCoupon = async (flag) => {
    const cart_id = BrowserDatabase.getItem(CART_ID_CACHE_KEY);
    await updateSidewideCoupon(cart_id, flag, !isSignedIn);
  };

  return (
    <div block="sideWideCouponBlock">
      {site_wide_applied || coupon_code ? (
        <div block="sideWideCouponBlock" elem="sidewideApplyed">
          <div block="appliedCouponDetail">
            <span block="showCouponBtnLeftBlock">
              <img block="couponImage" src={Coupon} alt="couponImage" />
              <span block="couponText" mods={{ isArabic }}>
                <span block="sideWideCouponBlock" elem="recommendedCode">
                  {coupon_code ? coupon_code : site_wide_coupon}&nbsp;
                </span>
                {__("coupon applied")}
              </span>
            </span>
          </div>
          <button
            className="removeCouponBtn"
            onClick={(e) => {
              coupon_code ? handleRemoveCode(e) : handleSideWideCoupon(0);
            }}
          >
            {__("Remove")}
          </button>
        </div>
      ) : (
        <div block="sideWideCouponBlock" elem="sidewideNotApplyed">
          <div block="showCouponBtn">
            <span block="showCouponBtnLeftBlock">
              <img block="couponImage" src={Coupon} alt="couponImage" />
              <span block="couponText" mods={{ isArabic }}>
                {__("Recommended code: ")}
                <span block="sideWideCouponBlock" elem="recommendedCode">
                  {site_wide_coupon}
                </span>
              </span>
            </span>

            <button
              block="sidewideSelectText"
              onClick={(e) => {
                handleSideWideCoupon(1);
              }}
            >
              {__("Apply")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SideWideCoupon);
