import { SET_MEGAMENU_CATEGORIES_LIST,SET_MEGAMENU_BANNER_AND_DYNAMIC_SLIDER_DATA, SET_MOBILE_MEGAMENU_PAGE_OPEN_FLAG, SET_MEGAMENU_BRANDS_DATA, SET_MOBILE_MEGAMENU_CATEGORY_LOADER } from './CategoriesList.action';

export const getInitialState = () => ({
    isLoading: true,
    isCategoryLoading: true,
    isBrandListLoading:true,
    isJSONLoading: true,
    categories: [],
    megaMenuBannerAndDynamicSliderData: [],
    mobileMegaMenuPageOpenFlag: "",
    megaMenuBrands: {},
});

const CategoriesListReducer = (state = getInitialState(), action) => {
    const { type, categories, megaMenuBannerAndDynamicSliderData, mobileMegaMenuPageOpenFlag, megaMenuBrands } = action;

    switch (type) {
    case SET_MEGAMENU_CATEGORIES_LIST:
        return {
            ...state,
            isLoading: false,
            isCategoryLoading: false,
            categories
        };
    case SET_MEGAMENU_BANNER_AND_DYNAMIC_SLIDER_DATA:

        return {
            ...state,
            isLoading: false,
            isJSONLoading: false,
            megaMenuBannerAndDynamicSliderData,
        }
    case SET_MOBILE_MEGAMENU_PAGE_OPEN_FLAG:

        return {
            ...state,
            isLoading: false,
            mobileMegaMenuPageOpenFlag
        }
    case SET_MEGAMENU_BRANDS_DATA:

        return {
            ...state,
            isLoading: false,
            isBrandListLoading: false,
            megaMenuBrands

        }
    case SET_MOBILE_MEGAMENU_CATEGORY_LOADER: 
        
        return {
            ...state,
            isLoading: true,
            isCategoryLoading: true,
            isBrandListLoading:true,
            isJSONLoading: true,
            isLoading: true
        }
    default:
        return state;
    }
};

export default CategoriesListReducer;
