import Event, {
  EVENT_GTM_NO_RESULT_SEARCH_SCREEN_VIEW, // Done
} from "Util/Event";

import BaseEvent from "../Base.event";
import { getAlgoliaIndexForQuerySuggestion } from "Util/API/endpoint/Suggestions/Suggestions.create";
import { indexCode } from "Util/AlgoliaIndex";
import { isArabic } from "Util/App";

/**
 * Constants
 *
 * @type {number}
 */
export const URL_REWRITE = "url-rewrite";
export const SPAM_PROTECTION_DELAY = 200;
export const EVENT_HANDLE_DELAY = 700;

/**
 * GTM PWA Impression Event
 *
 * Called when customer see banners on home page
 */
class NoResultSearchScreenEvent extends BaseEvent {
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
    Event.observer(EVENT_GTM_NO_RESULT_SEARCH_SCREEN_VIEW, (data) => {
      this.handle(EVENT_GTM_NO_RESULT_SEARCH_SCREEN_VIEW, data);
    });
  }

  handler(EVENT_TYPE, data) {
    const countryCodeFromUrl = getLocaleFromUrl();
    const lang = isArabic() ? "arabic" : "english";
    const algoliaQueryIndex = getAlgoliaIndexForQuerySuggestion(
      countryCodeFromUrl,
      lang
    );
    const index_code =
      indexCode[process.env.REACT_APP_ALGOLIA_ENV][algoliaQueryIndex] || null;
    this.pushEventData({
      event: EVENT_TYPE,
      eventCategory: "search",
      eventAction: EVENT_TYPE,
      UserType: this.getCustomerId().toString().length > 0 ? "Logged In" : "Logged Out",
      CustomerID: this.getCustomerId(),
      PageType: this.getPageType(),
      SearchTerm: data || "",
      index_code: index_code,
    });
  }
  getCustomerId() {
    return this.isSignedIn()
      ? this.getAppState().MyAccountReducer.customer.id || ""
      : "";
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

export default NoResultSearchScreenEvent;
