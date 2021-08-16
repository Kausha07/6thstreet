import Link from "Component/Link";
import Loader from "Component/Loader";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import { Products } from "Util/API/endpoint/Product/Product.type";
import {
  formatQuerySuggestions,
  getGenderInArabic,
  getHighlightedText,
} from "Util/API/endpoint/Suggestions/Suggestions.create";
import { WishlistItems } from "Util/API/endpoint/Wishlist/Wishlist.type";
import { isArabic } from "Util/App";
import { getCurrency } from "Util/App/App";
import BrowserDatabase from "Util/BrowserDatabase";
import Event, {
  EVENT_GTM_BRANDS_CLICK,
  EVENT_GTM_PRODUCT_CLICK,
  EVENT_GTM_TRENDING_BRANDS_CLICK,
  EVENT_GTM_TRENDING_TAGS_CLICK,
} from "Util/Event";
import isMobile from "Util/Mobile";
import TrendingProductsVueSliderContainer from "../TrendingProductsVueSlider";
import WishlistSliderContainer from "../WishlistSlider";
import BRAND_MAPPING from "./SearchSiggestion.config";
import "./SearchSuggestion.style";

var ESCAPE_KEY = 27;

class SearchSuggestion extends PureComponent {
  static propTypes = {
    inNothingFound: PropTypes.bool.isRequired,
    isEmpty: PropTypes.bool.isRequired,
    isActive: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    products: Products.isRequired,
    brands: PropTypes.array.isRequired,
    trendingBrands: PropTypes.array.isRequired,
    trendingTags: PropTypes.array.isRequired,
    hideActiveOverlay: PropTypes.func,
    querySuggestions: PropTypes.array,
    topSearches: PropTypes.array,
    recentSearches: PropTypes.array,
    // recommendedForYou: PropTypes.array,
    trendingProducts: PropTypes.array,
    searchString: PropTypes.string,
    wishlistData: WishlistItems.isRequired,
  };

  static defaultProps = {
    hideActiveOverlay: () => {},
  };

  state = {
    isArabic: isArabic(),
    isMobile: isMobile.any() || isMobile.tablet(),
  };

  componentDidMount() {
    document.addEventListener("keydown", this._handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown);
  }

  _handleKeyDown = (event) => {
    switch (event.keyCode) {
      case ESCAPE_KEY:
        this.props.closeSearch();
        break;
      default:
        break;
    }
  };

  getKeyByValue = (object, value) => {
    return Object.keys(object).find((key) => object[key] === value);
  };

  getBrandUrl = (brandName) => {
    const { isArabic } = this.state;
    let name = brandName;
    if (isArabic) {
      name = this.getKeyByValue(BRAND_MAPPING, brandName);
    }

    name = name ? name : brandName;
    const urlName = name
      ?.replace(/'/g, "")
      .replace(/[(\s+).&]/g, "-")
      .replace(/-{2,}/g, "-")
      .replace(/\-$/, "")
      .replace("@", "at")
      .toLowerCase();
    // .replace("&", "")
    // .replace(/'/g, "")
    // .replace(/(\s+)|--/g, "-")
    // .replace("@", "at")
    // .toLowerCase();
    return urlName;
  };

  // query suggestion block starts

  getBrandSuggestionUrl = (brandName, queryID) => {
    const { isArabic } = this.state;
    let brandUrl;
    let formattedBrandName;
    const { gender } = BrowserDatabase.getItem(APP_STATE_CACHE_KEY) || {};
    if (isArabic) {
      let requestedGender = getGenderInArabic(gender);
      let arabicAlphabetDigits =
        /[\u0600-\u06ff]|[\u0750-\u077f]|[\ufb50-\ufc3f]|[\ufe70-\ufefc]|[\u0200]|[\u00A0]/g;
      if (arabicAlphabetDigits.test(brandName)) {
        formattedBrandName = brandName.match("\\s*[^a-zA-Z]+\\s*");
        brandName = formattedBrandName[0].trim();
      }
      brandUrl = `${this.getBrandUrl(
        brandName
      )}.html?q=${brandName}&qid=${queryID}&dFR[gender][0]=${requestedGender}`;
    } else {
      formattedBrandName = brandName
        .toUpperCase()
        .split(" ")
        .filter(function (allItems, i, a) {
          return i == a.indexOf(allItems.toUpperCase());
        })
        .join(" ")
        .toLowerCase();
      brandUrl = `${this.getBrandUrl(
        formattedBrandName
      )}.html?q=${formattedBrandName}&qid=${queryID}&dFR[gender][0]=${gender}`;
    }
    return brandUrl;
  };

  getCatalogUrl = (query, gender, queryID) => {
    const { isArabic } = this.state;
    let requestedGender = gender;
    if (isArabic) {
      requestedGender = getGenderInArabic(gender);
    }
    const catalogUrl = `/catalogsearch/result/?q=${formatQuerySuggestions(
      query
    )}&qid=${queryID}&p=0&dFR[gender][0]=${requestedGender}`;
    return catalogUrl;
  };

  // query suggestion block ends

  discountPercentage(basePrice, specialPrice, haveDiscount) {
    let discountPercentage = Math.round(100 * (1 - specialPrice / basePrice));
    if (discountPercentage === 0) {
      discountPercentage = 1;
    }

    return (
      <span
        block="SearchProduct"
        elem="Discount"
        mods={{ discount: haveDiscount }}
      >
        -({discountPercentage}%)<span> </span>
      </span>
    );
  }

  closeSearchPopup = () => {
    this.props.closeSearch();
  };

  logRecentSearches = (search) => {
    let recentSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    let tempRecentSearches = [];
    if (recentSearches) {
      tempRecentSearches = [...recentSearches.reverse()];
    }
    tempRecentSearches = tempRecentSearches.filter(
      (item) => item.name !== search
    );
    if (tempRecentSearches.length > 4) {
      tempRecentSearches.shift();
      tempRecentSearches.push({
        name: search,
      });
    } else {
      tempRecentSearches.push({ name: search });
    }
    localStorage.setItem(
      "recentSearches",
      JSON.stringify(tempRecentSearches.reverse())
    );
  };

  // common function for top search, recent search, query suggestion search.
  onSearchQueryClick = (search) => {
    const { closeSearch } = this.props;
    this.logRecentSearches(search);
    closeSearch();
  };

  handleProductClick = (product) => {
    Event.dispatch(EVENT_GTM_PRODUCT_CLICK, product);
    this.closeSearchPopup();
  };

  handleBrandsClick = (brandItem) => {
    const { closeSearch } = this.props;
    Event.dispatch(EVENT_GTM_BRANDS_CLICK, brandItem);
    closeSearch();
  };

  handleTrendingBrandsClick = (brandName) => {
    const { closeSearch } = this.props;
    Event.dispatch(EVENT_GTM_TRENDING_BRANDS_CLICK, brandName);
    closeSearch();
  };

  handleTrendingTagsClick = (label) => {
    const { closeSearch } = this.props;
    Event.dispatch(EVENT_GTM_TRENDING_TAGS_CLICK, label);
    closeSearch();
  };

  // render functions

  renderBrand = (brand) => {
    const { brand_name: name = "", count } = brand;
    const urlName = this.getBrandUrl(name);

    return (
      <li>
        <Link
          to={`/${urlName}.html?q=${urlName}`}
          onClick={() => this.handleBrandsClick(urlName)}
        >
          <div className="suggestion-details-box">
            {name}
            <div>{count}</div>
          </div>
        </Link>
      </li>
    );
  };

  renderLoader() {
    const { isLoading } = this.props;
    const { isMobile } = this.state;

    return isMobile ? null : <Loader isLoading={isLoading} />;
  }

  renderBrands() {
    const { brands = [] } = this.props;

    return (
      <div block="SearchSuggestion" elem="Brands">
        <h2>{__("Brands")}</h2>
        <ul>{brands.map(this.renderBrand)}</ul>
      </div>
    );
  }

  renderQuerySuggestion = (querySuggestions) => {
    const { query, count, isBrand } = querySuggestions;
    const { searchString, queryID } = this.props;
    const { gender } = BrowserDatabase.getItem(APP_STATE_CACHE_KEY) || {};
    return (
      <li>
        {isBrand ? (
          <Link
            to={encodeURI(
              this.getBrandSuggestionUrl(formatQuerySuggestions(query), queryID)
            )}
            onClick={() =>
              this.onSearchQueryClick(formatQuerySuggestions(query))
            }
          >
            <div className="suggestion-details-box">
              {getHighlightedText(formatQuerySuggestions(query), searchString)}
              <div>{count}</div>
            </div>
          </Link>
        ) : (
          <Link
            to={encodeURI(this.getCatalogUrl(query, gender, queryID))}
            onClick={() =>
              this.onSearchQueryClick(formatQuerySuggestions(query))
            }
          >
            <div className="suggestion-details-box">
              {getHighlightedText(formatQuerySuggestions(query), searchString)}
              <div>{count}</div>
            </div>
          </Link>
        )}
      </li>
    );
  };

  renderQuerySuggestions() {
    const { querySuggestions = [] } = this.props;
    return (
      <div block="SearchSuggestion" elem="Item">
        <ul>{querySuggestions.slice(0, 5).map(this.renderQuerySuggestion)}</ul>
      </div>
    );
  }

  renderSpecialPrice(specialPrice, haveDiscount) {
    const currency = getCurrency();
    return (
      <span
        block="SearchProduct"
        elem="SpecialPrice"
        mods={{ discount: haveDiscount }}
      >
        {currency}
        <span> </span>
        {specialPrice}
      </span>
    );
  }

  renderPrice = (price) => {
    // if (price && price.length > 0) {
    //   const priceObj = price[0],
    //     currency = getCurrency();
    //   const priceToShow = priceObj[currency]["6s_base_price"];
    //   return (
    //     <span
    //       block="SearchProduct"
    //       elem="Price"
    //     >{`${currency} ${priceToShow}`}</span>
    //   );
    // }
    // return null;

    if (price && price.length > 0) {
      const priceObj = price[0],
        currency = getCurrency();
      const basePrice = priceObj[currency]["6s_base_price"];
      const specialPrice = priceObj[currency]["6s_special_price"];
      const haveDiscount =
        specialPrice !== "undefined" &&
        specialPrice &&
        basePrice !== specialPrice;

      if (basePrice === specialPrice || !specialPrice) {
        return <span id="price">{`${currency} ${basePrice}`}</span>;
      }

      return (
        <div block="SearchProduct" elem="SpecialPriceCon">
          <del block="SearchProduct" elem="Del">
            <span id="price">{`${currency} ${basePrice}`}</span>
          </del>
          <span block="SearchProduct" elem="PriceWrapper">
            {this.discountPercentage(basePrice, specialPrice, haveDiscount)}
            {this.renderSpecialPrice(specialPrice, haveDiscount)}
          </span>
        </div>
      );
    }
    return null;
  };

  renderProduct = (product) => {
    const { url, name, thumbnail_url, brand_name, price } = product;

    return (
      <li>
        <Link to={url} onClick={() => this.handleProductClick(product)}>
          <div block="SearchProduct">
            <img
              src={thumbnail_url}
              alt="Product Image"
              block="SearchProduct"
              elem="Image"
            />
            <div block="SearchProduct" elem="Info">
              <h6 block="SearchProduct" elem="Brand">
                {brand_name}
              </h6>
              <span block="SearchProduct" title={name} elem="ProductName">
                {name}
              </span>
              {this.renderPrice(price)}
            </div>
          </div>
        </Link>
      </li>
    );
  };

  renderProducts() {
    const { products = [] } = this.props;

    return (
      <div block="SearchSuggestion" elem="Recommended">
        {/* <h2>{__("Trending Products")}</h2> */}
        <ul>{products.map(this.renderProduct)}</ul>
      </div>
    );
  }

  renderSuggestions() {
    return (
      <>
        {this.renderQuerySuggestions()}
        {/* {this.renderBrands()} */}
        {this.renderWishlistProducts()}
        {this.renderProducts()}
      </>
    );
  }

  renderNothingFound() {
    const { searchString } = this.props;
    return (
      <>
        <div block="NothingFound">
          <p>
            {__("No result found for")} &nbsp;
            <span>{searchString}</span>
            {__(" but here are few suggestions")}
          </p>
        </div>
        {this.renderRecentSearches()}
        {this.renderTopSearches()}
        {this.renderTrendingBrands()}
        {/* {this.renderRecommendedForYou()} */}
        {this.renderTrendingProducts()}
        {this.renderTrendingTags()}
      </>
    );
  }

  // recommended for you

  // renderRecommendedForYou = () => {
  //   const { recommendedForYou } = this.props;
  //   if (recommendedForYou && recommendedForYou.length > 0) {
  //     return (
  //       <div className="recommendedForYouSliderBox">
  //         <DynamicContentVueProductSliderContainer
  //           widgetID="vue_trending_slider"
  //           products={recommendedForYou}
  //           heading={__("Recommended for you")}
  //           key={`DynamicContentVueProductSliderContainer99`}
  //         />
  //       </div>
  //     );
  //   }
  // };

  renderTrendingProducts = () => {
    const { trendingProducts } = this.props;
    if (trendingProducts && trendingProducts.length > 0) {
      return (
        <div className="recommendedForYouSliderBox">
          <TrendingProductsVueSliderContainer
            widgetID="vue_trending_slider"
            products={trendingProducts}
            isHome={true}
            heading={__("Trending products")}
            key={`TrendingProductsVueSliderContainer`}
          />
        </div>
      );
    }
  };

  renderWishlistProducts = () => {
    const { wishlistData, searchString } = this.props;
    if (wishlistData && wishlistData.length > 0) {
      console.log("wishlistData", wishlistData);
      let filteredWishlist =
        wishlistData.filter(
          (item) =>
            item.product.brand_name
              .toUpperCase()
              .includes(searchString.toUpperCase()) ||
            item.product.name
              .toUpperCase()
              .includes(searchString.toUpperCase()) ||
            item.product.sku.toUpperCase().includes(searchString.toUpperCase())
        ) || [];
      return (
        <div className="wishlistSliderContainer">
          <WishlistSliderContainer
            products={
              searchString && filteredWishlist.length > 0
                ? filteredWishlist
                : wishlistData
            }
            heading={__("Your Wishlist")}
            key={`Wishlist`}
            isHome={true}
          />
        </div>
      );
    }
  };

  renderTrendingBrand = (brand, i) => {
    const { label = "", image_url } = brand;
    const { isArabic } = this.state;
    const { gender } = BrowserDatabase.getItem(APP_STATE_CACHE_KEY) || {};
    let requestedGender = isArabic ? getGenderInArabic(gender) : gender;
    const urlName = label
      .replace("&", "")
      .replace(/'/g, "")
      .replace(/(\s+)|--/g, "-")
      .replace("@", "at")
      .toLowerCase();

    return (
      <li key={i}>
        <Link
          to={`/${urlName}.html?q=${urlName}&dFR[gender][0]=${requestedGender}`}
          onClick={() => this.handleTrendingBrandsClick(urlName)}
        >
          <div block="SearchSuggestion" elem="TrandingImg">
            <img src={image_url} alt="Trending" />
            {label}
          </div>
        </Link>
      </li>
    );
  };

  renderTrendingBrands() {
    const { trendingBrands = [] } = this.props;

    return (
      <div block="TrandingBrands">
        <h2>{__("Trending brands")}</h2>
        <ul>{trendingBrands.map(this.renderTrendingBrand)}</ul>
      </div>
    );
  }

  renderTrendingTag = ({ link, label }, i) => (
    <li key={i}>
      <Link
        to={{ pathname: link }}
        onClick={() => this.handleTrendingTagsClick(label)}
      >
        <div block="SearchSuggestion" elem="TrandingTag">
          {label}
        </div>
      </Link>
    </li>
  );

  renderTrendingTags() {
    const { trendingTags = [] } = this.props;

    return (
      <div block="TrandingTags">
        <h2>{__("Trending tags")}</h2>
        <ul>{trendingTags.map(this.renderTrendingTag)}</ul>
      </div>
    );
  }

  renderTopSearch = ({ search, link }, i) => {
    const { isArabic } = this.state;
    const { gender } = BrowserDatabase.getItem(APP_STATE_CACHE_KEY) || {};
    let requestedGender = isArabic ? getGenderInArabic(gender) : gender;
    return (
      <li key={i}>
        <Link
          to={
            link
              ? link
              : `/catalogsearch/result/?q=${search}&dFR[gender][0]=${requestedGender}`
          }
          onClick={() => this.onSearchQueryClick(search)}
        >
          <div block="SearchSuggestion" elem="TopSearches">
            {search}
          </div>
        </Link>
      </li>
    );
  };

  renderTopSearches() {
    const { topSearches = [] } = this.props;
    return (
      <div block="TopSearches">
        <h2>{__("Top searches")}</h2>
        <ul>{topSearches.map(this.renderTopSearch)}</ul>
      </div>
    );
  }

  // recent searches

  renderRecentSearch = ({ name, link }, i) => {
    const { isArabic } = this.state;
    const { gender } = BrowserDatabase.getItem(APP_STATE_CACHE_KEY) || {};
    let requestedGender = isArabic ? getGenderInArabic(gender) : gender;
    return (
      <li key={i}>
        <Link
          to={
            link
              ? link
              : `/catalogsearch/result/?q=${name}&dFR[gender][0]=${requestedGender}`
          }
          onClick={() => this.onSearchQueryClick(name)}
        >
          <div block="SearchSuggestion" elem="TopSearches">
            {name}
          </div>
        </Link>
      </li>
    );
  };

  renderRecentSearches() {
    const { recentSearches = [] } = this.props;
    return recentSearches.length > 0 ? (
      <div block="RecentSearches">
        <h2>{__("Recent searches")}</h2>
        <ul>{recentSearches.map(this.renderRecentSearch)}</ul>
      </div>
    ) : null;
  }

  renderEmptySearch() {
    return (
      <>
        {this.renderRecentSearches()}
        {this.renderTopSearches()}
        {this.renderTrendingBrands()}
        {/* {this.renderRecommendedForYou()} */}
        {this.renderTrendingProducts()}
        {this.renderWishlistProducts()}
        {this.renderTrendingTags()}
      </>
    );
  }

  renderContent() {
    const {
      isActive,
      isEmpty,
      inNothingFound,
      querySuggestions = [],
    } = this.props;
    if (!isActive) {
      return null;
    }

    if (isEmpty && isActive) {
      return this.renderEmptySearch();
    }

    if (inNothingFound && querySuggestions.length === 0) {
      return this.renderNothingFound();
    }

    return this.renderSuggestions();
  }

  renderCloseButton() {
    const { closeSearch } = this.props;
    const { isArabic, isMobile } = this.state;
    if (!isMobile) {
      return null;
    }
    const svg = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 -1 26 26"
      >
        <path
          d="M23.954 21.03l-9.184-9.095 9.092-9.174-1.832-1.807-9.09 9.179-9.176-9.088-1.81
                  1.81 9.186 9.105-9.095 9.184 1.81 1.81 9.112-9.192 9.18 9.1z"
        />
      </svg>
    );

    return (
      <div block="SearchSuggestion" elem="CloseContainer" mods={{ isArabic }}>
        <button
          block="CloseContainer"
          elem="Close"
          mods={{ isArabic }}
          onClick={closeSearch}
        >
          {svg}
        </button>
      </div>
    );
  }
  render() {
    const { isArabic } = this.state;
    return (
      <div block="SearchSuggestion" mods={{ isArabic }}>
        <div block="SearchSuggestion" elem="Content">
          {this.renderCloseButton()}
          {/* {this.renderLoader()} */}
          {this.renderContent()}
        </div>
        <div block="SearchSuggestion" elem="ShadeWrapper">
          <div block="SearchSuggestion" elem="Shade" />
        </div>
      </div>
    );
  }
}

export default SearchSuggestion;
