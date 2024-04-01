import React from "react";
import Link from "Component/Link";
import Image from "Component/Image";
import isMobile from "Util/Mobile";
import { formatCDNLink } from "Util/Url";
import "./MegaMenuBannerSlider.style.scss";
import Event from "Util/Event";
import {
  HOME_PAGE_BANNER_CLICK_IMPRESSIONS,
  HOME_PAGE_BANNER_IMPRESSIONS,
} from "Component/GoogleTagManager/events/BannerImpression.event";
import { topBannerClickTrackingEvent } from "Component/MobileMegaMenu/MoEngageTrackingEvents/MoEngageTrackingEvents.helper";

const MegamenuBannerSlider = (props) => {
  const { gender="women" } = props
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

const sendImpressions = () => {
  const { BannerInformation } = props;
  let isItemEmpty = false; 
  if(BannerInformation && Object.keys(BannerInformation)?.length > 0) {
    let items = [BannerInformation];
    const getStoreName = (BannerInformation?.button_label)? BannerInformation?.button_label :  "";
      const getIndexId = props?.index ? props.index : 1;
      items.forEach((item, index) => {
        if(!item?.button_label) {
          isItemEmpty = true;
        }
        Object.assign(item, {
          promotion_name: item?.button_label || "",
          tag: item?.description || "",
          url:item?.image_url || "",
          link:item?.link || '',
          store_code: getStoreName,
          indexValue: index + 1,
          default_Index: getIndexId,
        });
      });
    if(!isItemEmpty) {
      Event.dispatch(HOME_PAGE_BANNER_IMPRESSIONS, items);
    }
  }
}

const sendBannerClickImpression = (item) => {
  const newItem = {
    promotion_name: item.button_label || "",
    tag: item?.description || "",
    url:item?.image_url || "",
    link:item?.link || ''
  } || {};
  Event.dispatch(HOME_PAGE_BANNER_CLICK_IMPRESSIONS, [newItem]);
}
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
        onClick = {()=>{
          topBannerClickTrackingEvent({
            gender: gender,
            prev_screen_name: sessionStorage.getItem("prevScreen"),
            banner_label: button_label,
          })
          sendBannerClickImpression(item)
        }}
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
    {props && props?.BannerInformation && Object.keys( props?.BannerInformation?.length > 0) && renderImage(props?.BannerInformation)}
    {sendImpressions()}
  </div>;
};

export default MegamenuBannerSlider;
