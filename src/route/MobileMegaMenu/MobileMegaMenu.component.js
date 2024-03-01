import MegaMenuBannerSlider from "../../component/MobileMegaMenu/MegaMenuCategories/Components/MegaMenuBannerSlider/MegaMenuBannerSlider.component";
import MegaMenuHorizontalSlider from "../../component/MobileMegaMenu/MegaMenuCategories/Components/MegaMenuHorizontalSlider/MegaMenuHorizontalSlider.component";
import MegaMenuCategoriesAccordian from "../../component/MobileMegaMenu/MegaMenuCategories/Components/MegaMenuCategoriesAccordian/MegaMenuCategoriesAccordian.component";
import BrandSelectionGrid from "../../component/MobileMegaMenu/MegaMenuBrands/Components/BrandSelectionGrid/BrandSelectionGrid.component";
import './MobileMegaMenu.style.scss';
const MobileMegaMenu = () => {
  return (
    <div block="mobile-megamenu-main-container">
      <MegaMenuBannerSlider />
      <MegaMenuHorizontalSlider />
      <MegaMenuCategoriesAccordian />
      <BrandSelectionGrid />
    </div>
  );
};

export default MobileMegaMenu;
