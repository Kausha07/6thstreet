import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper";
import "swiper/swiper-bundle.min.css";
import { v4 } from "uuid";

import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";

import Link from "Component/Link";

import "./InfluencerFullWidthSlider.style";
import { PlayButton } from "../Icons";

const InfluencerFullWidthSlider = (props) => {
  const { archived } = props;
  const renderSlides = (item, index) => {
    const { curtains, title, id } = item;
    const imageSRC = curtains?.pending?.backgroundImage;

    if (imageSRC) {
      return (
        <SwiperSlide key={item.id}>
          <div block={"slideSpckItem"} id={item.id} key={v4()}>
            <Link to={`/live-party?influencerPageToLiveParty=${id}`}>
              <div block={"slideMainImage"}>
                <img src={imageSRC} alt={title} />
                <button block="playerButton">
                  <img src={PlayButton} />
                </button>
                <p block="title">{title}</p>
              </div>
            </Link>
          </div>
        </SwiperSlide>
      );
    }
  };

  const renderSlider = () => {
    return (
      <div block="fullWidthSlider" mods={{ isArabic: isArabic() }}>
        <div block="linearGradient1"></div>
        <Swiper
          direction={"horizontal"}
          loop={true}
          grabCursor={true}
          centeredSlides={true}
          mousewheel={true}
          modules={[Mousewheel]}
          className="mySwiper"
          breakpoints={{
            1024: {
              slidesPerView: 5,
              loopedSlides: 3,
            },
            700: {
              slidesPerView: 5,
            },
            420: {
              slidesPerView: 3,
            },
            300: {
              slidesPerView: 3,
            },
          }}
        >
          {archived?.length > 0 && archived?.map(renderSlides)}
        </Swiper>
        <div block="linearGradient2"></div>
      </div>
    );
  };

  return (
    <>
      <div block="headingBlock" mods={{ isArabic: isArabic() }}>
        <h2 block="heading" mods={{ isArabic: isArabic() }}>
          {isMobile.any()
            ? __("LATEST STYLING VIDEOS")
            : __("LATEST STYLING VIDEOS BY INFLUENCERS")}
        </h2>
        <Link to="/live-party">
          <button block="button">{__("View All")}</button>
        </Link>
      </div>
      {renderSlider()}
    </>
  );
};

export default InfluencerFullWidthSlider;
