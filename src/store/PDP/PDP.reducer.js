// TODO update this import when renamed
import {
    SET_PDP_DATA,
    SET_PDP_GALLERY_IMAGE_INDEX,
    SET_PDP_LOADING,
    SET_PDP_CLICK_AND_COLLECT,
    SET_DISPLAY_SEARCH,
    SET_BRAND_INFO_DATA,
    SET_BRAND_BUTTON_CLICK,
    SET_VUE_TRENDING_BRAND_CLICK
} from './PDP.action';

export const getInitialState = () => ({
    product: {},
    options: {},
    imageIndex: 0, // positive numbers - gallery, negative numbers - special cases, i.e. video = -1
    clickAndCollectStores: [],
    isLoading: true,
    displaySearch: false,
    brandInfoData: '',
    brandButtonClick : false,
    vueTrendingBrandClick: false
});

export const PDPReducer = (state = getInitialState(), action) => {
    const { type } = action;

    switch (type) {
        case SET_PDP_DATA:
            const {
                response: {
                    data: product = {},
                    nbHits
                },
                options = {}
            } = action;

            return {
                ...state,
                imageIndex: 0,
                product,
                options,
                nbHits,
                isLoading:true,
            };

        case SET_PDP_GALLERY_IMAGE_INDEX:
            const { imageIndex } = action;

            return {
                ...state,
                imageIndex
            };

        case SET_PDP_CLICK_AND_COLLECT:
            const { clickAndCollectStores } = action;
            return {
                ...state,
                clickAndCollectStores
            };

        case SET_BRAND_INFO_DATA:
            const { data } = action;
            return {
                ...state,
                brandInfoData: data,
            };

        case SET_PDP_LOADING:
            const { isLoading } = action;

            return {
                ...state,
                isLoading
            };

        case SET_DISPLAY_SEARCH:
            const { displaySearch } = action;

            return {
                ...state,
                displaySearch
            };

        case SET_BRAND_BUTTON_CLICK:
            const { brandButtonClick } = action;

            return {
                ...state,
                brandButtonClick
            };

        case SET_VUE_TRENDING_BRAND_CLICK:
            const { vueTrendingBrandClick } = action;
    
            return {
                ...state,
                vueTrendingBrandClick
            };

        default:
            return state;
    }
};

export default PDPReducer;
