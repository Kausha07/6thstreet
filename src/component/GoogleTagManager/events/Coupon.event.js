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
    let productName = [],
      productID = [];
    if (cartItem.length > 0) {
      cartItem.forEach((item) => {
        let productKeys = item?.full_item_info;
        productName.push(productKeys?.name);
        productID.push(productKeys?.config_sku);
      });
    }
    this.pushEventData({
      event: event.name,
      eventCategory: "checkout_tracking",
      eventAction: event.name,
      couponCode: event.coupon,
      productName:
        productName.length == 0
          ? ""
          : productName.length == 1
          ? productName.toString()
          : productName,
      productId:
        productID.length == 0
          ? ""
          : productID.length == 1
          ? productID.toString()
          : productID,
      UserType:
        this.getCustomerId().toString().length > 0 ? "Logged In" : "Logged Out",
      CustomerID: this.getCustomerId(),
      PageType: this.getPageType(),
    });
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
