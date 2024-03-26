export const SET_MEGAMENU_BRANDS_DATA = 'SET_MEGAMENU_BRANDS_DATA';
export const SET_MOBILE_MEGAMENU_PAGE_OPEN_FLAG = "SET_MOBILE_MEGAMENU_PAGE_OPEN_FLAG";
export const SET_MOBILE_MEGAMENU_CATEGORY_LOADER = "SET_MOBILE_MEGAMENU_CATEGORY_LOADER";
export const SET_MEGAMENU_CATEGORIES_DATA = 'SET_MEGAMENU_CATEGORIES_DATA';
export const SET_MEGAMENU_DYNAMIC_BANNER_SLIDER_DATA = "SET_MEGAMENU_DYNAMIC_BANNER_SLIDER_DATA";
export const SET_MEGAMENU_HEADER_GENDER_CHANGE = "SET_MEGAMENU_HEADER_GENDER_CHANGE";

export const setMegaMenuBrandsData = (megaMenuBrands) => ({
    type: SET_MEGAMENU_BRANDS_DATA,
    megaMenuBrands
})

export const setMobileMegaMenuPageOpenFlag = (mobileMegaMenuPageOpenFlag) => ({
    type: SET_MOBILE_MEGAMENU_PAGE_OPEN_FLAG,
    mobileMegaMenuPageOpenFlag
})

export const setLoadingFlagTrue = () => ({
    type: SET_MOBILE_MEGAMENU_CATEGORY_LOADER
})

export const setMegaMenuCategoriesData = (gender, data) => ({
    type: SET_MEGAMENU_CATEGORIES_DATA,
    payload: { gender, data },
});

export const setMegaMenuDynamicBannerSliderData = (gender, data) => ({
    type: SET_MEGAMENU_DYNAMIC_BANNER_SLIDER_DATA,
    payload: { gender, data },
});

export const setMegaMenuHeaderGenderChange = (megamenuHeaderGenderChange) => ({
    type: SET_MEGAMENU_HEADER_GENDER_CHANGE,
    megamenuHeaderGenderChange
})
