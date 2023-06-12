import React, { useState, useEffect } from "react";
import PLPFilterCustomCheckbox from "Component/PLPFilterCustomCheckbox/PLPFilterCustomCheckbox";
import "./PLPFilterNestedOptions.style";
import PLPFilterLeaf from "Component/PLPFilterLeaf/PLPFilterLeaf";

function PLPFilterNestedOptions({
  option,
  parentCallback,
  filter,
  onLevelThreeCategoryPress,
  isSearch,
  searchKey,
  levelThreeDropdownopen,
  handleSubcategoryDropdown,
}) {
  const [isChecked, setIsChecked] = useState(option?.is_selected || false);
  const [isLeafLevelVisible, setIsLeafLevelVisible] = useState(false);
  const toggleIsLeafLevelVisible = (e, optionClicked) => {
    const { category_key } = optionClicked;
    if(levelThreeDropdownopen.includes(category_key)){
      const newlevelThreeDropdownopen = levelThreeDropdownopen.filter(key => key != category_key)
      handleSubcategoryDropdown(newlevelThreeDropdownopen);
    }else {
      handleSubcategoryDropdown([ ...levelThreeDropdownopen, category_key]);
    }
    setIsLeafLevelVisible(!isLeafLevelVisible);
  };
  const handleCheckboxClick = (isDropdownable) => {
    const isDropDown = isDropdownable ? true : false;
    onLevelThreeCategoryPress(option, isDropDown);
  };
  const handleLeafLevelClick = (e, leaf ) => {
    onLevelThreeCategoryPress(leaf, false);
  };

  useEffect(() => {
    if (searchKey === "" && isSearch) {
      setIsLeafLevelVisible(false);
    } else if( isSearch ){
      setIsLeafLevelVisible(true);
    }
  }, [searchKey]);

  let isDropdownable = false;
  let isAllSelected = true;
  if (option && option?.sub_subcategories) {
    Object.entries(option.sub_subcategories).map((sub_cat) => {
      if (!!!sub_cat[1].is_selected) {
        isAllSelected = false;
      }
    });
  }
  if (option && option?.sub_subcategories) {
    let sub_subCat = [];
    const { sub_subcategories } = option;
    Object.entries(sub_subcategories).map((sub_cat) => {
      sub_subCat.push(sub_cat[1]);
    });
    if (sub_subCat.length > 0) {
      isDropdownable = true;
    }
  }

  const renderLeaf = (leaf) => {
    const {
      facet_key = "",
      facet_value = "",
      label = "",
    } = leaf;

    if (facet_key && facet_value && label) {
      return (
        <>
          <PLPFilterLeaf
            leaf={leaf}
            handleLeafLevelClick={handleLeafLevelClick}
          />
        </>
      );
    }
  };

  const renderLeafLevel = () => {
    const { sub_subcategories = {} } = option;
    const sub_subCat = [];
    Object.entries(sub_subcategories).map((sub_cat) =>
      sub_subCat.push(sub_cat[1])
    );
    if (sub_subCat.length > 0) {
      return <>{sub_subCat.map((option) => renderLeaf(option))}</>;
    }
  };

  return (
    <>
      <div className="checkboxWrapper">
        <PLPFilterCustomCheckbox
          label={option?.label}
          checked={isChecked}
          isSubCatSelected={isAllSelected}
          onChange={handleCheckboxClick}
          parentCallback={parentCallback}
          option={option}
          isDropdownable={isDropdownable}
          isLeafLevelVisible={isLeafLevelVisible}
          toggleIsLeafLevelVisible={toggleIsLeafLevelVisible}
          setIsChecked={setIsChecked}
          filter={filter}
        />
      </div>
      {( levelThreeDropdownopen.includes(option?.category_key) ) && (
        <div block="wrapperLeafLevel">
          <ul>{renderLeafLevel()}</ul>
        </div>
      )}
    </>
  );
}

export default PLPFilterNestedOptions;
