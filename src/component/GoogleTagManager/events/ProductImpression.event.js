import Event, { EVENT_PRODUCT_IMPRESSION } from "Util/Event";

import BaseEvent from "./Base.event";

/**
 * Website places, from where was received event data
 *
 * @type {string}
 */
export const EVENT_PRODUCT_LIST_IMPRESSION = "EVENT_PRODUCT_LIST_IMPRESSION";
//export const HOME_PAGE_BANNER_IMPRESSIONS = "HOME_PAGE_BANNER_IMPRESSIONS";

/**
 * Constants
 *
 * @type {number}
 */
export const SPAM_PROTECTION_DELAY = 200;
export const EVENT_HANDLE_DELAY = 700;

/**
 * GTM PWA Impression Event
 *
 * Called when customer see banners on home page
 */
class ProductImpressionEvent extends BaseEvent {
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
    // Home
    Event.observer(EVENT_PRODUCT_LIST_IMPRESSION, (impression) => {
      //if (document.readyState == ("complete" || "interactive"  )){
      this.handle(EVENT_PRODUCT_IMPRESSION, impression, "promoView");
      //}
    });
  }

  /**
   * Handle Impressions
   *
   * @param eventName Unique event id
   * @param impressions banner list
   */
  handler(EVENT_TYPE, impressions = []) {
    const storage = this.getStorage();

    const formattedImpressions = impressions.map(
      (
        { name,label, id, brand_name, color, sku, url, product_type_6s,category, price },
        index
      ) => ({
        name: name || label,
        id: sku || id,
        price: price[0][Object.keys(price[0])[0]]["6s_special_price"],
        brand: brand_name,
        variant: color,
        category: product_type_6s || category,
        url: url,
        //list: "",
        position: 1,
        dimension9:
          (100 -
          Math.round(
            (price[0][Object.keys(price[0])[0]]["6s_special_price"] /
              price[0][Object.keys(price[0])[0]]["6s_base_price"]) *
              100
          )) || 0 ,
        dimension10: price[0][Object.keys(price[0])[0]]["6s_base_price"] || "",
        dimension11:
          price[0][Object.keys(price[0])[0]]["6s_special_price"] || " ",
      })
    );

    storage.impressions = formattedImpressions;
    this.setStorage(storage);
    this.pushEventData({
      event: "productImpression",
      ecommerce: {
        currencyCode: this.getCurrencyCode(),
        product: formattedImpressions,
      },
    });
  }
}

export default ProductImpressionEvent;
