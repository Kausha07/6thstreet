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
  MOE_trackEvent,
} from "Util/Event";
import "./ProductItem.style";
import { setPrevPath } from "Store/PLP/PLP.action";
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

//Global Variable for PLP AddToCart
var urlWithQueryID;
var influencerPDPURL;
export const mapStateToProps = (state) => ({
  prevPath: state.PLP.prevPath,
  requestedOptions: state.PLP.options,
  selectedGender: state?.InfluencerReducer?.selectedGender,
  isStorePage: state?.InfluencerReducer?.isStorePage,
  isCollectionPage: state?.InfluencerReducer?.isCollectionPage,
});

export const mapDispatchToProps = (dispatch, state) => ({
  setPrevPath: (prevPath) => dispatch(setPrevPath(prevPath)),
  resetProduct: () => PDPDispatcher.resetProduct({}, dispatch),
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

  state = {
    isArabic: isArabic(),
    stockAvailibility: true,
    selectedSizeType: "eu",
    selectedSizeCode: "",
    hover: false
  };
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
    if (pageUrl.pathname == "/catalogsearch/result/" && (page == "plp")) {
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
    } else if ((page == "plp" && pageUrl.pathname.includes(".html"))) {
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
    if (queryID && position && position > 0 && product.objectID && userToken) {
      new Algolia().logAlgoliaAnalytics("click", SELECT_ITEM_ALGOLIA, [], {
        objectIDs: [product.objectID],
        queryID,
        userToken: userToken,
        position: [position],
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

  renderExclusive() {
    const {
      product: { promotion },
    } = this.props;

    if (promotion !== undefined) {
      return promotion !== null ? (
        <div block="PLPSummary" elem="Exclusive">
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

  renderImage() {
    const {
      product: { thumbnail_url, brand_name, product_type_6s, color },
      lazyLoad = true,
      requestedOptions,
    } = this.props;

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
    return (
      <div block="ProductItem" elem="ImageBox">
        <Image lazyLoad={lazyLoad} src={thumbnail_url} alt={altText} />
        {/* {this.renderOutOfStock()} */}
        {this.renderExclusive()}
        {this.renderColors()}
      </div>
    );
  }

  renderBrand() {
    const {
      product: { brand_name },
    } = this.props;
    return (
      <h2 block="ProductItem" elem="Brand">
        {" "}
        {brand_name}{" "}
      </h2>
    );
  }
  renderTitle() {
    const {
      product: { name },
    } = this.props;
    const { isArabic } = this.state;

    return (
      <p
        block="ProductItem"
        elem="Title"
        mods={{
          isArabic,
        }}
      >
        {" "}
        {name}{" "}
      </p>
    );
  }

  renderPrice() {
    const {
      product: { price },
      page,
      pageType,
    } = this.props;
    if (!price || (Array.isArray(price) && !price[0])) {
      return null;
    }
    return (
      <Price
        price={price}
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
    let price = Array.isArray(product.price)
      ? Object.values(product.price[0])
      : Object.values(product.price);
    if (price[0].default === 0) {
      return null;
    }
    return (
      <div block="ProductItem" elem="AddToCart">
        <PLPAddToCart
          product={this.props.product}
          url={urlWithQueryID}
          pageType={pageType}
          removeFromWishlist={removeFromWishlist}
          wishlist_item_id={wishlist_item_id}
          influencerPDPURL={influencerPDPURL}
          position={position}
          qid={qid}
          isVueData={isVueData}
          product_Position={position}
          isFilters={isFilters}
        />
      </div>
    );
  }

  renderLink() {
    const {
      product,
      product: { url, link },
      qid,
      isVueData,
      prevPath = null,
      selectedGender,
      isStorePage,
      isCollectionPage,
      pageType,
    } = this.props;
    let queryID;
    if (!isVueData) {
      if (!qid) {
        queryID = getStore().getState().SearchSuggestions.queryID;
      } else {
        queryID = qid;
      }
    }

    let pathname = "/";
    if (!isVueData && url) {
      try {
        pathname = new URL(url)?.pathname;
      } catch (err) {
        console.error(err);
      }
      if (queryID) {
        urlWithQueryID = `${pathname}?qid=${queryID}`;
      } else {
        urlWithQueryID = pathname;
      }
    } else {
      urlWithQueryID = url ? url : link ? link : link; // From api link and url both in different cases.
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
      >
        {this.renderImage()}
        {pageType !== "cartSlider" && 
          pageType !== "wishlist" &&  
          this.renderOutOfStock()}
        {this.renderBrand()}
        {this.renderTitle()}
        {this.renderPrice()}
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
    if(!this.state.hover) {
      this.setState({hover: true});
    } 
  };

  handleMouseLeave = () => {
    if(this.state.hover) {
      this.setState({hover: false});
    }
  };

  render() {
    const { isArabic } = this.state;
    const {
      product: { sku, timer_start_time, timer_end_time, },
      pageType,    
    } = this.props;
    let setRef = (el) => {
      this.viewElement = el;
    };
    return (
      <li
        id={sku}
        ref={setRef}
        block="ProductItem"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        mods={{
          isArabic,
        }}
      >
        {" "}
        {this.renderLabel()}
        {pageType !== "cartSlider" && this.renderWishlistIcon()}
        {this.renderLink()}{" "}
        <div className= {isArabic ? "CountdownTimerArabic" : "CountdownTimer"}>
         {timer_start_time && timer_end_time && <DynamicContentCountDownTimer start={timer_start_time} end={timer_end_time} isPLPOrPDP />}
        </div> 
        {!isMobile.any() &&
          pageType !== "vuePlp" &&
          pageType !== "cart" &&
          pageType !== "cartSlider" &&
          this.state.hover &&
          this.renderAddToCartOnHover()}
        {isMobile.any() &&
          pageType === "wishlist" &&
          this.renderAddToCartButton(this.props.product)}
      </li>
    );
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProductItem)
);
