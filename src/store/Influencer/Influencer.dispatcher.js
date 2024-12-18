import {
  setInfluencerLoading,
  setInfluencerLastTilesData,
  loadMoreClicked,
  setMasterTrendingInfo,
  setInfluencerSelectedGender,
  setLastClickedInfluencer,
  setInfluencerPreviousSelectedGender,
  setAlgoliaQuery,
  setInfluencerName,
  setInfluencerInfo,
  setIsCollectionPage,
  setIsStorePage,
} from "./Influencer.action";
import {
  getTrendingInfo,
  getInfluencerInfo,
} from "Util/API/endpoint/Influencer/Influencer.endpoint";

export class InfluencerDispatcher {
  async influencerHomePage(item, dispatch) {
    dispatch(setInfluencerLoading(true));

    try {
      const { locale, envID } = item;
      const response = await getTrendingInfo(locale, envID);
      if (response) {
        dispatch(setMasterTrendingInfo(response));
      }
      dispatch(setInfluencerLoading(false));
    } catch (err) {
      dispatch(setInfluencerLoading(false));
      console.error(
        "Error while fetching Trending Info on Influencer's main page",
        err
      );
    }
  }

  async influencerStorePage(item, dispatch) {
    dispatch(setInfluencerLoading(true));

    try {
      const { locale, envID, influencer_id } = item;
      const response = await getInfluencerInfo(influencer_id, envID, locale);
      if (response) {
        dispatch(setInfluencerInfo(response));
        dispatch(
          setAlgoliaQuery(response?.["algolia_query"]?.["categories.level2"])
        );
        dispatch(setInfluencerName(response?.influencer_name));
      }
      dispatch(setInfluencerLoading(false));
    } catch (err) {
      dispatch(setInfluencerLoading(false));
      console.error(
        "Error while fetching data on Influencer's Store page",
        err
      );
    }
  }

  setInfluencerName(name, dispatch) {
    dispatch(setInfluencerName(name));
  }

  isStorePage(val, dispatch) {
    dispatch(setIsStorePage(val));
  }

  isCollectionPage(val, dispatch) {
    dispatch(setIsCollectionPage(val));
  }

  async loadMoreButtonClicked(data, dispatch) {
    dispatch(loadMoreClicked(data));
  }

  async influencerLastTilesData(data, dispatch) {
    dispatch(setInfluencerLastTilesData(data));
  }

  async influencerSelectedGender(gender, dispatch) {
    dispatch(setInfluencerSelectedGender(gender));
  }

  async influencerPreviousSelectedGender(gender, dispatch) {
    dispatch(setInfluencerPreviousSelectedGender(gender));
  }

  async lastClickedInfluencer(influencerID, dispatch) {
    dispatch(setLastClickedInfluencer(influencerID));
  }
}
export default new InfluencerDispatcher();
