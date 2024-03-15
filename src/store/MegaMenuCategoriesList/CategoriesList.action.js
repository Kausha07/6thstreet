export const SET_MEGAMENU_CATEGORIES_LIST = 'SET_MEGAMENU_CATEGORIES_LIST';
export const SET_MEGAMENU_BANNER_AND_DYNAMIC_SLIDER_DATA = 'SET_MEGAMENU_BANNER_AND_DYNAMIC_SLIDER_DATA';
export const SET_MEGAMENU_BRANDS_DATA = 'SET_MEGAMENU_BRANDS_DATA';
export const SET_MOBILE_MEGAMENU_PAGE_OPEN_FLAG = "SET_MOBILE_MEGAMENU_PAGE_OPEN_FLAG";

export const setMegaMenuCategoriesList = (categories) => ({
    type: SET_MEGAMENU_CATEGORIES_LIST,
    categories
});

export const setMegaMenuBannerAndDynmaicSliderData = (megaMenuBannerAndDynamicSliderData) => ({
    type: SET_MEGAMENU_BANNER_AND_DYNAMIC_SLIDER_DATA,
    megaMenuBannerAndDynamicSliderData
})

export const setMegaMenuBrandsData = (megaMenuBrands) => ({
    type: SET_MEGAMENU_BRANDS_DATA,
    megaMenuBrands
})

export const setMobileMegaMenuPageOpenFlag = (mobileMegaMenuPageOpenFlag) => ({
    type: SET_MOBILE_MEGAMENU_PAGE_OPEN_FLAG,
    mobileMegaMenuPageOpenFlag
})