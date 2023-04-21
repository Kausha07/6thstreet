import React, { useState, useRef } from "react";
import PLPFilterCustomCheckbox from "Component/PLPFilterCustomCheckbox/PLPFilterCustomCheckbox";
import "./PLPFilterNestedOptions.style";
import selectGray from "Component/FieldNestedMultiSelect/icons/selectGray.svg";
import selectRed from "Component/FieldNestedMultiSelect/icons/selectRed.svg";
import { v4 } from "uuid";

function PLPFilterNestedOptions({
  option,
  parentCallback,
  filter,
  onBlur,
  handleTogglebuttonClick,
  onLevelThreeCategoryPress
}) {
  const [isChecked, setIsChecked] = useState(option?.is_selected || false);
  const [isLeafLevelVisible, setIsLeafLevelVisible] = useState(false);
  const leafFilterRef = useRef(null);
  const toggleIsLeafLevelVisible = (e) => {
    setIsLeafLevelVisible(!isLeafLevelVisible);
  };
  const handleCheckboxClick = () => {
    const { facet_key, facet_value, is_selected } = option;
    handleTogglebuttonClick();
    onLevelThreeCategoryPress(option);
    onBlur();
  };
  const handleLeafLevelClick = (e, facet_key, facet_value, is_selected) => {
    parentCallback(facet_key, facet_value, !is_selected);
    onBlur();
  };
  let isDropdownable = false;
  if (
    option &&
    option?.sub_subcategories &&
    Object.keys(option.sub_subcategories).length != 0
  ) {
    isDropdownable = true;
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
            handleLeafLevelClick(e, facet_key, facet_value, is_selected, label);
          }}
          data-is_selected={is_selected}
        >
          <div block="wrapperLeafLevel" elem="wrapperDiv">
            <div block="wrapperLeafLevel" elem="wrapperIconLabel">
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
              <label>{label}</label>
            </div>
            <div block="wrapperLeafLevel" elem="productCount">
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
          onChange={handleCheckboxClick}
          parentCallback={parentCallback}
          option={option}
          isDropdownable={isDropdownable}
          isLeafLevelVisible={isLeafLevelVisible}
          toggleIsLeafLevelVisible={toggleIsLeafLevelVisible}
          setIsChecked={setIsChecked}
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
