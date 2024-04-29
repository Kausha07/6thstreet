import Event, { EVENT_HOME_SCREEN_VIEW } from "Util/Event";
import BaseEvent from "../events/Base.event";
export const SPAM_PROTECTION_DELAY = 200;

class HomeScreenViewEvent extends BaseEvent {
  bindEvent() {
    Event.observer(EVENT_HOME_SCREEN_VIEW, ({ user_segment, variant_name }) => {
      this.handle({
        user_segment,
        variant_name,
      });
    });
  }

  handler({ user_segment, variant_name }) {
    if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
      return;
    }

    this.pushEventData({
      user_segment,
      variant_name,
    });
  }
}

export default HomeScreenViewEvent;
