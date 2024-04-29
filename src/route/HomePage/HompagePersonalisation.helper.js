import { getUUID } from "Util/Auth";
import Event, {
  EVENT_HOME_SCREEN_VIEW,
  EVENT_PLP_SCREEN_VIEW,
  MOE_trackEvent,
} from "Util/Event";

export const getHomePagePersonalizationJsonFileUrl = (
  devicePrefix,
  gender,
  customer
) => {
  const userSegementValue = customer?.user_segment ? customer.user_segment : "new_user";
  if (userSegementValue) {
    return `${devicePrefix}${userSegementValue}_${gender}.json`;
  }
  return `${devicePrefix}${gender}.json`;
};

export const getUserVWOVariation = async (
  customer,
  abTestingConfig = {}
) => {
  const userId = customer?.id ? customer?.id : getUUID();
  const campaign_name = abTestingConfig?.HPP?.campaignName || "";
  // Get Logged in User Variations from VWO tool
  try {
    if (userId && vwoClientInstance) {
      const variationName = await vwoClientInstance?.activate(
        campaign_name,
        `${userId}`
      );
      return variationName;
    }
  } catch (e) {
    console.error("vwo varition error", e);
  }
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
  MOE_trackEvent(EVENT_HOME_SCREEN_VIEW, {
    user_segment: user_segment || "new_user",
    variant_name: variantName,
  });
  Event.dispatch(EVENT_HOME_SCREEN_VIEW, {
    user_segment: user_segment || "new_user",
    variant_name: variantName,
  });
};

export const hppPlpScreenViewTrackingEvent = (
  user_segment,
  variant_name,
  abTestingConfig
) => {
  const variantName = variant_name
    ? variant_name
    : abTestingConfig?.HPP?.defaultValue;
  MOE_trackEvent(EVENT_PLP_SCREEN_VIEW, {
    prev_screen_name: sessionStorage.getItem("prevScreen"),
    user_segment: user_segment || "new_user",
    variant_name: variantName || abTestingConfig.HPP.defaultValue,
  });
};
