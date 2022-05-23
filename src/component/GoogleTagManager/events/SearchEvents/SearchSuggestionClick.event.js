import Event, {
  EVENT_CLICK_SEARCH_QUERY_SUGGESSTION_CLICK, // Done
} from "Util/Event";

import BaseEvent from "../Base.event";

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
class SearchSuggesionClickEvent extends BaseEvent {
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
    Event.observer(EVENT_CLICK_SEARCH_QUERY_SUGGESSTION_CLICK, () => {
      this.handle(EVENT_CLICK_SEARCH_QUERY_SUGGESSTION_CLICK);
    });
  }

  handler(EVENT_TYPE) {
    this.pushEventData({
      event: EVENT_TYPE,
    });
  }
}

export default SearchSuggesionClickEvent;
