import HeaderCart from "Component/HeaderCart";
import Image from "Component/Image";
import PDPGalleryCrumb from "Component/PDPGalleryCrumb";
import PDPGalleryOverlay from "Component/PDPGalleryOverlay";
import Slider from "Component/Slider";
import SliderVertical from "Component/SliderVertical";
import SearchIcon from "Component/Icons/Search";
import WishlistIcon from "Component/WishlistIcon";
import PropTypes from "prop-types";
import { createRef, PureComponent } from "react";
import { isArabic } from "Util/App";
import browserHistory from "Util/History";
import isMobile from "Util/Mobile";
import "./PDPGallery.style";
import PDPGalleryTag from "Component/PDPGalleryTag/PDPGalleryTag.component";
import PDPDispatcher from "Store/PDP/PDP.dispatcher";
import { connect } from "react-redux";
import HomeIcon from "Component/Icons/Home/home.png";
import { setPDPGaleryImage } from "Store/PDP/PDP.action";
import Event, {
  EVENT_MOE_PDP_IMAGE_SCROLL,
  MOE_trackEvent,
  EVENT_GTM_PDP_TRACKING,
} from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import BrowserDatabase from "Util/BrowserDatabase";
import { getCurrency } from "Util/App";
import fallbackImage from "../../style/icons/fallback.png";
import { Share } from "../Icons";
import { showNotification } from "Store/Notification/Notification.action";

import DynamicContentCountDownTimer from "../DynamicContentCountDownTimer/DynamicContentCountDownTimer.component.js";
import timerIcon from "./icons/flash_Sale.svg";
import Ratings from 'Component/Ratings/Ratings';
import PDPGalleryStrip from 'Component/PDPGalleryStrip/PDPGalleryStrip';
import MobileAPI from "Util/API/provider/MobileAPI";
import unmute from "./icons/sound_off@3x.png";
import mute from "./icons/sound_on@3x.png";
export const mapStateToProps = (state) => ({
  displaySearch: state.PDP.displaySearch,
  isNewDesign:state.AppConfig?.vwoData?.NewPDP?.isFeatureEnabled || false
});

export const mapDispatchToProps = (dispatch) => ({
  showPDPSearch: (displaySearch) =>
    PDPDispatcher.setPDPShowSearch({ displaySearch }, dispatch),
  setImageIndex: (index) => dispatch(setPDPGaleryImage(index)),
  showSuccessNotification: (message) =>
    dispatch(showNotification("success", message)),
  showErrorNotification: (error) =>
    dispatch(showNotification("error", error[0].message)),
    getAddToCartInfo:(data) => PDPDispatcher.getAddToCartInfo(dispatch, data)
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

  constructor(props) {
    super(props);
    this.overlaybuttonRef = createRef();
    this.crumbsRef = createRef();
    this.state = {
      openGalleryOverlay: false,
      isVideoPlaying: false,
      isArabic: isArabic(),
      listener: "",
      isFirstTimeZoomedIn: true,
      scrolledSlide: 0,
      isVideoPlayPause:false,
      isMute:true,
      getProductImage:""
    };
    this.videoRef = {
      prod_style_video: React.createRef(),
      prod_360_video: React.createRef(),
    };
  }

  componentDidMount(){
    this.renderMyViewCount();
    this.getproductFile();
  }
  
  componentWillUnmount() {
    const { scrolledSlide } = this.state;
    const {
      product: { sku, name },
    } = this.props;
    if (scrolledSlide > 0) {
      const eventData = {
        name: EVENT_MOE_PDP_IMAGE_SCROLL,
        product_id: sku,
        product_name: name,
        imagesScrolled: scrolledSlide,
      };
      Event.dispatch(EVENT_GTM_PDP_TRACKING, eventData);
    }
  }

  renderMyViewCount = async () => {
    const {
      product:{
        objectID:productId,
      }
    } = this.props;
    try {
      MobileAPI.post(`product-view/${productId}`);
    }catch(err){
      console.error('Error fetching data:', err);
    }
  }
  
  onBackButtonClick = () => {
    const { location } = browserHistory;
    browserHistory.goBack();
  };

  renderBackButton() {
    const { isArabic } = this.state;
    const { homeFromPDP } = this.props;
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
  renderAltTag = () => {
    const {
      product: {
        brand_name = "",
        color = "",
        product_type_6s = "",
        categories = {},
      },
    } = this.props;

    const checkCategory = () => {
      if (!categories) {
        return "";
      }
      if (categories.level4 && categories.level4.length > 0) {
        return categories.level4[0];
      } else if (categories.level3 && categories.level3.length > 0) {
        return categories.level3[0];
      } else if (categories.level2 && categories.level2.length > 0) {
        return categories.level2[0];
      } else if (categories.level1 && categories.level1.length > 0) {
        return categories.level1[0];
      } else if (categories.level0 && categories.level0.length > 0) {
        return categories.level0[0];
      } else return "";
    };
    const categoryLevel = checkCategory().split("///").pop();
    return (
      brand_name + " " + categoryLevel + " - " + color + " " + product_type_6s
    );
  };

  renderGalleryImage = (src, i) => (
    <Image
      lazyLoad={false}
      src={src}
      key={src}
      mix={{ block: "PDPGallery", elem: "sliderItem" }}
      alt={this.renderAltTag()}
    />
  );

  showGalleryOverlay = () => {
    const { location } = browserHistory;
    document.body.style.position = "fixed";
    this.setState({ openGalleryOverlay: true }, () => {
      document.body.style.overflow = "hidden";
      browserHistory.push(`${location.pathname}`);
    });
  };

  renderGalleryOverlay = () => {
    window.onpopstate = () => {
      this.closeGalleryOverlay();
    };
    const { isFirstTimeZoomedIn } = this.state;
    return (
      <PDPGalleryOverlay
        closeGalleryOverlay={this.closeGalleryOverlay.bind(this)}
        isOverlay={true}
        isFirstTimeZoomedIn={isFirstTimeZoomedIn}
        {...this.props}
      />
    );
  };

  closeGalleryOverlay = () => {
    document.body.style.position = "static";
    this.setState({ openGalleryOverlay: false }, () => {
      document.body.style.overflow = "visible";
      this.props.setImageIndex(this.props.currentIndex);
      this.props.onSliderChange(this.props.currentIndex);
    });
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
    const { isArabic } = this.state;
    const { gallery, currentIndex, onSliderChange} = this.props;
   

    if (!gallery.length) {
      return null;
    }
    

    return (
      <Slider
        activeImage={currentIndex}
        onActiveImageChange={this.onSlideChange}
        mix={{ block: "PDPGallery", elem: `${isArabic ? "Slider_isArabic":"Slider"}` }}
        mods={{  }}
        isInteractionDisabled={!isMobile.any()}
        showCrumbs={isMobile.any()}
        direction={isArabic ? 'rtl':'ltr'}
       
      >
        {this.renderGallery()}
        {this.renderVideos()}
      </Slider>
    );
  }

  renderVideos() {
    const { prod_style_video, prod_360_video } = this.props;
    const videos = { prod_style_video, prod_360_video };
    const {isVideoPlayPause, isMute} = this.state;
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
            muted={isMute}
            onClick={(event) => {
              event.stopPropagation();
              if(isVideoPlayPause){
                this.videoRef[key].current.play();
              } else{
                this.videoRef[key].current.pause();
              }
              this.setState({isVideoPlayPause:!isVideoPlayPause});  
            }}
          />
      ));
  }

  playVideo(video_type) {
    const { gallery, onSliderChange } = this.props;
    const video = this.videoRef[video_type];
    var counter = 1;
    if (video?.current) {
      this.setState({ isVideoPlaying: video }, () => {
        const innerThisRef = this;
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
            innerThisRef.setState({ isVideoPlaying: false }, () => {
              counter = 1;
            });
          }
        }
      });
    }
  }

  onSlideChange = (activeSlide) => {
    const {
      gallery,
      onSliderChange,
      prod_360_video,
      prod_style_video,
      product: {
        categories = {},
        name,
        sku,
        url,
        thumbnail_url,
        product_type_6s,
        price,
        gender,
        color,
        brand_name,
      },
    } = this.props;
    const { isVideoPlaying, listener, scrolledSlide } = this.state;
    this.setState({isVideoPlayPause:false,isMute:true}); 

    if (activeSlide > scrolledSlide) {
      this.setState({ scrolledSlide: activeSlide });
    }

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
    const specialPrice =
      price && price[0]
        ? price[0][Object.keys(price[0])[0]]["6s_special_price"]
        : price && Object.keys(price)[0] !== "0"
        ? price[Object.keys(price)[0]]["6s_special_price"]
        : null;
    const originalPrice =
      price && price[0]
        ? price[0][Object.keys(price[0])[0]]["6s_base_price"]
        : price && Object.keys(price)[0] !== "0"
        ? price[Object.keys(price)[0]]["6s_base_price"]
        : null;
    const checkCategoryLevel = () => {
      if (!categories) {
        return "this category";
      }
      if (categories.level4 && categories.level4.length > 0) {
        return categories.level4[0];
      } else if (categories.level3 && categories.level3.length > 0) {
        return categories.level3[0];
      } else if (categories.level2 && categories.level2.length > 0) {
        return categories.level2[0];
      } else if (categories.level1 && categories.level1.length > 0) {
        return categories.level1[0];
      } else if (categories.level0 && categories.level0.length > 0) {
        return categories.level0[0];
      } else return "";
    };
    const categoryLevel =
      product_type_6s && product_type_6s.length > 0
        ? product_type_6s
        : checkCategoryLevel().includes("///")
        ? checkCategoryLevel().split("///").pop()
        : "";
    const currentAppState = BrowserDatabase.getItem(APP_STATE_CACHE_KEY);
    MOE_trackEvent(EVENT_MOE_PDP_IMAGE_SCROLL, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      category: currentAppState.gender
        ? currentAppState.gender.toUpperCase()
        : "",
      subcategory: categoryLevel || product_type_6s,
      color: color || "",
      brand_name: brand_name || "",
      full_price: originalPrice || "",
      product_url: url,
      currency: getCurrency() || "",
      gender: gender || "",
      product_sku: sku || "",
      discounted_price: specialPrice || "",
      product_image_url: thumbnail_url || "",
      product_name: name || "",
      image_no: activeSlide || "",
      app6thstreet_platform: "Web",
    });
  };
  searchButtonClick = (e) => {
    e.stopPropagation();
    const { displaySearch, showPDPSearch } = this.props;
    showPDPSearch(!displaySearch);
  };
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
            onClick={() => {
              this.setState({isVideoPlayPause:false,isMute:true});
              this.stopVideo();
            }}
          >
            {__("View Gallery")}
          </button>
        ) : (
          <div block="PDPGallery-VideoButtonsContainer" elem="VideoButtons">
            {prod_style_video && (
              <button
                block="PDPGallery-VideoButtonsContainer-VideoButtons"
                elem="StyleVideo"
                onClick={() => {
                  this.setState({isVideoPlayPause:false,isMute:true});
                  this.playVideo("prod_style_video")}}
              >
                {__("Video")}
              </button>
            )}
            {prod_360_video && (
              <button
                block="PDPGallery-VideoButtonsContainer-VideoButtons"
                elem="360DegreeVideo"
                onClick={() => {
                  this.setState({isVideoPlayPause:false,isMute:true});
                this.playVideo("prod_360_video")
              }}
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

  copyToClipboard = async () => {
    const { showSuccessNotification, showErrorNotification } = this.props;
    try {
      await navigator.clipboard.writeText(window.location.href);
      showSuccessNotification(__("Link copied to clipboard"));
    } catch (err) {
      showErrorNotification(__("Something went wrong! Please, try again!"));
      console.error(err);
    }
  };

  async getproductFile() {
    const {
      product: { gallery_images },
    } = this.props;
    const response = await fetch(gallery_images[0], {
      mode: "no-cors",
    });
    const blob = await response.blob();
    const file = new File([blob], "file.jpeg", {
      type: blob.type,
    }); 
    this.setState({getProductImage : file})
  }


  renderShareButton() {
    const {
      product: { gallery_images, name },
    } = this.props;
    const {getProductImage} = this.state;
    const url = new URL(window.location.href).href;
    const navigatorShare = async () => {
      if (navigator.share) {
        if ('canShare' in navigator) {
          try {
            let productData = {
              title: document.title,
              text: `Hey check this out: ${document.title}`,
              url: url
            };
            if(getProductImage?.size?.length > 0) {
              productData['files'] = [getProductImage];
            }
            await navigator.share(productData);
          } catch (err) {
            console.log("ERROR", err);
          }
        } else {
          navigator.share({
            title: document.title,
            text: `Hey check this out: ${document.title}`,
            url: url
          })
        }
      } else {
        this.copyToClipboard();
      }
 
    };
    return (
      <>
        <div block="MobileShare">
          <button onClick={navigatorShare} block="Share">
            <Share block="Icon" />
          </button>
        </div>
      </>
    );
  }
  renderSaleBlock = () => {
    const { isArabic } = this.state;
    const {getAddToCartInfo, product : {timer_start_time, timer_end_time}} = this.props;
    const newinfoText = __("Flash Sale: For limited time only");
    const now = Date.parse(new Date().toUTCString());
    const startDay = Date.parse(timer_start_time);
    const endDay = Date.parse(timer_end_time);
    if (!(endDay >= startDay) || !(now <= endDay) ||  startDay >= now) {
      if(this.props?.addtoCartInfo?.is_flash_sale === true) {
        getAddToCartInfo({"is_flash_sale":false});
      }
    } else {
        if(this.props?.addtoCartInfo?.is_flash_sale === false) {
            getAddToCartInfo({"is_flash_sale":true});
          }
      return(
        <div block="saleBlock"   mods={{ isArabic }}> <DynamicContentCountDownTimer  newtimerIcon={timerIcon}  infoText={newinfoText} start={timer_start_time} end={timer_end_time} isPLPOrPDP /></div>
      )
    }

  }

  renderMuteUnmute= () =>{
    const { prod_style_video, prod_360_video } = this.props;
    const videos = { prod_style_video, prod_360_video };
    const {isMute, isArabic} = this.state;
    return Object.keys(videos)
      .filter((key) => !!videos[key])
      .map((key, index) => (
        
        <span className={`btn__mute ${isMute ? 'muteActive':''} ${isArabic ?'_isArabic':''}`} onClick={(event) => {
          event.stopPropagation();
          if(isMute){
            this.videoRef[key].current.muted = true;
          } else {
            this.videoRef[key].current.muted = false;
          }
          this.setState({isMute:!isMute});
        } }>
          {!isMute && <img src={mute} className="icon icon__mute" alt="mute"/>}
          {isMute && <img src={unmute} className="icon icon__unmute"alt="unmute"/>}
        </span>
      ));
  }

  render() {
    const { openGalleryOverlay, isArabic, isVideoPlaying } = this.state;
    const { 
      renderMySignInPopup,
      isNewDesign,
      product:{
        rating_brand,
        rating_sku,
        objectID,
        sku,
        name
      }
    } = this.props;
    return (
      <>
        {
            /* Mobile Flash sale block */
            isNewDesign && isMobile.any() && this.renderSaleBlock()
        }
      <div block='PDPGallery'>
        {openGalleryOverlay ? (
          this.renderGalleryOverlay()
        ) : (
          <>
            {this.renderBackButton()}
            {this.renderCrumbs()}
            <div block="OverlayIcons" mods={{ isArabic }}>
              {this.renderCartIcon()}
              {this.renderWishlistIcon()}
              {isMobile.any() && this.renderShareButton()}
            </div>
          </>
        )}
          
        <button
          ref={this.overlaybuttonRef}
          block="PDPGallery"
          elem="OverlayButton"
          mods={{ isArabic }}
          onClick={this.showGalleryOverlay}
        >
          {
            /* Desktop Flash sale block */
            isNewDesign && !isMobile.any() && this.renderSaleBlock()
          }
          {this.renderSlider()}
          {this.renderGalleryTag()}
          {isNewDesign && <PDPGalleryStrip className="PDPGalleryStrip" productId={objectID} sku={sku}/>}

        {isMobile.any() && isVideoPlaying && this.renderMuteUnmute()}
          
        </button>

          {isNewDesign && isMobile.any() && <Ratings className="PDPRatings" rating_sku={rating_sku} rating_brand={rating_brand} productSku={sku} isPDPEventsOnly />}
        
        {!isNewDesign && this.renderVideoButtons()}  
      </div>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PDPGallery);
