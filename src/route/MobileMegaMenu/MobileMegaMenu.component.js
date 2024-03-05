import {useState, useEffect} from "react";
import Loader from "Component/Loader";
import { connect } from "react-redux";
import CategoriesListDispatcher from "Store/MegaMenuCategoriesList/CategoriesList.dispatcher";
import { setMobileMegaMenuPageOpenFlag } from "Store/MegaMenuCategoriesList/CategoriesList.action"
import MegaMenuBannerSlider from "../../component/MobileMegaMenu/MegaMenuCategories/Components/MegaMenuBannerSlider/MegaMenuBannerSlider.component";
import MegaMenuHorizontalSlider from "../../component/MobileMegaMenu/MegaMenuCategories/Components/MegaMenuHorizontalSlider/MegaMenuHorizontalSlider.component";
import MegaMenuCategoriesAccordian from "../../component/MobileMegaMenu/MegaMenuCategories/Components/MegaMenuCategoriesAccordian/MegaMenuCategoriesAccordian.component";
import './MobileMegaMenu.style.scss';

export const mapStateToProps = (state) => ({
  gender: state.AppState.gender,
  locale: state.AppState.locale,
  isLoading: state?.CategoriesListReducer?.isLoading,
  megaMenuBannerAndDynamicSliderData: state?.CategoriesListReducer?.megaMenuBannerAndDynamicSliderData
});

export const mapDispatchToProps = (dispatch) => ({
  requestMegaMenuBannerAndDynamicSliderData: (gender) => CategoriesListDispatcher.requestMegaMenuBannerAndDynamicSliderData(gender, dispatch),
  setMobileMegaMenuPageOpenFlag: (mobileMegaMenuPageOpenFlag) => setMobileMegaMenuPageOpenFlag(mobileMegaMenuPageOpenFlag),
});
const MobileMegaMenu = (props) => {
  const [dynamicContent, setDynamicContent] = useState([]);
  const {requestMegaMenuBannerAndDynamicSliderData, gender } = props;
  useEffect(()=>{
    requestMegaMenuBannerAndDynamicSliderData(gender);
    setMobileMegaMenuPageOpenFlag("megamenu");
  },[])
  console.log('test kiran rendering the megaenu')
  const BannerInformation = props.megaMenuBannerAndDynamicSliderData?.data?.[0]?.data?.[0] || {};
  const HorizantalSliderInformation = props.megaMenuBannerAndDynamicSliderData?.data?.[0]?.data?.[1] || [];
  const BrandSelectionGridData = props.megaMenuBannerAndDynamicSliderData?.data?.[1];

  return (
    <div block="mobile-megamenu-main-container">
      <Loader isLoading={props?.isLoading}/>
      <MegaMenuBannerSlider BannerInformation={BannerInformation} isLoading={props?.isLoading}/>
      <MegaMenuHorizontalSlider HorizantalSliderInformation={HorizantalSliderInformation} isLoading={props?.isLoading}/>
      <MegaMenuCategoriesAccordian />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileMegaMenu);
