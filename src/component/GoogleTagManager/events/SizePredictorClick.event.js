import Event, { EVENT_SIZE_PREDICTION_CLICK } from "Util/Event";
import BaseEvent from "./Base.event";
export const SPAM_PROTECTION_DELAY = 200;

class SizeSelectionOrSizeHelpClicked extends BaseEvent {
  bindEvent() {
    Event.observer(
      EVENT_SIZE_PREDICTION_CLICK,
      (data) => {
        this.handle(data);
      }
    );
  }

  handler({ event_name, trigger_source, sp_size,  sp_size_list, simple_sku, sp_status_code, api_status }) {
    if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
      return;
    }

    // console.log("test SizeSelectionOrSizeHelpClicked 2",event_name, trigger_source, sp_size,  sp_size_list, simple_sku, sp_status_code, api_status )
    this.pushEventData({
        event_name, trigger_source, sp_size,  sp_size_list, simple_sku, sp_status_code, api_status 
    });
  }
}

export default SizeSelectionOrSizeHelpClicked;

