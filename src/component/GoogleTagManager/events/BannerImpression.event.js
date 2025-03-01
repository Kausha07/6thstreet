import Event,  {
  EVENT_GTM_VIEW_PROMOTION,
  EVENT_GTM_SELECT_PROMOTION,
  EVENT_MOE_PROMOTION_IMPRESSION,
  EVENT_MOE_PROMOTION_CLICK,
  MOE_trackEvent
} from "Util/Event";
import BrowserDatabase from "Util/BrowserDatabase";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import BaseEvent from "./Base.event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { getCurrency } from "Util/App";
import { getStore } from "Store";

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
export const URL_REWRITE = "url-rewrite";
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
      if (document.readyState == ("complete" || "interactive")) {
        this.handle(EVENT_GTM_VIEW_PROMOTION, impression, "promoView");
      }
    });
    Event.observer(HOME_PAGE_BANNER_CLICK_IMPRESSIONS, (impression) => {
      this.handle(EVENT_GTM_SELECT_PROMOTION, impression, "promoClick");
    });
  }

  /**
   * Handle Impressions
   *
   * @param eventName Unique event id
   * @param impressions banner list
   */
  handler(EVENT_TYPE, impressions = [], promo_key = "promoView", item_key = "items" ){
    const storage = this.getStorage();
    // if (
    //   !impressions ||
    //   impressions.length === 0 ||
    //   this.spamProtection(SPAM_PROTECTION_DELAY)
    // ) {
    //   console.log("impression not recorded", EVENT_TYPE, impressions);
    //   return;
    // }
    const {
      AppConfig: {
        vwoData: { HPP: { variationName = ""} = {} } = {},
        abTestingConfig: {
          HPP: { defaultUserSegment },
        },
      },
    } = getStore().getState();
    const formattedImpressions = impressions.map(
      ({ label, promotion_name, id, store_code, tag, indexValue }, index) => ({
        id: id ? id : promotion_name ? promotion_name.split(" ").join("-") : label || "",
        name: (store_code ? store_code + "-" : "") + (label || promotion_name) + (tag ? "-" + tag : ""),
        creative: tag || promotion_name || label || "",
        position: indexValue ? indexValue : index + 1,
        widget_name: tag ? tag : ""
      })
    );

    let promoName = [], promoID = [], promoIndex = [];
    const currentAppState = BrowserDatabase.getItem(APP_STATE_CACHE_KEY);
    const currentPageType = this.getPageType() || "";

    formattedImpressions.forEach((item) => {
      promoName.push(item?.name || item?.label);
      promoID.push(item?.id || item?.label);
      promoIndex.push(item?.position || item?.indexValue);
    });

    const formattedPromotionImpressionsForGa4 = [];
    formattedImpressions.forEach((item) => {
      formattedPromotionImpressionsForGa4.push({
          promotion_id: item.id || item.label,
          promotion_name: item.name || item.label,
          creative_name: item.creative,
          index: item.position || item.indexValue
      });
  });
    
    storage.impressions = formattedImpressions;
    this.setStorage(storage);
    this.pushEventData({
      event: EVENT_TYPE,
      ecommerce: {
        currency:getCurrency(),
        [promo_key]: {
          promotions: formattedImpressions,
        },
        [item_key]: formattedPromotionImpressionsForGa4
      },
      gender: currentAppState?.gender?.toLowerCase(),
      banner_type: impressions[0]?.has_video ? "video" : "image",
      segment_name: BrowserDatabase?.getItem("customer")?.user_segment || defaultUserSegment,
      variant_name: variationName,
      current_page: sessionStorage.getItem("currentScreen"),
    });
    const MoeEventType =
      EVENT_TYPE == EVENT_GTM_VIEW_PROMOTION
        ? EVENT_MOE_PROMOTION_IMPRESSION
        : EVENT_TYPE == EVENT_GTM_SELECT_PROMOTION
          ? EVENT_MOE_PROMOTION_CLICK
          : null;

    if (document.readyState == ("complete" || "interactive")) {
      MOE_trackEvent(MoeEventType, {
        country: getCountryFromUrl().toUpperCase(),
        language: getLanguageFromUrl().toUpperCase(),
        promotion_id: promoID.length == 1 ? promoID.toString() : promoID,
        promotion_name: promoName.length == 1 ? promoName.toString() : promoName,
        index: promoIndex.length == 1 ? promoIndex.toString() : promoIndex,
        category_name: currentAppState.gender
          ? currentAppState.gender.toUpperCase()
          : "",
        screen_name: currentPageType,
        app6thstreet_platform: "Web",
        gender: currentAppState?.gender?.toLowerCase(),
        banner_type: impressions[0]?.has_video ? "video" : "image",
        segment_name: BrowserDatabase?.getItem("customer")?.user_segment || defaultUserSegment,
        variant_name: variationName,
        current_page: sessionStorage.getItem("currentScreen"),
        position:  formattedImpressions?.length == 1 ? formattedImpressions?.[0]?.position : promoIndex,
        widget_name: formattedImpressions?.length == 1 ? formattedImpressions?.[0]?.widget_name || "" : ""
      });
    }
  }
}

export default BannerImpressionEvent;
