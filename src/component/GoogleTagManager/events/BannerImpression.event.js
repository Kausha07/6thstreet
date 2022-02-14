import Event, {
  EVENT_PROMOTION_IMPRESSION,
  EVENT_CLICK_PROMOTION_IMPRESSION,
} from "Util/Event";

import BaseEvent from "./Base.event";

/**
 * Website places, from where was received event data
 *
 * @type {string}
 */
export const HOME_PAGE_BANNER_IMPRESSIONS = "HOME_PAGE_BANNER_IMPRESSIONS";
export const HOME_PAGE_BANNER_CLICK_IMPRESSIONS =
  "HOME_PAGE_BANNER_CLICK_IMPRESSIONS";

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
class BannerImpressionEvent extends BaseEvent {
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
    // Home
    Event.observer(HOME_PAGE_BANNER_IMPRESSIONS, (impression) => {
      this.handle(EVENT_PROMOTION_IMPRESSION, impression, "promoView");
    });
    Event.observer(HOME_PAGE_BANNER_CLICK_IMPRESSIONS, (impression) => {
      this.handle(EVENT_CLICK_PROMOTION_IMPRESSION, impression, "promoClick");
    });
  }

  /**
   * Handle Impressions
   *
   * @param eventName Unique event id
   * @param impressions banner list
   */
  handler(EVENT_TYPE, impressions = [], promo_key = "promoView") {
    const storage = this.getStorage();
    // if (
    //   !impressions ||
    //   impressions.length === 0 ||
    //   this.spamProtection(SPAM_PROTECTION_DELAY)
    // ) {
    //   console.log("impression not recorded", EVENT_TYPE, impressions);
    //   return;
    // }

    const formattedImpressions = impressions.map(
      ({ label, promotion_name, id }, index) => ({
        id: promotion_name.split(" ").join("-"),
        name: label || promotion_name,
        creative: promotion_name || "",
        position: index + 1,
      })
    );

    storage.impressions = formattedImpressions;
    this.setStorage(storage);
    this.pushEventData({
      event: EVENT_TYPE,
      ecommerce: {
        [promo_key]: {
          promotions: formattedImpressions,
        },
      },
    });
  }
}

export default BannerImpressionEvent;
