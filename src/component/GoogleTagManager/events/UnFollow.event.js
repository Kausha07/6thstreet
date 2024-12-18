import Event, {EVENT_PDP_UNFOLLOW_BRAND } from "Util/Event";
import BaseEvent from "./Base.event";
export const SPAM_PROTECTION_DELAY = 200;

class UnFollowEvent extends BaseEvent {
  bindEvent() {
    Event.observer(EVENT_PDP_UNFOLLOW_BRAND, ({ product_sku, brand_name }) => {
      this.handle({
        product_sku,
        brand_name,
      });
    });
  }

  handler({ product_sku, brand_name }) {
    if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
      return;
    }

    this.pushEventData({
        product_sku,
        brand_name,
    });
  }
}

export default UnFollowEvent;
