/* eslint-disable import/no-cycle */
import Event, { EVENT_GTM_PRODUCT_ADD_TO_CART } from "Util/Event";
import BrowserDatabase from "Util/BrowserDatabase";
import BaseEvent from "./Base.event";

export const SPAM_PROTECTION_DELAY = 200;
export const EVENT_EXECUTION_DELAY = 400;
/**
 * Product add to cart event
 */
class AddToCartEvent extends BaseEvent {
  /**
   * Bind add to cart
   */
  bindEvent() {
    Event.observer(EVENT_GTM_PRODUCT_ADD_TO_CART, ({ product }) => {
      setTimeout(() => {
        this.handle(product);
      }, EVENT_EXECUTION_DELAY);
    });
  }

  /**
   * Handle product add to cart
   */
  handler(product) {
    if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
      return;
    }
    const productPositionData =
      BrowserDatabase.getItem("ProductPositionData") || {};
    const sku = product.id;
    const getProdPosition = productPositionData[sku] || null;

    const formattedData = product.position
      ? product
      : {
          ...product,
          ...(getProdPosition && { position: getProdPosition }),
        };
    const sha_email =
      BrowserDatabase.getItem("TT_Data") &&
      BrowserDatabase.getItem("TT_Data")?.mail
        ? BrowserDatabase.getItem("TT_Data").mail
        : null;
    const sha_phone =
      BrowserDatabase.getItem("TT_Data") &&
      BrowserDatabase.getItem("TT_Data")?.phone
        ? BrowserDatabase.getItem("TT_Data").phone
        : null;
    this.pushEventData({
      sha256_email: sha_email,
      sha256_phone_number: sha_phone,
      ecommerce: {
        currency: this.getCurrencyCode(),
        currencyCode:  this.getCurrencyCode(),
        add: {
          products: [formattedData],
        },
        items: [
          {
            item_name: product?.name,
            item_id: product?.id,
            item_brand: product?.brand,
            item_category: product?.category,
            item_variant: product?.variant,
            price: product?.price,
            item_size: JSON.stringify(product?.size) ?? "",
          }
        ]
      },
    });
  }
}

export default AddToCartEvent;
