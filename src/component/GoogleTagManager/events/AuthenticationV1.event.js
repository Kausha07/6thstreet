import Event, { EVENT_GTM_NEW_AUTHENTICATION, EVENT_WISHLIST_ICON_CLICK, MOE_trackEvent } from "Util/Event";
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
export const SPAM_PROTECTION_DELAY = 0;
export const EVENT_HANDLE_DELAY = 3000;
export const URL_REWRITE = "url-rewrite";
/**
 * GTM PWA Impression Event
 *
 * Called when customer see banners on home page
 */
class AuthenticationV1Event extends BaseEvent {
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
    Event.observer(EVENT_GTM_NEW_AUTHENTICATION, (data) => {
      this.handle(data);
    });
  }

  handler(data) {
    this.pushEventData({
      event: data?.name,
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toLowerCase(), 
      isLoggedIn:
        data.name == "login"
          ? true
          : this.getCustomerId().toString().length > 0
          ? true
          : false,
      screen_name: data?.screen ? data?.screen : this.getPageType(),
      prev_screen_name: data.prevScreen ? data.prevScreen : this.getPageType(),
      UserID: this.getCustomerId(),
      ClientID: this.getGAID(),
      ...(data?.failedReason && { failedReason: data?.failedReason }),
      ...(data.loginMode && { loginMode: data?.loginMode }),
      ...(data.name == EVENT_WISHLIST_ICON_CLICK && {
        eventCategory: "PLP_Search_PDP_Home",
        eventAction: EVENT_WISHLIST_ICON_CLICK,
      }),
    });
    MOE_trackEvent(data?.name, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      isLoggedIn:
        data.name == "login"
          ? true
          : this.getCustomerId().toString().length > 0
          ? true
          : false,
      screen_name: data?.screen ? data?.screen : this.getPageType(),
      prev_screen_name: data.prevScreen ? data.prevScreen : this.getPageType(),
      ...(data?.failedReason && { failedReason: data?.failedReason }),
      ...(data?.loginMode && { loginMode: data?.loginMode }),
      ...(data?.email && { email: data?.email }),
      ...(data?.gender && { gender: data?.gender }),
      ...(data?.phone && { phone: data?.phone }),
      app6thstreet_platform: "Web",
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

export default AuthenticationV1Event;
