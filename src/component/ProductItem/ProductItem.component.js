import {
  HOME_PAGE_BANNER_CLICK_IMPRESSIONS,
  HOME_PAGE_BANNER_IMPRESSIONS,
} from "Component/GoogleTagManager/events/BannerImpression.event";
import { EVENT_PRODUCT_LIST_IMPRESSION } from "Component/GoogleTagManager/events/ProductImpression.event";
import Image from "Component/Image";
import Link from "Component/Link";
import Price from "Component/Price";
import ProductLabel from "Component/ProductLabel/ProductLabel.component";
import WishlistIcon from "Component/WishlistIcon";
import PLPAddToCart from "Component/PLPAddToCart/PLPAddToCart.component";
import { influencerURL } from "Component/InfluencerCollection/InfluencerCollection.config";
import PropTypes from "prop-types";
import { PureComponent, lazy, Suspense } from "react";
import { getStore } from "Store";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import { Product } from "Util/API/endpoint/Product/Product.type";
import { getGenderInArabic } from "Util/API/endpoint/Suggestions/Suggestions.create";
import Algolia from "Util/API/provider/Algolia";
import { isArabic, getCurrency } from "Util/App";
import { getUUIDToken } from "Util/Auth";
import BrowserDatabase from "Util/BrowserDatabase";
import isMobile from "Util/Mobile";
import { getQueryParam } from "Util/Url";
import Event, {
  EVENT_GTM_PRODUCT_CLICK,
  SELECT_ITEM_ALGOLIA,
  EVENT_MOE_PRODUCT_CLICK,
  EVENT_COLOUR_VARIENT_CLICK,
  EVENT_FLIP_IMAGE_SCROLL,
  MOE_trackEvent,
} from "Util/Event";
import { SPECIAL_COLORS, translateArabicColor } from "Util/Common";
import "./ProductItem.style";
import { setPrevPath, setColourVarientsButtonClick } from "Store/PLP/PLP.action";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { RequestedOptions } from "Util/API/endpoint/Product/Product.type";
import PDPDispatcher from "Store/PDP/PDP.dispatcher";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { isSignedIn } from "Util/Auth";
const MsiteAddToCartPopUp = lazy(() =>
  import(
    /* webpackChunkName: 'MsiteAddToCartPopUp' */ "Component/MsiteAddToCartPopUp"
  )
);
import DynamicContentCountDownTimer from "../DynamicContentCountDownTimer/DynamicContentCountDownTimer.component.js"
import SwiperSliderProduct from "../SwiperSliderProduct/SwiperSliderProduct.component";
import Ratings from 'Component/Ratings/Ratings';
//Global Variable for PLP AddToCart
var urlWithQueryID;
var influencerPDPURL;
export const mapStateToProps = (state) => ({
  prevPath: state.PLP.prevPath,
  requestedOptions: state.PLP.options,
  selectedGender: state?.InfluencerReducer?.selectedGender,
  isStorePage: state?.InfluencerReducer?.isStorePage,
  isCollectionPage: state?.InfluencerReducer?.isCollectionPage,
  isNewDesign:state.PDP.isNewDesign
});

export const mapDispatchToProps = (dispatch, state) => ({
  setPrevPath: (prevPath) => dispatch(setPrevPath(prevPath)),
  resetProduct: () => PDPDispatcher.resetProduct({}, dispatch),
  requestProductBySku: (options) =>
    PDPDispatcher.requestProductBySku(options, dispatch),
    setColourVarientsButtonClick: (colourVarientsButtonClick) => dispatch(setColourVarientsButtonClick(colourVarientsButtonClick)),
});

class ProductItem extends PureComponent {
  static propTypes = {
    product: Product.isRequired,
    page: PropTypes.string,
    position: PropTypes.number,
    qid: PropTypes.string,
    isVueData: PropTypes.bool,
    pageType: PropTypes.string,
    prevPath: PropTypes.string,
    requestedOptions: RequestedOptions.isRequired,
  };

  static defaultProps = {
    page: "",
    impressionSent: false,
  };

  constructor(props) {
    super(props);
    this.scrollRef = React.createRef(null);
    this.swiperRef = React.createRef(null);
    this.state = {
      isArabic: isArabic(),
      stockAvailibility: true,
      selectedSizeType: "eu",
      selectedSizeCode: "",
      hover: false,
      currentImage: "",
      currentIndex: 0,
      colorVarientsClick: false,
      theme: { dark: false, light: false },
      isdark: true,
      colorVarientButtonClick : false,
      colorVarientProductData : {},
      selectedOption: null,
      colorVarientBrandName : "",
      colorVarientName : "",
      colorVarientPrice : [],
      autoplay: false,
      imageScroller: false,
      showImageScroller: false,
    };
  }
  componentDidMount() {
    this.registerViewPortEvent();
  }

  registerViewPortEvent() {
    let observer;

    let options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    observer = new IntersectionObserver(this.handleIntersect, options);
    observer.observe(this.viewElement);
  }
  getPLPListName() {
    const { page } = this.props;
    const pageUrl = new URL(window.location.href);
    if (pageUrl.pathname == "/catalogsearch/result/" && page == "plp") {
      const getSearchQuery = pageUrl.search.includes("&")
        ? pageUrl.search.split("&")
        : pageUrl.search;
      const searchParameter = getSearchQuery[0]
        ? getSearchQuery[0].replace("?q=", "")
        : getSearchQuery.includes("?q=")
        ? getSearchQuery.replace("?q=", "")
        : getSearchQuery;
      const formatSearchParam =
        searchParameter && searchParameter.includes("+")
          ? searchParameter.replaceAll("+", " ")
          : searchParameter;
      return `Search PLP - ${formatSearchParam}`;
    } else if (page == "plp" && pageUrl.pathname.includes(".html")) {
      const pagePath = pageUrl.pathname.split(".html");
      const pageName = pagePath[0] ? pagePath[0].replaceAll("/", " ") : "";
      return `PLP -${pageName}`;
    } else {
      return null;
    }
  }
  sendImpressions() {
    const {
      product = [],
      sendProductImpression,
      page,
      sendProductImpressionOnBundle,
    } = this.props;
    const queryID = localStorage.getItem("queryID")
      ? localStorage.getItem("queryID")
      : null;
    const productDataWithQueryID =
      page == "plp" && queryID
        ? { ...product, ...{ productQueryID: queryID } }
        : product;
    if (page == "plp" && sendProductImpressionOnBundle) {
      sendProductImpression([productDataWithQueryID]);
    } else {
      const productData =
        !productDataWithQueryID.product_Position && this.props?.position
          ? { ...productDataWithQueryID, ...{ position: this.props?.position } }
          : { ...productDataWithQueryID };
      const productMappedData = {
        ...productData,
        ...{ list: this.getPLPListName() },
      };
      Event.dispatch(EVENT_PRODUCT_LIST_IMPRESSION, [productMappedData]);
    }
    this.setState({ impressionSent: true });
  }
  handleIntersect = (entries, observer) => {
    const { impressionSent } = this.state;
    if (impressionSent) {
      return;
    }
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.sendImpressions();
      }
    });
  };
  setSize = (sizeType, sizeCode) => {
    // this.setState({
    //   selectedSizeType: sizeType || "eu",
    //   selectedSizeCode: sizeCode || "",
    // });
  };

  setStockAvailability = (status) => {
    // const {
    //   product: { price },
    // } = this.props;
    // console.log("hi",status)
    // this.setState({ stockAvailibility: !!price && status });
  };

  handleClick = this.handleProductClick.bind(this);

  handleProductClick() {
    const {
      product,
      position,
      qid,
      isVueData,
      setPrevPath,
      resetProduct,
      product: {
        name,
        url,
        sku,
        color,
        brand_name,
        product_type_6s,
        categories,
        price = {},
        product_Position,
        thumbnail_url,
      },
      isFilters,
    } = this.props;
    var data = localStorage.getItem("customer") || null;
    let userData = data ? JSON.parse(data) : null;
    let userToken =
      userData && userData.data && userData.data.id
        ? `user-${userData.data.id}`
        : getUUIDToken();
    let queryID;
    resetProduct();
    setPrevPath(window.location.href);
    if (!isVueData) {
      if (!qid) {
        queryID = getStore().getState().SearchSuggestions.queryID;
      } else {
        queryID = qid;
      }
    }
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
    const categoryLevel = checkCategoryLevel().includes("///")
      ? checkCategoryLevel().split("///").pop()
      : "";

    const itemPrice = price[0][Object.keys(price[0])[0]]["6s_special_price"];
    const basePrice = price[0][Object.keys(price[0])[0]]["6s_base_price"];
    const productData = { ...product, ...{ listName: this.getPLPListName() } };
    Event.dispatch(EVENT_GTM_PRODUCT_CLICK, productData);

    Event.dispatch(EVENT_FLIP_IMAGE_SCROLL, {
      product_id: product?.objectID || "",
      product_name: name || "",
      image_number: this.swiperRef?.current?.activeIndex || 0,
    });

    if (queryID && position && position > 0 && product.objectID && userToken) {
      new Algolia().logAlgoliaAnalytics("click", SELECT_ITEM_ALGOLIA, [], {
        objectIDs: [product.objectID],
        queryID,
        userToken: userToken,
        position: [position],
        getRankingInfo: true,
      });
    }
    const currentAppState = BrowserDatabase.getItem(APP_STATE_CACHE_KEY);
    MOE_trackEvent(EVENT_MOE_PRODUCT_CLICK, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      category: currentAppState.gender
        ? currentAppState.gender.toUpperCase()
        : "",
      subcategory: categoryLevel || product_type_6s,
      color: color || "",
      brand_name: brand_name || "",
      full_price: basePrice || "",
      product_url: url,
      currency: getCurrency() || "",
      product_sku: sku || "",
      discounted_price: itemPrice || "",
      product_image_url: thumbnail_url || "",
      product_name: name,
      isLoggedIn: isSignedIn(),
      app6thstreet_platform: "Web",
      isFilters: isFilters ? "Yes" : "No",
      position: product_Position || "",
    });

    MOE_trackEvent(EVENT_FLIP_IMAGE_SCROLL, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      app6thstreet_platform: "Web",
      product_id: product?.objectID || "",
      product_name: name || "",
      image_number: this.swiperRef?.current?.activeIndex || 0,
    });

    // this.sendBannerClickImpression(product);
  }

  sendBannerClickImpression(item) {
    Event.dispatch(HOME_PAGE_BANNER_CLICK_IMPRESSIONS, [item]);
  }

  renderWishlistIcon() {
    const {
      product: { sku },
      product,
      pageType,
      renderMySignInPopup,
      isFilters,
      position,
    } = this.props;
    return (
      <WishlistIcon
        renderMySignInPopup={renderMySignInPopup}
        sku={sku}
        data={product}
        pageType={pageType}
        isFilters={isFilters}
        product_position={position}
        colorVarientButtonClick={this.state?.colorVarientButtonClick}
      />
    );
  }

  renderLabel() {
    const { product } = this.props;
    return <ProductLabel product={product} section="productItem" />;
  }

  renderColors() {
    const {
      product: { also_available_color, promotion },
    } = this.props;

    if (also_available_color && !promotion) {
      const count = also_available_color.split(",").length - 2;

      return count > 0 ? (
        <div block="PLPSummary" elem="Colors">
          {" "}
          {`+${count} `} {__("Colors")}{" "}
        </div>
      ) : null;
    }

    return null;
  }

  renderExclusiveMobile(gallery_image_urls_flag) {
    const {
      product: { promotion },
    } = this.props;

    let TagStyle = {};
    if (gallery_image_urls_flag && !isMobile.any()) {
      TagStyle = {
        bottom: "0px",
        zIndex: 1,
      };
    }

    if (promotion !== undefined && promotion !== "") {
      return promotion !== null ? (
        <span block="ExclusiveMobile" style={TagStyle}>
          {" "}
          {promotion}{" "}
        </span>
      ) : null;
    }

    return null;
  }
  // gallery_image_urls_flag : true when crowsel is visible
  renderExclusive(gallery_image_urls_flag) {
    const {
      product: { promotion },
    } = this.props;

    if(isMobile.any()){
      return null;
    }

    let TagStyle = {};
    if(gallery_image_urls_flag && !isMobile.any()) {
      TagStyle = { 
        bottom: "0px",
        zIndex : 1 
      }
    }

    if (promotion !== undefined) {
      return promotion !== null ? (
        <div block="PLPSummary" elem="Exclusive" style={TagStyle}>
          {" "}
          {promotion}{" "}
        </div>
      ) : null;
    }

    return null;
  }

  renderOutOfStock() {
    const {
      product: { in_stock, stock_qty },
    } = this.props;
    if (in_stock === 0 || (in_stock === 1 && stock_qty === 0)) {
      return (
        <span block="ProductItem" elem="OutOfStock">
          {" "}
          {__("out of stock")}
        </span>
      );
    }

    return null;
  }

  generateInputField = (val, index) => {
    const {
      product = {},
      product: { sku = "", color = "", color_hex = "", },
    } = this.props;
    const productAlsoAvailableColors = (
      product &&
      Object.keys(product)?.length > 0 &&
      Array.isArray(product?.["6s_also_available_color"])
        ? product?.["6s_also_available_color"]?.length > 0
        : product?.["6s_also_available_color"]
    )
      ? [sku, ...Object.keys(product?.["6s_also_available_color"])]
      : [];

    const colorKey = productAlsoAvailableColors?.[index];
    const background =
      product?.["6s_also_available_color"]?.[colorKey]?.color || color_hex;
    const colorArray = [
      "#ffffff",
      "#FFFFFF",
      "#F7E7CE",
      "#fbfdea",
      "#e1e1de",
      "#efe6c6",
      "#e3dac9",
    ];
    const isBorderColor = colorArray?.includes(background?.toLowerCase());
    const zIndex = index === 0 ? 1 : -index;
    return (
      <input
        block="radio-input"
        type="radio"
        name={colorKey}
        id={colorKey}
        value={colorKey}
        onChange={this.onChangeTheme}
        style={{
          background,
          border: isBorderColor && "0.2px solid #000000",
          "z-index": `${zIndex}`,
        }}
      />
    );
  };

  renderColorVariantsMobile = () => {
    const {
      product = {},
      product: { sku = "" },
    } = this.props;
    const { isdark, isArabic } = this.state;
    const productAlsoAvailableColors = product?.["6s_also_available_color"]
      ? Object.keys(product?.["6s_also_available_color"])
      : [];

    const allAvailableColors = [sku, ...productAlsoAvailableColors].slice(0, 3);

    return this.getInstockColorVarientsCount() > 0 &&
      allAvailableColors?.length > 0 ? (
      <div
        block="PLPMobileColorVarients"
        mods={{ isArabic }}
        onClick={() => this.props.setColourVarientsButtonClick(true)}
      >
        {allAvailableColors?.length === 1 ? (
          <div block="radio-label">
            {this.generateInputField(productAlsoAvailableColors?.[0], 0)}
          </div>
        ) : (
          <div block="radio-label multi-color">
            {allAvailableColors?.map(this.generateInputField)}
          </div>
        )}
        {this.getInstockColorVarientsCount() > 3 && (
          <span block="colorVarientCounts" mods={{ isArabic }}>
            {"+"}
          </span>
        )}
      </div>
    ) : null;
  };
  
  handleImageScrollerMouseEnter = (requireGalleryImageUrl) => {
    if(!isMobile.any() && requireGalleryImageUrl?.length > 0) {
      this.setState({ imageScroller : true },() => {
          setTimeout(() => {
            this.setState({showImageScroller: true});
            if (this.swiperRef.current && this.swiperRef.current.autoplay) {
              this.swiperRef.current.autoplay.start();
            }
          }, 200);
         
      });
    }
  }

  handleImageScrollerMouseLeave = (requireGalleryImageUrl) => {
    if(!isMobile.any() && requireGalleryImageUrl?.length > 0) {
      this.setState({ imageScroller : false },() => {
       
        setTimeout(() => {
          this.setState({showImageScroller: false});
          if (this.swiperRef.current && this.swiperRef.current.autoplay) {
            this.swiperRef.current.autoplay.stop();
          }
        }, 200);
        
      });
    }
   
  }
  renderImage() {
    const {
      product: { thumbnail_url, brand_name, product_type_6s, color, gallery_image_urls = [], sku },
      lazyLoad = true,
      requestedOptions,
    } = this.props;
    const { isArabic, colorVarientButtonClick, currentImage, colorVarientProductData } = this.state;
    const updateProductGalleryImageData =
      (colorVarientButtonClick &&
      colorVarientProductData &&
      Object.keys(colorVarientProductData)?.length !== 0)
        ? colorVarientProductData?.data?.gallery_image_urls
        : gallery_image_urls;
    const checkCatgeroyPath = () => {
      if (requestedOptions.hasOwnProperty("categories.level4") == 1) {
        return requestedOptions["categories.level4"];
      } else if (requestedOptions.hasOwnProperty("categories.level3") == 1) {
        return requestedOptions["categories.level3"];
      } else if (requestedOptions.hasOwnProperty("categories.level2") == 1) {
        return requestedOptions["categories.level2"];
      } else if (requestedOptions.hasOwnProperty("categories.level1") == 1) {
        return requestedOptions["categories.level1"];
      } else if (requestedOptions.hasOwnProperty("categories.level0") == 1) {
        return requestedOptions["categories.level0"];
      } else {
        return "";
      }
    };
    const categoryTitle = checkCatgeroyPath().split("///").pop();

    const altText =
      brand_name + " " + categoryTitle + " - " + color + " " + product_type_6s;

    const requireGalleryImageUrl =
    updateProductGalleryImageData?.length > 4
        ? updateProductGalleryImageData?.slice(0, 4)
        : updateProductGalleryImageData;
    return (
      <div block="ProductItem" elem="ImageBox" onMouseEnter={() =>this.handleImageScrollerMouseEnter(requireGalleryImageUrl)} onMouseLeave={() =>this.handleImageScrollerMouseLeave(requireGalleryImageUrl)}>
        {(isMobile.any() && requireGalleryImageUrl?.length > 0) || ((requireGalleryImageUrl?.length > 0 && this.state.imageScroller) || this.state.showImageScroller ) ? (
          <div className="swiperWrapper" style={{display: (this.state.showImageScroller || isMobile.any())? "block" : "none"}}>
          <SwiperSliderProduct
            gallery_image_urls={requireGalleryImageUrl}
            isArabic={isArabic}
            sku={sku}
            altText={altText}
            lazyLoad={lazyLoad}
            colorVarientButtonClick={colorVarientButtonClick}
            currentImage={currentImage}
            swiperRef={this.swiperRef}
            imageScroller={this.state.imageScroller}
            thumbnail_url={thumbnail_url}
          />
          {!isMobile.any() && this.renderExclusive(true)}
        </div>
        ) :null}
        {(!isMobile.any() || (isMobile.any() && requireGalleryImageUrl.length === 0)) && <div style={{display: this.state.showImageScroller ? "none" : "block"}}>
          <Image
            src={
              this.state.colorVarientButtonClick
                ? this.state.currentImage
                : thumbnail_url
            }
            alt={altText}
          />
          {this.renderExclusive(false)}
        </div>}
        {/* {this.renderOutOfStock()} */}
        {isMobile.any() ? this.renderColorVariantsMobile() : null}
      </div>
    );
  }


  getProductDetailsBySkuAlgolia = async(sku) => {
    try {
      if(sku){
        const response = await new Algolia()?.getProductBySku({ sku });
        const {
          data: { image_url = "", sku: productSku, brand_name = "", name = "", price = []},
        } = response;
        const defaultImage = "https://d3aud5mq3f80jd.cloudfront.net/static/media/fallback.bf804003.png";
        if(sku === productSku) {
          this.props.setColourVarientsButtonClick(true);
          this.setState({ colorVarientProductData : response, currentImage : image_url, colorVarientButtonClick: true, colorVarientBrandName : brand_name, colorVarientName : name, colorVarientPrice : price});
        }else {
          this.setState({ colorVarientProductData : "", currentImage : defaultImage, colorVarientButtonClick: true, colorVarientBrandName : "", colorVarientName : "", colorVarientPrice : [] });
        }
      }

      const {
        colorVarientProductData: {
          data,
          data: { objectID, name: ProductName, color },
        },
      } = this.state;

      // MoEngage Tracking Event for Color Varient Button click
      MOE_trackEvent(EVENT_COLOUR_VARIENT_CLICK, {
        country: getCountryFromUrl().toUpperCase(),
        language: getLanguageFromUrl().toUpperCase(),
        app6thstreet_platform: "Web",
        product_id: objectID || "",
        product_name: ProductName || "",
        number_of_colours_available: data?.["6s_also_available_count"] || 0,
        colour_name : color || "",
      });

      // GTM Tracking Event for Color Varient Button Click
      Event.dispatch(EVENT_COLOUR_VARIENT_CLICK, {
        product_id: objectID || "",
        product_name: ProductName || "",
        number_of_colours_available: data?.["6s_also_available_count"] || 0,
        colour_name: color || "",
      });

    } catch (e) {
      console.error(e);
    }
  }

  onChangeTheme = (sku) => {
    const { isdark } = this.state;
    this.setState({ isDark: !isdark, selectedOption: sku });
  };

  handleScroll = (scrollOffset) => {
    const adjustedOffset = this.state.isArabic ? -scrollOffset : scrollOffset;
    this.scrollRef.current.scrollLeft += adjustedOffset;
  }

  getInstockColorVarientsCount = () => {
    const { product = {} } = this.props
    const { colorVarientProductData = {} } = this.state
    let stockCount = 0;
    const updatedProductData = Object.keys(colorVarientProductData)?.length !== 0 ? colorVarientProductData?.data : product;
    if (
      updatedProductData &&
      Object.keys(updatedProductData)?.length > 0 &&
      updatedProductData?.["6s_also_available"]?.length > 0 &&
      updatedProductData?.["6s_also_available_color"] &&
      Object.keys(updatedProductData?.["6s_also_available_color"])?.length > 0
    ) {
      stockCount = Object?.values(
        updatedProductData?.["6s_also_available_color"]
      )?.reduce((count, item) => {
        if (item?.stock === "1") {
          return count + 1;
        }
        return count;
      }, 0);
    }
    return stockCount;
  }
  
  getArabicToEnglishColorTranslation = (color) => {
    const engColor = isArabic ? translateArabicColor(color) : color;
    const fixedColor = engColor?.toLowerCase()?.replace(/ /g, "_");
    const prodColor = SPECIAL_COLORS[fixedColor]
      ? SPECIAL_COLORS[fixedColor]
      : fixedColor;
    return prodColor;
  }

  renderColorVariants = () => {
    const { product = {}, product: { sku = "", color = "" } } = this.props;
    const { isdark = "", isArabic, selectedOption } = this.state;
    const productAlsoAvailableColors = ((product && Object.keys(product)?.length > 0 && Array.isArray(product?.["6s_also_available_color"])) ? product?.["6s_also_available_color"]?.length > 0 : product?.["6s_also_available_color"])
      ? [sku, ...Object.keys(product?.["6s_also_available_color"])]
      : [];
    
    let colorValue = "";
    if(!Array.isArray(color) && color) {
      colorValue = this.getArabicToEnglishColorTranslation(color);
    }else if(Array.isArray(color) && color?.length > 0) {
      colorValue = this.getArabicToEnglishColorTranslation(color[0]);
    }else {
      colorValue = "";
    }

    return (
      <div block="colorVariantContainer">
        {this.getInstockColorVarientsCount() > 0 ? (
          <>
            <button onClick={() => this.handleScroll(-30)}>
              {(productAlsoAvailableColors?.length > 7 && this.getInstockColorVarientsCount() > 7 )? (
                <span block="left-arrow" mods={{ isArabic }}></span>
              ) : null}
            </button>
            <div block="colorVariantSlider" ref={this.scrollRef}>
              {productAlsoAvailableColors?.map(
                (sku, index) =>
                  product?.["6s_also_available_color"]?.[sku]?.stock !== "0" && (
                    <div
                      key={index}
                      block="radio-label"
                      onClick={() => this.getProductDetailsBySkuAlgolia(sku)}
                    >
                      <input
                        block="radio-input"
                        type="radio"
                        name={isdark ? "dark" : "light"}
                        id={sku}
                        value={sku}
                        checked={selectedOption === sku}
                        onChange={() => this.onChangeTheme(sku)}
                        style={{
                          background:
                            product?.["6s_also_available_color"]?.[sku]?.color ||
                            colorValue,
                          boxShadow:
                            selectedOption === sku
                              ? `0px 0px 0px 0.5px ${
                                  product?.["6s_also_available_color"]?.[sku]
                                    ?.color || colorValue
                                }`
                              : "0px 0px 0px 0.5px #D1D3D4",
                        }}
                      />
                    </div>
                  )
              )}
            </div>
            <button onClick={() => this.handleScroll(30)}>
              {(productAlsoAvailableColors?.length > 7 && this.getInstockColorVarientsCount() > 7)? (
                <span block="right-arrow" mods={{ isArabic }}></span>
              ) : null}
            </button>
          </>
        ) : null}
      </div>
    );
  };

  renderBrand() {
    const {
      product: { brand_name },
    } = this.props;
    const { colorVarientBrandName } = this.state;
    const modifiedBrandName = ( colorVarientBrandName !== "" ) ? colorVarientBrandName : brand_name;
    return (
      <h2 block="ProductItem" elem="Brand">
        {" "}
        {modifiedBrandName}{" "}
      </h2>
    );
  }
  renderTitle() {
    const {
      product: { name },
    } = this.props;
    const { isArabic, colorVarientName } = this.state;
    const modifiedName = ( colorVarientName !== '' ) ? colorVarientName : name ; 
    return (
      <p
        block="ProductItem"
        elem="Title"
        mods={{
          isArabic,
        }}
      >
        {" "}
        {modifiedName}{" "}
      </p>
    );
  }

  renderPrice() {
    const {
      product: { price },
      page,
      pageType,
    } = this.props;
    const { colorVarientPrice  } = this.state;
    const modifiedPrice = (colorVarientPrice?.length !== 0 ) ? colorVarientPrice : price ; 
    if (!modifiedPrice || (Array.isArray(modifiedPrice) && !modifiedPrice[0])) {
      return null;
    }
    return (
      <Price
        price={modifiedPrice}
        page={page}
        renderSpecialPrice={true}
        pageType={pageType}
      />
    );
  }

  renderAddToCartOnHover() {
    const {
      product,
      pageType,
      removeFromWishlist,
      wishlist_item_id,
      position,
      qid,
      isVueData,
      isFilters,
    } = this.props;
    const { colorVarientProductData = {}, colorVarientProductData : { data = "" }, colorVarientButtonClick  } = this.state;
    const modifiedProductData = (colorVarientButtonClick && Object.keys(colorVarientProductData)?.length !== 0 ) ? data : product; 
    let price = Array.isArray(modifiedProductData?.price)
      ? Object.values(modifiedProductData?.price[0])
      : Object.values(modifiedProductData?.price);
    if (price[0].default === 0) {
      return null;
    }
    return (
      <div block="ProductItem" elem="AddToCart">
        <PLPAddToCart
          product={modifiedProductData}
          url={urlWithQueryID}
          pageType={pageType}
          removeFromWishlist={removeFromWishlist}
          wishlist_item_id={wishlist_item_id}
          influencerPDPURL={influencerPDPURL}
          position={position}
          qid={qid}
          isVueData={isVueData}
          isFilters={isFilters}
          colorVarientButtonClick={colorVarientButtonClick}
        />
      </div>
    );
  }

  renderLink() {
    const {
      product,
      product: { 
        url, 
        link,
        rating_brand,
        rating_sku,
      },
      qid,
      isVueData,
      prevPath = null,
      selectedGender,
      isStorePage,
      isCollectionPage,
      pageType,
      isNewDesign
    } = this.props;

    const { colorVarientProductData = {}, colorVarientProductData : { data = "" }, colorVarientButtonClick  } = this.state;
    const modifiedUrl = (colorVarientButtonClick && Object.keys(colorVarientProductData)?.length !== 0 ) ? data?.url : url; 
    const modifiedLink = (colorVarientButtonClick && Object.keys(colorVarientProductData)?.length !== 0 ) ? data?.link : link;

    let queryID;
    if (!isVueData) {
      if (!qid) {
        queryID = getStore().getState().SearchSuggestions.queryID;
      } else {
        queryID = qid;
      }
    }

    let pathname = "/";
    if (!isVueData && modifiedUrl) {
      try {
        pathname = new URL(modifiedUrl)?.pathname;
      } catch (err) {
        console.error(err);
      }
      if (queryID) {
        urlWithQueryID = `${pathname}?qid=${queryID}`;
      } else {
        urlWithQueryID = pathname;
      }
    } else {
      urlWithQueryID = modifiedUrl ? modifiedUrl : modifiedLink ? modifiedLink : link; // From api link and url both in different cases.
    }
    const gender = BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
      ? BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
      : "home";
    let requestedGender = isArabic ? getGenderInArabic(gender) : gender;

    let parseLink =
      isVueData && new URL(urlWithQueryID) && new URL(urlWithQueryID).origin
        ? urlWithQueryID.replace(new URL(urlWithQueryID).origin, "")
        : urlWithQueryID;

    const linkTo = {
      pathname: parseLink,
      state: {
        product,
        prevPath: prevPath,
      },
    };

    let influencerId = "";
    let collectionId = "";
    let influencerParseLink = "";
    if (influencerURL().includes(location.pathname)) {
      influencerId = getQueryParam("influencerID", location);
      collectionId = getQueryParam("influencerCollectionID", location);
      influencerParseLink =
        parseLink +
        `${parseLink.includes("?") ? "&" : "?"}` +
        `influencerID=${influencerId}&influencerCollectionID=${collectionId}` +
        `&selectedGender=${selectedGender}` +
        `&isStore=${isStorePage}&isCollection=${isCollectionPage}`;
      influencerPDPURL = influencerParseLink;
    }

    return (
      <Link
        to={
          influencerURL().includes(location.pathname)
            ? influencerPDPURL
            : isVueData
            ? parseLink
            : linkTo
        }
        onClick={this.handleClick}
        block="ProductItem" elem="ImgBlock"

      >
        {this.renderImage()}
        {isNewDesign && <Ratings rating_sku={rating_sku} rating_brand={rating_brand} className="PLPratings" />}
      </Link>
    );
  }

  renderAddToCartButton = (productInfo) => {
    return (
      <Suspense fallback={<div></div>}>
        <MsiteAddToCartPopUp productInfo={productInfo} />
      </Suspense>
    );
  };

  handleMouseEnter = () => {
    if (!this.state.hover) {
      this.setState({ hover: true, imageScroller : false });
    }
  };

  handleMouseLeave = () => {
    if (this.state.hover) {
      this.setState({ hover: false, imageScroller : false });
    }
  };


  render() {
    const { isArabic } = this.state;
    const {
      product: { sku, timer_start_time, timer_end_time, },
      pageType
    } = this.props;
    let setRef = (el) => {
      this.viewElement = el;
    };
    return (
      <li
        id={sku}
        ref={setRef}
        block="ProductItem"
        mods={{
          isArabic,
        }}
      >
        {" "}
        {this.renderLabel()}
        {pageType !== "cartSlider" && this.renderWishlistIcon()}
          {this.renderLink()}{" "}
        {pageType !== "cartSlider" &&
          pageType !== "wishlist" &&
          this.renderOutOfStock()}
        {!isMobile.any() ? this.renderColorVariants() : null}
        <div
          block="product-description-block"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          >
          {this.renderBrand()}
          {this.renderTitle()}
          {this.renderPrice()}
          {!isMobile.any() &&
          pageType !== "vuePlp" &&
          pageType !== "cart" &&
          pageType !== "cartSlider" &&
          this.state.hover &&
          this.renderAddToCartOnHover()}
        </div>
        <div className={isArabic ? "CountdownTimerArabic" : "CountdownTimer"}>
          {timer_start_time && timer_end_time && (
            <DynamicContentCountDownTimer
              start={timer_start_time}
              end={timer_end_time}
              isPLPOrPDP
            />
          )}
        </div>
        {isMobile.any() &&
          pageType === "wishlist" &&
          this.renderAddToCartButton(this.props.product)}
        
        {isMobile.any() &&  pageType !== "cartSlider" &&(
          <div className="tagsForMsiteProduct">
            {this.renderExclusiveMobile(true)}
          </div>
        )}

      </li>
    );
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProductItem)
);
