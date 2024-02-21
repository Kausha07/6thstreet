import React, { useState, useEffect } from "react";
import Link from "Component/Link";
import Image from "Component/Image";
import isMobile from "Util/Mobile";
import { formatCDNLink } from "Util/Url";
import "./MegaMenuBannerSlider.style.scss";

const MegamenuBannerSlider = (props) => {
  const Banneritems = {
    "type": "banner",
    "image_url": "https://s3-alpha-sig.figma.com/img/6fbc/9851/667540c2aa8e81b6b816b96bf5f61a29?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=gkPCvKQZk3PoWp7MKCIL7WZPBuahdltKdTiA98FvxYhg3rwNLO4Lg1cR~0X9UNp48qUJswLiDPjoWzh-A37Cl7sLT-T8ZtxYE~35Ppxg6gPV5kM0fb1U3RAQ1SUBLd7ihCkqGlw4C9wOctBl7A0Q0iuBjFm7NHciRDbzM2RZNY6NgOKjCUAdVuSDy48jr~eYy9ePKxuAs7Q8Z9cuhICvm6-HSXgMz1ub8b2C~mK9Dd3Afrk-KMkUNUR335MUQ6Q~PUnxMTF1lpmiTeUFx9xmY-uFzxJiS5qi1Avtg4ny-51jXiM1MzcjQonxj~cIibe1jtN8PcrVKlKyWVa1L-qh2A__",
    "description": "love is in the air",
    "link": "https://en-ae-stage.6tst.com/catalogsearch/result/?q=adidias&qid=cbb3a8e0303527db32a69041672d7778&p=0&dFR%5Bgender%5D%5B0%5D=Women&dFR%5Bin_stock%5D%5B0%5D=1",
    "button_label": "Shop The Valentine’s Edit >"
  }
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
            key={i}
            src={image_url}
            ratio="custom"
            alt={description ? description : ""}
          />
          {renderButton()}
          {renderDescription(description, button_label)}
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
          lazyLoad={true}
          src={image_url}
          block="Image"
          style={{
            width: `${window.innerWidth}px`,
            height: `${window.innerWidth / 2}px`,
          }}
          alt={
            item.description ? item.description : "DynamicContentBannerImage"
          }
        />

        {renderButton()}
        {renderDescription(description, button_label)}
      </Link>
    );
  };

  return <div block="MegaMenuBannerImage" >
    {renderImage(Banneritems)}
  </div>;
};

export default MegamenuBannerSlider;
