import Event, { EVENT_HOME_SCREEN_VIEW } from "Util/Event";
import BaseEvent from "../events/Base.event";
export const SPAM_PROTECTION_DELAY = 200;

class HomeScreenViewEvent extends BaseEvent {
  bindEvent() {
    Event.observer(EVENT_HOME_SCREEN_VIEW, ({ segment_name, variant_name }) => {
      this.handle({
        segment_name,
        variant_name,
      });
    });
  }

  handler({ segment_name, variant_name }) {
    if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
      return;
    }

    this.pushEventData({
      segment_name,
      variant_name,
    });
  }
}

export default HomeScreenViewEvent;
