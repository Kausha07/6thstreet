import { useEffect } from "react";
import { connect } from "react-redux";
import CategoriesListDispatcher from "Store/MegaMenuCategoriesList/CategoriesList.dispatcher";
import { setMegaMenuHeaderGenderChange } from "Store/MegaMenuCategoriesList/CategoriesList.action";
import {renderBannerAnimationShimper, renderMegaMenuAnimationShimer} from "../../component/MobileMegaMenu/Utils/MegaMenuShimers.helper"
import MegaMenuBannerSlider from "../../component/MobileMegaMenu/MegaMenuCategories/Components/MegaMenuBannerSlider/MegaMenuBannerSlider.component";
import MegaMenuHorizontalSlider from "../../component/MobileMegaMenu/MegaMenuCategories/Components/MegaMenuHorizontalSlider/MegaMenuHorizontalSlider.component";
import MegaMenuCategoriesAccordian from "../../component/MobileMegaMenu/MegaMenuCategories/Components/MegaMenuCategoriesAccordian/MegaMenuCategoriesAccordian.component";
import "./MobileMegaMenu.style.scss";
let globalGender = "";
export const mapStateToProps = (state) => ({
  gender: state.AppState.gender,
  locale: state.AppState.locale,
  isLoading: state?.CategoriesListReducer?.isLoading,
  megamenuDynmaicBannerSliderData: state?.CategoriesListReducer?.megamenuDynmaicBannerSliderData
});

export const mapDispatchToProps = (dispatch) => ({
  requestMegaMenuBannerAndDynamicSliderData: (gender) =>
    CategoriesListDispatcher.requestMegaMenuBannerAndDynamicSliderData(
      gender,
      dispatch
    ),
  setMegaMenuHeaderGenderChange: (megamenuHeaderGenderChange) => dispatch(setMegaMenuHeaderGenderChange(megamenuHeaderGenderChange))
});
const MobileMegaMenu = (props) => {
  const { requestMegaMenuBannerAndDynamicSliderData, gender, megamenuDynmaicBannerSliderData, setMegaMenuHeaderGenderChange } = props;


  useEffect(() => {
    if(globalGender !== gender && megamenuDynmaicBannerSliderData?.[gender]?.length === 0) {
     globalGender = gender;
      requestMegaMenuBannerAndDynamicSliderData(gender);
    }
    setMegaMenuHeaderGenderChange(true);
    scrollToTop();
    return () => {
      setMegaMenuHeaderGenderChange(false);
    }
  }, [gender]);

  const scrollToTop = () => {
    window.scrollTo({ top: "100px", behavior: "smooth" });
  }
  
  const BannerInformation =
    megamenuDynmaicBannerSliderData?.[gender]?.[0]?.data?.filter(d => d?.type==="banner")?.[0] || {};
  const HorizantalSliderInformation =
    megamenuDynmaicBannerSliderData?.[gender]?.[0]?.data?.filter(d => d?.type==="slider")?.[0] || [];
  const renderLoaders = () => {
    return (
      <>
        {renderBannerAnimationShimper()}
        {renderMegaMenuAnimationShimer("Wrapper","Card",4)}
        {renderMegaMenuAnimationShimer("CategoiresAccordianWrapper","CategoiresAccordianCard",4)}
      </>
    );
  };
  const renderMegaMenuContent = () => {
    return (
      <>
        <MegaMenuBannerSlider
          BannerInformation={BannerInformation}
          isLoading={props?.isLoading}
          gender={props?.gender}
        />
        <MegaMenuHorizontalSlider
          HorizantalSliderInformation={HorizantalSliderInformation}
          isLoading={props?.isLoading}
          gender={props?.gender}
        />
        <MegaMenuCategoriesAccordian />
      </>
    );
  };

  return (
    <div block="mobile-megamenu-main-container">
      {props?.isLoading ? renderLoaders() : renderMegaMenuContent()}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileMegaMenu);
