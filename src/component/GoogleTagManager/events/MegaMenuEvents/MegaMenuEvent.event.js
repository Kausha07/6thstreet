import Event, { EVENT_CATEGORY_EXPANDED } from "Util/Event";
import BaseEvent from "../Base.event";
export const SPAM_PROTECTION_DELAY = 200;

class MegaMenuEvent extends BaseEvent {
  bindEvent() {
    Event.observer(
        EVENT_CATEGORY_EXPANDED,
      ({
        gender,
        category_name,
        category_position,
      }) => {
        this.handle({
            gender,
            category_name,
            category_position,
        });
      }
    );
  }

  handler({
    gender,
    category_name,
    category_position,
  }) {
    if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
      return;
    }

    this.pushEventData({
        gender,
        category_name,
        category_position,
    });
  }
}

export default MegaMenuEvent;
