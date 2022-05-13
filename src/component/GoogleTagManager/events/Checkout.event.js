/* eslint-disable import/no-cycle */
import Event, { EVENT_GTM_CHECKOUT } from 'Util/Event';

import ProductHelper from '../utils';
import BaseEvent from './Base.event';

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
        Event.observer(EVENT_GTM_CHECKOUT, ({ totals, step }) => {
            this.handle(totals, step);
        });
    }

    /**
     * Handle
     */
    handler(totals, step) {
        if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
            return;
        }

        this.pushEventData({
            ecommerce: {
                currencyCode: this.getCurrencyCode(),
                checkout: {
                    actionField: this.getActionFields(step),
                    products: this.getProducts(totals)
                }
            }
        });
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
        const products = Object.values(items).reduce((acc, item) => (
            [
                ...acc,
                {
                    ...ProductHelper.getItemData(item),
                    quantity: ProductHelper.getQuantity(item),
                    id:item.full_item_info.config_sku,
                }
            ]), []);
        const groupedProducts = this.getGroupedProducts();
        Object.values(groupedProducts || {}).forEach(({ data }) => products.push(data));

        return products;
    }
}

export default CheckoutEvent;
