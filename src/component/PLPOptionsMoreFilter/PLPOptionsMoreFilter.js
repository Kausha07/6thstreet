import React from "react";
import "./PLPOptionsMoreFilter.style";
import Rectangle from "./icons/Rectangle.svg";
import SelectedRectangle from "./icons/SelectedRectangle.svg";

function PLPOptionsMoreFilter({ options, onMoreFilterClick }) {
  const handleOptionMoreFilterClick = (option) => {
    onMoreFilterClick(option);
  };
  const renderCheckbox = (option, index) => {
    const { facet_key, facet_value, is_selected, label } = option;
    const isChecked = is_selected;
    // below code is for set fist coloumns left margin = 0;
    let isFirstInRow = false;
    if (index % 4 === 0) {
      isFirstInRow = true;
    }
    return (
      <>
        <li>
          <div
            className={
              isFirstInRow
                ? "optionsMoreFilterWrapper firstInRow"
                : "optionsMoreFilterWrapper"
            }
            onClick={() => {
              handleOptionMoreFilterClick(option);
            }}
          >
            <div>
              {isChecked ? (
                <span>
                  <img
                    src={SelectedRectangle}
                    alt="SelectedRectangle"
                    id={`SelectedRectangle${label}`}
                  />
                </span>
              ) : (
                <span>
                  <img
                    src={Rectangle}
                    alt="Rectangle"
                    id={`Rectangle${label}`}
                  />
                </span>
              )}
            </div>
            <label>{label}</label>
          </div>
        </li>
      </>
    );
  };

  return (
    <ul className="plpMoreFilterOptionsUl">
      {Object.values(options).map((option, index) =>
        renderCheckbox(option, index)
      )}
    </ul>
  );
}

export default PLPOptionsMoreFilter;
