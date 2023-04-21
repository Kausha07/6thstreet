import React, { useState, useEffect, useRef } from "react";
import "./PLPMoreFilters.style";

function PLPMoreFilters(props) {
  const [showAll, setShowAll] = useState(false);
  const [numVisibleItems, setNumVisibleItems] = useState(4);
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

  const renderMoreFilterList = () => {
    const { handleMoreFilterChange, selectedMoreFilter } = props;
    const listItems = props.ListOFMoreFilters.map((item, index) => (
      <li key={index} onClick={() => handleMoreFilterChange(item)}>
        <div
          className={`moreFilters ${
            item === selectedMoreFilter ? "isSelected" : ""
          }`}
        >
          <label>
            <h4>{item}</h4>
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
            <label className="MoreButtonLabel">
              {showAll
                ? `-${__("Less")}`
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
