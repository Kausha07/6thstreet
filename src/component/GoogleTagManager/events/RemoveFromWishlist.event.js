/* eslint-disable import/no-cycle */
import Event, { EVENT_GTM_PRODUCT_REMOVE_FROM_WISHLIST } from "Util/Event";
import BaseEvent from "./Base.event";

export const SPAM_PROTECTION_DELAY = 200;
/**
 * Product remove from wishlist
 */
class RemoveFromWishlistEvent extends BaseEvent {
  /**
   * Bind remove from wishlist
   */
  bindEvent() {
    Event.observer(EVENT_GTM_PRODUCT_REMOVE_FROM_WISHLIST, ({ product }) => {
      this.handle(product);
    });
  }

  /**
   * Handle product remove from wishlist
   */
  handler(product) {
    if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
      return;
    }

    const currency_code = this.getCurrencyCode();
    this.pushEventData({
      ecommerce: {
        currencyCode: currency_code, 
        currency:currency_code,
        remove: {
          products: [product],
        },
        items: [
          {
            item_name: product?.name,
            item_id: product?.id,
            item_brand: product?.brand,
            item_category: product?.category,
            item_variant: product?.variant,
            item_category: product?.categories?.level0?.[0] ?? "",
            item_category2: product?.categories?.level1?.[0] ?? "",  
            item_category3: product?.categories?.level2?.[0] ?? "",
            item_category4: product?.categories?.level3?.[0] ?? "",
            item_category5: product?.categories?.level4?.[0] ?? "",
            price: product?.price[0][Object.keys(product?.price[0])]["6s_special_price"] ?? 0,
            discount: (
              (product?.price[0][Object.keys(product?.price[0])]["6s_base_price"] ?? 0) - 
              (product?.price[0][Object.keys(product?.price[0])]["6s_special_price"] ?? 0)
            ) ?? 0,
            quantity: product?.quantity,
            variant_availability: product?.variant_availability,
          }
        ]
      },
    });
  }
}

export default RemoveFromWishlistEvent;
