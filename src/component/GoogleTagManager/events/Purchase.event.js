/* eslint-disable import/no-cycle */
import Event, {
  EVENT_GTM_PURCHASE,
  EVENT_MOE_PURCHASE_SUCCESS,
  EVENT_MOE_PURCHASE_SUCCESS_PRODUCT,
  MOE_trackEvent
} from "Util/Event";
import { roundPrice } from "Util/Price";
import { isSignedIn } from "Util/Auth";
import ProductHelper from "../utils";
import BaseEvent from "./Base.event";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import BrowserDatabase from "Util/BrowserDatabase";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
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
    Event.observer(EVENT_GTM_PURCHASE, ({ orderID: orderId, totals, paymentMethod }) => {
      this.handle(orderId, totals, paymentMethod);
    });
  }

  /**
   * Handle
   *
   * @param orderId
   * @param totals
   * @param cartData
   */
  handler(orderId, totals, paymentMethod) {
    if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
      return;
    }
    const productsData = this.getProducts(totals);
    const formattedImpressions = productsData.map(
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
    const SHIPMENT_DETAILS =
        BrowserDatabase.getItem("SHIPMENT_DETAILS")
          ? BrowserDatabase.getItem("SHIPMENT_DETAILS")
          : {};
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
      is_express_visible: SHIPMENT_DETAILS[item?.full_item_info?.sku] && SHIPMENT_DETAILS[item?.full_item_info?.sku] !=0 ? true : false
    }));

    this.pushEventData({
      sha256_email: sha_email,
      sha256_phone_number: sha_phone,
      ecommerce: {
        currencyCode: this.getCurrencyCode(),
        currency:  this.getCurrencyCode(),
        transaction_id: orderId ?? "",
        order_id: orderId,
        total: totals?.total ?? "",
        discount: totals?.discount ?? 0,
        shipping: totals?.shipping_fee ?? 0,
        international_shipping_amount: totals?.international_shipping_amount?? 0,
        subtotal: totals?.subtotal ?? 0,
        cod_amount: totals?.msp_cod_amount ?? 0,
        coupon:totals?.coupon_code ?? "",
        tax_amount:totals?.tax_amount ?? "",
        // promotional_balance_used: promotional_balance_used,// commented and will be enabled later
        // transactional_balance_used: transactional_balance_used,
        purchase: {
          actionField: this.getActionFields(orderId, totals),
          products: formattedImpressions
        },
        items:ga4_items
      },
    });
    const currentAppState = BrowserDatabase.getItem(APP_STATE_CACHE_KEY);
    const currentSelectedAddress = BrowserDatabase.getItem("currentSelectedAddress");
    const { city = "", area = "" } = currentSelectedAddress ? currentSelectedAddress: {};
    const productDetails = totals?.items;
    let productName = [],
      productColor = [],
      productBrand = [],
      productSku = [],
      productGender = [],
      productBasePrice = [],
      productSizeOption = [],
      productSizeValue = [],
      productSubCategory = [],
      productThumbanail = [],
      productUrl = [],
      productQty = [],
      productCategory = [],
      productItemPrice = [];
    if (productDetails && productDetails.length > 0) {
      productDetails.forEach((item) => {
        let productKeys = item?.full_item_info;
        productName.push(productKeys?.name);
        productColor.push(productKeys?.color);
        productBrand.push(productKeys?.brand_name);
        productSku.push(productKeys?.config_sku);
        productGender.push(productKeys?.gender);
        productBasePrice.push(productKeys?.original_price);
        productSizeOption.push(productKeys?.size_option);
        productSizeValue.push(productKeys?.size_value);
        productSubCategory.push(productKeys?.subcategory);
        productThumbanail.push(productKeys?.thumbnail_url);
        productUrl.push(productKeys?.url);
        productQty.push(productKeys?.qty);
        productCategory.push(productKeys?.category);
        productItemPrice.push(productKeys?.itemPrice);

        MOE_trackEvent(EVENT_MOE_PURCHASE_SUCCESS_PRODUCT, {
          city:city,
          area: area,
          country: getCountryFromUrl().toUpperCase(),
          language: getLanguageFromUrl().toUpperCase(),
          category: productKeys?.category
            ? productKeys?.category
            : currentAppState.gender
            ? currentAppState.gender.toUpperCase()
            : "",
          currency: totals?.currency_code || "",
          order_id: orderId || "",
          transaction_id: orderId || "",
          brand_name: productKeys?.brand_name || "",
          color: productKeys?.color || "",
          discounted_price: productKeys?.itemPrice || "",
          full_price: productKeys?.original_price || "",
          product_name: productKeys?.name || "",
          product_sku: productKeys?.config_sku || "",
          gender: productKeys?.gender || "",
          size_id: productKeys?.size_option || "",
          size: productKeys?.size_value || "",
          subcategory: productKeys?.subcategory || "",
          app6thstreet_platform: "Web",
          is_express_visible: SHIPMENT_DETAILS[item?.full_item_info?.sku] && SHIPMENT_DETAILS[item?.full_item_info?.sku] !=0 ? true : false
        });
      });

      MOE_trackEvent(EVENT_MOE_PURCHASE_SUCCESS, {
        country: getCountryFromUrl().toUpperCase(),
        language: getLanguageFromUrl().toUpperCase(),
        category:
          productCategory.length > 0
            ? productCategory
            : currentAppState.gender
            ? currentAppState.gender.toUpperCase()
            : "",
        coupon_code_applied: totals?.coupon_code || "",
        currency: totals?.currency_code || "",
        product_count: totals?.items.length || "",
        discounted_amount: totals?.discount || "",
        shipping_fee: totals?.shipping_fee || "",
        subtotal_amount: totals?.subtotal || "",
        order_id: orderId || "",
        total_amount: totals?.total || "",
        transaction_id: orderId || "",
        brand_name: productBrand.length > 0 ? productBrand : "",
        color: productColor.length > 0 ? productColor : "",
        discounted_price: productItemPrice.length > 0 ? productItemPrice : "",
        full_price: productBasePrice.length > 0 ? productBasePrice : "",
        product_name: productName.length > 0 ? productName : "",
        product_sku: productSku.length > 0 ? productSku : "",
        gender: productGender.length > 0 ? productGender : "",
        size_id: productSizeOption.length > 0 ? productSizeOption : "",
        size: productSizeValue.length > 0 ? productSizeValue : "",
        subcategory: productSubCategory.length > 0 ? productSubCategory : "",
        isLoggedIn: isSignedIn(),
        app6thstreet_platform: "Web",
        paymentMethod: paymentMethod || "",
        //shipping: "",
        //value: "",
      });
    }
  }

  getProductPosition(id) {
    const productPositionData =
      BrowserDatabase.getItem("ProductPositionData") || {};
    const getProdPosition = productPositionData[id] || null;
    return getProdPosition;
  }
  
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
