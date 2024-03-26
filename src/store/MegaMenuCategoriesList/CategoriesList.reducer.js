import { SET_MOBILE_MEGAMENU_PAGE_OPEN_FLAG, SET_MEGAMENU_BRANDS_DATA, SET_MOBILE_MEGAMENU_CATEGORY_LOADER, SET_MEGAMENU_CATEGORIES_DATA, SET_MEGAMENU_DYNAMIC_BANNER_SLIDER_DATA, SET_MEGAMENU_HEADER_GENDER_CHANGE } from './CategoriesList.action';

export const getInitialState = () => ({
    isLoading: true,
    isCategoryLoading: true,
    isBrandListLoading:true,
    isJSONLoading: true,
    megaMenuCategoriesData: {
        women: [],
        men: [],
        kids: [],
    },
    megamenuDynmaicBannerSliderData:  {
        women: [],
        men: [],
        kids: [],
    },
    mobileMegaMenuPageOpenFlag: "",
    megaMenuBrands: {},
    megamenuHeaderGenderChange: false,
});

const CategoriesListReducer = (state = getInitialState(), action) => {
    const { type, mobileMegaMenuPageOpenFlag, megaMenuBrands, megamenuHeaderGenderChange } = action;

    switch (type) {
    case SET_MOBILE_MEGAMENU_PAGE_OPEN_FLAG: {

        return {
            ...state,
            isLoading: false,
            mobileMegaMenuPageOpenFlag
        }
    }
    case SET_MEGAMENU_BRANDS_DATA:{

        return {
            ...state,
            isLoading: false,
            isBrandListLoading: false,
            megaMenuBrands

        }
    }
    case SET_MOBILE_MEGAMENU_CATEGORY_LOADER: {
        
        return {
            ...state,
            isLoading: true,
            isCategoryLoading: true,
            isBrandListLoading:true,
            isJSONLoading: true,
            isLoading: true
        }
    }
    case SET_MEGAMENU_CATEGORIES_DATA: {
        const { gender, data } = action.payload;

        return {
            ...state,
            isLoading: false,
            isCategoryLoading: false,
            megaMenuCategoriesData: {
              ...state.megaMenuCategoriesData,
              [gender]: data,
            },
        };
    }
    case SET_MEGAMENU_DYNAMIC_BANNER_SLIDER_DATA: {
        const { gender, data } = action.payload;

        return {
            ...state,
            isLoading: false,
            isJSONLoading: false,
            megamenuDynmaicBannerSliderData: {
                ...state.megamenuDynmaicBannerSliderData,
                [gender]: data,
            },
        };
    }
    case SET_MEGAMENU_HEADER_GENDER_CHANGE: {
        return {
            ...state,
            megamenuHeaderGenderChange,
        }
    }

    default:
        return state;
    }
};

export default CategoriesListReducer;
