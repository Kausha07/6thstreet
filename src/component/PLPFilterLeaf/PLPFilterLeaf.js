import React, { useState, useEffect } from "react";
import { v4 } from "uuid";
import { isArabic } from "Util/App";
import selectGray from "Component/FieldNestedMultiSelect/icons/selectGray.svg";
import selectRed from "Component/FieldNestedMultiSelect/icons/selectRed.svg";
import "./PLPFilterLeaf.style";

function PLPFilterLeaf({ leaf, handleLeafLevelClick, activeFiltersIds, isSearch }) {
  const {
    facet_key = "",
    facet_value = "",
    is_selected = false,
    label = "",
    product_count = 0,
    category_id,
  } = leaf;

  const [isLeafSelected, setIsLeafSelected] = useState(leaf?.is_selected);
  useEffect(() => {
    setIsLeafSelected(leaf?.is_selected);
  }, [leaf]);

  if (facet_key && facet_value && label) {
    return (
      <li
        key={v4()}
        onClick={(e) => {
          setIsLeafSelected(!isLeafSelected);
          handleLeafLevelClick(e, leaf);
        }}
        data-is_selected={isLeafSelected}
      >
        <div
          block="wrapperLeafLevel"
          elem="wrapperDiv"
          mods={{ isArabic: isArabic() }}
        >
          <div
            block="wrapperLeafLevel"
            elem="wrapperIconLabel"
            className={isLeafSelected ? "isLeafSelected" : ""}
          >
            <div>
              {isLeafSelected ? (
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
            <label className={isArabic() ? "labelAr" : "labelLeaflevel"}>{label}</label>
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
}

export default PLPFilterLeaf;
