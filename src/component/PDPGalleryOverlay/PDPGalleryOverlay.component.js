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

  imageRef = createRef();

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
    };
  }

  componentDidMount() {
    const { onSliderChange, currentIndex } = this.props;
    const { imageRef, overlayRef } = this;
    const imgHeight =
      imageRef.current === null ? null : imageRef.current.offsetHeight;
    const imgWidth =
      imageRef.current === null ? null : imageRef.current.offsetWidth;
    const overlayHeight = overlayRef.current.children[5].offsetHeight;
    const overlayWidth = overlayRef.current.children[5].offsetWidth;
    const addX =
      (overlayWidth - imgWidth) / 2 - (overlayWidth - imgWidth * 1.5) / 2;
    const addY =
      (overlayHeight - imgHeight) / 2 - (overlayHeight - imgHeight * 1.5) / 2;

    const imageScale = 1 - (overlayWidth - imgWidth) / overlayWidth;
    this.setState({
      addX,
      addY,
      initialScale: 0.5,
      scale: Math.floor(imageScale / 0.5) * 0.5,
    });
    onSliderChange(0);
    this.listenArrowKey();
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleArrorKeySlide);
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

  zoomIn = () => {
    const { scale, addX, addY } = this.state;
    if (scale < 8) {
      this.setState({
        scale: scale + 0.5,
        positionX: addX,
        positionY: addY,
      });
    }
  };

  zoomOut = () => {
    const { scale, addX, addY, initialScale } = this.state;
    if (scale > initialScale) {
      this.setState({
        scale: scale - 0.5,
        positionX: -addX,
        positionY: -addY,
      });
    }
  };

  renderImage(src, i) {
    const { isZoomEnabled, handleZoomChange, disableZoom } = this.props;
    const { scale, positionX, positionY, initialScale } = this.state;

    return (
      <TransformWrapper
        key={i}
        scale={scale}
        onZoomChange={handleZoomChange}
        wheel={{ disabled: true, wheelEnabled: false }}
        pan={{
          //   disabled: !isZoomEnabled,
          limitToWrapperBounds: true,
          velocity: false,
        }}
        options={{
          limitToBounds: true,
          minScale: 0.5,
          minPositionX: positionX,
          minPositionY: positionY,
        }}
      >
        {({
          scale,
          previousScale,
          resetTransform,
          setTransform,
          positionX,
          positionY,
          options,
          centerView,
        }) => {
          const { minPositionY, minPositionX } = options;
          if (scale === 0.5 && previousScale !== 0.5) {
            // resetTransform();
          }

          // if (scale !== previousScale && scale !== 0.5) {
          //   setTransform(
          //     positionX - minPositionX,
          //     positionY - minPositionY,
          //     scale,
          //     0
          //   );
          // }

          return (
            <ProductGalleryBaseImage
              imageRef={this.imageRef}
              centerContent
              setTransform={setTransform}
              index={i}
              mediaData={src}
              scale={scale}
              previousScale={previousScale}
              disableZoom={disableZoom}
              isZoomEnabled={isZoomEnabled}
            />
          );
        }}
      </TransformWrapper>
    );
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
      return gallery.map(this.renderImage);
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
        isInteractionDisabled={isZoomEnabled}
      >
        {this.renderGallery()}
      </Slider>
    );
  }
  prev = () => {
    const { currentIndex, onSliderChange, gallery = [] } = this.props;
    if (currentIndex === 0) {
      return;
    } else {
      onSliderChange(currentIndex - 1);
    }
    console.log("prev clicked");
  };
  next = () => {
    const { currentIndex, onSliderChange, gallery = [] } = this.props;
    if (currentIndex + 1 === gallery.length) {
      return;
    } else {
      onSliderChange(currentIndex + 1);
    }
    console.log("next clicked");
  };

  handleArrorKeySlide = (e) => {
    switch (e.keyCode) {
      case 37:
        // alert("left");
        this.prev();

        break;

      case 39:
        // alert("right");
        this.next();
        break;
    }
  };
  listenArrowKey = () => {
    document.addEventListener("keydown", this.handleArrorKeySlide);
  };

  render() {
    const { closeGalleryOverlay } = this.props;

    return (
      <div block="PDPGalleryOverlay" ref={this.overlayRef}>
        <button
          block="PDPGalleryOverlay"
          elem="Button"
          onClick={closeGalleryOverlay}
        >
          <Close />
        </button>
        <button block="PDPGalleryOverlay" elem="ZoomIn" onClick={this.zoomIn}>
          <Plus />
        </button>
        <button block="PDPGalleryOverlay" elem="ZoomOut" onClick={this.zoomOut}>
          <Minus />
        </button>
        <button block="PDPGalleryOverlay" elem="Prev" onClick={this.prev}>
          <ChevronLeft />
        </button>
        <button block="PDPGalleryOverlay" elem="Next" onClick={this.next}>
          <ChevronRight />
        </button>
        {this.renderCrumbs()}
        {this.renderSlider()}
      </div>
    );
  }
}

export default PDPGalleryOverlay;
