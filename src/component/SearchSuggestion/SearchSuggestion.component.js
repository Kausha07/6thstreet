import Link from "Component/Link";
import Loader from "Component/Loader";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import { Products } from "Util/API/endpoint/Product/Product.type";
import {
  formatQuerySuggestions,
  getHighlightedText,
} from "Util/API/endpoint/Suggestions/Suggestions.create";
import { isArabic } from "Util/App";
import { getCurrency } from "Util/App/App";
import BrowserDatabase from "Util/BrowserDatabase";
import isMobile from "Util/Mobile";
import DynamicContentVueProductSliderContainer from "../DynamicContentVueProductSlider";
import BRAND_MAPPING from "./SearchSiggestion.config";
import "./SearchSuggestion.style";
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
  };

  static defaultProps = {
    hideActiveOverlay: () => {},
  };

  state = {
    isArabic: isArabic(),
    isMobile: isMobile.any() || isMobile.tablet(),
  };

  renderLoader() {
    const { isLoading } = this.props;
    const { isMobile } = this.state;

    return isMobile ? null : <Loader isLoading={isLoading} />;
  }

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

  renderBrand = (brand) => {
    const { brand_name: name = "", count } = brand;
    const urlName = this.getBrandUrl(name);

    return (
      <li>
        <Link
          to={`/${urlName}.html?q=${urlName}`}
          onClick={this.closeSearchPopup}
        >
          <div className="suggestion-details-box">
            {name}
            <div>{count}</div>
          </div>
        </Link>
      </li>
    );
  };

  renderBrands() {
    const { brands = [] } = this.props;

    return (
      <div block="SearchSuggestion" elem="Brands">
        <h2>{__("Brands")}</h2>
        <ul>{brands.map(this.renderBrand)}</ul>
      </div>
    );
  }

  // query suggestion block starts

  getBrandSuggestionUrl = (brandName, queryID) => {
    const { isArabic } = this.state;
    let brandUrl;
    let formattedBrandName;
    const { gender } = BrowserDatabase.getItem(APP_STATE_CACHE_KEY) || {};
    if (isArabic) {
      let requestedGender = this.getGenderInArabic(gender);
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
      requestedGender = this.getGenderInArabic(gender);
    }
    const catalogUrl = `/catalogsearch/result/?q=${formatQuerySuggestions(
      query
    )}&qid=${queryID}&p=0&dFR[gender][0]=${requestedGender}`;
    return catalogUrl;
  };

  getGenderInArabic = (gender) => {
    switch (gender) {
      case "men":
        return "رجال";
      case "women":
        return "نساء";
      case "kids":
        return "أطفال";
    }
  };

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
        <Link to={url} onClick={this.closeSearchPopup}>
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
            {__("No result found for")}
            <span>{query}</span>
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
          <DynamicContentVueProductSliderContainer
            widgetID="vue_trending_slider"
            products={trendingProducts}
            heading={__("Trending products")}
            key={`DynamicContentVueProductSliderContainer99`}
          />
        </div>
      );
    }
  };
  renderTrendingBrand = (brand, i) => {
    const { label = "", image_url } = brand;

    const urlName = label
      .replace("&", "")
      .replace(/'/g, "")
      .replace(/(\s+)|--/g, "-")
      .replace("@", "at")
      .toLowerCase();

    return (
      <li key={i}>
        <Link
          to={`/${urlName}.html?q=${urlName}`}
          onClick={this.closeSearchPopup}
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
      <Link to={{ pathname: link }} onClick={this.closeSearchPopup}>
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
    return (
      <li key={i}>
        <Link
          to={link ? link : `/catalogsearch/result/?q=${search}`}
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
    return (
      <li key={i}>
        <Link
          to={link ? link : `/catalogsearch/result/?q=${name}`}
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
        {this.renderTrendingTags()}
      </>
    );
  }

  renderContent() {
    const { isActive, isEmpty, inNothingFound } = this.props;

    if (!isActive) {
      return null;
    }

    if (isEmpty && isActive) {
      return this.renderEmptySearch();
    }

    if (inNothingFound) {
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
