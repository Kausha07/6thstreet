import React from "react";
import TinySlider from "tiny-slider-react";

import { formatCDNLink } from "Util/Url";
import { isArabic } from "Util/App";

import Link from "Component/Link";
import "./InfluencerSliderCollection.style";

const InfluencerSliderCollection = (props) => {
  const settings = {
    lazyload: true,
    mouseDrag: true,
    touch: true,
    nav: true,
    loop: true,
    navPosition: "bottom",
    autoplay: false,
  };

  const renderSlide = (item, i) => {
    const { cartIcon } = props;
    const {
      algolia_query,
      description,
      id: influncer_collection_id,
      link,
      products,
      thumbnail_url,
      title,
      type,
      url,
    } = item.collection;
    const {
      id: influencer_id,
      family_name,
      image_url,
      influencer_name,
      name,
    } = item.influencer;
    const newLink = `influencer.html/Collection?influencerCollectionID=${influncer_collection_id}&influencerID=${influencer_id}`;
    return (
      <div key={`${influencer_id}+${i}`} block="spck-influencer-slider">
        <div block="mainImage">
          <Link
            to={formatCDNLink(newLink)}
            key={influencer_id + i}
            data-banner-type="influencer_slider_banner_image"
            data-promotion-name={item.promotion_name ? item.promotion_name : ""}
            data-tag={item.tag ? item.tag : ""}
          >
            <img
              src={thumbnail_url}
              alt={item ? title : "influencer-slider-image"}
            />
          </Link>
        </div>

        <div block="Influencer_Shop" mods={{ isArabic: isArabic() }}>
          <Link
            to={formatCDNLink(
              `influencer.html/Store?influencerID=${influencer_id}`
            )}
            key={influencer_id + "Influencer_Shop"}
            data-banner-type="influencer_slider_influencerImage"
            data-promotion-name={item.promotion_name ? item.promotion_name : ""}
            data-tag={item.tag ? item.tag : ""}
          >
            <div block="inluencerImage">
              <img src={image_url} alt="inluencerImage" />
              <p>{influencer_name}</p>
            </div>
          </Link>

          <Link
            to={formatCDNLink(newLink)}
            key={influencer_id}
            data-banner-type="influencer_slider_influencerShop"
            data-promotion-name={item.promotion_name ? item.promotion_name : ""}
            data-tag={item.tag ? item.tag : ""}
          >
            <div block="inluencerShop" mods={{ isArabic: isArabic() }}>
              <img src={cartIcon} alt="inluencerShop" />
              <p>{__("Shop")}</p>
            </div>
          </Link>
        </div>

        <div block="CollectionInfo" mods={{ isArabic: isArabic() }}>
          <h3 block="CollectionTitle">{title}</h3>
        </div>
      </div>
    );
  };
  const renderSlider = () => {
    const { item } = props;
    const { type, items } = item;
    return (
      <TinySlider settings={settings}>
        {items.length > 0 && items?.map(renderSlide)}
      </TinySlider>
    );
  };

  return <div> {renderSlider()}</div>;
};

export default InfluencerSliderCollection;
