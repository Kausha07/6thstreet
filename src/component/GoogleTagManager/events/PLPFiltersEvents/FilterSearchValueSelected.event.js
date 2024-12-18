import Event, { EVENT_FILTER_SEARCH_VALUE_SELECTED } from "Util/Event";

import BaseEvent from "../Base.event"

export const SPAM_PROTECTION_DELAY = 200;

class FilterSearchValueSelected extends BaseEvent {

    bindEvent() {
        Event.observer(EVENT_FILTER_SEARCH_VALUE_SELECTED, ({ attributeType, attributeName, attributeValue, searchTerm }) => {
          this.handle({ attributeType, attributeName, attributeValue, searchTerm });
        });
    }


    handler({ attributeType, attributeName, attributeValue, searchTerm }) {
        if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
          return;
        }

        this.pushEventData({
          attributeType,
          attributeName,
          attributeValue,
          searchTerm,
        });
    }

}

export default FilterSearchValueSelected;

