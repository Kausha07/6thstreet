import Event, { EVENT_PDP_RATING_CLICK } from "Util/Event";
import BaseEvent from "./Base.event";
export const SPAM_PROTECTION_DELAY = 200;

class RatingsEvent extends BaseEvent {
  bindEvent() {
    Event.observer(EVENT_PDP_RATING_CLICK, ({ product_rating, no_of_rating,product_name }) => {
      this.handle({
        product_rating,
        no_of_rating,
        product_name
      });
    });
  }

  handler({ product_rating, no_of_rating, product_name }) {
    if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
      return;
    }

    this.pushEventData({
        product_rating,
        no_of_rating,
        product_name
    });
  }
}

export default RatingsEvent;
