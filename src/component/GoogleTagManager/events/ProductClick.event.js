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
        click: {
          actionField: { list: "Category page" },
          products: [
            {
              name: product.name ? product.name : "",
              id: product.sku ? product.sku : "",
              price: product.price[0][Object.keys(product.price[0])].default
                ? product.price[0][Object.keys(product.price[0])].default
                : product.price[0][Object.keys(product.price[0])][
                    "6s_special_price"
                  ]
                ? product.price[0][Object.keys(product.price[0])][
                    "6s_special_price"
                  ]
                : 0,
              brand: product.brand_name ? product.brand_name : "",
              category: product.product_type_6s
                ? product.product_type_6s
                : product.category && typeof product.category == "string"
                ? product.category
                : "",
              variant: product.color ? product.color : "",
              position: product.product_Position
                ? product.product_Position
                : product.position
                ? product.position
                : "",
            },
          ],
        },
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
