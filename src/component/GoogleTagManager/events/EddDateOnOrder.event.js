/* eslint-disable import/no-cycle */
import Event, { EVENT_GTM_EDD_DATE_AT_PLACE_ORDER } from "Util/Event";

import BaseEvent from "./Base.event";

export const SPAM_PROTECTION_DELAY = 200;

/**
 * Product add to cart event
 */
class EddDateOnOrderEvent extends BaseEvent {
  /**
   * Bind add to cart
   */
  bindEvent() {
    Event.observer(EVENT_GTM_EDD_DATE_AT_PLACE_ORDER, ({ edd_date }) => {
      this.handle(edd_date);
    });
  }

  /**
   * Handle product add to cart
   */
  handler(edd_date) {
    if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
      return;
    }

    this.pushEventData({
      ecommerce: {
        edd_date: edd_date,
      },
    });
  }
}

export default EddDateOnOrderEvent;
