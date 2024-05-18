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
            item_name: product?.name ?? "",
            item_id: product?.id ??"",
            item_brand: product?.brand ?? "",
            item_category: product?.categories?.level1?.[0] ?? "",
            item_category2:product?.categories?.level2?.[0] ?? "",
            item_category3:product?.categories?.level3?.[0] ?? "",
            item_category4:product?.categories?.level4?.[0] ?? "",
            item_category5:product?.categories?.level5?.[0] ?? "",
            item_variant: product?.variant ?? "",
            price: product?.price ?? "",
            discount : product?.discount ?? 0,
            item_size: product?.size ?? "",
            item_size_type : product?.size_id ?? "",
            variant_availability :product?.variant_availability ?? ""
          }
        ]
      },
    });
  }
}

export default AddToCartEvent;
