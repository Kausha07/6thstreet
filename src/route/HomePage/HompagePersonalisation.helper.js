import { getUUID } from "Util/Auth";
import Event, {
  EVENT_HOME_SCREEN_VIEW,
  EVENT_PLP_SCREEN_VIEW,
  MOE_trackEvent,
} from "Util/Event";

export const getHomePagePersonalizationJsonFileUrl = (
  devicePrefix,
  gender,
  customer,
  abTestingConfig
) => {
  const userSegementValue = customer?.user_segment
    ? customer.user_segment
    : abTestingConfig?.HPP?.defaultUserSegment;
  if (userSegementValue) {
    return `${devicePrefix}${userSegementValue}_${gender}.json`;
  }
  return `${devicePrefix}${gender}.json`;
};


export const getUserSpecificDynamicContent = (
  dynamicContent = [],
  variationName = "",
  abTestingConfig = {}
) => {
  const variant_name =
    variationName && variationName?.toLowerCase() !== "control"
      ? variationName
      : abTestingConfig?.HPP?.defaultValue; 
  if (!dynamicContent || dynamicContent?.length === 0) {
    return [];
  }
  const filteredContent = dynamicContent.filter(
    (item) => !item?.widget_variant || item.widget_variant === `${variant_name}`
  );

  return filteredContent?.length > 0 ? filteredContent : dynamicContent;
};

export const homePageScreenViewTrackingEvent = (
  user_segment,
  variant_name,
  abTestingConfig
) => {
  const variantName = variant_name
    ? variant_name
    : abTestingConfig?.HPP?.defaultValue;
  const userSegment = user_segment
    ? user_segment
    : abTestingConfig?.HPP?.defaultUserSegment;
  MOE_trackEvent(EVENT_HOME_SCREEN_VIEW, {
    segment_name: userSegment,
    variant_name: variantName,
  });
  Event.dispatch(EVENT_HOME_SCREEN_VIEW, {
    segment_name: userSegment,
    variant_name: variantName,
  });
};

export const hppPlpScreenViewTrackingEvent = () => {
  MOE_trackEvent(EVENT_PLP_SCREEN_VIEW, {
    prev_screen_name: sessionStorage.getItem("prevScreen"),
  });
};
