/* eslint-disable import/no-cycle */
import Event, { EVENT_GTM_PRODUCT_CLICK } from 'Util/Event';

import { EVENT_IMPRESSION } from '../GoogleTagManager.component';
import ProductHelper from '../utils';
import BaseEvent from './Base.event';

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
    }

    /**
     * Handle product click
     */
    handler(product) {
        const {
            position = 1,
            list,
            category,
            price,
            id,
            brand,
            name,
            variant,
            url
        } = this.getProductFromImpression(product) || {};

        if (!id) {
            return;
        }

        this.pushEventData({
            ecommerce: {
                click: {
                    actionField: {
                        list,
                        action: 'click'
                    },
                    products: [
                        {
                            category,
                            price,
                            id,
                            brand,
                            position,
                            name,
                            variant
                        }
                    ]
                }
            },
            eventCallback() {
                document.location = url;
            }
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

        return impressions.find(({ id: impressionId }) => (
            impressionId === id || impressionId === sku
        ));
    }
}

export default ProductClickEvent;
