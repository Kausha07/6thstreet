import Event, { EVENT_GTM_PDP_TRACKING } from "Util/Event";
import BaseEvent from "./Base.event";

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
/**
 * GTM PWA Impression Event
 *
 * Called when customer see banners on home page
 */
class PDPTrackingEvent extends BaseEvent {
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
    Event.observer(EVENT_GTM_PDP_TRACKING, (data) => {
      this.handle(data);
    });
  }

  handler(data) {
    const eventName = data.name;
    const EventAction = data.action ? data.action : eventName;
    
    if (eventName) {
      const eventData = {
        event: eventName,
        eventCategory: "pdp_tracking",
        eventAction: EventAction,
        ...(data.product_id && { productId: data.product_id }),
        ...(data.product_name && { productName: data.product_name }),
        ...(data.stockStatus && { stockStatus: data.stockStatus }),
        ...(data.size_type && { size_type: data.size_type }),
        ...(data.size_value && { size_value: data.size_value }),
        ...(data.imagesScrolled && { imagesScrolled: data.imagesScrolled }),
        UserType: this.getCustomerId().toString().length > 0 ? "Logged In" : "Logged Out",
      };
  
      // Check if eventName is "select_size"
      if (eventName === "select_size") {
        // Add ecommerce data
        eventData.ecommerce ={
          currency: data?.currency ?? "",
          items: [
              {
                  item_name: data?.product_name ?? "",
                  item_id: data?.product_id ?? "",
                  item_brand: data?.brand_name ?? "",
                  item_category: data?.item_category ?? "",
                  item_category2: data?.item_category2 ?? "",
                  item_category3: data?.item_category3 ?? "",
                  item_category4: data?.item_category4?? "",
                  item_category5: data?.item_category5 ?? "",
                  item_variant: data?.color ?? "",
                  // item_list_name: 'Product_LIST_NAME_HERE',
                  // item_list_id: 'Product_LIST_ID_HERE',
                  price: data?.price ?? "",
                  discount: data?.discount ?? "",
                  item_size:  data?.size_value ?? "",
                  item_size_type:  data?.size_type ?? "",
              }
          ]
      };
      }
  
      // Push the event data
      this.pushEventData(eventData);
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

export default PDPTrackingEvent;
