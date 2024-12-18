import Event, { EVENT_PRODUCT_RATING_CLEAR} from "Util/Event";
import BaseEvent from "./Base.event"
export const SPAM_PROTECTION_DELAY = 200;

class ProductRatingClear extends BaseEvent {

    bindEvent() {
        Event.observer(EVENT_PRODUCT_RATING_CLEAR,() => {
          this.handle(EVENT_PRODUCT_RATING_CLEAR);
        });
    }

    handler(EVENT_TYPE) {
        if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
          return;
        }    
        this.pushEventData({
          event: EVENT_TYPE,
        });
    }
}

export default ProductRatingClear;

