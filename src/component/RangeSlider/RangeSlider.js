import React, { useState, useRef, useMemo } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./RangeSlider.style";
import { getCountryCurrencyCode } from "Util/Url/Url";
import { isArabic } from "Util/App";

const RenderMinMaxRenger = React.memo(({ value1, value2, currency }) => {
  return (
    <p block="renderMinMaxRenger">
      {currency}{" "}
      <span block="renderMinMaxRenger" elem="spanRenderMinMaxRenger">
        {value1}
      </span>{" "}
      - {currency}{" "}
      <span block="renderMinMaxRenger" elem="spanRenderMinMaxRenger">
        {value2}
      </span>
    </p>
  );
});

const RenderMinMaxRengerDiscount = React.memo(
  ({ value1, value2, currency }) => {
    return (
      <p block="renderMinMaxRenger">
        <span block="renderMinMaxRenger" elem="spanRenderMinMaxRenger">
          {value1}
          {"%"}
        </span>{" "}
        -{" "}
        <span block="renderMinMaxRenger" elem="spanRenderMinMaxRenger">
          {value2}
          {"%"}
        </span>
      </p>
    );
  }
);

function RangeSlider({
  filter,
  parentCallback,
  minVal,
  maxVal,
  currentMIN,
  currentMAX,
}) {
  const [currState, setCurrState] = useState([minVal, maxVal]);
  const [isMinMaxSet, setIsMinMaxSet] = useState(false);
  const [values, setValues] = useState([currentMIN, currentMAX]);
  const [currentPointerState, setCurrentPointerState] = useState([
    minVal,
    maxVal,
  ]);
  const { newPriceRangeData = {}, category, newDiscountData = {} } = filter;
  let MIN = values[0];
  let MAX = values[1];
  const currency = getCountryCurrencyCode();

  if (
    category === "discount" &&
    newDiscountData &&
    newDiscountData.min &&
    newDiscountData.max &&
    !isMinMaxSet
  ) {
    MIN = newDiscountData.min;
    MAX = newDiscountData.max;
    setValues([newDiscountData.min, newDiscountData.max]);
    setIsMinMaxSet(true);
  } else if (
    newPriceRangeData &&
    newPriceRangeData.min &&
    newPriceRangeData.max &&
    !isMinMaxSet
  ) {
    MIN = newPriceRangeData.min;
    MAX = newPriceRangeData.max;
    setValues([newPriceRangeData.min, newPriceRangeData.max]);
    setIsMinMaxSet(true);
  }

  const debounceFunc = (func, delay) => {
    let timer;
    return function (...args) {
      const context = this;
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  };

  const handleChange = (val) => {
    const facet_key = category;
    const facet_value = `gte${val[0]},lte${val[1]}`;
    const checked = undefined;
    const isRadio = true;
    parentCallback(facet_key, facet_value, checked, isRadio);
    setCurrState(val);
  };

  const optimisedSearchHandler = useMemo(
    () => debounceFunc(handleChange, 500),
    []
  );

  const onChange = (val) => {
    setCurrentPointerState(val);
    optimisedSearchHandler(val);
  };

  if (minVal === maxVal && category === "discount") {
    return (
      <>
        <p>{__("Select Discount Range")}</p>
        <div block="rengeSliderWrapper">
          <RenderMinMaxRengerDiscount
            value1={minVal}
            value2={maxVal}
            currency={currency}
          />
          <div block="wrapperSlider">
            <Slider
              range
              min={MIN}
              max={MAX}
              value={[MIN, MAX]}
              onChange={onChange}
              defaultValue={[MIN, MAX]}
              pushable
              trackStyle={{ backgroundColor: "black" }}
              dotStyle={{ border: "solid 2px black" }}
              activeDotStyle={{ border: "solid 2px black" }}
              reverse={isArabic()}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {category === "discount" ? (
        <p>{__("Select Discount Range")}</p>
      ) : (
        <p>{__("Select Price Range")}</p>
      )}
      <div block="rengeSliderWrapper">
        {category === "discount" && (
          <RenderMinMaxRengerDiscount
            value1={currentPointerState[0] || minVal}
            value2={currentPointerState[1]}
            currency={currency}
          />
        )}
        {category != "discount" && (
          <RenderMinMaxRenger
            value1={currentPointerState[0] || minVal}
            value2={currentPointerState[1]}
            currency={currency}
          />
        )}
        <div block="wrapperSlider">
          <Slider
            range
            min={MIN}
            max={MAX}
            value={currState}
            onChange={onChange}
            defaultValue={[MIN, MAX]}
            pushable
            trackStyle={{ backgroundColor: "black" }}
            dotStyle={{ border: "solid 2px black" }}
            activeDotStyle={{ border: "solid 2px black" }}
            reverse={isArabic()}
          />
        </div>
      </div>
    </>
  );
}

export default RangeSlider;
