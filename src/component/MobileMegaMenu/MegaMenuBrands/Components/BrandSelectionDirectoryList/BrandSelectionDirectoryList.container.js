import { useState, useEffect } from "react";
import { isArabic } from "Util/App";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Algolia from "Util/API/provider/Algolia";
import { groupByName } from "Util/API/endpoint/Brands/Brands.format";
import BrandSelectionDirectoryList from "./BrandSelectionDirectoryList.component";
import { setMegaMenuBrandsData, setMobileMegaMenuPageOpenFlag } from "Store/MegaMenuCategoriesList/CategoriesList.action";
import { setGender } from "Store/AppState/AppState.action";
export const mapStateToProps = (state) => ({
  gender: state.AppState.gender
});

export const mapDispatchToProps = (dispatch) => ({
  setMegaMenuBrandsData: (megaMenuBrandsData) => dispatch(setMegaMenuBrandsData(megaMenuBrandsData)),
  setMobileMegaMenuPageOpenFlag: (mobileMegaMenuPageOpenFlag) => dispatch(setMobileMegaMenuPageOpenFlag(mobileMegaMenuPageOpenFlag)),
  setGender: (gender) => dispatch(setGender(gender))

});

const BrandSelectionDirectoryListContainer = (props) => {
  const [brands, setBrands] = useState([]);
  const [brandMapping, setBrandMapping] = useState(null);
  const { isLoading, setIsLoading } = props;
  const isArabicValue = isArabic();
  const gender = props?.gender;

  useEffect(() => {
    let brandType = gender;
    const genderTab = isArabicValue ? getGenderInAR(brandType) : brandType;
    const kidsGender = isArabicValue
      ? `${getGenderInAR("Boy")},${getGenderInAR("Girl")}`
      : "Boy,Girl";
    requestShopbyBrands(brandType === "kids" ? kidsGender : genderTab);
    props?.setMobileMegaMenuPageOpenFlag("menu-brands");
  }, []);

  useEffect(() => {
    let brandType = gender;
    const genderTab = isArabicValue ? getGenderInAR(brandType) : brandType;
    const kidsGender = isArabicValue
      ? `${getGenderInAR("Boy")},${getGenderInAR("Girl")}`
      : "Boy,Girl";
    requestShopbyBrands(brandType === "kids" ? kidsGender : genderTab);
    props?.setMobileMegaMenuPageOpenFlag("menu-brands");
  }, [gender]);

  useEffect(() => {
    return () => {
      props?.setMobileMegaMenuPageOpenFlag("");
    }
  },[])
  const getGenderInAR = (gender) => {
    switch (gender) {
      case "men":
        return "رجال";
      case "women":
        return "نساء";
      case "kids":
        return "أطفال";
      case "Girl":
        return "بنات";
      case "Boy":
        return "أولاد";
    }
  };
  const getGenderInEn = (gender) => {
    switch (gender) {
      case "رجال":
        return "men";
      case "نساء":
        return "women";
      case "أطفال":
        return "kids";
      case "بنات":
        return "Girl";
      case "أولاد":
        return "Boy";
    }
  };
  const requestBrands = async (gender) => {
    setIsLoading(true);
    const mengamenuBrand = true;
    return new Algolia()
      .getBrands(gender, mengamenuBrand)
      .then((data) => {
        return data;
      })
      .catch((error) => console.error(error));
  };

  const requestShopbyBrands = async (gender) => {
    const { setMegaMenuBrandsData } = props;
    try {
      const activeBrandsList = await requestBrands(gender);
      const resultantBrandsObject = activeBrandsList?.map((key) => ({ name: key }));
      const groupByNameResult =  groupByName(resultantBrandsObject,true) || {};
      const sortedBrands = Object.entries(groupByNameResult)?.sort(
        ([letter1], [letter2]) => {
          if (letter1 !== letter2) {
            if (letter1 < letter2) {
              return -1;
            }
            return 1;
          }
          if (letter1 === "0-9") {
            return 1;
          }
          if (letter2 === "0-9") {
            return -1;
          }
        }
      );
      setMegaMenuBrandsData(groupByNameResult);
      setBrands(sortedBrands);
      setIsLoading(false);
    } catch (e) {
      setBrands([]);
      console.error(e);
    }
  };
  return (
    <div>
      <BrandSelectionDirectoryList brands={brands} isLoading={isLoading} gender={props?.gender} />
    </div>
  );
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BrandSelectionDirectoryListContainer)
);
