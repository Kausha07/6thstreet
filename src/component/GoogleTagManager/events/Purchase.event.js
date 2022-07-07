/* eslint-disable import/no-cycle */
import Event, {
  EVENT_GTM_PURCHASE,
  EVENT_MOE_PURCHASE_SUCCESS,
} from "Util/Event";
import { roundPrice } from "Util/Price";

import ProductHelper from "../utils";
import BaseEvent from "./Base.event";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import BrowserDatabase from "Util/BrowserDatabase";

export const PURCHASE_EVENT_HANDLE_DELAY = 700;
export const SPAM_PROTECTION_DELAY = 10000;

/**
 * On order success page "Purchase"
 */
class PurchaseEvent extends BaseEvent {
  /**
   * Event delay
   *
   * @type {number}
   */
  eventHandleDelay = PURCHASE_EVENT_HANDLE_DELAY;

  /**
   * Bind on product detail
   */
  bindEvent() {
    Event.observer(EVENT_GTM_PURCHASE, ({ orderID: orderId, totals }) => {
      this.handle(orderId, totals);
    });
  }

  /**
   * Handle
   *
   * @param orderId
   * @param totals
   * @param cartData
   */
  handler(orderId, totals) {
    if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
      return;
    }

    this.pushEventData({
      ecommerce: {
        currencyCode: this.getCurrencyCode(),
        purchase: {
          actionField: this.getActionFields(orderId, totals),
          products: this.getProducts(totals),
        },
      },
    });
    console.log("totals", totals);
    const currentAppState = BrowserDatabase.getItem(APP_STATE_CACHE_KEY);
    const productDetails = totals?.items;
    const formattedDetetails = productDetails.map(
      ({
        full_item_info: {
          name,
          brand_name,
          itemPrice,
          price,
          category,
          config_sku,
          gender,
          size_option,
          size_value,
          sku,
          color,
          product_type_6s
        },
      }) => ({
        brand_name: brand_name || "",
        color: color || "",
        discounted_amount: itemPrice || price,
        product_name: name || "",
        product_sku: config_sku || sku,
        gender: gender || "",
        size_id: size_option || "",
        size: size_value || "",
        subcategory: product_type_6s || category || "",
      })
    );
    console.log("formattedDetetails", formattedDetetails);
    Moengage.track_event(EVENT_MOE_PURCHASE_SUCCESS, {
      country: currentAppState.country
        ? currentAppState.country.toUpperCase()
        : "",
      language: currentAppState.language
        ? currentAppState.language.toUpperCase()
        : "",
      category: currentAppState.gender
        ? currentAppState.gender.toUpperCase()
        : "",

      coupon_code_applied: totals?.coupon_code || "",
      currency: totals?.currency_code || "",
      product_count: totals?.items.length || "",
      shipping_fee: totals?.shipping_fee || "",
      subtotal_amount: totals?.subtotal || "",
      order_id: orderId || "",
      total_amount: totals?.total || "",
      transaction_id: totals?.id || "",
      product: formattedDetetails,
      app6thstreet_platform: "Web",
      //shipping: "",
      //value: "",
    });
  }
  getMOEPurchaseDetails() {}
  /**
   * Get order information
   *
   * @return {{revenue: number, coupon_discount_abs: string, coupon: string, shipping: number, affiliation: string, coupon_discount_amount: string, tax: number, id: *}}
   */
  getActionFields(
    orderId = "",
    { tax_amount, total, shipping_fee, coupon_code = "" }
  ) {
    return {
      id: orderId,
      affiliation: "Online Store",
      revenue: +roundPrice(total),
      tax: +roundPrice(tax_amount),
      shipping: +roundPrice(shipping_fee),
      coupon: coupon_code,
    };
  }

  /**
   * Get product detail
   *
   * @param totals
   *
   * @return {{quantity: number, price: number, name: string, variant: string, id: string, category: string, brand: string, url: string}[]}
   * @param cartData
   */
  getProducts({ items = [] }) {
    const products = items.reduce(
      (acc, item) => [
        ...acc,
        {
          ...ProductHelper.getItemData(item),
          quantity: ProductHelper.getQuantity(item),
        },
      ],
      []
    );

    const groupedProducts = this.getGroupedProducts();
    Object.values(groupedProducts || {}).forEach(({ data }) =>
      products.push(data)
    );

    return products;
  }
}

export default PurchaseEvent;
