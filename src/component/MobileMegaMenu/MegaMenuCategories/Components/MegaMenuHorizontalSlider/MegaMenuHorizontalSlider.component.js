import React from "react";
import "./MegaMenuHorizontalSlider.style.scss";
import DynamicContentSliderWithLabel from "Component/DynamicContentSliderWithLabel";
const MegaMenuHorizontalSlider = (props) => {
  const horizantalSliderData = props?.HorizantalSliderInformation || {};
  return (
    <div block="megemenu-horizantal-slider-container">
      <DynamicContentSliderWithLabel
        megeMenuHorizontalSliderData={horizantalSliderData?.items}
        promotion_name={horizantalSliderData?.title}
        tag={horizantalSliderData?.title}
        type={horizantalSliderData?.type}
        widgetID={horizantalSliderData?.type}
        isHomePage={true}
        megamenuType={true}
        gender={props?.gender}
      />
    </div>
  );
};

export default MegaMenuHorizontalSlider;
