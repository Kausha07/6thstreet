import React, { useRef } from "react";
import Image from "Component/Image";
import "./MegaMenuCategoriesAccordian.style.scss";
import MegaMenuNestedCategoriesList from "../MegaMenuNestedCategoriesList/MegaMenuNestedCategoriesList.component";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getLocaleFromUrl } from "Util/Url/Url";
import { isArabic,truncate } from "Util/App";
import CategoriesListDispatcher from "Store/MegaMenuCategoriesList/CategoriesList.dispatcher";
import { renderMegaMenuAnimationShimer } from "Component/MobileMegaMenu/Utils/MegaMenuShimers.helper";
import { categoryExpandEvent } from "Component/MobileMegaMenu/MoEngageTrackingEvents/MoEngageTrackingEvents.helper";

let globalGenderAccordian = "";
export const mapStateToProps = (state) => ({
  gender: state.AppState.gender,
  locale: state.AppState.locale,
  isLoading: state?.CategoriesListReducer?.isLoading,
  isCategoryLoading: state?.CategoriesListReducer?.isCategoryLoading,
  megaMenuCategoriesData: state?.CategoriesListReducer?.megaMenuCategoriesData,
});

export const mapDispatchToProps = (dispatch) => ({
  setLoaderforCategory: () => {
    CategoriesListDispatcher.setLoaderforCategory(dispatch);
  },
  requestMegaMenuCategoriesList: (gender, locale) =>
    CategoriesListDispatcher.requestMegaMenuCategoriesList(
      gender,
      locale,
      dispatch
    ),
    
});

const MegaMenuCategoriesAccordion = (props) => {
  const [clickedIndex, setClickedIndex] = useState(null);
  const isArabicValue = isArabic();
  const ScrollerRef = useRef({});
  const { requestMegaMenuCategoriesList, setLoaderforCategory,  gender, data = [], megaMenuCategoriesData } = props;

  useEffect(() => {
    const locale = getLocaleFromUrl();
    if(globalGenderAccordian !== gender &&  megaMenuCategoriesData?.[gender]?.length === 0) {
      globalGenderAccordian = gender;
      setLoaderforCategory();
      requestMegaMenuCategoriesList(gender, locale);
    }
  }, [gender]);

  const renderImage = (image_url = "", description = "") => {
    return (
      <Image
        src={image_url}
        block="MegamenImage"
        alt={description ? description : ""}
      />
    );
  };

  const handleNestedCategoriesShowList = (index,item) => {
    const { label = "" } = item;
    setClickedIndex((prevIndex) => (prevIndex === index ? null : index));
    if (ScrollerRef && ScrollerRef.current && ScrollerRef.current[index]) {
      setTimeout(() => {
        const element = ScrollerRef.current[index];
        const elementRect = element?.getBoundingClientRect();
        const elementTop = elementRect?.top + window.scrollY;
        const scrollToOffset = elementTop - 100; 
        window.scrollTo({ top: scrollToOffset, behavior: 'smooth' });
      }, 1);
    }
    categoryExpandEvent({
      gender: gender,
      category_name: label,
      category_position: index+1,
    })
  };
  const renderMegaMenuCategoriesLists = (item, index) => {
    const {
      type = "",
      label = "",
      desc = "",
      image = "",
      tag = "",
      promotion_name = "",
    } = item;
    const isClicked = clickedIndex === index;
    return (
      <div
        block={`megamenucategoryList-container menu-${index}`}
        key={`menu-${index}`}
        ref={(ref) => (ScrollerRef.current[index] = ref)}
        onClick={() => handleNestedCategoriesShowList(index,item)}
        id={`menu-${index}`}
      >
        <div block="megaMenuCategoryList" id={index} >
          <div block="megaMenuContentBlock" mods={{isArabicValue}}>
            <div block="megeMenuCategoriesHeader" mods={{isArabicValue}}>
              <h3 block="categoriesL2names">{truncate(label,17)}</h3>
              <span block={`accordian${isClicked ? " active" : ""}`}></span>
            </div>
            <div block="megaMenuCategoriesDescription">{truncate(desc,28)}</div>
          </div>
          {renderImage(image, desc)}
        </div>
        {isClicked ? (
          <div block="megamenu-nested-categories-list-container">
            {item?.item?.map((category, index) => (
              <MegaMenuNestedCategoriesList
                nestedCategoiresList={category}
                isLoading={props.isCategoryLoading}
                ScrollerRef={ScrollerRef}
                key={`listMenu-${index}`}
                parentCategory={label}
                gender={gender}
                subCategoryPosition={index+1}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  };
  const nestedCatoriesList = props?.megaMenuCategoriesData?.[gender] || [];
  return (
    <div block="megamenu-categories-accordian-container">
      {props.isCategoryLoading
        ? renderMegaMenuAnimationShimer(
            "CategoiresAccordianWrapper",
            "CategoiresAccordianCard",
            4
          )
        : nestedCatoriesList?.length > 0
        ? nestedCatoriesList.map((item, index) =>
            renderMegaMenuCategoriesLists(item, index)
          )
        : null}
      
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MegaMenuCategoriesAccordion);
