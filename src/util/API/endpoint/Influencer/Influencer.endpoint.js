import CDN from "src/util/API/provider/CDN";
import MobileAPI from "src/util/API/provider/MobileAPI";

export const getTrendingInfo = (locale, envID) =>
  CDN.get(
    `resources/${envID}/${locale}/collections/trending_collection_with_influncers.json`
  ) || {};

export const getInfluencerInfo = (influencer_id, envID, locale) =>
  CDN.get(`resources/${envID}/${locale}/collections/${influencer_id}.json`) ||
  {};

export const getFollowedInfluencer = () =>
  MobileAPI.get(`/influencer/list`) || {};

export const followUnfollowInfluencer = (payload) =>
  MobileAPI.post(`/influencer/follow`, payload) || {};

export const getAllInfluencers = (envID, locale) =>
  CDN.get(`resources/${envID}/${locale}/collections/influencers.json`) || {};

export const getOnlyTrendingCollections = (envID, locale) =>
  CDN.get(
    `resources/${envID}/${locale}/collections/trending_collections.json`
  ) || {};
