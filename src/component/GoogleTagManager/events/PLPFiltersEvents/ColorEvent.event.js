import Event, { EVENT_COLOUR_VARIENT_CLICK } from "Util/Event";
import BaseEvent from "../Base.event";
export const SPAM_PROTECTION_DELAY = 200;

class ColorVarientEvent extends BaseEvent {
  bindEvent() {
    Event.observer(
      EVENT_COLOUR_VARIENT_CLICK,
      ({
        product_id,
        product_name,
        number_of_colours_available,
        colour_name,
      }) => {
        this.handle({
          product_id,
          product_name,
          number_of_colours_available,
          colour_name,
        });
      }
    );
  }

  handler({
    product_id,
    product_name,
    number_of_colours_available,
    colour_name,
  }) {
    if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
      return;
    }

    this.pushEventData({
      product_id,
      product_name,
      number_of_colours_available,
      colour_name,
    });
  }
}

export default ColorVarientEvent;
