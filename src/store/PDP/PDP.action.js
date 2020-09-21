export const SET_PDP_DATA = 'SET_PDP_DATA';
export const SET_PDP_LOADING = 'SET_PDP_LOADING';
export const SET_PDP_GALLERY_IMAGE_INDEX = 'SET_PDP_GALLERY_IMAGE_INDEX';

export const setPDPGaleryImage = (imageIndex) => ({
    type: SET_PDP_GALLERY_IMAGE_INDEX,
    imageIndex
});

export const setPDPLoading = (isLoading) => ({
    type: SET_PDP_LOADING,
    isLoading
});

export const setPDPData = (
    response,
    options
) => ({
    type: SET_PDP_DATA,
    response,
    options
});
