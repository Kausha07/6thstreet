/* eslint-disable import/no-cycle */
import Event, { EVENT_GTM_CHECKOUT, EVENT_ADD_PAYMENT_INFO, EVENT_GTM_CHECKOUT_BILLING } from "Util/Event";
import BrowserDatabase from "Util/BrowserDatabase";
import ProductHelper from "../utils";
import BaseEvent from "./Base.event";

export const CHECKOUT_EVENT_DELAY = 500;
export const SPAM_PROTECTION_DELAY = 1000;

/**
 * On checkout
 */
class CheckoutEvent extends BaseEvent {
  /**
   * Event fire delay
   *
   * @type {number}
   */
  eventHandleDelay = CHECKOUT_EVENT_DELAY;

  /**
   * Bind
   */
  bindEvent() {
    Event.observer(
      EVENT_GTM_CHECKOUT,
      ({
        totals,
        step,
        payment_code,
        addressClicked,
        newAddressAdded,
        isDefaultAddressAdded,
      }) => {
        this.handle(
          totals,
          step,
          payment_code,
          addressClicked,
          newAddressAdded,
          isDefaultAddressAdded
        );
      }
    );
  }

  /**
   * Handle
   */
  handler(
    totals,
    step,
    payment_code,
    addressClicked,
    newAddressAdded,
    isDefaultAddressAdded
  ) {
    if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
      return;
    }

    const products = this.getProducts(totals);
    const formattedImpressions = products.map(
      ({ brand, category, id, name, price, quantity, variant }) => {
        const productPosition = this.getProductPosition(id) || null;
        return {
          brand: brand,
          category: category,
          id: id,
          name: name,
          price: price,
          quantity: quantity,
          variant: variant,
          ...(productPosition && {position: productPosition}),
        };
      }
    );

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
    
    const total_items = totals?.items;
    const ga4_items = total_items.map((item) => ({
      item_name: item?.full_item_info?.name,
      item_id: item?.full_item_info?.config_sku,
      item_brand: item?.full_item_info?.brand_name,
      item_category: item?.full_item_info?.category,
      item_variant: item?.full_item_info?.color,
      price: item?.full_item_info?.original_price,
      discount: item?.full_item_info?.discount_amount,
      quantity: item?.full_item_info?.qty,
      item_size: item?.full_item_info?.size_value,
      item_size_type: item?.full_item_info?.size_option,
      item_url:  item?.full_item_info?.thumbnail_url
    }));

    this.pushEventData({
      ...(step == 2 && {
        sha256_email: sha_email,
        sha256_phone_number: sha_phone,
        addressClicked: addressClicked || false,
        newAddressAdded: newAddressAdded || false,
        isDefaultAddressAdded: isDefaultAddressAdded || false,
        event: EVENT_GTM_CHECKOUT_BILLING
      }),
      ...(step == 3 && {
        payment_method: payment_code ? payment_code : null,
        event: EVENT_ADD_PAYMENT_INFO
      }),
      ecommerce: {
        currencyCode: this.getCurrencyCode(),
        currency:  this.getCurrencyCode(),
        transaction_id: totals?.id ?? "",
        total: totals?.total ?? "",
        discount: totals?.discount ?? 0,
        shipping: totals?.shipping_fee ?? 0,
        international_shipping_amount: totals?.international_shipping_amount?? 0,
        subtotal: totals?.subtotal ?? 0,
        cod_amount: totals?.msp_cod_amount ?? 0,
        coupon:totals?.coupon_code ?? "",
        tax_amount:totals?.tax_amount ?? "",
        checkout: {
          actionField: this.getActionFields(step),
          products: formattedImpressions
        },
        items: ga4_items
      },
    });
  }
  getProductPosition(id) {
    const productPositionData =
      BrowserDatabase.getItem("ProductPositionData") || {};
    const getProdPosition = productPositionData[id] || null;
    return getProdPosition;
  }
  /**
   * Get action field for GTM data
   *
   * @param step
   * @return {{action: string, step: *}}
   */
  getActionFields(step) {
    return {
      step,
    };
  }

  /**
   * Get product detail
   *
   * @param paymentTotals
   *
   * @return {{quantity: number, price: number, name: string, variant: string, id: string, category: string, brand: string, url: string}[]}
   */
  getProducts({ items = {} }) {
    const products = Object.values(items).reduce(
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

export default CheckoutEvent;
