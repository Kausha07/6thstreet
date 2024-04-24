/* eslint-disable import/no-cycle */
import Event, { EVENT_GTM_CART, EVENT_MOE_VIEW_CART_ITEMS } from "Util/Event";

import BaseEvent from "./Base.event";

export const SPAM_PROTECTION_DELAY = 1000;

/**
 * On checkout
 */
class CartEvent extends BaseEvent {
  /**
   * Event fire delay
   *
   * @type {number}
   */
  eventHandleDelay = 100;

  /**
   * Bind
   */
  bindEvent() {
    Event.observer(EVENT_GTM_CART, (totals) => {
      this.handle(totals);
    });
  }

  /**
   * Handle
   */
  handler(totals) {
    const items = totals?.items || null;
    const formattedImpressions = items
      ? items.map(
          ({
            full_item_info: {
              brand_name,
              sku,
              name,
              price,
              color,
              category,
              itemPrice,
            },
          }) => ({
            brand: brand_name,
            category: category,
            id: sku,
            name,
            price: price || itemPrice,
            variant: color,
          })
        )
      : null;
      const ga4_items = items.map((item) => ({
        item_name: item?.full_item_info?.name,
        item_id: item?.full_item_info?.config_sku,
        item_brand: item?.full_item_info?.brand_name,
        item_category: item?.full_item_info?.category,
        item_variant: item?.full_item_info?.color,
        price: item?.full_item_info?.price,
        discount: (item?.full_item_info?.original_price - item?.full_item_info?.price),
        quantity: item?.full_item_info?.qty,
        item_size: item?.full_item_info?.size_value,
        item_size_type: item?.full_item_info?.size_option
      }));

    if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
      return;
    }
    console.log("test", items);
    this.pushEventData({
      event: EVENT_MOE_VIEW_CART_ITEMS,
      products: formattedImpressions || "",
      value: totals?.total || "",
      ecommerce : {
        total: totals?.total || "",
        discount: totals?.discount || "",
        shipping: totals?.shipping_fee,
        subtotal: totals?.subtotal || "",
        international_shipping_amount: totals?.international_shipping_amount?? 0,
        currency: totals?.currency_code || "",
        coupon: totals?.coupon_code || "",
        items: ga4_items
        }
    });
  }
}

export default CartEvent;
