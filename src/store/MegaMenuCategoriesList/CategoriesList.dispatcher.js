import { CATEGORIES_STATIC_FILE_KEY } from "Component/Menu/Menu.config";
import { getStaticFile } from "Util/API/endpoint/StaticFiles/StaticFiles.endpoint";
import Logger from "Util/Logger";

import { setMegaMenuCategoriesList, setMegaMenuBannerAndDynmaicSliderData } from "./CategoriesList.action";
import MobileAPI from "Util/API/provider/MobileAPI";

export class CategoriesListDispatcher {
  async requestMegaMenuCategoriesList(gender,locale, dispatch) {
    if(gender !== "influencer"){
      try {
        const categories = await MobileAPI.get(`/megamenu/${gender}?locale=${locale}&device=app&category_level=3`);

        dispatch(setMegaMenuCategoriesList(categories));
      } catch (e) {
        // TODO: handle error
        Logger.log(e);
        return { data: [] };
      }
    }
  }

  async requestMegaMenuBannerAndDynamicSliderData(gender,dispatch) {
    try {
      const response = await fetch("/DynamicBannerData.json").then((res) => {
        return res.json();
      });

      dispatch(setMegaMenuBannerAndDynmaicSliderData(response));
    } catch (e) {
      Logger.log(e);
    }
  }
}

export default new CategoriesListDispatcher();
