import Event, { EVENT_FILTER_ATTRIBUTE_VALUE_SELECTED } from "Util/Event";

import BaseEvent from "../Base.event"

export const SPAM_PROTECTION_DELAY = 200;

class FilterAttributeValueSelected extends BaseEvent {

    bindEvent() {
        Event.observer(EVENT_FILTER_ATTRIBUTE_VALUE_SELECTED, ({ attributeType, attributeName, attributeValue, productCount }) => {
          this.handle({ attributeType, attributeName, attributeValue, productCount });
        });
    }

    handler({ attributeType, attributeName, attributeValue, productCount }) {
        if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
          return;
        }

        this.pushEventData({
          attributeType,
          attributeName,
          attributeValue,
          productCount,
        });
    }

}

export default FilterAttributeValueSelected;
