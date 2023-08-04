import React, { useState, useEffect } from "react";
import "./PLPOptionsMoreFilter.style";
import Rectangle from "./icons/Rectangle.svg";
import SelectedRectangle from "./icons/SelectedRectangle.svg";
import { isArabic } from "Util/App";

function PLPOptionsMoreFilter({ option, onMoreFilterClick }) {
  const [isChecked, setIsChecked] = useState(option?.is_selected);
  const handleOptionMoreFilterClick = (option) => {
    setIsChecked(!isChecked);
    onMoreFilterClick(option);
  };
  useEffect(() => {
    setIsChecked(option?.is_selected);
  }, [option]); 
  const renderCheckbox = (option, index) => {
    const { label } = option;

    return (
      <>
        <li>
          <div
            className={
              isArabic()
                ? "optionsMoreFilterWrapper optionsMoreFilterWrapperAr"
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
    <>
      {renderCheckbox(option)}
    </>
  );
}

export default PLPOptionsMoreFilter;
