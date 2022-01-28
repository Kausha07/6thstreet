/* eslint-disable no-magic-numbers */
import PropTypes from "prop-types";
import { createRef, PureComponent } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import Image from "Component/Image";
import PDPGalleryCrumb from "Component/PDPGalleryCrumb";
import ProductGalleryBaseImage from "Component/ProductGalleryBaseImage";
import Slider from "Component/Slider";
import SliderHorizontal from "Component/SliderHorizontal";
import isMobile from "Util/Mobile";

import { ReactComponent as Close } from "./icons/close.svg";
import { ReactComponent as Minus } from "./icons/minus.svg";
import { ReactComponent as Plus } from "./icons/plus.svg";
import { ChevronLeft, ChevronRight } from "Component/Icons";
import PinchZoomPan from "react-responsive-pinch-zoom-pan";

import "./PDPGalleryOverlay.style";

class PDPGalleryOverlay extends PureComponent {
  static propTypes = {
    currentIndex: PropTypes.number.isRequired,
    gallery: PropTypes.arrayOf(PropTypes.string).isRequired,
    crumbs: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ).isRequired,
    onSliderChange: PropTypes.func.isRequired,
    closeGalleryOverlay: PropTypes.func.isRequired,
    isZoomEnabled: PropTypes.bool.isRequired,
    handleZoomChange: PropTypes.func.isRequired,
    disableZoom: PropTypes.func.isRequired,
    isGalleryEmpty: PropTypes.bool.isRequired,
  };

  overlayRef = createRef();


  constructor(props) {
    super(props);
    this.renderImage = this.renderImage.bind(this);

    this.state = {
      scale: 1,
      positionY: 0,
      positionX: 0,
      addY: 0,
      addX: 0,
      initialScale: 1,
      isMobile: isMobile.any() || isMobile.tablet(),
      isZoomIn: false
    };

  }

  onImageClick = (e) => {
    e.stopPropagation()
    this.setState(prevState => ({
      isZoomIn: !prevState.isZoomIn
    }));
  }


  renderCrumb = (index, i) => {
    const { onSliderChange } = this.props;
    return (
      <PDPGalleryCrumb
        onSlideChange={onSliderChange}
        key={i}
        // prefer numerical index
        index={+index}
      />
    );
  };



  renderImage(src, i) {


  }

  renderGalleryImage = (src, i) => <Image lazyLoad={false} src={src} key={i} />;

  renderCrumbs() {
    const {
      crumbs = [],
      currentIndex,
      onSliderChange,
      isZoomEnabled,
    } = this.props;

    return (
      <div block="PDPGalleryOverlay" elem="Crumbs">
        <SliderHorizontal
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
          isZoomEnabled={isZoomEnabled}
        >
          {crumbs.map(this.renderCrumb)}
        </SliderHorizontal>
      </div>
    );
  }

  renderGallery() {
    const { gallery = [], isGalleryEmpty } = this.props;

    if (gallery[0] !== undefined && !isGalleryEmpty) {
      return gallery.map((src, i) => {
        const { isZoomEnabled, handleZoomChange, disableZoom, currentIndex, gallery } = this.props;
        return (

          <div style={{ width: 500, height: "auto", textAlign: "center" }} key={i} onClick={this.onImageClick} id="galleryOverlayImage">
            <PinchZoomPan position='center' initialScale='auto' doubleTapBehavior='reset' zoomButtons={false} key={i}>
              <img className={this.state.isZoomIn ? "galleryOverlayImageZoomOut" : "galleryOverlayImage"} mix={{
                block: "ProductGallery",
                elem: "SliderImage",
                mods: { isPlaceholder: !src },
              }} ratio="custom" lazyLoad={false} alt='' src={gallery[currentIndex]} style={{ width: "500px !important" }} key={i}
              />
            </PinchZoomPan>
          </div >

        )

        this.renderImage()
      })
    }
    return gallery.map(this.renderGalleryImage);
  }

  renderSlider() {
    const {
      gallery = [],
      currentIndex,
      onSliderChange,
      isZoomEnabled,
    } = this.props;

    if (!gallery.length) {
      return null;
    }

    return (
      <Slider
        activeImage={currentIndex}
        onActiveImageChange={onSliderChange}
        mix={{ block: "PDPGalleryOverlay", elem: "Slider" }}
        showCrumbs={isMobile.any()}
        isInteractionDisabled={true}
      >
        {this.renderGallery()}
      </Slider>
    );
  }
  prev = (e) => {
    e.preventDefault();
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();

    const { currentIndex, onSliderChange, gallery = [] } = this.props;

    if (currentIndex === 0) {
      return;
    } else {
      onSliderChange(currentIndex - 1);
    }
  };
  next = (e) => {
    e.preventDefault();
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();

    const { currentIndex, onSliderChange, gallery = [] } = this.props;
    if (currentIndex + 1 === gallery.length) {
      return;
    } else {
      onSliderChange(currentIndex + 1);
    }
  };

  handleArrorKeySlide = (e) => {
    switch (e.keyCode) {
      case 37:
        this.prev();

        break;

      case 39:
        this.next();
        break;
    }
  };
  listenArrowKey = () => {
    const { isMobile } = this.state;
    if (!isMobile) {
      document.addEventListener("keydown", this.handleArrorKeySlide);
    }
  };
  renderPrevButton = () => {
    return (
      <button block="PDPGalleryOverlay" elem="Prev" onClick={this.prev}>
        <ChevronLeft />
      </button>
    );
  };

  renderNextButton = () => {
    return (
      <button block="PDPGalleryOverlay" elem="Next" onClick={this.next}>
        <ChevronRight />
      </button>
    );
  };

  render() {
    const { closeGalleryOverlay } = this.props;
    const { rendered } = this.state;

    return (
      <div block="PDPGalleryOverlay">
        <button
          block="PDPGalleryOverlay"
          elem="Button"
          onClick={closeGalleryOverlay}
        >
          <Close />
        </button>
        {/* <button block="PDPGalleryOverlay" elem="ZoomIn" onClick={() => this.zoomin()}>
          <Plus />
        </button>
        <button block="PDPGalleryOverlay" elem="ZoomOut" onClick={() => this.zoomout()}>
          <Minus />
        </button> */}
        {this.renderPrevButton()}
        {this.renderNextButton()}
        {this.renderCrumbs()}
        {this.renderSlider()}
      </div>

    );
  }
}

export default PDPGalleryOverlay;
