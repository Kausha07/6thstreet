/* eslint-disable import/no-cycle */
import Event, { EVENT_GTM_TRENDING_TAGS_CLICK } from "Util/Event";
import BaseEvent from "./Base.event";

/**
 * Trending brands click event
 */
export const URL_REWRITE = "url-rewrite";
class TrendingTagsClickEvent extends BaseEvent {
  /**
   * Set delay
   *
   * @type {number}
   */
  eventHandleDelay = 0;

  /**
   * Bind click events
   */
  bindEvent() {
    Event.observer(EVENT_GTM_TRENDING_TAGS_CLICK, (trendingTags) => {
      this.handle(trendingTags);
    });
  }

  /**
   * Handle trending brands click
   */
  handler(trendingTags) {
    this.pushEventData({
      event: "trending_tag_click",
      eventCategory: "search",
      eventAction: "trending_tag_click",
      UserType: this.getCustomerId().toString().length > 0 ? "Logged In" : "Logged Out",
      search_term: trendingTags || "",
      ecommerce: {
        click: {
          trendingTags: trendingTags,
        },
      },
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

export default TrendingTagsClickEvent;
