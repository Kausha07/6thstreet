import Event, { EVENT_MYORDERPAGE_VISIT, EVENT_ORDERDETAILPAGE_VISIT, EVENT_ORDERDETAILPAGE_CHANNEL  } from "Util/Event";
import BaseEvent from "./Base.event"
export const SPAM_PROTECTION_DELAY = 200;

class MyOrder extends BaseEvent {

    bindEvent() {
        Event.observer(EVENT_MYORDERPAGE_VISIT, ({ page, channel}) => {
          this.handle(EVENT_MYORDERPAGE_VISIT, { page, channel});
        });

        Event.observer(EVENT_ORDERDETAILPAGE_VISIT, ({ page, channel}) => {
          this.handle(EVENT_ORDERDETAILPAGE_VISIT, { page, channel});
        });

        Event.observer(EVENT_ORDERDETAILPAGE_CHANNEL, ({ page, channel}) => {
          this.handle(EVENT_ORDERDETAILPAGE_CHANNEL, { page, channel});
        });
    }

    handler(EVENT_TYPE, { page, channel}) {
        if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
          return;
        }    
        this.pushEventData({
          event: EVENT_TYPE,
          ecommerce: {
            page: {
              type: page,
              channel: channel
            },
          },
        });
    }
}

export default MyOrder;

