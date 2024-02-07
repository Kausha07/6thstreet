import Event, { EVENT_PRODUCT_RATING_CLICK, EVENT_PRODUCT_RATING_CLEAR, EVENT_PRODUCT_RATING_VALUE  } from "Util/Event";
import BaseEvent from "./Base.event"
export const SPAM_PROTECTION_DELAY = 200;

class ProductRating extends BaseEvent {

    bindEvent() {
        Event.observer(EVENT_PRODUCT_RATING_CLICK, ({ sku, rating}) => {
          this.handle(EVENT_PRODUCT_RATING_CLICK,{ sku, rating});
        });
        Event.observer(EVENT_PRODUCT_RATING_CLEAR, ({ sku, rating}) => {
          this.handle(EVENT_PRODUCT_RATING_CLEAR, { sku, rating});
        });
        Event.observer(EVENT_PRODUCT_RATING_VALUE, ({ sku, rating}) => {
          this.handle(EVENT_PRODUCT_RATING_VALUE, { sku, rating});
        });
    }

    handler(EVENT_TYPE, { sku, rating}) {
        if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
          return;
        }    
        this.pushEventData({
          event: EVENT_TYPE,
          sku,
          rating,
        });
    }
}

export default ProductRating;

