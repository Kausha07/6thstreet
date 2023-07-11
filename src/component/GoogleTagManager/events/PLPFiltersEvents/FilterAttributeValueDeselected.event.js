import Event, { EVENT_FILTER_ATTRIBUTE_VALUE_DESELECTED } from "Util/Event";

import BaseEvent from "../Base.event"

export const SPAM_PROTECTION_DELAY = 200;

class FilterAttributeValueDeselected extends BaseEvent {

    bindEvent() {
        Event.observer(EVENT_FILTER_ATTRIBUTE_VALUE_DESELECTED, ({ attributeType, attributeName, attributeValue }) => {
          this.handle({ attributeType, attributeName, attributeValue });
        });
    }

    handler({ attributeType, attributeName, attributeValue }) {
        if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
          return;
        }

        this.pushEventData({
          attributeType,
          attributeName,
          attributeValue,
        });
    }
}

export default FilterAttributeValueDeselected;
