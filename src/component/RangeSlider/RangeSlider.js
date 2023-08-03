import React, { useState, useMemo } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./RangeSlider.style";
import { getCountryCurrencyCode } from "Util/Url/Url";
import { isArabic } from "Util/App";

const RenderMinMaxRenger = ({ value1, value2, currency }) => {
  return (
    <p block="renderMinMaxRenger">
      {currency}{" "}
      <span block="renderMinMaxRenger" elem="spanRenderMinMaxRenger">
        {isArabic() ? value2 : value1}
      </span>{" "}
      - {currency}{" "}
      <span block="renderMinMaxRenger" elem="spanRenderMinMaxRenger">
        {isArabic() ? value1 : value2}
      </span>
    </p>
  );
};

const RenderMinMaxRengerDiscount = ({ value1, value2, currency }) => {
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
};

function RangeSlider({
  filter,
  parentCallback,
  minVal,
  maxVal,
  currentMIN,
  currentMAX,
  onBlur,
}) {
  const [currState, setCurrState] = useState();
  const [showCurrent, setShowCurrent] = useState(false);
  const [currentPointerState, setCurrentPointerState] = useState([
    minVal,
    maxVal,
  ]);
  const { category } = filter;
  let MIN = currentMIN;
  let MAX = currentMAX;
  const currency = getCountryCurrencyCode();

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
    setShowCurrent(false);
    onBlur();
  };

  const optimisedSearchHandler = useMemo(
    () => debounceFunc(handleChange, 500),
    []
  );

  const onChange = (val) => {
    setCurrentPointerState(val);
    setShowCurrent(true);
    optimisedSearchHandler(val);
  };

  return (
    <>
      {category === "discount" ? (
        <p>{__("Select Discount Range")}</p>
      ) : (
        <p>{__("Select Price Range")}</p>
      )}
      <div block="rengeSliderWrapper">
        {category === "discount" && showCurrent && (
          <RenderMinMaxRengerDiscount
            value1={currentPointerState[0] || minVal}
            value2={currentPointerState[1]}
            currency={currency}
          />
        )}
        {category === "discount" && !!!showCurrent && (
          <RenderMinMaxRengerDiscount
            value1={minVal}
            value2={maxVal}
            currency={currency}
          />
        )}
        {category != "discount" && showCurrent && (
          <RenderMinMaxRenger
            value1={currentPointerState[0] || minVal}
            value2={currentPointerState[1]}
            currency={currency}
          />
        )}
        {category != "discount" && !!!showCurrent && (
          <RenderMinMaxRenger
            value1={minVal}
            value2={maxVal}
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
            defaultValue={[minVal, maxVal]}
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
