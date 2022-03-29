/* eslint-disable import/no-cycle */
import Event, { EVENT_GTM_TRENDING_TAGS_CLICK } from "Util/Event";
import BaseEvent from "./Base.event";

/**
 * Trending brands click event
 */
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
      ecommerce: {
        click: {
          trendingTags: trendingTags,
        },
      },
    });
  }
}

export default TrendingTagsClickEvent;
