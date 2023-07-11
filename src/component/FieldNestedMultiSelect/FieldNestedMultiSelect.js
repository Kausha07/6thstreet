import React, { useState, useEffect } from "react";
import "./FieldNestedMultiSelect.style";
import PLPFilterNestedOptions from "Component/PLPFilterNestedOptions/PLPFilterNestedOptions";
import selectGray from "./icons/selectGray.svg";
import selectRed from "./icons/selectRed.svg";
import { v4 } from "uuid";
import { isArabic } from "Util/App";

function FieldNestedMultiSelect({
  multiLevelData,
  parentCallback,
  isSearch,
  searchList,
  searchKey,
  onLevelThreeCategoryPress,
  filter,
  onBlur,
  activeFiltersIds,
}) {
  const [nestedToggleOptionsList, setNestedToggleOptionsList] = useState(false);
  const [isSelected, setIsSelected] = useState(
    multiLevelData?.is_selected ? true : false
  );
  const [levelThreeDropdownopen, setLevelThreDropdownopen] = useState([]);
  const handleTogglebuttonClick = (e) => {
    e ? e.stopPropagation() : null;
    setNestedToggleOptionsList(!nestedToggleOptionsList);
  };
  const { is_selected } = multiLevelData;
  const is_Arabic = isArabic() ? true : false;
  const handleToggleIsSelected = (e, isDropdown) => {
    const { facet_key, facet_value, is_selected } = multiLevelData;
    e.stopPropagation();
    setIsSelected(!isSelected);
    onLevelThreeCategoryPress(multiLevelData, isDropdown, isSearch, searchKey);
  };
  const handleSubcategoryDropdown = (newOpenDropdown) => {
    setLevelThreDropdownopen(newOpenDropdown)
  };

  useEffect(() => {
    if (searchKey === "") {
      setNestedToggleOptionsList(false);
    } else {
      setNestedToggleOptionsList(true);
    }
  }, [searchKey]);

  const renderNestedOptions = () => {
    const { sub_subcategories } = multiLevelData;
    let sub_subCat = [];
    Object.entries(sub_subcategories).map((sub_cat) => {
      sub_subCat.push(sub_cat[1]);
    });
    if (isSearch) {
      sub_subCat = [];
      Object.entries(sub_subcategories).map((sub_cat) => {
        if (sub_cat[0].toLowerCase().includes(searchKey.toLowerCase())) {
          sub_subCat.push(sub_cat[1]);
        } else {
          Object.entries(sub_cat[1].sub_subcategories).map((subSubCat) => {
            if( subSubCat[0].toLowerCase().includes(searchKey.toLowerCase())) {
              sub_subCat.push(sub_cat[1]);
            }
          });
        }
      });
    }
    if (sub_subCat.length > 0) {
      return (
        <>
          {sub_subCat.map((option) => (
            <PLPFilterNestedOptions
              key={v4()}
              option={option}
              parentCallback={parentCallback}
              filter={filter}
              onBlur={onBlur}
              handleTogglebuttonClick={handleTogglebuttonClick}
              onLevelThreeCategoryPress={onLevelThreeCategoryPress}
              isSearch={isSearch}
              searchKey={searchKey}
              levelThreeDropdownopen={levelThreeDropdownopen}
              handleSubcategoryDropdown={handleSubcategoryDropdown}
              activeFiltersIds={activeFiltersIds}
            />
          ))}
        </>
      );
    }
  };

  let isAllSelected = true;
  let isSelectedFromSearch = true;
  Object.entries(multiLevelData.sub_subcategories).map((sub_cat) => {
    if (!!!sub_cat[1].is_selected) {
      isAllSelected = false;
    }
    if(isSearch && !!!activeFiltersIds.includes(sub_cat[1]?.category_id)){
      isAllSelected = false;
    }
    if(!!!activeFiltersIds.includes(sub_cat[1]?.category_id)){
      isSelectedFromSearch = false;
    }
  });
  let isDropdown = false;
  if (multiLevelData && multiLevelData?.sub_subcategories) {
    let sub_subCat = [];
    const { sub_subcategories } = multiLevelData;
    Object.entries(sub_subcategories).map((sub_cat) => {
      sub_subCat.push(sub_cat[1]);
    });
    if (sub_subCat.length > 0) {
      isDropdown = true;
    }
  }
  if (!isDropdown) {
    const { label, product_count, is_selected = false, category_id } = multiLevelData;
    let isSearchSelected = false;
    if(isSearch && activeFiltersIds.includes(category_id)){
      isSearchSelected = true;
    }
    return (
      <div>
        <div
          onClick={(e) => {
            handleToggleIsSelected(e, isDropdown);
          }}
          className="toggleButtonNestedMultiSelect"
          block="toggleButtonNestedMultiSelectBlock"
        >
          <div style={{ display: "flex" }}>
            {is_selected || isSearchSelected ? (
              <span>
                <img src={selectRed} alt="selectRed" id={`selectRed${label}`} />
              </span>
            ) : (
              <span>
                <img
                  src={selectGray}
                  alt="selectGray"
                  id={`selectGray${label}`}
                />
              </span>
            )}
            <span
              className={`labelMultiSelect ${
                is_Arabic ? "labelMultiSelectArabic" : ""
              }`}
            >
              {label}
            </span>
          </div>
          <div className="wrapperCountArrow">
            <div block="toggleButtonNestedMultiSelectBlock" elem="spanwrap">
              <span>{product_count}</span>
            </div>
            <span
              className={
                nestedToggleOptionsList
                  ? "arrow arrow-top hideArrow"
                  : "arrow arrow-bottom hideArrow"
              }
            ></span>
          </div>
        </div>
        <div className="multiSelectSeperator"></div>
      </div>
    );
  }

  const { label } = multiLevelData;
  return (
    <div>
      <div
        onClick={(e) => {
          handleTogglebuttonClick(e);
        }}
        className="toggleButtonNestedMultiSelect"
      >
        <div
          onClick={(e) => {
            handleToggleIsSelected(e, isDropdown);
          }}
        >
          {isAllSelected || isSelectedFromSearch ? (
            <span>
              <img src={selectRed} alt="selectRed" id={`selectRed${label}`} />
            </span>
          ) : (
            <span>
              <img
                src={selectGray}
                alt="selectGray"
                id={`selectGray${label}`}
              />
            </span>
          )}
          <span
            className={`labelMultiSelect ${
              is_Arabic ? "labelMultiSelectArabic" : ""
            }`}
          >
            {label}
          </span>
        </div>
        <span
          className={
            nestedToggleOptionsList
              ? "arrowLThree arrowLThree-top"
              : "arrowLThree arrowLThree-bottom"
          }
        ></span>
      </div>
      {nestedToggleOptionsList && (
        <div>
          <fieldset className="nestedOptionsContainer">
            {renderNestedOptions()}
          </fieldset>
        </div>
      )}
      <div className="multiSelectSeperator"></div>
    </div>
  );
}

export default FieldNestedMultiSelect;
