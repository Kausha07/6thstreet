export const SET_PDP_DATA = 'SET_PDP_DATA';
export const SET_PDP_LOADING = 'SET_PDP_LOADING';
export const SET_DISPLAY_SEARCH = 'SET_DISPLAY_SEARCH'
export const SET_PDP_GALLERY_IMAGE_INDEX = 'SET_PDP_GALLERY_IMAGE_INDEX';
export const SET_PDP_CLICK_AND_COLLECT = 'SET_PDP_CLICK_AND_COLLECT';
export const SET_BRAND_INFO_DATA = 'SET_BRAND_INFO_DATA';
export const SET_BRAND_BUTTON_CLICK = 'SET_BRAND_BUTTON_CLICK';

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

export const setPDPClickAndCollect = ( storesList ) => ({
    type: SET_PDP_CLICK_AND_COLLECT,
    clickAndCollectStores: storesList
})

export const setBrandButtonClick = (brandButtonClick) => ({
    type: SET_BRAND_BUTTON_CLICK,
    brandButtonClick
});
