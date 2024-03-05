import { useEffect } from "react";
import "./MegaMenuBrands.style.scss";
import { connect, useDispatch } from "react-redux";
import CategoriesListDispatcher from "Store/MegaMenuCategoriesList/CategoriesList.dispatcher";
import BrandSelectionGrid from "../../component/MobileMegaMenu/MegaMenuBrands/Components/BrandSelectionGrid/index";
import BrandSelectionDirectoryList from "../../component/MobileMegaMenu/MegaMenuBrands/Components/BrandSelectionDirectoryList"

export const mapStateToProps = (state) => ({
  gender: state.AppState.gender,
  locale: state.AppState.locale,
  isLoading: state?.CategoriesListReducer?.isLoading,
  megaMenuBannerAndDynamicSliderData:
    state?.CategoriesListReducer?.megaMenuBannerAndDynamicSliderData,
});
export const mapDispatchToProps = (dispatch) => ({
    requestMegaMenuBannerAndDynamicSliderData: (gender) => CategoriesListDispatcher.requestMegaMenuBannerAndDynamicSliderData(gender, dispatch)
  });

const MegaMenuBrands = (props) => {
    const {requestMegaMenuBannerAndDynamicSliderData, gender } = props;
  useEffect(()=>{
    requestMegaMenuBannerAndDynamicSliderData(gender);
  },[])
  const BrandSelectionGridData = props?.megaMenuBannerAndDynamicSliderData?.data?.[1]?.data || [];
  console.log('test megamenuBrands', BrandSelectionGridData, gender);
  return (
    <div block="megamenu-brands-main-container">
      <BrandSelectionGrid BrandSelectionGridData={BrandSelectionGridData}/>
      <BrandSelectionDirectoryList gender={props?.gender}/>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps) (MegaMenuBrands);
