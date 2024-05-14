import Event, { EVENT_GTM_VIEW_ITEM_LIST } from "Util/Event";

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
      this.handle(EVENT_GTM_VIEW_ITEM_LIST, impression);
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
    let isFilters = false;
    let queryId = null;
    const formattedImpressions = impressions.map(
      (
        {
          name,
          label,
          id,
          brand_name,
          color,
          sku,
          category,
          categories,
          price,
          list,
          product_Position,
          position,
          productQueryID,
          in_stock
        },
        index
      ) => ({
        name: name || label || "",
        id: sku || id || "",
        price:
          price && price.length > 0
            ? price[0][Object.keys(price[0])[0]]["6s_special_price"]
            : "",
        brand: brand_name ? brand_name : "",
        category:  categories?.level1?.[0] ?? "",
        category2: categories?.level2?.[0] ?? "",
        category3: categories?.level3?.[0] ?? "",
        category4: categories?.level4?.[0] ?? "",
        category5: categories?.level5?.[0] ?? "",
        variant: color || "",
        list: list || "Others",
        position: product_Position
          ? product_Position
          : position
          ? position
          : index + 1 || "",
        queryId: productQueryID ? productQueryID : null,
        variant_availability: in_stock
      })
    );

    impressions.map((item) => {
      if (item.isFilters) {
        isFilters = true;
      }
    });
  
    // Find the first non-null queryId
   const firstQueryIdItem = formattedImpressions.find(item => item.queryId !== null);
   if (firstQueryIdItem) {
     queryId = firstQueryIdItem.queryId;
   }

    storage.impressions = formattedImpressions;
    this.setStorage(storage);
    this.pushEventData({
      event: EVENT_GTM_VIEW_ITEM_LIST,
      ecommerce: {
        currency: this.getCurrencyCode(),
        currencyCode: this.getCurrencyCode(),
        impressions: formattedImpressions,
        items: formattedImpressions.map((item, index) => ({
          item_name: item.name,
          item_id: item.id,
          item_brand: item.brand,
          item_category: item.category,
          item_category2: item.category2,
          item_category3: item.category3,
          item_category4: item.category4,
          item_category5: item.category5,
          item_variant: item.variant,
          item_list_name: item.list,
          item_list_id: '',
          price: item.price,
          index: item.position,
          variant_availability: item.variant_availability
        }))
      },
      is_filter: isFilters ? "Yes" : "No",
      query_id: queryId,

    });
  }
}

export default ProductImpressionEvent;
