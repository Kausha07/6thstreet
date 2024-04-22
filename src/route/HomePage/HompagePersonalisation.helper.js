import { getUUID } from "Util/Auth";

export const getHomePagePersonalizationJsonFileUrl = (
  devicePrefix,
  gender,
  customer,
  locale
) => {
  const userSegementValue = customer?.user_segment || "";
  if (userSegementValue && locale === "en-om" && gender === "men") {
    return `${devicePrefix}${userSegementValue}_${gender}.json`;
  }
  return `${devicePrefix}${gender}.json`;
};

export const getUserVWOVariation = async (
  customer,
  homepagePersonalisationConfig = {}
) => {
  const userId = customer?.id ? customer?.id : getUUID();
  const campaign_name = homepagePersonalisationConfig?.HPP?.campaignName || "";
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
  variantionName,
  homepagePersonalisationConfig = {}
) => {
  const variant_name = variantionName
    ? variantionName
    : homepagePersonalisationConfig?.HPP?.defaultValue;
  if (!dynamicContent || dynamicContent?.length === 0) {
    return [];
  }
  const filteredContent = dynamicContent.filter(
    (item) => item?.widget_variant == variant_name
  );

  return filteredContent?.length > 0 ? filteredContent : dynamicContent;
};
