import Event, { EVENT_Track_USER_VARIANT } from "Util/Event";

import BaseEvent from "./Base.event";

export const SPAM_PROTECTION_DELAY = 200;

class TrackUserVariant extends BaseEvent {

    bindEvent() {
        Event.observer(EVENT_Track_USER_VARIANT, ({ campaint_variant }) => {
          this.handle({ campaint_variant });
        });
    }

    handler({ campaint_variant }) {
        if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
          return;
        }

        this.pushEventData({
          campaint_variant,
        });
    }

}

export default TrackUserVariant;
