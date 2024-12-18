import {
  SET_INFLUENCER_LOADING,
  SET_INFLUENCER_TILES_INFO,
  SET_LOAD_MORE_CLICKED,
  SET_MASTER_TRENDING_INFO,
  SET_INFLUENCER_SELECTED_GENDER,
  SET_LAST_CLICKED_INFLUENCER,
  SET_INFLUENCER_PREVIOUS_SELECTED_GENDER,
  SET_ALGOLIA_QUERY,
  SET_INFLUENCER_NAME,
  SET_INFLUENCER_INFO,
  SET_IS_COLLECTION_PAGE,
  SET_IS_STORE_PAGE,
} from "./Influencer.action";

export const getInitialState = () => ({
  influencerTilesData: [],
  isInfluencerLoading: true,
  isLoadMoreClicked: false,
  masterTrendingInfo: {},
  selectedGender: "WOMEN",
  lastClickedInfluencer: null,
  prevSelectedGender: "WOMEN",
  influencerInfo: {},
  influencerAlgoliaQuery: undefined,
  influencerName: "",
  isStorePage: false,
  isCollectionPage: false,
});

export const InfluencerReducer = (state = getInitialState(), action) => {
  const { type } = action;

  switch (type) {
    case SET_INFLUENCER_TILES_INFO:
      const { data: influencerTilesData = [] } = action;
      return {
        ...state,
        influencerTilesData,
      };

    case SET_INFLUENCER_LOADING:
      const { isLoading: isInfluencerLoading } = action;
      return {
        ...state,
        isInfluencerLoading,
      };

    case SET_LOAD_MORE_CLICKED:
      const { data: isLoadMoreClicked = true } = action;
      return {
        ...state,
        isLoadMoreClicked,
      };

    case SET_MASTER_TRENDING_INFO:
      const { data } = action;
      return {
        ...state,
        masterTrendingInfo: data,
      };

    case SET_INFLUENCER_SELECTED_GENDER:
      const { gender } = action;
      return {
        ...state,
        selectedGender: gender,
      };
    case SET_INFLUENCER_PREVIOUS_SELECTED_GENDER:
      const { prevGender } = action;
      return {
        ...state,
        prevSelectedGender: prevGender,
      };
    case SET_LAST_CLICKED_INFLUENCER:
      const { influencer } = action;
      return {
        ...state,
        lastClickedInfluencer: influencer,
      };

    case SET_INFLUENCER_INFO:
      const { data: influencerInfo = [] } = action;
      return {
        ...state,
        influencerInfo,
      };

    case SET_ALGOLIA_QUERY:
      const { query } = action;
      return {
        ...state,
        influencerAlgoliaQuery: query,
      };

    case SET_INFLUENCER_NAME:
      const { name } = action;
      return {
        ...state,
        influencerName: name,
      };

    case SET_IS_COLLECTION_PAGE:
      const { val: isCollectionPage } = action;
      return {
        ...state,
        isCollectionPage,
      };

    case SET_IS_STORE_PAGE:
      const { val: isStorePage } = action;
      return {
        ...state,
        isStorePage,
      };

    default:
      return state;
  }
};

export default InfluencerReducer;
