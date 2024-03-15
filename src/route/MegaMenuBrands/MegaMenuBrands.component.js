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

const MegaMenuBrands = (props) => {
    const { gender } = props;
  const BrandSelectionGridData = props?.megaMenuBannerAndDynamicSliderData?.[1]?.data || [];
  return (
    <div block="megamenu-brands-main-container" id="megamenu-brands-main-container-id">
      <BrandSelectionGrid BrandSelectionGridData={BrandSelectionGridData}/>
      <BrandSelectionDirectoryList gender={props?.gender}/>
    </div>
  );
};

export default connect(mapStateToProps, null) (MegaMenuBrands);
