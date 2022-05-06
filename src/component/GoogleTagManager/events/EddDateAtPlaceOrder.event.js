/* eslint-disable import/no-cycle */
import Event, { EVENT_GTM_EDD_DATE_AT_PLACE_ORDER } from "Util/Event";

import BaseEvent from "./Base.event";

export const SPAM_PROTECTION_DELAY = 200;

/**
 * Product add to cart event
 */
class EddVisibilityOnPdpEvent extends BaseEvent {
  /**
   * Bind add to cart
   */
  bindEvent() {
    Event.observer(EVENT_GTM_EDD_DATE_AT_PLACE_ORDER, ({ edd_status }) => {
      this.handle(edd_status);
    });
  }

  /**
   * Handle product add to cart
   */
  handler(edd_status) {
    if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
      return;
    }

    this.pushEventData({
      ecommerce: {
        edd_status: edd_status,
      },
    });
  }
}

export default EddVisibilityOnPdpEvent;
