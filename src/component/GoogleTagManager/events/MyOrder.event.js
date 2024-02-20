import Event, { EVENT_MYORDERPAGE_VISIT, EVENT_ORDERDETAILPAGE_VISIT  } from "Util/Event";
import BaseEvent from "./Base.event"
export const SPAM_PROTECTION_DELAY = 200;

class MyOrder extends BaseEvent {

    bindEvent() {
        Event.observer(EVENT_MYORDERPAGE_VISIT, ({ page}) => {
          this.handle(EVENT_MYORDERPAGE_VISIT, { page});
        });

        Event.observer(EVENT_ORDERDETAILPAGE_VISIT, ({ page}) => {
          this.handle(EVENT_ORDERDETAILPAGE_VISIT, { page});
        });
    }

    handler(EVENT_TYPE, { page}) {
        if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
          return;
        }
        
        this.pushEventData({
          event: EVENT_TYPE,
          screen_name: page,
        });
        
    }
}

export default MyOrder;

