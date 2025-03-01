import Event, { EVENT_PAGE_LOAD } from "Util/Event";
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
class PageLoadEvent extends BaseEvent {
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
    Event.observer(EVENT_PAGE_LOAD, () => {
      this.handle();
    });
  }

  handler() {
    this.pushEventData({
      eventCategory: "Home",
      eventAction: "page_load",
      UserType:
        this.getCustomerId().toString().length > 0 ? "Logged In" : "Logged Out",
      ClientID: this.getGAID(),
    });
  }
  getCustomerId() {
    return this.isSignedIn()
      ? this.getAppState().MyAccountReducer.customer.id || ""
      : "";
  }
  getGAID() {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("_ga"))
      ?.split("=")[1];
    if (cookieValue) {
      const splitGAID = () => {
        if (cookieValue.includes(".")) {
          let cookieSplit = cookieValue.split(".");
          if (cookieSplit.length == 4) {
            return cookieSplit[2] + "." + cookieSplit[3];
          }
        } else if (cookieValue.includes("GA1.1.")) {
          return cookieValue.split("GA1.1.")[1];
        } else if (cookieValue.includes("GA1.2.")) {
          return cookieValue.split("GA1.2.")[1];
        } else if (cookieValue.includes("GA1.3.")) {
          return cookieValue.split("GA1.3.")[1];
        } else if (cookieValue.includes("GA1.3.")) {
          return cookieValue.split("GA1.4.")[1];
        } else {
          return cookieValue;
        }
      };
      return splitGAID();
    } else {
      return "";
    }
  }
}

export default PageLoadEvent;
