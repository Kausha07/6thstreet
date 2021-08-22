import PropTypes from "prop-types";
import { createRef, PureComponent } from "react";

import Image from "Component/Image";
import Link from "Component/Link";
import PDPGalleryCrumb from "Component/PDPGalleryCrumb";
import PDPGalleryOverlay from "Component/PDPGalleryOverlay";
import Slider from "Component/Slider";
import SliderVertical from "Component/SliderVertical";
import WishlistIcon from "Component/WishlistIcon";
import HeaderCart from "Component/HeaderCart";
import CSS from "Util/CSS";
import isMobile from "Util/Mobile";

import browserHistory from "Util/History";
import { isArabic } from "Util/App";

import { MAX_ZOOM_SCALE } from "./PDPGallery.config";

import "./PDPGallery.style";

class PDPGallery extends PureComponent {
  static propTypes = {
    currentIndex: PropTypes.number.isRequired,
    gallery: PropTypes.arrayOf(PropTypes.string).isRequired,
    prod_style_video: PropTypes.string.isRequired,
    prod_360_video: PropTypes.string.isRequired,
    crumbs: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ).isRequired,
    onSliderChange: PropTypes.func.isRequired,
    sku: PropTypes.string.isRequired,
  };

  overlaybuttonRef = createRef();

  crumbsRef = createRef();

  maxScale = MAX_ZOOM_SCALE;

  state = {
    galleryOverlay: "",
    isVideoPlaying: false,
    isArabic: isArabic(),
  };

  videoRef = {
    prod_style_video: React.createRef(),
    prod_360_video: React.createRef()
  };

  componentDidMount() {
    CSS.setVariable(
      this.crumbsRef,
      "gallery-crumbs-height",
      `${this.overlaybuttonRef.current.offsetHeight}px`
    );
  }

  renderBackButton() {
    const { isArabic } = this.state;
    return (
      <div block="BackArrow" mods={{ isArabic }} key="back">
        <button block="BackArrow-Button" onClick={browserHistory.goBack} />
      </div>
    );
  }

  renderItemCount() {
    const {
      totals: { items = [] },
    } = this.props;

    const itemQuantityArray = items.map((item) => item.qty);
    const totalQuantity = itemQuantityArray.reduce(
      (qty, nextQty) => qty + nextQty,
      0
    );

    if (totalQuantity && totalQuantity !== 0) {
      return (
        <div block="HeaderCart" elem="Count">
          {totalQuantity}
        </div>
      );
    }

    return null;
  }

  renderCartIcon() {
    const { isArabic } = this.state;
    return <HeaderCart showCartPopUp={false} mods={{ isArabic }} />;
  }
  renderWishlistIcon() {
    const { isArabic } = this.state;
    const { sku } = this.props;
    return <WishlistIcon sku={sku} mods={{ isArabic }} />;
  }

  renderCrumb = (index, i) => (
    <PDPGalleryCrumb
      key={i}
      // prefer numerical index
      index={+index}
    />
  );

  renderGalleryImage = (src, i) => <Image src={src} key={i} />;

  renderGalleryOverlay = () => {
    const galleryOverlay = (
      <PDPGalleryOverlay closeGalleryOverlay={this.closeGalleryOverlay} />
    );

    document.body.style.overflow = "hidden";

    this.setState({ galleryOverlay });
  };

  closeGalleryOverlay = () => {
    document.body.style.overflow = "visible";
    this.setState({ galleryOverlay: "" });
  };

  renderCrumbs() {
    const { crumbs = [], currentIndex, onSliderChange } = this.props;
    return (
      <div ref={this.crumbsRef} block="PDPGallery" elem="Crumbs">
        <SliderVertical
          mix={{
            block: "Slider",
            mods: { isCrumbs: true },
            mix: {
              block: "Slider",
              elem: "Wrapper",
              mods: { isCrumbs: true },
            },
          }}
          activeImage={currentIndex}
          onActiveImageChange={onSliderChange}
          isInteractionDisabled
        >
          {crumbs.map(this.renderCrumb)}
        </SliderVertical>
      </div>
    );
  }

  renderGallery() {
    const { gallery = [] } = this.props;
    
    return gallery.map(this.renderGalleryImage);
  }

  renderSlider() {
    const { gallery, currentIndex, onSliderChange } = this.props;

    if (!gallery.length) {
      return null;
    }

    return (
      <Slider
        activeImage={currentIndex}
        onActiveImageChange={onSliderChange}
        mix={{ block: "PDPGallery", elem: "Slider" }}
        isInteractionDisabled={!isMobile.any()}
        showCrumbs={isMobile.any()}
      >
        {this.renderGallery()}
        {this.renderVideos()}
      </Slider>
    );
  }
  
  renderVideos() {
    const { prod_style_video, prod_360_video } = this.props;
    const videos =  { prod_style_video, prod_360_video };
    return (
      Object.keys(videos).filter((key) => !!videos[key]).map((key, index) => (
          <video
            key={index}
            data-index={index}
            block="Video"
            ref={this.videoRef[key]}
            height="534"
            src={videos[key]}
            type="video/mp4"
            controls={!isMobile.any()}
            disablepictureinpicture
            playsinline
          />
      ))
    );
  }

  playVideo(video_type) {
    const { gallery, onSliderChange } = this.props;
    const video = this.videoRef[video_type];
    var counter = 1;
    if(video?.current) {
      this.setState({ isVideoPlaying: video }, () => {
        onSliderChange(gallery.length + parseInt(video?.current.dataset['index']));
        video.current.play();
        video.current.addEventListener("ended", () => {
          counter = counter + 1;
          if(counter <= 2){
            video.current.play();
          }
          else {
            onSliderChange(0);
            this.setState({ isVideoPlaying: false}, () => {
              counter = 1;
            });
          }
        });
      });
    }
  }

  stopVideo() {
    const { isVideoPlaying } = this.state;
    const { onSliderChange } = this.props;
    if(isVideoPlaying?.current){
      isVideoPlaying.current.pause();
      isVideoPlaying.current.currentTime = 0;
    }
    onSliderChange(0);
    this.setState({ isVideoPlaying: false})
  }

  renderVideoButtons() {
    const { prod_360_video, prod_style_video, currentIndex, gallery } = this.props;
    const { isVideoPlaying } = this.state;
    if(!(prod_360_video || prod_style_video) || !isMobile.any()){
      return null;
    }

    return (
      <div
        block="PDPGallery"
        elem="VideoButtonsContainer"
      >
        {
          isVideoPlaying && currentIndex>=gallery.length
          ?
          <button
            block="PDPGallery-VideoButtonsContainer-VideoButtons"
            elem="ViewGallery"
            onClick={() => this.stopVideo()}
          >
            View Gallery
          </button>
          :
          <div
            block="PDPGallery-VideoButtonsContainer"
            elem="VideoButtons"
          >
            { prod_style_video && <button
              block="PDPGallery-VideoButtonsContainer-VideoButtons"
              elem="StyleVideo"
              onClick={()=>this.playVideo('prod_style_video')}
            >
              Video
            </button>
            }
            { prod_360_video && <button
              block="PDPGallery-VideoButtonsContainer-VideoButtons"
              elem="360DegreeVideo"
              onClick={()=>this.playVideo('prod_360_video')}
            >
              360
            </button>
            }
          </div>
        }
        <div block="Seperator" />
      </div>
    )
  }

  render() {
    const { galleryOverlay, isArabic } = this.state;

    return (
      <div block="PDPGallery">
        {galleryOverlay}
        {this.renderBackButton()}
        {this.renderCrumbs()}
        <div block="OverlayIcons" mods={{ isArabic }}>
          {this.renderCartIcon()}
          {this.renderWishlistIcon()}
        </div>
        <button
          ref={this.overlaybuttonRef}
          block="PDPGallery"
          elem="OverlayButton"
          onClick={this.renderGalleryOverlay}
        >
          {this.renderSlider()}
        </button>
        {this.renderVideoButtons()}
      </div>
    );
  }
}

export default PDPGallery;
