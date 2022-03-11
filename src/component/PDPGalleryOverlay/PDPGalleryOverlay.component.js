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
import DragAndZoom from "react-drag-and-zoom"

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
    this.ResetTheZoomInValue = this.ResetTheZoomInValue.bind(this);

    this.state = {
      scale: 1,
      positionY: 0,
      positionX: 0,
      addY: 0,
      addX: 0,
      initialScale: 1,
      isMobile: isMobile.any() || isMobile.tablet(),
      isZoomIn: false,
      ZoomLevel:0
    };

  }

  ResetTheZoomInValue() {
    this.setState({isZoomIn:false});
  }

  onImageClick = (e) => {
    e.stopPropagation()

    const {ZoomLevel,isZoomIn}  = this.state;

    if(ZoomLevel < 2 && isZoomIn)
    {
        this.setState(prevState => ({ZoomLevel: prevState.ZoomLevel + 1}));
    }
    else
    {
      this.setState(prevState => ({isZoomIn: !prevState.isZoomIn,ZoomLevel: 0}))
    }
  }


  renderCrumb = (index, i) => {
    const { onSliderChange } = this.props;
    const {isZoomIn} = this.state;
    return (
      <PDPGalleryCrumb
        onSlideChange={onSliderChange}
        key={i}
        // prefer numerical index
        index={+index}
        isZoomIn={isZoomIn}
        ResetTheZoomInValue={this.ResetTheZoomInValue}
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
        <div style={{ width: 500, height: "auto", textAlign: "center"}} key={i}   id="galleryOverlayImage">
        <DragAndZoom>
          <img onClick={this.onImageClick} onDragStart={(e)=>{e.stopPropagation()}} onDragStop={()=>{{document.body.clientWidth="100%"}}} mix={{
            block: "ProductGallery",
            elem: "SliderImage",
            mods: { isPlaceholder: !src },
          }} className={this.state.isZoomIn ? `galleryOverlayImageZoomOut galleryOverlayImageZoomLevel${this.state.ZoomLevel}` : "galleryOverlayImage"} ratio="custom" lazyLoad={false} alt='' src={gallery[currentIndex]}  key={i}          />
        </DragAndZoom>
        </div >)
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
        isInteractionDisabled={!isMobile.any()}
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
    // Extracting the isZoomIn state
    const {isZoomIn} = this.state

    // Extracting the isZoomIn state
    if(isZoomIn) this.setState({isZoomIn:false,ZoomLevel:0});
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
    // Extracting the isZoomIn state
    const {isZoomIn} = this.state

    // Extracting the isZoomIn state
    if(isZoomIn) this.setState({isZoomIn:false,ZoomLevel:0});
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
