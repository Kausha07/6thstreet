import Link from "Component/Link";
import Loader from "Component/Loader";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { Products } from "Util/API/endpoint/Product/Product.type";
import { isArabic } from "Util/App";
import { getCurrency } from "Util/App/App";
import isMobile from "Util/Mobile";
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
    newHits: PropTypes.array,
    topSearches: PropTypes.array,
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
      .replace(/'/g, "")
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
          {name}
          <span>{count}</span>
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

  renderQuerySuggestion = (newHit) => {
    const { query, count } = newHit;

    const urlName = this.getBrandUrl(query);

    return (
      <li>
        <Link
          to={`/${urlName}.html?q=${urlName}`}
          onClick={this.closeSearchPopup}
        >
          {query}
          <span>{count}</span>
        </Link>
      </li>
    );
  };

  renderQuerySuggestions() {
    const { newHits = [] } = this.props;

    return (
      <div block="SearchSuggestion" elem="Item">
        <ul>{newHits.map(this.renderQuerySuggestion)}</ul>
      </div>
    );
  }

  renderPrice = (price) => {
    if (price && price.length > 0) {
      const priceObj = price[0],
        currency = getCurrency();
      const priceToShow = priceObj[currency]["6s_base_price"];
      return (
        <span
          block="SearchProduct"
          elem="Price"
        >{`${currency} ${priceToShow}`}</span>
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
        <h2>{__("Recommended")}</h2>
        <ul>{products.map(this.renderProduct)}</ul>
      </div>
    );
  }

  renderSuggestions() {
    return (
      <>
        {this.renderQuerySuggestions()}
        {this.renderBrands()}
        {this.renderProducts()}
      </>
    );
  }

  renderNothingFound() {
    return <div block="NothingFound">{__("No result found")}</div>;
  }
  closeSearchPopup = () => {
    this.props.closeSearch();
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

  renderTopSearch = ({ search }, i) => (
    <li key={i}>
      <Link to={{ pathname: search }} onClick={this.closeSearchPopup}>
        <div block="SearchSuggestion" elem="TrandingTag">
          {search}
        </div>
      </Link>
    </li>
  );

  renderTopSearches() {
    const { topSearches = [] } = this.props;
    console.log("topSearches", topSearches);
    return (
      <div block="TrandingTags">
        <h2>{__("Top searches")}</h2>
        <ul>{topSearches.map(this.renderTopSearch)}</ul>
      </div>
    );
  }

  renderEmptySearch() {
    return (
      <>
        {this.renderTopSearches()}
        {this.renderTrendingBrands()}
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
    const { newHits } = this.props;
    console.log("newHits", newHits);
    return (
      <div block="SearchSuggestion" mods={{ isArabic }}>
        <div block="SearchSuggestion" elem="Content">
          {this.renderCloseButton()}
          {this.renderLoader()}
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
