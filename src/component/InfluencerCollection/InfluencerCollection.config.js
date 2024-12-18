export const influencerProductCount = 40;

export const influencerStorePageBreadcrumbsText = (influencerName) => {
  return [__("Influencer"), __("%s's Store", influencerName)];
};

export const influencerCollectionPageBreadcrumbsText = (influencerName) => {
  return [
    __("Influencer"),
    __("%s's Store", influencerName),
    __("%s's Collection", influencerName),
  ];
};

export const influencerStorePageURL = (
  influencer_id,
  selectedGenderFromURL
) => {
  return [
    "/influencer.html",
    `/influencer.html/Store?influencerID=${influencer_id}&selectedGender=${selectedGenderFromURL}`,
  ];
};

export const influencerCollectionPageURL = (
  influencer_id,
  selectedGenderFromURL,
  collection_id
) => {
  return [
    "/influencer.html",
    `/influencer.html/Store?influencerID=${influencer_id}&selectedGender=${selectedGenderFromURL}`,
    `/influencer.html/Collection?influencerCollectionID=${collection_id}&influencerID=${influencer_id}`,
  ];
};

export const influencerURL = () => {
  const influencerPathNames = [
    "/influencer.html/Collection",
    "/influencer.html/Store",
  ];
  return influencerPathNames;
};

export default influencerProductCount;
