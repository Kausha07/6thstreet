import Event, { EVENT_MOE_CATEGORIES_TAB_ICON } from "Util/Event";
import BaseEvent from "../Base.event";
export const SPAM_PROTECTION_DELAY = 200;

class CategoriesTabEvent extends BaseEvent {
  bindEvent() {
    Event.observer(
        EVENT_MOE_CATEGORIES_TAB_ICON,
      ({
        gender,
        prev_screen_name,
        screen_name,
      }) => {
        this.handle({
            gender,
            prev_screen_name,
            screen_name,
        });
      }
    );
  }

  handler({
    gender,
    prev_screen_name,
    screen_name,
  }) {
    if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
      return;
    }

    this.pushEventData({
        gender,
        prev_screen_name,
        screen_name,
    });
  }
}

export default CategoriesTabEvent;
