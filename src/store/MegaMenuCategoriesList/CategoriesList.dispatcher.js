import { CATEGORIES_MEGA_MENU_STATIC_FILE_KEY } from "Component/MobileMegaMenu/MegaMenuCategories/Components/MegaMenu.config.js";
import { getStaticFile } from "Util/API/endpoint/StaticFiles/StaticFiles.endpoint";
import Logger from "Util/Logger";

import { setLoadingFlagTrue, setMegaMenuCategoriesData, setMegaMenuDynamicBannerSliderData  } from "./CategoriesList.action";
import MobileAPI from "Util/API/provider/MobileAPI";

export class CategoriesListDispatcher {
  async requestMegaMenuCategoriesList(gender,locale, dispatch) {
    if(gender !== "influencer" || gender !== "home"){
      try {
        const categories = await MobileAPI.get(`/megamenu/${gender}?locale=${locale}&device=app&category_level=2`);
        if(categories && categories?.data && categories?.data?.length > 0) {
          dispatch(setMegaMenuCategoriesData(gender, categories?.data));
        }
      } catch (e) {
        // TODO: handle error
        Logger.log(e);
        return { data: [] };
      }
    }
  }

  async requestMegaMenuBannerAndDynamicSliderData(gender,dispatch) {
    try {
      const response = await getStaticFile(
        CATEGORIES_MEGA_MENU_STATIC_FILE_KEY,
        typeof gender === "object"
          ? { $GENDER: gender?.gender }
          : { $GENDER: gender }
      )
      dispatch(setMegaMenuDynamicBannerSliderData(gender,response));
    } catch (e) {
      Logger.log(e);
    }
  }

  setLoaderforCategory(dispatch) {
    dispatch(setLoadingFlagTrue())
  }
}

export default new CategoriesListDispatcher();
