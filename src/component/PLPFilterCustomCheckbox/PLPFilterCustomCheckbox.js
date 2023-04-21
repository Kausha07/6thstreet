import React, { useState } from "react";
import "./PLPFilterCustomCheckbox.style.scss";
import selectGray from "./icons/selectGray.svg";
import selectRed from "Component/FieldNestedMultiSelect/icons/selectRed.svg";
import DropDownArrow from "./icons/DropDownArrow.svg";

function PLPFilterCustomCheckbox({
  label,
  checked,
  onChange,
  option,
  isDropdownable,
  isLeafLevelVisible,
  toggleIsLeafLevelVisible,
  setIsChecked,
}) {
  const handleCheckboxClick = (e) => {
    if (e) {
      e.stopPropagation();
    }
    onChange && onChange(!checked);
  };

  if (isDropdownable) {
    return (
      <>
        <div className="optionSeperator"></div>
        <label
          onClick={(e) => {
            toggleIsLeafLevelVisible(e);
          }}
        >
          <div
            className="checkboxText"
            onClick={(e) => {
              handleCheckboxClick(e);
            }}
          >
            <div
              className="checkboxDiv"
              onClick={(e) => {
                toggleIsLeafLevelVisible(e);
              }}
            >
              {checked && (
                <span className="checkmarkSelected">
                  <img
                    src={selectRed}
                    alt="Call"
                    id={`call${"gguygytgghjk"}`}
                  />
                </span>
              )}
              {!checked && (
                <span className="checkmarkUnselected">
                  <img
                    src={selectGray}
                    alt="Call"
                    id={`call${"gguygytgghjk"}`}
                  />
                </span>
              )}
            </div>
            {label}
          </div>
          {isDropdownable && (
            <div className="nestedOptionCount">
              <span className={""}>
                <img
                  src={DropDownArrow}
                  alt="Call"
                  id={`call${"gguygytgghjk"}`}
                  style={
                    isLeafLevelVisible ? {} : { transform: "rotate(180deg)" }
                  }
                />
              </span>
            </div>
          )}
        </label>
      </>
    );
  }
  return (
    <>
      <div className="optionSeperator"></div>
      <label onClick={handleCheckboxClick}>
        <div className="checkboxText">
          <div className="checkboxDiv">
            {checked && (
              <span className="checkmarkSelected">
                <img src={selectRed} alt="Call" id={`call${"gguygytgghjk"}`} />
              </span>
            )}
            {!checked && (
              <span className="checkmarkUnselected">
                <img src={selectGray} alt="Call" id={`call${"gguygytgghjk"}`} />
              </span>
            )}
          </div>
          {label}
        </div>
        {!isDropdownable && (
          <div className="nestedOptionCount">
            <span>{option?.product_count}</span>
          </div>
        )}
        {isDropdownable && (
          <div className="nestedOptionCount">
            <span className={"arrow arrow-bottom"}></span>
          </div>
        )}
      </label>
    </>
  );
}

export default PLPFilterCustomCheckbox;
