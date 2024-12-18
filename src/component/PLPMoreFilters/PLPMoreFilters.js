import React, { useState, useEffect, useRef } from "react";
import "./PLPMoreFilters.style";
import { isArabic } from "Util/App";

function PLPMoreFilters(props) {
  const [showAll, setShowAll] = useState(false);
  const [numVisibleItems, setNumVisibleItems] = useState(5);
  const listRef = useRef(null);
  const isMoreFilterSelected = false;
  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  useEffect(() => {
    if (listRef && listRef.current && listRef.current.offsetWidth) {
      const listWidth = listRef.current.offsetWidth;
      const listItemWidth = 90; // adjust as needed
      const maxNumVisibleItems = Math.floor(listWidth / listItemWidth);
      setNumVisibleItems(
        Math.min(maxNumVisibleItems, props.ListOFMoreFilters.length)
      );
    }
  }, [props.ListOFMoreFilters]);

  const getLabel = (item) => {
    const lang = isArabic() ? "ar" : "en";
    const { option = {} } = props;
    if (
      option &&
      option[item] &&
      option[item]?.moreFiltersTraslation &&
      option[item]?.moreFiltersTraslation?.[lang]
    ) {
      let label = option[item]?.moreFiltersTraslation?.[lang];
      label = label.charAt(0).toUpperCase() + label.slice(1);
      return label;
    }
    return item;
  };

  const renderMoreFilterList = () => {
    const { handleMoreFilterChange, selectedMoreFilter } = props;
    const listItems = props.ListOFMoreFilters.map((item, index) => (
      <li key={index} onClick={() => handleMoreFilterChange(item,index+1)}>
        <div
          className={`moreFilters ${
            item === selectedMoreFilter ? "isSelected" : ""
          }`}
        >
          <label>
            <h4>{getLabel(item)}</h4>
          </label>
          <span
            className={
              isMoreFilterSelected ? "arrow arrow-top" : "arrow arrow-bottom"
            }
          ></span>
        </div>
      </li>
    ));
    const visibleListItems = showAll
      ? listItems
      : listItems.slice(0, numVisibleItems);
    return visibleListItems;
  };

  return (
    <ul block="PLPMoreFilters" elem="Ul">
      {renderMoreFilterList()}
      {numVisibleItems < props.ListOFMoreFilters.length && (
        <li onClick={toggleShowAll} className="buttonMoreandLess">
          <div>
            <label className="MoreButtonLabel" 
              onClick={()=> showAll ? props?.handleMoreFilterChange("") : null}
            >
              {showAll
                ? `- ${__("Less")}`
                : `+${props.ListOFMoreFilters.length - numVisibleItems} ${__(
                    "More"
                  )}`}
            </label>
          </div>
        </li>
      )}
    </ul>
  );
}

export default PLPMoreFilters;
