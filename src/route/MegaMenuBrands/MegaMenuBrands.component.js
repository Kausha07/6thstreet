import { useState } from "react";
import "./MegaMenuBrands.style.scss";
import { connect } from "react-redux";
import { renderMegaMenuAnimationShimer } from "Component/MobileMegaMenu/Utils/MegaMenuShimers.helper";
import BrandSelectionGrid from "../../component/MobileMegaMenu/MegaMenuBrands/Components/BrandSelectionGrid/index";
import BrandSelectionDirectoryList from "../../component/MobileMegaMenu/MegaMenuBrands/Components/BrandSelectionDirectoryList";

export const mapStateToProps = (state) => ({
  gender: state.AppState.gender,
  locale: state.AppState.locale,
  isLoading: state?.CategoriesListReducer?.isLoading,
  megamenuDynmaicBannerSliderData: state?.CategoriesListReducer?.megamenuDynmaicBannerSliderData
});

const MegaMenuBrands = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const { gender, megamenuDynmaicBannerSliderData } = props;
  const BrandSelectionGridData =
    megamenuDynmaicBannerSliderData?.[gender]?.[1]?.data || [];
  return (
    <div
      block="megamenu-brands-main-container"
      id="megamenu-brands-main-container-id"
    >
      {isLoading ? (
        renderMegaMenuAnimationShimer("BrandSelectionGridWrapper","BrandSelectionGridCard",8)
      ) : (
        <BrandSelectionGrid BrandSelectionGridData={BrandSelectionGridData} />
      )}
      <BrandSelectionDirectoryList
        gender={props?.gender}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
};

export default connect(mapStateToProps, null)(MegaMenuBrands);
