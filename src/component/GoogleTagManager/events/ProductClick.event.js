/* eslint-disable import/no-cycle */
import Event, {
  EVENT_GTM_PRODUCT_CLICK,
  EVENT_GTM_VUE_PRODUCT_CLICK,
} from "Util/Event";
import BrowserDatabase from "Util/BrowserDatabase";
import { EVENT_IMPRESSION } from "../GoogleTagManager.component";
import ProductHelper from "../utils";
import BaseEvent from "./Base.event";

/**
 * Product click event
 */
class ProductClickEvent extends BaseEvent {
  /**
   * Set delay
   *
   * @type {number}
   */
  eventHandleDelay = 0;

  /**
   * Bind click events
   */
  bindEvent() {
    Event.observer(EVENT_GTM_PRODUCT_CLICK, (product) => {
      this.handle(product);
    });
    Event.observer(EVENT_GTM_VUE_PRODUCT_CLICK, (product) => {
      this.handle(product, true);
    });
  }

  /**
   * Handle product click
   */
  handler(product) {
    const { list } = this.getProductFromImpression(product) || {};
    const id = product.sku || "";
    const prodPosition = product.product_Position
      ? product.product_Position
      : product.position
      ? product.position
      : 0;
    const positionObj = {
      [id]: prodPosition,
    };
    const initialPositionData =
      BrowserDatabase.getItem("ProductPositionData") || {};
    if (id) {
      BrowserDatabase.setItem(
        { ...initialPositionData, ...positionObj },
        "ProductPositionData"
      );
    }

    this.pushEventData({
      ecommerce: {
        currencyCode: this.getCurrencyCode(),
        currency: this.getCurrencyCode(),
        click: {
          actionField: { list: product.listName ? product.listName : "Others" },
          products: [
            {
              name: product.name ?? "",
              id: product.sku ?? "",
              price: product.price[0][Object.keys(product.price[0])]["6s_special_price"] ?? 0,
              brand: product.brand_name ??  "",
              category:  product.categories?.level1?.[0] ?? "",
              category2: product.categories?.level2?.[0] ?? "",
              category3: product.categories?.level3?.[0] ?? "",
              category4: product.categories?.level4?.[0] ?? "",
              category5: product.categories?.level5?.[0] ?? "",
              variant: product.color ?? "",
              position: product.product_Position ?? product.position ?? "",
            },
          ],
        },
       items : [
        {
          item_name: product.name ?? "",
          item_id: product.sku ?? "",
          item_brand: product.brand_name ?? "",
          item_category: product.categories?.level1?.[0] ?? "",
          item_category2: product.categories?.level2?.[0] ?? "",
          item_category3: product.categories?.level3?.[0] ?? "",
          item_category4: product.categories?.level4?.[0] ?? "",
          item_category5: product.categories?.level5?.[0] ?? "",
          item_variant: product.color ?? "",
          item_list_name: product.listName ?? "",
          item_list_id: '',
          price: product.price[0][Object.keys(product.price[0])]["6s_special_price"] ?? 0,
          discount: (
            (product.price[0][Object.keys(product.price[0])]["6s_base_price"] ?? 0) - 
            (product.price[0][Object.keys(product.price[0])]["6s_special_price"] ?? 0)
            ) ?? 0,
          quantity: 1,
          index: product.product_Position ?? product.position ?? ""
        }
       ]
      },
    });
  }

  /**
   * Get product position in impression
   *
   * @return {*}
   * @param clickedProduct
   */
  getProductFromImpression(clickedProduct) {
    const { impressions = [] } = this.getStorage(EVENT_IMPRESSION);
    const id = ProductHelper.getSku(clickedProduct);

    const { sku } = clickedProduct;

    return impressions.find(
      ({ id: impressionId }) => impressionId === id || impressionId === sku
    );
  }
}

export default ProductClickEvent;
