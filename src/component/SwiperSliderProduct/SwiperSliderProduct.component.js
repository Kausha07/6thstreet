import { v4 } from "uuid";
import isMobile from "Util/Mobile";
import { isArabic } from "Util/App";
import { getUUID } from "Util/Auth";
import Image from "Component/Image";
import React, { PureComponent } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
import "./SwiperSliderProduct.style";
import "swiper/swiper-bundle.min.css";

class SwiperSliderProduct extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isArabic: isArabic(),
    };
  }

  renderSlide = (image_url, index, altText, lazyLoad, sku) => {
    return (
      <SwiperSlide key={`productSlider-items-${sku}-${v4()}-${index}`}>
        <div>
          <img
            src={ image_url
            }
            alt={altText}
          />
        </div>
      </SwiperSlide>
    );
  };

  render() {
    const { gallery_image_urls, altText, lazyLoad, sku, swiperRef } = this.props;
    
    const { isArabic } = this.state;
    const requireGalleryImageUrl =
      gallery_image_urls?.length > 4
        ? gallery_image_urls?.slice(0, 4)
        : gallery_image_urls;

    return (
      <div
        block="productItemSlider"
        id={getUUID()}
        mods={{ isArabic }}
      >
        <Swiper
          direction={"horizontal"}
          loop={true}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={1}
          autoplay={{ enabled: false, delay: 800 }}
          pagination={{ clickable: true }}
          modules={[Autoplay, Pagination, Navigation]}
          reverseDirection={true}
          allowTouchMove={true}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {requireGalleryImageUrl?.length > 0 &&
            requireGalleryImageUrl?.map((image_url, index) =>
              this.renderSlide(image_url, index, altText, lazyLoad, sku)
            )}
        </Swiper>
      </div>
    );
  }
}

export default SwiperSliderProduct;
