import Event, { EVENT_FLIP_IMAGE_SCROLL } from "Util/Event";
import BaseEvent from "../Base.event";
export const SPAM_PROTECTION_DELAY = 200;

class FlipImageScrollEvent extends BaseEvent {
  bindEvent() {
    Event.observer(
        EVENT_FLIP_IMAGE_SCROLL,
      ({
        product_id,
        product_name,
        image_number,
      }) => {
        this.handle({
          product_id,
          product_name,
          image_number,
        });
      }
    );
  }

  handler({
    product_id,
    product_name,
    image_number,
  }) {
    if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
      return;
    }

    this.pushEventData({
      product_id,
      product_name,
      image_number,
    });
  }
}

export default FlipImageScrollEvent;
