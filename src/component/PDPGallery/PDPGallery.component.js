import HeaderCart from "Component/HeaderCart";
import Image from "Component/Image";
import PDPGalleryCrumb from "Component/PDPGalleryCrumb";
import PDPGalleryOverlay from "Component/PDPGalleryOverlay";
import Slider from "Component/Slider";
import SliderVertical from "Component/SliderVertical";
import ShareButton from "Component/ShareButton";
import SearchIcon from "Component/Icons/Search";
import WishlistIcon from "Component/WishlistIcon";
import PropTypes from "prop-types";
import { createRef, PureComponent } from "react";
import { isArabic } from "Util/App";
import CSS from "Util/CSS";
import browserHistory from "Util/History";
import isMobile from "Util/Mobile";
import { MAX_ZOOM_SCALE } from "./PDPGallery.config";
import "./PDPGallery.style";
import videoIcon from "./icons/video.svg";
import PDPGalleryTag from "Component/PDPGalleryTag/PDPGalleryTag.component";
import PDPDispatcher from "Store/PDP/PDP.dispatcher";
import { connect } from 'react-redux';
import HomeIcon from "Component/Icons/Home/home.png"
import { setPDPGaleryImage } from "Store/PDP/PDP.action";
export const mapStateToProps = (state) => ({
  displaySearch: state.PDP.displaySearch
});

export const mapDispatchToProps = (dispatch) => ({
  showPDPSearch: (displaySearch) => PDPDispatcher.setPDPShowSearch({ displaySearch }, dispatch),
  setImageIndex: (index) => dispatch(setPDPGaleryImage(index)),
});

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
    listener: "",
  };

  videoRef = {
    prod_style_video: React.createRef(),
    prod_360_video: React.createRef(),
  };

  // componentDidMount() {
  // CSS.setVariable(
  // this.crumbsRef,
  // "gallery-crumbs-height",
  // `${this.overlaybuttonRef.current.offsetHeight}px`
  // );
  // }

  onBackButtonClick = () => {
    const { location } = browserHistory;
    browserHistory.goBack();
  }
  renderBackButton() {
    const { isArabic } = this.state;
    const { homeFromPDP } = this.props
    return (
      <div block="BackArrow" mods={{ isArabic }} key="back">
        <button block="BackArrow-Button" onClick={this.onBackButtonClick} />
        <div block="BackArrow-HomeIcon" onClick={homeFromPDP}>
          <img src={HomeIcon} alt="home" />
        </div>
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
    const { sku, product, renderMySignInPopup } = this.props;
    return (
      <WishlistIcon
        sku={sku}
        renderMySignInPopup={renderMySignInPopup}
        mods={{ isArabic }}
        pageType="pdp"
        data={product}
      />
    );
  }
  renderShareButton() {
    const url = new URL(window.location.href);
    url.searchParams.append("utm_source", "pdp_share");
    return (
      <div block="ShareIcon">
        <ShareButton
          title={document.title}
          text={`Hey check this out: ${document.title}`}
          url={url}
        />
      </div>
    );
  }

  renderSearchButton() {
    const url = new URL(window.location.href);
    if (!!!isMobile.any()) {
      return null;
    }

    return (
      <div block="SearchIcon" onClick={this.searchButtonClick}>
        <SearchIcon
          title={document.title}
          text={`Hey check this out: ${document.title}`}
          url={url.searchParams.append("utm_source", "pdp_share")}
        />
      </div>
    );
  }

  renderCrumb = (index, i) => {
    return (
      <PDPGalleryCrumb
        key={i}
        onSlideChange={this.onSlideChange}
        src={index}
        // prefer numerical index
        index={i}
      />
    );
  };
  renderAltTag = () =>{
    const {
      product: { 
        brand_name = "",
        color = "",
        product_type_6s = "",
        categories={}
      },
    } = this.props;
    const checkCategory = () => {
      if(!categories){
        return '';
      }
      if (categories.level4){
        return categories.level4[0];
      }
      else if (categories.level3){
        return categories.level3[0];
      }
      else if (categories.level2){
        return categories.level2[0];
      }
      else if (categories.level1){
        return categories.level1[0];
      }
      else if (categories.level0){
        return categories.level0[0];
      }
      else return "";
    }
    const categoryLevel = checkCategory().split('///').pop();
    return(brand_name + " " + categoryLevel + " - " + color + " " + product_type_6s);
  }
  renderGalleryImage = (src, i) =>  (
    <Image
      lazyLoad={false}
      src={src}
      key={src}
      mix={{ block: "PDPGallery", elem: "sliderItem" }}
      alt={this.renderAltTag()}
    />
  );

  renderGalleryOverlay = () => {
    const { location } = browserHistory;
    browserHistory.push(`${location.pathname}`);
    window.onpopstate = () => {
      this.closeGalleryOverlay();
    }
    const galleryOverlay = (
      <PDPGalleryOverlay
        closeGalleryOverlay={this.closeGalleryOverlay}
        isOverlay={!!this.state.galleryOverlay}
        {...this.props}
      />
    );
    // document.body.style.overflow = "hidden";

    this.setState({ galleryOverlay });
  };

  closeGalleryOverlay = () => {
    document.body.style.overflow = "visible";
    this.props.setImageIndex(this.props.currentIndex)
    this.props.onSliderChange(this.props.currentIndex);
    this.setState({ galleryOverlay: "" });    
  };

  renderCrumbs() {
    const {
      crumbs = [],
      currentIndex,
      onSliderChange,
      prod_style_video,
      prod_360_video,
    } = this.props;

    let filterCrumb = crumbs.filter((item) => {
      return item?.includes("http");
    });

    if (prod_style_video && prod_360_video) {
      // filterCrumb.push(videoIcon);
      // filterCrumb.push(videoIcon);
    } else if (prod_style_video || prod_360_video) {
      // filterCrumb.push(videoIcon);
    }

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
          onActiveImageChange={this.onSlideChange}
          isInteractionDisabled
        >
          {filterCrumb.map(this.renderCrumb)}
        </SliderVertical>
      </div>
    );
  }

  renderGallery() {
    const { gallery = [] } = this.props;

    return gallery.map(this.renderGalleryImage);
  }

  renderGalleryTag() {
    const {
      product: { prod_tag_2 },
    } = this.props;
    return <PDPGalleryTag tag={prod_tag_2} />;
  }
  renderSlider() {
    const { gallery, currentIndex, onSliderChange } = this.props;

    if (!gallery.length) {
      return null;
    }

    return (
      <div>
        <Slider
          activeImage={currentIndex}
          onActiveImageChange={this.onSlideChange}
          mix={{ block: "PDPGallery", elem: "Slider" }}
          isInteractionDisabled={!isMobile.any()}
          showCrumbs={isMobile.any()}
        >
          {this.renderGallery()}
          {this.renderVideos()}
        </Slider>
      </div>
    );
  }

  renderVideos() {
    const { prod_style_video, prod_360_video } = this.props;
    const videos = { prod_style_video, prod_360_video };
    return Object.keys(videos)
      .filter((key) => !!videos[key])
      .map((key, index) => (
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
      ));
  }

  playVideo(video_type) {
    const { gallery, onSliderChange } = this.props;
    const video = this.videoRef[video_type];
    var counter = 1;
    if (video?.current) {
      this.setState({ isVideoPlaying: video }, () => {
        onSliderChange(
          gallery.length + parseInt(video?.current.dataset["index"])
        );
        video.current.play();
        video.current.addEventListener("ended", listener);
        this.setState({ listener });
        // after issue fix can be removed below commented code

        // video.current.addEventListener("ended", () => {
        // console.log({ counter });
        // counter = counter + 1;
        // if (counter <= 2) {
        // video.current.play();
        // } else {
        // onSliderChange(0);
        // video.current.removeEventListener("ended");
        // this.setState({ isVideoPlaying: false }, () => {
        // counter = 1;
        // });
        // }
        // });
        function listener(event) {
          counter = counter + 1;
          if (counter <= 2) {
            video.current.play();
          } else {
            onSliderChange(0);
            video.current.removeEventListener("ended", listener);
            this.setState({ isVideoPlaying: false }, () => {
              counter = 1;
            });
          }
        }
      });
    }
  }

  onSlideChange = (activeSlide) => {
    const { gallery, onSliderChange, prod_360_video, prod_style_video } =
      this.props;
    const { isVideoPlaying, listener } = this.state;

    if (activeSlide <= gallery.length - 1) {
      // stop the video
      if (isVideoPlaying?.current) {
        isVideoPlaying.current.pause();
        isVideoPlaying.current.currentTime = 0;
        isVideoPlaying?.current.removeEventListener("ended", listener);
      }
      this.setState({ isVideoPlaying: false });
      onSliderChange(activeSlide);
    } else if (activeSlide > gallery.length - 1) {
      // play the video
      if (!(prod_360_video || prod_style_video)) {
        return null;
      }
      onSliderChange(activeSlide);
      if (activeSlide >= gallery.length) {
        if (activeSlide === gallery.length) {
          if (isVideoPlaying?.current) {
            isVideoPlaying.current.pause();
            isVideoPlaying.current.currentTime = 0;
            isVideoPlaying?.current.removeEventListener("ended", listener);
          }
          if (prod_360_video && prod_style_video) {
            this.playVideo("prod_style_video");
          } else {
            if (prod_360_video) {
              this.playVideo("prod_360_video");
            } else if (prod_style_video) {
              this.playVideo("prod_style_video");
            }
          }
        } else if (activeSlide === gallery.length + 1) {
          if (isVideoPlaying?.current) {
            isVideoPlaying.current.pause();
            isVideoPlaying.current.currentTime = 0;
            isVideoPlaying?.current.removeEventListener("ended", listener);
          }
          if (prod_360_video && prod_style_video) {
            this.playVideo("prod_360_video");
          } else {
            if (prod_360_video) {
              this.playVideo("prod_360_video");
            } else if (prod_style_video) {
              this.playVideo("prod_style_video");
            }
          }
        }
      }
    }
  };
  searchButtonClick = (e) => {
    e.stopPropagation();
    const { displaySearch, showPDPSearch } = this.props
    showPDPSearch(!displaySearch)
  }
  stopVideo() {
    const { isVideoPlaying, listener } = this.state;

    const { onSliderChange } = this.props;
    if (isVideoPlaying?.current) {
      isVideoPlaying.current.pause();
      isVideoPlaying.current.currentTime = 0;
    }
    onSliderChange(0);
    isVideoPlaying?.current.removeEventListener("ended", listener);
    this.setState({ isVideoPlaying: false });
  }

  renderVideoButtons() {
    const { prod_360_video, prod_style_video, currentIndex, gallery } =
      this.props;
    const { isVideoPlaying } = this.state;
    if (!(prod_360_video || prod_style_video) || !isMobile.any()) {
      return null;
    }

    return (
      <div block="PDPGallery" elem="VideoButtonsContainer">
        {isVideoPlaying && currentIndex >= gallery.length ? (
          <button
            block="PDPGallery-VideoButtonsContainer-VideoButtons"
            elem="ViewGallery"
            onClick={() => this.stopVideo()}
          >
            {__("View Gallery")}
          </button>
        ) : (
          <div block="PDPGallery-VideoButtonsContainer" elem="VideoButtons">
            {prod_style_video && (
              <button
                block="PDPGallery-VideoButtonsContainer-VideoButtons"
                elem="StyleVideo"
                onClick={() => this.playVideo("prod_style_video")}
              >
                {__("Video")}
              </button>
            )}
            {prod_360_video && (
              <button
                block="PDPGallery-VideoButtonsContainer-VideoButtons"
                elem="360DegreeVideo"
                onClick={() => this.playVideo("prod_360_video")}
              >
                {__("360°")}
              </button>
            )}
          </div>
        )}
        <div block="Seperator" />
      </div>
    );
  }

  render() {
    const { galleryOverlay, isArabic } = this.state;
    const { renderMySignInPopup } = this.props;
    return (
      <div block="PDPGallery">
        {galleryOverlay}
        {!galleryOverlay && this.renderBackButton()}
        {!galleryOverlay && this.renderCrumbs()}
        {!galleryOverlay && (
          <div block="OverlayIcons" mods={{ isArabic }}>
            {this.renderCartIcon()}
            {this.renderWishlistIcon()}
            {/* {this.renderShareButton()} */}
            {/* {this.renderSearchButton()} */}
          </div>
        )}

        <button
          ref={this.overlaybuttonRef}
          block="PDPGallery"
          elem="OverlayButton"
          mods={{ isArabic }}
          onClick={(e) => {
            e.stopPropagation()
            this.renderGalleryOverlay()
          }}
        >
          {this.renderSlider()}
          {this.renderGalleryTag()}
        </button>
        {this.renderVideoButtons()}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PDPGallery);
