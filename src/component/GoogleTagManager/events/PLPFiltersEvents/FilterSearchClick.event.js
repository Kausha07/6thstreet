import Event, { EVENT_FILTER_SEARCH_CLICK } from "Util/Event";
import BaseEvent from "../Base.event"
export const SPAM_PROTECTION_DELAY = 200;

class FilterSearchClick extends BaseEvent {

    bindEvent() {
        Event.observer(EVENT_FILTER_SEARCH_CLICK, ({ attributeType, attributeName }) => {
          this.handle({ attributeType, attributeName });
        });
    }

    handler({ attributeType, attributeName }) {
        if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
          return;
        }

        this.pushEventData({
          attributeType,
          attributeName
        });
    }
}

export default FilterSearchClick;

