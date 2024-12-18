import { isArabic, getDiscountFromTotals } from "Util/App";
import {
  EVENT_REMOVE_COUPON,
  EVENT_APPLY_COUPON,
  EVENT_APPLY_COUPON_FAILED,
} from "Util/Event";

export const getSideWideSavingPercentages = (totals = []) => {
  const totalMrp = getDiscountFromTotals(totals, "total_mrp");
  const totalDiscount = getDiscountFromTotals(totals, "total_discount");

  // let discountPercentage = Math.round(100 * (1 - totalDiscount / totalMrp));

  let discountPercentage = Math.round(100 * ( totalDiscount / totalMrp));

  return discountPercentage;
};

export const handleSwcToPromoCall = async ({
  SWCPromoCall = true,
  applyCouponToCart = () => {},
  pageType = "",
  setLoader = () => {},
  removeCouponFromCart = () => {},
  flag,
  sidewideCouponCode,
  sendSiteWideCouponEvents,
  isSignedIn,
}) => {
  if (flag == 0) {
    const resp = await removeCouponFromCart({ is_guest: !isSignedIn, isSiteWide: true });
    sendSiteWideCouponEvents(EVENT_REMOVE_COUPON, sidewideCouponCode);
  } else if (flag == 1) {
    setLoader(true);
    try {
      let response = (await applyCouponToCart(sidewideCouponCode)) || null;
      setLoader(false);
      if (typeof response === "string") {
        sendSiteWideCouponEvents(EVENT_APPLY_COUPON_FAILED, sidewideCouponCode);
      } else {
        sendSiteWideCouponEvents(EVENT_APPLY_COUPON, sidewideCouponCode);
      }
    } catch (error) {
      console.error(error);
    }
  }
};
