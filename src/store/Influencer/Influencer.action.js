export const SET_INFLUENCER_TILES_INFO = "SET_INFLUENCER_TILES_INFO";
export const SET_INFLUENCER_LOADING = "SET_INFLUENCER_LOADING";
export const SET_LOAD_MORE_CLICKED = "SET_LOAD_MORE_CLICKED";
export const SET_MASTER_TRENDING_INFO = "SET_MASTER_TRENDING_INFO";
export const SET_INFLUENCER_SELECTED_GENDER = "SET_INFLUENCER_SELECTED_GENDER";
export const SET_LAST_CLICKED_INFLUENCER = "SET_LAST_CLICKED_INFLUENCER";
export const SET_INFLUENCER_PREVIOUS_SELECTED_GENDER =
  "SET_INFLUENCER_PREVIOUS_SELECTED_GENDER";
export const SET_ALGOLIA_QUERY = "SET_ALGOLIA_QUERY";
export const SET_INFLUENCER_NAME = "SET_INFLUENCER_NAME";
export const SET_INFLUENCER_INFO = "SET_INFLUENCER_INFO";
export const SET_IS_COLLECTION_PAGE = "SET_IS_COLLECTION_PAGE";
export const SET_IS_STORE_PAGE = "SET_IS_STORE_PAGE";

export const setInfluencerLoading = (isLoading) => ({
  type: SET_INFLUENCER_LOADING,
  isLoading,
});

export const setInfluencerLastTilesData = (data) => ({
  type: SET_INFLUENCER_TILES_INFO,
  data,
});

export const loadMoreClicked = (data) => ({
  type: SET_LOAD_MORE_CLICKED,
  data,
});

export const setMasterTrendingInfo = (data) => ({
  type: SET_MASTER_TRENDING_INFO,
  data,
});

export const setInfluencerSelectedGender = (gender) => ({
  type: SET_INFLUENCER_SELECTED_GENDER,
  gender,
});

export const setInfluencerPreviousSelectedGender = (prevGender) => ({
  type: SET_INFLUENCER_PREVIOUS_SELECTED_GENDER,
  prevGender,
});

export const setLastClickedInfluencer = (influencer) => ({
  type: SET_LAST_CLICKED_INFLUENCER,
  influencer,
});

export const setAlgoliaQuery = (query) => ({
  type: SET_ALGOLIA_QUERY,
  query,
});

export const setInfluencerName = (name) => ({
  type: SET_INFLUENCER_NAME,
  name,
});

export const setInfluencerInfo = (data) => ({
  type: SET_INFLUENCER_INFO,
  data,
});

export const setIsCollectionPage = (val) => ({
  type: SET_IS_COLLECTION_PAGE,
  val,
});

export const setIsStorePage = (val) => ({
  type: SET_IS_STORE_PAGE,
  val,
});
