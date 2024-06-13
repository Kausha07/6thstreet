import Event, { EVENT_PDP_RATING_CLICK } from "Util/Event";
import BaseEvent from "./Base.event";
export const SPAM_PROTECTION_DELAY = 200;

class RatingsEvent extends BaseEvent {
  bindEvent() {
    Event.observer(EVENT_PDP_RATING_CLICK, ({ product_rating, no_of_ratings ,product_sku }) => {
      this.handle({
        product_rating,
        no_of_ratings,
        product_sku
      });
    });
  }

  handler({ product_rating, no_of_ratings, product_sku }) {
    if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
      return;
    }

    this.pushEventData({
        product_rating,
        no_of_ratings,
        product_sku
    });
  }
}

export default RatingsEvent;
