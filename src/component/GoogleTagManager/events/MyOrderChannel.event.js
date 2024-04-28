import Event, {  EVENT_ORDERDETAILPAGE_CHANNEL  } from "Util/Event";
import BaseEvent from "./Base.event"
export const SPAM_PROTECTION_DELAY = 200;

class MyOrderChannel extends BaseEvent {

    bindEvent() {     

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
          screen_name: page,
          channel: channel,
        });
        
    }
}

export default MyOrderChannel;

