export const SET_PDP_DATA = 'SET_PDP_DATA';
export const SET_PDP_LOADING = 'SET_PDP_LOADING';
export const SET_DISPLAY_SEARCH = 'SET_DISPLAY_SEARCH'
export const SET_PDP_GALLERY_IMAGE_INDEX = 'SET_PDP_GALLERY_IMAGE_INDEX';
export const SET_PDP_CLICK_AND_COLLECT = 'SET_PDP_CLICK_AND_COLLECT';
export const SET_BRAND_INFO_DATA = 'SET_BRAND_INFO_DATA';
export const SET_BRAND_BUTTON_CLICK = 'SET_BRAND_BUTTON_CLICK';
export const SET_VUE_TRENDING_BRAND_CLICK = 'SET_VUE_TRENDING_BRAND_CLICK'
export const SET_NEW_DESIGN = 'SET_NEW_DESIGN'
export const SET_ADDTOCART_INFO = 'SET_ADDTOCART_INFO'

export const setPDPGaleryImage = (imageIndex) => ({
    type: SET_PDP_GALLERY_IMAGE_INDEX,
    imageIndex
});

export const setPDPShowSearch = (displaySearch) => ({
    type: SET_DISPLAY_SEARCH,
    displaySearch
});

export const setPDPLoading = (isLoading) => ({
    type: SET_PDP_LOADING,
    isLoading
});

export const setBrandInfoData = (data) => ({
    type: SET_BRAND_INFO_DATA,
    data
});
    

export const setPDPData = (
    response,
    options
) => ({
    type: SET_PDP_DATA,
    response,
    options
});

export const setNewDesign = (
    response
) => {
    return {
    type: SET_NEW_DESIGN,
    isNewDesign:response,
}};
export const setAddtoCartInfo = (
    response
) => {
    return {
    type: SET_ADDTOCART_INFO,
    addtoCartInfo:response,
}};

export const setPDPClickAndCollect = ( storesList ) => ({
    type: SET_PDP_CLICK_AND_COLLECT,
    clickAndCollectStores: storesList
})

export const setBrandButtonClick = (brandButtonClick) => ({
    type: SET_BRAND_BUTTON_CLICK,
    brandButtonClick
});

export const setVueTrendingBrandClick = (vueTrendingBrandClick) => ({
    type: SET_VUE_TRENDING_BRAND_CLICK,
    vueTrendingBrandClick
});
