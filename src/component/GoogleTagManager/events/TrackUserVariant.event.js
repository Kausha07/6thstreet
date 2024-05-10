import Event, { EVENT_Track_USER_VARIANT } from "Util/Event";

import BaseEvent from "./Base.event";

export const SPAM_PROTECTION_DELAY = 200;

class TrackUserVariant extends BaseEvent {

    bindEvent() {
        Event.observer(EVENT_Track_USER_VARIANT, ({ campaign_variant }) => {
          this.handle({ campaign_variant });
        });
    }

    handler({ campaign_variant }) {
        if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
          return;
        }

        this.pushEventData({
          campaign_variant,
        });
    }

}

export default TrackUserVariant;
