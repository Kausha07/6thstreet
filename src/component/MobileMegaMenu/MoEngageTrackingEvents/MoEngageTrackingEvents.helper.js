import Event, {
  EVENT_BOTTOM_NAV_CLICK,
  EVENT_MEGA_MENU_BANNER,
  EVENT_MEGA_MENU_CAROUSAL,
  EVENT_CATEGORY_EXPANDED,
  EVENT_SUBCATEGORY_CLICK,
  EVENT_CLICK_BRAND_BANNER,
  EVENT_CLICK_BRAND_ALPHABET,
  EVENT_CLICK_BRAND_SEARCH_SCREEN,
  MOE_trackEvent,
} from "Util/Event";

export const bottomNavClickTrackingEvent = (options) => {
  MOE_trackEvent(EVENT_BOTTOM_NAV_CLICK, options);
};

export const topBannerClickTrackingEvent = (options) => {
  MOE_trackEvent(EVENT_MEGA_MENU_BANNER, options);
};

export const megaMenuCarousalEvent = (options) => {
  MOE_trackEvent(EVENT_MEGA_MENU_CAROUSAL, options);
};

export const categoryExpandEvent = (options) => {
  MOE_trackEvent(EVENT_CATEGORY_EXPANDED, options);
};

export const subCategoryClickEvent = (options) => {
  MOE_trackEvent(EVENT_SUBCATEGORY_CLICK, options);
};

export const clickBrandBannerEvent = (options) => {
  MOE_trackEvent(EVENT_CLICK_BRAND_BANNER, options);
}

export const brandAlphabetClickEvent = (options) => {
  MOE_trackEvent(EVENT_CLICK_BRAND_ALPHABET, options);   
}

export const brandSearchClickEvent = (options) => {
    MOE_trackEvent(EVENT_CLICK_BRAND_SEARCH_SCREEN, options);
}