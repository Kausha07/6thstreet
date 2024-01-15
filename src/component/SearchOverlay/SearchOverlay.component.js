import { v4 } from "uuid";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import history from "Util/History";
import { getCurrency } from "Util/App/App";
import Algolia from "Util/API/provider/Algolia";
import BrowserDatabase from "Util/BrowserDatabase";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { Products } from "Util/API/endpoint/Product/Product.type";
import {
  getGenderInArabic,
  getHighlightedText,
} from "Util/API/endpoint/Suggestions/Suggestions.create";
import Event, {
  EVENT_CLICK_RECENT_SEARCHES_CLICK,
  EVENT_CLICK_SEARCH_QUERY_SUGGESSTION_CLICK,
  EVENT_GTM_NO_RESULT_SEARCH_SCREEN_VIEW,
  EVENT_GTM_PRODUCT_CLICK,
  EVENT_GTM_TRENDING_BRANDS_CLICK,
  EVENT_MOE_TRENDING_BRANDS_CLICK,
  EVENT_SEARCH_SUGGESTION_PRODUCT_CLICK,
  EVENT_GTM_SEARCH,
  EVENT_GTM_VIEW_SEARCH_RESULTS,
  MOE_trackEvent,
  SELECT_ITEM_ALGOLIA,
} from "Util/Event";
import { getUUIDToken } from "Util/Auth";
import { getStore } from "Store";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";

import Link from "Component/Link";
import Image from "Component/Image";
import Price from "Component/Price";
import ClickOutside from "Component/ClickOutside";
import { SEARCH_OVERLAY } from "Component/Header/Header.config";
import "./SearchOverlay.style";

import { LocationType } from "Type/Common";

export const mapStateToProps = (state) => ({
  indexCodeRedux: state.SearchSuggestions.algoliaIndex?.indexName,
});
export const mapDispatchToProps = (_dispatch) => ({

});

export class SearchOverlay extends PureComponent {
  static propTypes = {
    onVisible: PropTypes.func,
    showOverlay: PropTypes.func.isRequired,
    hideActiveOverlay: PropTypes.func.isRequired,
    closePopup: PropTypes.func.isRequired,
    handleViewBagClick: PropTypes.func.isRequired,
    querySuggestions: PropTypes.array,
    products: Products.isRequired,
    isHidden: PropTypes.bool,
    hideActiveOverlay: PropTypes.func,
    newTrendingBrands: PropTypes.array.isRequired,
    location: LocationType.isRequired,
  };

  static defaultProps = {
    isHidden: false,
    onVisible: () => {},
    hideActiveOverlay: () => {},
  };

  state = {
    isArabic: isArabic(),
    isPopup: false,
  };

  componentDidMount() {
    const { showOverlay } = this.props;
    if (!isMobile.any()) {
      showOverlay(SEARCH_OVERLAY);
    }
  }

  onCloseClick = () => {
    this.setState({ isPopup: true });
  };

  logRecentSearches = (search) => {
    let recentSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    let tempRecentSearches = [];
    if (recentSearches) {
      tempRecentSearches = [...recentSearches.reverse()];
    }
    tempRecentSearches = tempRecentSearches.filter(
      (item) => item.name.toUpperCase().trim() !== search.toUpperCase().trim()
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

  onSearchQueryClick = (search) => {
    const { closePopup, setPrevPath } = this.props;
    this.logRecentSearches(search);
    setPrevPath(window.location.href);
    closePopup();
  };

  onGenderSelection = (gender) => {
    const { isArabic } = this.state;
    let requestedGender = gender;
    let genderInURL;
    if (isArabic) {
      if (gender === "kids") {
        genderInURL = "أولاد,بنات";
        // to add Boy~Girl in arabic
      } else if (gender === "all") {
        genderInURL = "أولاد,بنات,نساء,رجال";
      } else {
        if (gender !== "home") {
          requestedGender = getGenderInArabic(gender);
          genderInURL = requestedGender?.replace(
            requestedGender?.charAt(0),
            requestedGender?.charAt(0).toUpperCase()
          );
        } else {
          genderInURL = "";
        }
      }
    } else {
      if (gender === "kids") {
        genderInURL = "Boy,Girl";
      } else if (gender === "all") {
        genderInURL = "Boy,Girl,Men,Women,Kids";
      } else {
        if (gender !== "home") {
          genderInURL = requestedGender?.replace(
            requestedGender?.charAt(0),
            requestedGender?.charAt(0).toUpperCase()
          );
        } else {
          genderInURL = "";
        }
      }
    }
    return genderInURL;
  };

  getCatalogUrl = (query, gender) => {
    let catalogUrl;
    let genderInURL;
    genderInURL = this.onGenderSelection(gender);
    catalogUrl = `/catalogsearch/result/?q=${encodeURIComponent(
      query
    )}&p=0&dFR[gender][0]=${genderInURL}&dFR[in_stock][0]=${1}`;
    return catalogUrl;
  };

  renderQuerySuggestion = (querySuggestions, i) => {
    const { query, label, count, indexCodeRedux } = querySuggestions;
    const { searchString, products = [] } = this.props;
    const gender =
      BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender === "all"
        ? "Men,Women,Kids,Boy,Girl"
        : BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
        ? BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
        : "home";
    const fetchSKU = products?.find(
      (item) =>
        item?.name?.toUpperCase()?.includes(query?.toUpperCase()) ||
        item?.sku?.toUpperCase()?.includes(query?.toUpperCase())
    );
    const eventData = { search: query, indexCodeRedux: indexCodeRedux };
    const suggestionEventDipatch = (query) => {
      if (query == searchString) {
        Event.dispatch(EVENT_GTM_NO_RESULT_SEARCH_SCREEN_VIEW, eventData);
        MOE_trackEvent(EVENT_GTM_NO_RESULT_SEARCH_SCREEN_VIEW, {
          country: getCountryFromUrl().toUpperCase(),
          language: getLanguageFromUrl().toUpperCase(),
          search_term: query || "",
          app6thstreet_platform: "Web",
        });
      } else {
        Event.dispatch(EVENT_CLICK_SEARCH_QUERY_SUGGESSTION_CLICK, eventData);
        MOE_trackEvent(EVENT_CLICK_SEARCH_QUERY_SUGGESSTION_CLICK, {
          country: getCountryFromUrl().toUpperCase(),
          language: getLanguageFromUrl().toUpperCase(),
          search_term: query || "",
          app6thstreet_platform: "Web",
        });
      }
      this.onSearchQueryClick(query);
    };
    const suggestionContent = () => {
      if (products?.length === 1 && fetchSKU) {
        return (
          <Link
            to={fetchSKU?.url+'&dFR[in_stock][0]=${1}'}
            onClick={() => suggestionEventDipatch(query)}
            key={i}
          >
            <div className="suggestion-details-box text-capitalize">
              {getHighlightedText(query, searchString)}
            </div>
          </Link>
        );
      } else {
        return (
          <Link
            to={{
              pathname: this.getCatalogUrl(query, gender),
            }}
            onClick={() => suggestionEventDipatch(query)}
            key={i}
          >
            <div className="suggestion-details-box">
              <div>{getHighlightedText(label, searchString)}</div>
            </div>
          </Link>
        );
      }
    };
    return (
      <li>
        {suggestionContent()}
        <div block="QuerySuggestionCount">{count}</div>
      </li>
    );
  };

  renderQuerySuggestions() {
    const { querySuggestions = [] } = this.props;
    return (
      <div block="SearchSuggestion" elem="Item">
        {((querySuggestions?.length > 0) && (querySuggestions[0]?.count !== '') ) ? (
          <ul>
            {querySuggestions?.slice(0, 5).map(this.renderQuerySuggestion)}
          </ul>
        ) : <p>{__("No Suggestions")}</p>}
      </div>
    );
  }

  renderSuggestions() {
    const {
      querySuggestions,
      suggestionEnabled = true,
      isEmpty,
      inNothingFound,
      search,
    } = this.props;
    const { isArabic } = this.state;
    return (
      <div block="suggestionBlocks">
        <div block="QuerySuggestionBlock">
          <h2>{__("SUGGESTIONS")}</h2>
          {suggestionEnabled ? this.renderQuerySuggestions() : null}
          {!isEmpty && (
            <div block="moreDataLink" mods={{isArabic}} onClick={this.SeeAllButtonClick}>
              {__(`See all`) + ` "${search}"`}
            </div>
          )}
        </div>
        <div block="spacingBlock" mods={{ isArabic }}></div>
        <div block="TredingProducts">{this.renderProducts()}</div>
      </div>
    );
  }

  renderPrice = (price) => {
    if (price && price.length > 0) {
      const priceObj = price?.[0],
        currency = getCurrency();
      const basePrice = priceObj?.[currency]?.["6s_base_price"];
      const specialPrice = priceObj?.[currency]?.["6s_special_price"];
      const haveDiscount =
        specialPrice !== "undefined" &&
        specialPrice &&
        basePrice !== specialPrice;
      return (
        <div block="SearchProduct" elem="SpecialPriceCon">
          <div><Price price={price} renderSpecialPrice={false} /></div>
        </div>
      );
    }
    return null;
  };

  handleProductClick = (product) => {
    const { position, objectID } = product;
    const { queryID, indexCodeRedux } = this.props;
    var data = localStorage.getItem("customer") || null;
    let userData = data ? JSON.parse(data) : null;
    let userToken =
      userData && userData.data && userData.data.id
        ? `user-${userData.data.id}`
        : getUUIDToken();
    if (queryID && position && position > 0 && objectID && userToken) {
      new Algolia().logAlgoliaAnalytics("click", SELECT_ITEM_ALGOLIA, [], {
        objectIDs: [objectID],
        queryID: queryID,
        userToken: userToken,
        position: [position],
      });
    }
    const eventData = { search: product?.name, indexCodeRedux: indexCodeRedux };
    Event.dispatch(EVENT_SEARCH_SUGGESTION_PRODUCT_CLICK, eventData);
    MOE_trackEvent(EVENT_SEARCH_SUGGESTION_PRODUCT_CLICK, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      search_term: product?.name || "",
      app6thstreet_platform: "Web",
    });
    Event.dispatch(EVENT_GTM_PRODUCT_CLICK, product);
    this.props.closePopup();
  };

  renderProduct = (product, index) => {
    const { url, name, thumbnail_url, brand_name, price } = product;
    const { closePopup } = this.props;
    const { isArabic } = this.state;
    let productData = {
      ...product,
      ...{ position: index + 1 },
    };
    const gender =
      BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender === "all"
        ? "Men,Women,Kids,Boy,Girl"
        : BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
        ? BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
        : "home";

    let genderInURL;
    genderInURL = this.onGenderSelection(gender);
    let parseLink = url?.includes("catalogsearch/result")
      ? url?.split("&")[0] + `&p=0&dFR[gender][0]=${genderInURL}`
      : url;
    let refactoredUrl = new URL(parseLink) && new URL(parseLink).pathname
      ? new URL(parseLink).pathname
      : parseLink;

    return (
      <li key={v4()} block="productContentLayoutLink" mods={{ isArabic }}>
        <div block="productDetailsLayout">
          <Link
            to={refactoredUrl ? refactoredUrl : "#"}
            onClick={() => this.handleProductClick(productData) && closePopup()}
            block="productsDetailsLink"
            elem="ProductLinks"
          >
            <div block="imagesLayouts" mods={{isArabic}}>
              <Image
                lazyLoad={true}
                src={thumbnail_url}
                alt={name ? name : "Product Image"}
                block="SearchProduct"
                elem="Image"
              />
            </div>
            <div block="SearchProduct" elem="Info">
              <h6 block="SearchProduct" elem="Brand">
                {brand_name}
              </h6>
              <span block="SearchProduct" title={name} elem="ProductName">
                {name}
              </span>
              {this.renderPrice(price)}
            </div>
          </Link>
        </div>
      </li>
    );
  };

  renderProducts() {
    const { products = [] } = this.props;
    const { isArabic } = this.state;
    return (
      <>
        {products.length > 0 ? (
          <div block="SearchSuggestion" elem="Recommended" mods={{ isArabic }}>
            <h2>{__("Products")}</h2>
            <ul>{products.slice(0, 3).map(this.renderProduct)}</ul>
          </div>
        ) : (
          <div block="TredingProducts">{this.renderTrendingBrands()}</div>
        )}
      </>
    );
  }

  renderRecentSearch = ({ name, link }, i) => {
    const gender =
      BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender === "all"
        ? "Men,Women,Kids,Boy,Girl"
        : BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
        ? BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
        : "home";

    let genderInURL;
    genderInURL = this.onGenderSelection(gender);
    const { indexCodeRedux } = this.props;
    const eventData = { search: name, indexCodeRedux: indexCodeRedux };
    return (
      <li key={i}>
        <Link
          to={
            link
              ? link
              : `/catalogsearch/result/?q=${encodeURIComponent(
                  name
                )}&p=0&dFR[gender][0]=${genderInURL}&dFR[in_stock][0]=${1}`
          }
          onClick={() => {
            Event.dispatch(EVENT_CLICK_RECENT_SEARCHES_CLICK, eventData);
            MOE_trackEvent(EVENT_CLICK_RECENT_SEARCHES_CLICK, {
              country: getCountryFromUrl().toUpperCase(),
              language: getLanguageFromUrl().toUpperCase(),
              search_term: name || "",
              app6thstreet_platform: "Web",
            });
          }}
        >
          <div block="SearchSuggestion" elem="TrandingTag">
            #{name}
          </div>
        </Link>
      </li>
    );
  };

  renderRecentSearches = () => {
    const { recentSearches = [] } = this.props;
    const { isArabic } = this.state;
    return recentSearches.length > 0 ? (
      <div block="RecentSearches">
        <h2>{__("Recent search")}</h2>
        <ul block="RecentSearches" elem="searchList" mods={{ isArabic }}>
          {recentSearches?.map(this.renderRecentSearch)}
        </ul>
      </div>
    ) :null;
  };

  handleTrendingBrandsClick = (brandName) => {
    const { closePopup, setPrevPath } = this.props;
    Event.dispatch(EVENT_GTM_TRENDING_BRANDS_CLICK, brandName);
    MOE_trackEvent(EVENT_MOE_TRENDING_BRANDS_CLICK, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      search_term: brandName || "",
      app6thstreet_platform: "Web",
    });
    setPrevPath(window.location.href);
    closePopup();
  };

  renderTrendingBrand = (brand, i) => {
    const { ar_label = "", ar_link = "", en_label = "", en_link = "", image_url } = brand;
    const { isArabic } = this.state;
    const gender =
      BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender === "all"
        ? "Men,Women,Kids,Boy,Girl"
        : BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
        ? BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
        : "home";

    let genderInURL;
    genderInURL = this.onGenderSelection(gender);
    const link = isArabic ? ar_link : en_link;
    const label = isArabic ? ar_label : en_label;
    return (
      <li key={i}>
        <Link
          to={{
            pathname: link
              ? `${link}`
              : `/catalogsearch/result/?q=${encodeURIComponent(
                  label
                )}&p=0&dFR[gender][0]=${genderInURL}&dFR[in_stock][0]=${1}`,
          }}
          onClick={() => this.handleTrendingBrandsClick(label)}
        >
          <div block="SearchSuggestion" elem="TrandingImage">
            <img lazyLoad={true} src={image_url} alt="Trending" />
            <div block="trendingLabels" mods={{ isArabic }}>{label}</div>
          </div>
        </Link>
      </li>
    );
  };

  renderTrendingBrands() {
    const { newTrendingBrands = [] } = this.props;
    const { isArabic } = this.state;
    return newTrendingBrands.length > 0 ? (
      <div block="TrandingBrands" mods={{ isArabic }}>
        <h2>{__("Trending brands")}</h2>
        <ul
          id="TrandingBrands"
          block="TrandingBrands"
          elem="trendingBrandList"
          mods={{ isArabic }}
          ref={this.ref}
        >
          {newTrendingBrands?.slice(0, 9)?.map(this.renderTrendingBrand)}
        </ul>
      </div>
    ) : null;
  }

  renderNothingFound() {
    const { isEmpty, search } = this.props;
    const { isArabic } = this.state;
    return (
      <div block="NothingFound" mods={{ isArabic }}>
        <div block="suggestionBlocks">
          <div block="QuerySuggestionBlock">
            <h2>{__("SUGGESTIONS")}</h2>
            <p>{__("No Suggestions")}</p>
            {!isEmpty && (
            <div block="moreDataLink" mods={{isArabic}} onClick={this.SeeAllButtonClick}>
              {__(`See all`) + ` "${search}"`}
            </div>
          )}
          </div>
          <div block="spacingBlock" mods={{ isArabic }}></div>
          <div block="TredingProducts">{this.renderTrendingBrands()}</div>
        </div>
      </div>
    );
  }

  renderEmptySearch() {
    return <>{this.renderRecentSearches()}</>;
  }

  checkForSKU = async (search) => {
    const config = {
      q: search,
      page: 0,
      limit: 2,
    };
    const { data } = await new Algolia().getPLP(config);
    if (data && data.length === 1) {
      return data[0];
    }
    if (data.length === 0) {
      const { indexCodeRedux } = this.props;
      const eventData = { search: search, indexCodeRedux: indexCodeRedux };
      Event.dispatch(EVENT_GTM_NO_RESULT_SEARCH_SCREEN_VIEW, eventData);
    }
    return null;
  };

  SeeAllButtonClick = async () => {
    const { search, closePopup, indexCodeRedux } = this.props;
    var invalid = /[°"§%()*\[\]{}=\\?´`'#<>|,;.:+_-]+/g;
    let finalSearch = search.match(invalid)
      ? encodeURIComponent(search)
      : search;
    const filteredItem = await this.checkForSKU(search);
    if (sessionStorage.hasOwnProperty("Searched_value")) {
      sessionStorage.removeItem("Searched_value");
    }
    if (filteredItem) {
      this.logRecentSearches(search);
      history.push(filteredItem?.url.split(".com")[1]);
    } else {
      const {
        AppState: { gender },
      } = getStore().getState();
      const PRODUCT_RESULT_LIMIT = 8;
      const productData = await new Algolia().searchBy(
        isArabic()
          ? {
              query: search,
              limit: PRODUCT_RESULT_LIMIT,
              gender: getGenderInArabic(gender),
              addAnalytics: true,
            }
          : {
              query: search,
              limit: PRODUCT_RESULT_LIMIT,
              gender: gender,
              addAnalytics: true,
            }
      );
      if (productData?.nbHits !== 0 && productData?.data.length > 0) {
        this.logRecentSearches(search);
        const eventData = { search: search, indexCodeRedux: indexCodeRedux };
        Event.dispatch(EVENT_GTM_SEARCH, eventData);
        MOE_trackEvent(EVENT_GTM_VIEW_SEARCH_RESULTS, {
          country: getCountryFromUrl().toUpperCase(),
          language: getLanguageFromUrl().toUpperCase(),
          search_term: search || "",
          app6thstreet_platform: "Web",
        });
      }

      const queryID = productData?.queryID ? productData?.queryID : null;
      let requestedGender = gender;
      let genderInURL;
      if (isArabic()) {
        if (gender === "kids") {
          genderInURL = "أولاد,بنات";
        } else {
          requestedGender = getGenderInArabic(gender);
          genderInURL = requestedGender?.replace(
            requestedGender?.charAt(0),
            requestedGender?.charAt(0).toUpperCase()
          );
        }
      } else {
        if (gender === "kids") {
          genderInURL = "Boy,Girl";
        } else {
          genderInURL = requestedGender?.replace(
            requestedGender?.charAt(0),
            requestedGender?.charAt(0).toUpperCase()
          );
        }
      }
      if (gender !== "home" && gender !== "all") {
        history.push({
          pathname: `/catalogsearch/result/?q=${finalSearch}&qid=${queryID}&p=0&dFR[gender][0]=${genderInURL}&dFR[in_stock][0]=${1}`,
          state: { prevPath: window.location.href },
        });
      } else if (gender === "all") {
        const allGender = isArabic()
          ? "أولاد,بنات,نساء,رجال"
          : "Men,Women,Kids,Boy,Girl";
        history.push({
          pathname: `/catalogsearch/result/?q=${finalSearch}&qid=${queryID}&p=0&dFR[gender][0]=${allGender}&dFR[in_stock][0]=${1}`,
          state: { prevPath: window.location.href },
        });
      } else {
        history.push({
          pathname: `/catalogsearch/result/?q=${finalSearch}&qid=${queryID}&dFR[in_stock][0]=${1}`,
          state: { prevPath: window.location.href },
        });
      }
    }
    closePopup();
  };

  renderContent = () => {
    const {
      isActive,
      isEmpty,
      inNothingFound,
      querySuggestions = [],
      searchString,
    } = this.props;
    if (!isActive) {
      return null;
    }
    const gender = BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
      ? BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
      : "home";
    if (gender === "home" && querySuggestions.length === 0) {
      return null;
    }
    if (isEmpty) {
      return this.renderEmptySearch();
    }
    if (inNothingFound && querySuggestions[0]?.count === "") {
      return this.renderNothingFound();
    }
    if (searchString.length > 2) {
      return this.renderSuggestions();
    } else {
      return this.renderEmptySearch();
    }
  };

  renderItemCount() {
    return (
      <div block="SearchOverlay" elem="ItemCount">
        {this.renderContent()}
      </div>
    );
  }

  handleOutsideClick = () => {
    const { closePopup } = this.props;
    this.setState({ isPopup: false });
    closePopup();
  };
  
  render() {
    const { isPopup } = this.props;
    const { isArabic } = this.state;
    const isVisible = isPopup;
    const mixProps = { block: "SearchOverlay", mods: { isArabic, isPopup } };
    const mix = { ...mixProps, mods: { ...mixProps.mods, isVisible } };
    return (
      <>
        <ClickOutside onClick={this.handleOutsideClick}>
          <div
            block="Overlay"
            ref={this.overlayRef}
            mods={{ isArabic, isVisible: isPopup }}
            mix={{ mix }}
          >
            {this.renderItemCount()}
          </div>
        </ClickOutside>
      </>
    );
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SearchOverlay)
);