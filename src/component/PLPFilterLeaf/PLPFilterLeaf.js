import React from "react";
import { v4 } from "uuid";
import { isArabic } from "Util/App";
import selectGray from "Component/FieldNestedMultiSelect/icons/selectGray.svg";
import selectRed from "Component/FieldNestedMultiSelect/icons/selectRed.svg";
import "./PLPFilterLeaf.style";

function PLPFilterLeaf({ leaf, handleLeafLevelClick }) {
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
}

export default PLPFilterLeaf;
