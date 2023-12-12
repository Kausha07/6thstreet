import Event, {
  EVENT_CLICK_RECOMMENDATION_CLICK, // Done
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
export const SPAM_PROTECTION_DELAY = 0;
export const EVENT_HANDLE_DELAY = 0;

/**
 * GTM PWA Impression Event
 *
 * Called when customer see banners on home page
 */
class RecommendedClickEvent extends BaseEvent {
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
    Event.observer(EVENT_CLICK_RECOMMENDATION_CLICK, (name) => {
      this.handle(EVENT_CLICK_RECOMMENDATION_CLICK, name);
    });
  }

  handler(EVENT_TYPE, name) {
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
      eventAction: "recommendation_clicked",
      UserType: this.getCustomerId().toString().length > 0 ? "Logged In" : "Logged Out",
      CustomerID: this.getCustomerId(),
      PageType: this.getPageType(),
      SearchTerm: name || "",
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

export default RecommendedClickEvent;
