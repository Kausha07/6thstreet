import React from "react";
import "./SideWideCoupon.style";
import CartDispatcher from "Store/Cart/Cart.dispatcher";
import BrowserDatabase from "Util/BrowserDatabase";
import { CART_ID_CACHE_KEY } from "Store/MyAccount/MyAccount.dispatcher";
import { connect } from "react-redux";
import { Coupon } from "Component/Icons/index";
import { isArabic as checkIsArabic } from "Util/App";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import Event, {
  EVENT_GTM_COUPON,
  MOE_trackEvent,
  EVENT_APPLY_COUPON,
  EVENT_REMOVE_COUPON,
  EVENT_APPLY_COUPON_FAILED,
} from "Util/Event";

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
    config: state.AppConfig.config,
  };
};

function SideWideCoupon(props) {
  const {
    handleRemoveCode,
    updateSidewideCoupon,
    totals: { site_wide_applied = 0, site_wide_coupon = "", coupon_code = "" },
    isSignedIn,
    config,
  } = props;
  const isArabic = checkIsArabic();
  const countryCode = getCountryFromUrl();
  const langCode = getLanguageFromUrl();
  const sidewideCouponCode = config?.countries?.[countryCode]?.sidewideCouponCode?.[langCode] || "";

  const sendSiteWideCouponEvents = (event, coupon) => {
    MOE_trackEvent(event, { 
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      coupon_code: coupon || "",
      app6thstreet_platform: "Web",
    });
    const eventData = {
      name: event,
      coupon: coupon,
      discount: props?.totals?.discount || "",
      shipping: props?.totals?.shipping_fee || "",
      tax: props?.totals?.tax_amount || "",
      sub_total : props?.totals?.subtotal || "",
      subtotal_incl_tax : props?.totals?.subtotal_incl_tax || "",
      total: props?.totals?.total || "",
    };
    Event.dispatch(EVENT_GTM_COUPON, eventData);
  }

  const handleSideWideCoupon = async (flag) => {
    const cart_id = BrowserDatabase.getItem(CART_ID_CACHE_KEY);
    const resp = await updateSidewideCoupon(cart_id, flag, !isSignedIn);

    if(!resp?.status){
      sendSiteWideCouponEvents(EVENT_APPLY_COUPON_FAILED, sidewideCouponCode );
    }else if(resp?.status && flag ) {
      sendSiteWideCouponEvents(EVENT_APPLY_COUPON, sidewideCouponCode );
    } else {
      sendSiteWideCouponEvents(EVENT_REMOVE_COUPON, sidewideCouponCode );
    }
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
                  {coupon_code ? coupon_code : sidewideCouponCode}&nbsp;
                </span>
                {__("Coupon applied")}
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
                  {sidewideCouponCode}
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
