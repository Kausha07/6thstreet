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

    if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
      return;
    }
    this.pushEventData({
      event: EVENT_MOE_VIEW_CART_ITEMS,
      total: totals?.total || "",
      discount: totals?.discount || "",
      shipping: totals?.shipping_fee,
      subtotal: totals?.subtotal || "",
      currency: totals?.currency_code || "",
      coupon: totals?.coupon_code || "",
      products: formattedImpressions || "",
    });
  }
}

export default CartEvent;
