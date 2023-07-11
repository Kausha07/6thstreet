import Event, { EVENT_FILTER_ATTRIBUTE_SELECTED } from "Util/Event";
import BaseEvent from "../Base.event"
export const SPAM_PROTECTION_DELAY = 200;

class FilterAttributeSelected extends BaseEvent {

    bindEvent() {
        Event.observer(EVENT_FILTER_ATTRIBUTE_SELECTED, ({ attributeType, AttributeName, attributePosition }) => {
          this.handle({ attributeType, AttributeName, attributePosition});
        });
    }

    handler({ attributeType, AttributeName, attributePosition}) {
        if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
          return;
        }
    
        this.pushEventData({
          attributeType,
          AttributeName,
          attributePosition,
        });
    }
}

export default FilterAttributeSelected;

