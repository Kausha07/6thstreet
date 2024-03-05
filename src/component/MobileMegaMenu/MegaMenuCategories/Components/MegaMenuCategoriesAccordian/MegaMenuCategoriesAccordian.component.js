import React, { useRef } from "react";
import Image from "Component/Image";
import Loader from "Component/Loader";
import "./MegaMenuCategoriesAccordian.style.scss";
import MegaMenuNestedCategoriesList from "../MegaMenuNestedCategoriesList/MegaMenuNestedCategoriesList.component";
import { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { getLocaleFromUrl } from "Util/Url/Url";
import { getQueryParam } from "Util/Url";
import { isArabic } from "Util/App";
import CategoriesListDispatcher from "Store/MegaMenuCategoriesList/CategoriesList.dispatcher";

export const mapStateToProps = (state) => ({
  gender: state.AppState.gender,
  locale: state.AppState.locale,
  categories: state?.CategoriesListReducer?.categories,
  isLoading: state?.CategoriesListReducer?.isLoading,
});

export const mapDispatchToProps = (dispatch) => ({
  requestMegaMenuCategoriesList: (gender, locale) =>
    CategoriesListDispatcher.requestMegaMenuCategoriesList(
      gender,
      locale,
      dispatch
    ),
});

const MegaMenuCategoriesAccordion = (props) => {
  const [showList, setShowList] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(null);
  const isArabicValue = isArabic();
  const ScrollerRef = useRef(null);
  const { requestMegaMenuCategoriesList, gender, data = [] } = props;
  useState(() => {
    const locale = getLocaleFromUrl();
    requestMegaMenuCategoriesList(gender, locale);
  }, []);

  const renderImage = (image_url = "", description = "") => {
    return (
      <Image
        lazyLoad={true}
        src={image_url}
        block="MegamenImage"
        alt={description ? description : ""}
      />
    );
  };
  const handleNestedCategoriesShowList = (index) => {
    setClickedIndex((prevIndex) => (prevIndex === index ? null : index));
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
      <ul
        block="megamenucategoryList-container"
        key={index}
        onClick={() => handleNestedCategoriesShowList(index)}
        ref={ScrollerRef}
      >
        <div block="megaMenuCategoryList">
          <div block="megaMenuContentBlock" mods={{isArabicValue}}>
            <div block="megeMenuCategoriesHeader" mods={{isArabicValue}}>
              <h3>{label}</h3>
              <span block={`accordian${isClicked ? " active" : ""}`}></span>
            </div>
            <div block="megaMenuCategoriesDescription">{desc}</div>
          </div>
          {renderImage(image, desc)}
        </div>
        {isClicked ? (
          <div block="megamenu-nested-categories-list-container">
            {item?.item?.map((category) => (
              <MegaMenuNestedCategoriesList
                nestedCategoiresList={category}
                isLoading={props.isLoading}
                ScrollerRef={ScrollerRef}
              />
            ))}
          </div>
        ) : null}
      </ul>
    );
  };
  const nestedCatoriesList = props?.categories?.data || [];
  return (
    <div block="megamenu-categories-accordian-container">
      <Loader isLoading={props.isLoading} />
      {nestedCatoriesList?.length > 0
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
