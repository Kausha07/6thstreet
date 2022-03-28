/* eslint-disable import/no-cycle */
import Event, { EVENT_GTM_TRENDING_BRANDS_CLICK } from "Util/Event";
import BaseEvent from "./Base.event";

/**
 * Trending brands click event
 */
class TrendingBrandsClickEvent extends BaseEvent {
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
    Event.observer(EVENT_GTM_TRENDING_BRANDS_CLICK, (trendingBrands) => {
      this.handle(trendingBrands);
    });
  }

  /**
   * Handle trending brands click
   */
  handler(trendingBrands) {
    this.pushEventData({
      ecommerce: {
        click: {
          trendingBrands: trendingBrands,
        },
      },
    });
  }
}

export default TrendingBrandsClickEvent;
