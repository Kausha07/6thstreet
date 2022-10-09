import Event, { EVENT_GTM_CHECKOUT_BILLING } from "Util/Event";
import BaseEvent from "./Base.event";

/**
 * Website places, from where was received event data
 *
 * @type {string}
 */

/**
 * Constants
 *
 * @type {number}
 */
export const SPAM_PROTECTION_DELAY = 200;
export const EVENT_HANDLE_DELAY = 700;
/**
 * GTM PWA Impression Event
 *
 * Called when customer see banners on home page
 */
class CheckoutBillingEvent extends BaseEvent {
  /**
   * Set base event call delay
   *
   * @type {number}
   */
  eventHandleDelay = EVENT_HANDLE_DELAY;

  /**
   * Bind PWA event handling
   */
  bindEvent() {
    Event.observer(EVENT_GTM_CHECKOUT_BILLING, () => {
     this.handle(EVENT_GTM_CHECKOUT_BILLING);
    });
  }

  handler(data) {
    if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
      return;
  }
    this.pushEventData({
      event: data,
      ecommerce: {
        currencyCode: this.getCurrencyCode(),
    }
    });
  }
}

export default CheckoutBillingEvent;
