import Event, { EVENT_FILTER_CLEAR_ALL } from "Util/Event";
import BaseEvent from "../Base.event";
export const SPAM_PROTECTION_DELAY = 200;

class FilterClearAll extends BaseEvent {

    bindEvent() {
        Event.observer(EVENT_FILTER_CLEAR_ALL, () => {
          this.handle();
        });
    }

    handler() {
        if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
          return;
        }
            
        this.pushEventData({
        });
    }
}

export default FilterClearAll;

