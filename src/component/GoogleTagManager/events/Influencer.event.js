import Event, {
  EVENT_GTM_INFLUENCER,
  MOE_trackEvent,
} from "Util/Event";
import BaseEvent from "./Base.event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
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
export const EVENT_HANDLE_DELAY = 3000;
export const URL_REWRITE = "url-rewrite";
/**
 * GTM PWA Impression Event
 *
 * Called when customer see banners on home page
 */
class InfluencerEvent extends BaseEvent {
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
    Event.observer(EVENT_GTM_INFLUENCER, (data) => {
      this.handle(data);
    });
  }

  handler(data) {
    if(data.EventName){
      this.pushEventData({
        event: data?.EventName,
        country: getCountryFromUrl().toUpperCase(),
        language: getLanguageFromUrl().toUpperCase(),
        isLoggedIn: this.getCustomerId().toString().length > 0 ? true : false,
        UserID: this.getCustomerId(),
        ClientID: this.getGAID(),
        ...(data?.influencer_id && { influencer_id: data?.influencer_id }),
        ...(data?.gender && { gender: data?.gender }),
        ...(data?.name && { name: data?.name }),
        ...(data?.collection_id && { collection_id: data?.collection_id }),
        ...(data?.link && { link: data?.link }),
      });
      MOE_trackEvent(data?.EventName, {
        country: getCountryFromUrl().toUpperCase(),
        language: getLanguageFromUrl().toUpperCase(),
        isLoggedIn: this.getCustomerId().toString().length > 0 ? true : false,
        app6thstreet_platform: "Web",
        ...(data?.influencer_id && { influencer_id: data?.influencer_id }),
        ...(data?.gender && { gender: data?.gender }),
        ...(data?.name && { name: data?.name }),
        ...(data?.collection_id && { collection_id: data?.collection_id }),
        ...(data?.link && { link: data?.link }),
      });
    }
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

  getPageType() {
    const { urlRewrite, currentRouteName } = window;
    if (currentRouteName === URL_REWRITE) {
      if (typeof urlRewrite === "undefined") {
        return "";
      }
      if (urlRewrite.notFound) {
        return "notfound";
      }
      return (urlRewrite.type || "").toLowerCase();
    }
    return (currentRouteName || "").toLowerCase();
  }
}

export default InfluencerEvent;
