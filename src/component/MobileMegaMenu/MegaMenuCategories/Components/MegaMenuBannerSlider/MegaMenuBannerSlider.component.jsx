import React, { useState, useEffect } from "react";
import Loader from "Component/Loader";
import Link from "Component/Link";
import Image from "Component/Image";
import isMobile from "Util/Mobile";
import { formatCDNLink } from "Util/Url";
import "./MegaMenuBannerSlider.style.scss";

const MegamenuBannerSlider = (props) => {
  const renderDescription = (description, button_label) => {
    return (
      <>
        {isMobile.any() && description && (
          <h4 block="BannerDesc">{description}</h4>
        )}
        {isMobile.any() && button_label && (
          <button block="BannerButton">{button_label}</button>
        )}
      </>
    );
  };

  const renderButton = () => {
    const { isMobileMegaMenuEnabled = false } = props;

    return isMobile.any() || !isMobileMegaMenuEnabled ? null : (
      <button>{__("Shop now")}</button>
    );
  };
const renderImage = (item) => {
    const { description = "", image_url = "", link="", button_label="", type="" } = item;

    if (!link) {
      return (
        <>
          <Image
            lazyLoad={true}
            src={image_url}
            ratio="custom"
            alt={description ? description : ""}
          />
        </>
      );
    }

    return (
      <Link
        to={formatCDNLink(item?.link)}
        data-banner-type={type || "banner"}
        data-promotion-name={item.description ? item.description : ""}
      >
        <Image
          src={image_url}
          block="Image"
          alt={
            item.description ? item.description : "DynamicContentBannerImage"
          }
        />

      </Link>
    );
  };

  return <div block="MegaMenuBannerImage" >
    <Loader isLoading={props?.isLoading}/>
    {props && props?.BannerInformation && Object.keys( props?.BannerInformation?.length > 0) && renderImage(props?.BannerInformation)}
  </div>;
};

export default MegamenuBannerSlider;
