import { useState } from "react";
import "./MegaMenuBrands.style.scss";
import { connect } from "react-redux";
import BrandSelectionGrid from "../../component/MobileMegaMenu/MegaMenuBrands/Components/BrandSelectionGrid/index";
import BrandSelectionDirectoryList from "../../component/MobileMegaMenu/MegaMenuBrands/Components/BrandSelectionDirectoryList";

export const mapStateToProps = (state) => ({
  gender: state.AppState.gender,
  locale: state.AppState.locale,
  isLoading: state?.CategoriesListReducer?.isLoading,
  megaMenuBannerAndDynamicSliderData:
    state?.CategoriesListReducer?.megaMenuBannerAndDynamicSliderData,
});

const MegaMenuBrands = (props) => {
  const { gender } = props;
  const [isLoading, setIsLoading] = useState(true);
  const BrandSelectionGridData =
    props?.megaMenuBannerAndDynamicSliderData?.[1]?.data || [];
  const renderBrandSelectionGridShimer = () => {
    return (
      <div block="BrandSelectionGridWrapper">
        <div
          block="BrandSelectionGridWrapper"
          elem="BrandSelectionGridCard"
        ></div>
        <div
          block="BrandSelectionGridWrapper"
          elem="BrandSelectionGridCard"
        ></div>
        <div
          block="BrandSelectionGridWrapper"
          elem="BrandSelectionGridCard"
        ></div>
        <div
          block="BrandSelectionGridWrapper"
          elem="BrandSelectionGridCard"
        ></div>
        <div
          block="BrandSelectionGridWrapper"
          elem="BrandSelectionGridCard"
        ></div>
        <div
          block="BrandSelectionGridWrapper"
          elem="BrandSelectionGridCard"
        ></div>
        <div
          block="BrandSelectionGridWrapper"
          elem="BrandSelectionGridCard"
        ></div>
        <div
          block="BrandSelectionGridWrapper"
          elem="BrandSelectionGridCard"
        ></div>
      </div>
    );
  };

  return (
    <div
      block="megamenu-brands-main-container"
      id="megamenu-brands-main-container-id"
    >
      {isLoading ? (
        renderBrandSelectionGridShimer()
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
