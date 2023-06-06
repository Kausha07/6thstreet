import React, { useState, useRef, useEffect } from "react";
import PLPFilterCustomCheckbox from "Component/PLPFilterCustomCheckbox/PLPFilterCustomCheckbox";
import "./PLPFilterNestedOptions.style";
import selectGray from "Component/FieldNestedMultiSelect/icons/selectGray.svg";
import selectRed from "Component/FieldNestedMultiSelect/icons/selectRed.svg";
import { v4 } from "uuid";
import { isArabic } from "Util/App";

function PLPFilterNestedOptions({
  option,
  parentCallback,
  filter,
  onBlur,
  handleTogglebuttonClick,
  onLevelThreeCategoryPress,
  isSearch,
  searchKey
}) {
  const [isChecked, setIsChecked] = useState(option?.is_selected || false);
  const [isLeafLevelVisible, setIsLeafLevelVisible] = useState(false);
  const leafFilterRef = useRef(null);
  const toggleIsLeafLevelVisible = (e) => {
    setIsLeafLevelVisible(!isLeafLevelVisible);
  };
  const handleCheckboxClick = (isDropdownable) => {
    const { facet_key, facet_value, is_selected } = option;
    const isDropDown = isDropdownable ? true : false;
    onLevelThreeCategoryPress(option, isDropDown);
  };
  const handleLeafLevelClick = (e, leaf ) => {
    onLevelThreeCategoryPress(leaf, false);
  };

  useEffect(() => {
    if (searchKey === "") {
      setIsLeafLevelVisible(false);
    } else {
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
      is_selected = false,
      label = "",
      product_count = 0,
    } = leaf;

    if (facet_key && facet_value && label) {
      return (
        <li
          key={v4()}
          ref={leafFilterRef}
          onClick={(e) => {
            handleLeafLevelClick(e, leaf);
          }}
          data-is_selected={is_selected}
        >
          <div
            block="wrapperLeafLevel"
            elem="wrapperDiv"
            mods={{ isArabic: isArabic() }}
          >
            <div
              block="wrapperLeafLevel"
              elem="wrapperIconLabel"
              className={is_selected ? "isLeafSelected" : ""}
            >
              <div>
                {is_selected ? (
                  <span>
                    <img
                      src={selectRed}
                      alt="selectRed"
                      id={`selectRed${label}`}
                    />
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
              </div>
              <label className={isArabic() ? "labelAr" : ""}>{label}</label>
            </div>
            <div
              block="wrapperLeafLevel"
              elem="productCount"
              mods={{ isArabic: isArabic() }}
            >
              <span>{product_count}</span>
            </div>
          </div>
        </li>
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
      {isLeafLevelVisible && (
        <div block="wrapperLeafLevel">
          <ul>{renderLeafLevel()}</ul>
        </div>
      )}
    </>
  );
}

export default PLPFilterNestedOptions;
