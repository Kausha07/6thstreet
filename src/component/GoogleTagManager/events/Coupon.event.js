import Event, { EVENT_GTM_COUPON } from "Util/Event";
import BaseEvent from "./Base.event";
import BrowserDatabase from "Util/BrowserDatabase";

/**
 * Website places, from where was received event data
 *
 * @type {string}
 */

/**
 * Constants
 *
 * @type {number}
 */
export const SPAM_PROTECTION_DELAY = 200;
export const EVENT_HANDLE_DELAY = 700;
export const URL_REWRITE = "url-rewrite";
export const CART_ITEMS_CACHE_KEY = "CART_ITEMS_CACHE_KEY";
/**
 * GTM PWA Impression Event
 *
 * Called when customer see banners on home page
 */
class CouponEvent extends BaseEvent {
  /**
   * Set base event call delay
   *
   * @type {number}
   */
  eventHandleDelay = EVENT_HANDLE_DELAY;

  /**
   * Bind PWA event handling
   */
  bindEvent() {
    Event.observer(EVENT_GTM_COUPON, (eventDetails) => {
      this.handle(eventDetails);
    });
  }

  handler(event) {
    const cartItem = BrowserDatabase.getItem(CART_ITEMS_CACHE_KEY) || [];

    let formattedImpressions = {};
    if (cartItem.length > 0) {
      formattedImpressions = cartItem.map(
        ({
          full_item_info: {
            name,
            config_sku,
            itemPrice,
            color,
            qty,
            brand_name,
          },
        }) => ({
          name: name || "",
          id: config_sku || "",
          qty: qty || "",
          brand: brand_name || "",
          price: itemPrice || "",
          color: color || "",
        })
      );
    }

    if (event.name) {
      this.pushEventData({
        event: event.name,
        eventCategory: "checkout_tracking",
        eventAction: event.name,
        couponCode: event.coupon,
        products: formattedImpressions,
        UserType:
          this.getCustomerId().toString().length > 0
            ? "Logged In"
            : "Logged Out",
        discount: event?.discount,
        tax: event?.tax,
        sub_total: event?.sub_total,
        subtotal_incl_tax: event?.subtotal_incl_tax,
        shipping: event?.shipping,
        total: event?.total,
      });
    }
  }

  getCustomerId() {
    return this.isSignedIn()
      ? this.getAppState().MyAccountReducer.customer.id || ""
      : "";
  }

  getPageType() {
    const { urlRewrite, currentRouteName } = window;
    if (currentRouteName === URL_REWRITE) {
      if (typeof urlRewrite === "undefined") {
        return "";
      }
      if (urlRewrite.notFound) {
        return "notfound";
      }
      return (urlRewrite.type || "").toLowerCase();
    }
    return (currentRouteName || "").toLowerCase();
  }
}

export default CouponEvent;
