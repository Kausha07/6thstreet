import { getUUID } from "Util/Auth";
import Event, {
  EVENT_HOME_SCREEN_VIEW,
  EVENT_PLP_SCREEN_VIEW,
  MOE_trackEvent,
} from "Util/Event";

export const getHomePagePersonalizationContent = async (
  devicePrefix,
  gender,
  customer,
  abTestingConfig,
  getStaticFile,
  HOME_STATIC_FILE_KEY,
) => {
  const userSegementValue = customer?.user_segment
    ? customer.user_segment
    : abTestingConfig?.HPP?.defaultUserSegment;

    const fileName = userSegementValue
      ? `${devicePrefix}${userSegementValue}_${gender}.json`
      : `${devicePrefix}${gender}.json`;
  /** Adding Fallback user segement and fallback filename, if user segment other that new_user or repeat_user*/
  const fallBackUserSegment = abTestingConfig?.HPP?.defaultUserSegment || "new_user";
  const fallBackFileName = `${devicePrefix}${fallBackUserSegment}_${gender}.json`;
  let dynamicContent = [];
  try {
    dynamicContent = await getStaticFile(HOME_STATIC_FILE_KEY, {
      $FILE_NAME: fileName,
    });
  }catch(e) {
    dynamicContent = await getStaticFile(HOME_STATIC_FILE_KEY, {
      $FILE_NAME: fallBackFileName,
    });
    console.error(e);
  }
  return dynamicContent;
};


export const getUserSpecificDynamicContent = (
  dynamicContent = [],
  variationName = "",
  abTestingConfig = {}
) => {
  const variant_name = variationName
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
