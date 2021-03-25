/* eslint-disable import/no-cycle */
import Event, { EVENT_GTM_PRODUCT_ADD_TO_CART } from 'Util/Event';

import BaseEvent from './Base.event';

export const SPAM_PROTECTION_DELAY = 200;

/**
 * Product add to cart event
 */
class AddToCartEvent extends BaseEvent {
    /**
     * Bind add to cart
     */
    bindEvent() {
        Event.observer(EVENT_GTM_PRODUCT_ADD_TO_CART, ({
            product
        }) => {
            this.handle(product);
        });
    }

    /**
     * Handle product add to cart
     */
    handler(product) {
        if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
            return;
        }

        this.pushEventData({
            ecommerce: {
                currencyCode: this.getCurrencyCode(),
                add: {
                    products: [product]
                }
            }
        });
    }
}

export default AddToCartEvent;
