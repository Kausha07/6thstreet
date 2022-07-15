/* eslint-disable import/no-cycle */
import Event, { EVENT_GTM_PURCHASE } from "Util/Event";
import { roundPrice } from "Util/Price";

import ProductHelper from "../utils";
import BaseEvent from "./Base.event";

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
