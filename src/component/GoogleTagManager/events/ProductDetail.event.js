/* eslint-disable import/no-cycle */
import Event, {
  EVENT_GTM_GENERAL_INIT,
  EVENT_GTM_PRODUCT_DETAIL,
} from "Util/Event";
import BrowserDatabase from "Util/BrowserDatabase";
import ProductHelper from "../utils";
import BaseEvent from "./Base.event";

export const SPAM_PROTECTION_TIMEOUT = 0;
export const EVENT_EXECUTION_DELAY = 300;

/**
 * Product detail push event
 */
class ProductDetailEvent extends BaseEvent {
  /**
   * Last product path name
   *
   * @type {null|string}
   */
  lastPath = null;

  /**
   * Bind on product detail
   */
  bindEvent() {
    Event.observer(EVENT_GTM_PRODUCT_DETAIL, ({ product, pathname }) => {
      setTimeout(() => {
        this.handle(product, pathname);
      }, EVENT_EXECUTION_DELAY);
    });

    Event.observer(EVENT_GTM_GENERAL_INIT, () => {
      this.lastPath = null;
    });
  }

  /**
   * Handle product detail event
   *
   * @param product
   * @param pathname
   */
  handler(product, pathname) {
    const { sku, type_id } = product;
    if (
      this.spamProtection(SPAM_PROTECTION_TIMEOUT, sku) ||
      pathname === this.lastPath
    ) {
      return;
    }

    this.lastPath = pathname;

    const productToPass =
      type_id === "simple"
        ? ProductHelper.getProductData(product, true)
        : ProductHelper.getProductData(product);
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
        detail: {
          // actionField: {
          //   list: "Category page",
          // },
          products: [product],
        },
        items: [
          {
            item_name: product?.name,
            item_id: product?.skuFromProps,
            item_brand: product?.brand,
            item_category: product?.category,
            item_variant: product?.variant,
            price: product?.price,
            item_category: product?.categories?.level1?.[0] ?? "",
            item_category2:product?.categories?.level2?.[0] ?? "",
            item_category3:product?.categories?.level3?.[0] ?? "",
            item_category4:product?.categories?.level4?.[0] ?? "",
            item_category5:product?.categories?.level5?.[0] ?? "",
            discount: product?.discount ?? "",
            variant_availability: product?.variant_availability ?? ""
          }
        ]
      },
    });
  }
}

export default ProductDetailEvent;
