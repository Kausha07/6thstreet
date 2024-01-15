import { createRef } from "react";
import { connect } from "react-redux";
import { matchPath, withRouter } from "react-router";
import PropTypes from "prop-types";
import Algolia from "Util/API/provider/Algolia";
import BrowserDatabase from "Util/BrowserDatabase";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import Event, {
  EVENT_GTM_CLEAR_SEARCH,
  EVENT_GTM_NO_RESULT_SEARCH_SCREEN_VIEW,
  EVENT_GTM_SEARCH,
  EVENT_GTM_VIEW_SEARCH_RESULTS,
  EVENT_GTM_CANCEL_SEARCH,
  EVENT_GTM_GO_TO_SEARCH,
  MOE_trackEvent
} from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { getGenderInArabic } from "Util/API/endpoint/Suggestions/Suggestions.create";
import { getStore } from "Store";
import PDPDispatcher from "Store/PDP/PDP.dispatcher";
import { hideActiveOverlay } from "Store/Overlay/Overlay.action";
import Form from "Component/Form";
import HeaderCart from "Component/HeaderCart";
import HeaderLogo from "Component/HeaderLogo";
import HeaderSearch from "Component/HeaderSearch";
import HeaderGenders from "Component/HeaderGenders";
import HeaderAccount from "Component/HeaderAccount";
import HeaderWishlist from "Component/HeaderWishlist";
import MyAccountOverlay from "Component/MyAccountOverlay";
import SearchOverlay from "SourceComponent/SearchOverlay";
import NavigationAbstract from "Component/NavigationAbstract/NavigationAbstract.component";
import { DEFAULT_STATE_NAME } from "Component/NavigationAbstract/NavigationAbstract.config";
import { MOBILE_MENU_SIDEBAR_ID } from "Component/MobileMenuSideBar/MoblieMenuSideBar.config";
import "./HeaderMainSection.style";
import { isSignedIn } from "Util/Auth";
export const URL_REWRITE = "url-rewrite";

import {
  TYPE_ACCOUNT,
  TYPE_BRAND,
  TYPE_CART,
  TYPE_CATEGORY,
  TYPE_HOME,
  TYPE_PRODUCT,
  TYPE_INFLUENCER,
} from "Route/UrlRewrites/UrlRewrites.config";
import Clear from "./icons/close-black.png";
import searchIcon from "./icons/search-black.svg";
import { HistoryType } from "Type/Common";

export const mapStateToProps = (state) => ({
  activeOverlay: state.OverlayReducer.activeOverlay,
  chosenGender: state.AppState.gender,
  displaySearch: state.PDP.displaySearch,
  gender: state.AppState.gender,
  indexCodeRedux: state.SearchSuggestions.algoliaIndex?.indexName,
});

export const mapDispatchToProps = (dispatch) => ({
  showPDPSearch: (displaySearch) =>
    PDPDispatcher.setPDPShowSearch({ displaySearch }, dispatch),
  hideActiveOverlay: () => dispatch(hideActiveOverlay()),
});

class HeaderMainSection extends NavigationAbstract {
  static propTypes = {
    activeOverlay: PropTypes.string.isRequired,
    changeMenuGender: PropTypes.func,
    onSearchSubmit: PropTypes.func,
    history: HistoryType.isRequired,
    hideActiveOverlay: PropTypes.func.isRequired,
  };

  static defaultProps = {
    changeMenuGender: () => {},
    search: "",
  };

  constructor(props) {
    super(props);

    this.state = {
      prevScrollpos: window.pageYOffset,
      visible: false,
      type: null,
      delay: 150,
      lastProduct: null,
      lastCategory: null,
      search: "",
      showSearch: false,
      showPLPSearch: false,
      isArabic: isArabic(),
      signInPopUp: "",
      showPopup: false,
      isMobile: isMobile.any(),
      isPopup: false,
      recentSearches: [],
      searchBarClick : false
    };
    this.searchRef = createRef();
    this.inputRef = createRef();
  }

  stateMap = {
    [DEFAULT_STATE_NAME]: {
      account: true,
      cart: true,
      wishlist: true,
      gender: true,
      logo: true,
    },
  };

  renderMap = {
    logo: this.renderLogo.bind(this),
    gender: this.renderGenderSwitcher.bind(this),
    searchContainer: this.renderSearchContainer.bind(this),
    rightIconsContainer: this.renderRightIconsContainer.bind(this),
    back: this.renderBack.bind(this),
  };

  renderRightIconsContainer() {
    const { isArabic } = this.state;
    if (this.isPDP() && isMobile.any()) {
      return null;
    }
    return (
      <div
        block="rightIconsContainer"
        key="rightIconsContainer"
        mods={{ isArabic }}
      >
        <div block="rightIcons">
          {this.renderWishlist()}
          {this.renderAccount()}
          {this.renderCart()}
        </div>
      </div>
    );
  }

  renderSearchContainer() {
    const { gender } = this.props;
    const { isArabic } = this.state;
    if (this.isPDP() && isMobile.any()) {
      return null;
    }
    return (
      <div block="searchContainer" key="searchContainer" mods={{ isArabic }}>
        {gender !== "influencer" && this.renderSearchIcon()}
      </div>
    );
  }

  showMyAccountPopup = () => {
    this.setState({ showPopup: true });
  };

  closePopup = () => {
    this.setState({
      signInPopUp: "",
      isPopup: false,
      showPopup: false,
      search: "",
    });
  };

  onSignIn = () => {
    this.closePopup();
  };

  renderMySignInPopup() {
    const { showPopup } = this.state;
    if (!showPopup) {
      return null;
    }

    return (
      <MyAccountOverlay
        closePopup={this.closePopup}
        onSignIn={this.onSignIn}
        isPopup
      />
    );
  }

  handleScroll = () => {
    // return
    // if (!this.isPDP()) {
    //   return;
    // }
    // const { prevScrollpos, isMobile } = this.state;
    // const currentScrollPos = window.pageYOffset;
    // const visible = prevScrollpos < currentScrollPos;
    // this.setState({
    //   prevScrollpos: currentScrollPos,
    //   visible: isMobile && visible,
    // });
  };

  componentDidMount() {
    if (isMobile.any()) {
      this.setState({ showSearch: true });
    }
    window.addEventListener("scroll", this.handleScroll);
    const { delay } = this.state;
    this.timer = setInterval(this.tick, delay);
    if (sessionStorage.hasOwnProperty("Searched_value")) {
      sessionStorage.removeItem("Searched_value");
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { delay } = this.state;
    if (prevState !== delay) {
      clearInterval(this.interval);
      this.interval = setInterval(this.tick, delay);
    }
  }

  componentWillUnmount() {
    this.timer = null;
    window.removeEventListener("scroll", this.handleScroll);
  }

  tick = () => {
    this.setState({
      type: this.getPageType(),
      lastCategory: this.getCategory(),
      lastProduct: this.getProduct(),
    });
  };

  isPLP() {
    const { type } = this.state;
    // updated this.props with window. in case of any issue need to verify this in future
    const {
      location: { search, pathname = "" },
    } = this.props;
    return TYPE_CATEGORY === type && (search || pathname.includes("?q="));
  }

  isPDP() {
    const { type } = this.state;
    return TYPE_PRODUCT === type;
  }

  getPageType() {
    if (location.pathname === "/" || location.pathname === "") {
      return TYPE_HOME;
    }
    if (matchPath(location.pathname, "/shop-by-brands")) {
      return TYPE_BRAND;
    }
    if (matchPath(location.pathname, "/my-account")) {
      return TYPE_ACCOUNT;
    }
    if (matchPath(location.pathname, "/cart")) {
      return TYPE_CART;
    }
    if (
      matchPath(location.pathname, "/viewall") ||
      location.search.includes("?q=")
    ) {
      return TYPE_CATEGORY;
    }
    if (matchPath(location.pathname, "/influencer.html")) {
      return TYPE_INFLUENCER;
    }
    return window.pageType;
  }

  getPageTypeTracking = () => {
    const { urlRewrite, currentRouteName } = window;

    if (currentRouteName === URL_REWRITE) {
      if (typeof urlRewrite === "undefined") {
        return "";
      }

      if (urlRewrite.notFound) {
        return "notfound";
      }

      return (urlRewrite.type || "").toLowerCase();
    }

    return (currentRouteName || "").toLowerCase();
  }

  getCategory() {
    return BrowserDatabase.getItem("CATEGORY_NAME") || "";
  }

  getProduct() {
    return BrowserDatabase.getItem("PRODUCT_NAME") || "";
  }

  setMainContentPadding(px = "0") {
    document.documentElement.style.setProperty("--main-content-padding", px);
  }

  renderAccount() {
    const isFooter = false;

    return (
      <HeaderAccount key="account" isFooter={isFooter} isMobile showNudge />
    );
  }

  renderCart() {
    return (
      <HeaderCart
        key="cart"
        CartButton="CartButton"
        showCartPopUp={!(isMobile.any() || isMobile.tablet())}
      />
    );
  }

  renderWishlist() {
    return <HeaderWishlist key="wishlist" isMobile />;
  }

  renderGenderSwitcher() {
    const { changeMenuGender, activeOverlay } = this.props;
    const { showPLPSearch, isArabic } = this.state;
    const pathNamesIncludesArrow = [
      "/influencer.html/Collection",
      "/influencer.html/Store",
    ];
    if (isMobile.any() && activeOverlay === MOBILE_MENU_SIDEBAR_ID) {
      return null;
    }
    return (this.isPLP() ||
      this.isPDP() ||
      this.getPageType() === TYPE_BRAND ||
      showPLPSearch ||
      pathNamesIncludesArrow.includes(location.pathname)) &&
      isMobile.any() ? null : (
      <HeaderGenders
        key="genders"
        isMobile
        changeMenuGender={changeMenuGender}
        mods={{ isArabic }}
      />
    );
  }

  renderLogo() {
    const { isArabic, showPLPSearch } = this.state;
    const { changeMenuGender } = this.props;
    if (isMobile.any()) {
      if (showPLPSearch) {
        this.setMainContentPadding("150px");

        return <HeaderLogo key="logo" />;
      } else if (this.isPLP() && !showPLPSearch) {
        this.setMainContentPadding("150px");

        return <HeaderLogo key="logo" />;
      }
      if (this.isPDP()) {
        const pagePDPTitle = String(this.getProduct()).toUpperCase();

        this.setMainContentPadding("50px");
        return (
          <span block="CategoryTitle" mods={{ isArabic, isPDP: true }}>
            {pagePDPTitle}
          </span>
        );
      }
    }
    this.setMainContentPadding("150px");
    return <HeaderLogo key="logo" />;
  }

  backFromPLP = () => {
    const { history, chosenGender } = this.props;
    switch (chosenGender) {
      case "women":
        history.push("/women.html");
        break;
      case "men":
        history.push("/men.html");
        break;
      case "kids":
        history.push("/kids.html");
        break;
      case "home":
        history.push("/home.html");
        break;
      case "all":
        history.push("/");
        break;
      default:
        history.push("/");
    }
  };

  renderBack() {
    const { history, displaySearch } = this.props;
    const { isArabic, showPLPSearch } = this.state;
    const pathNamesIncludesArrow = [
      "/influencer.html/Collection",
      "/influencer.html/Store",
    ];
    if (this.isPDP() && isMobile.any()) {
      return null;
    }
    return this.isPLP() ||
      this.isPDP() ||
      showPLPSearch ||
      pathNamesIncludesArrow.includes(location.pathname) ? (
      <div block="BackArrow" mods={{ isArabic }} key="back">
        <button block="BackArrow-Button" onClick={history.goBack}>
          <p>{__("Back")}</p>
        </button>
      </div>
    ) : null;
  }

  handleSearchClick = () => {
    const { showSearch } = this.state;
    this.setState({ showSearch: !showSearch });
  };

  handlePLPSearchClick = () => {
    this.setState({ showPLPSearch: true }, () => {
      document.getElementById("search-field").focus();
      document.body.style.overflow = "hidden";
    });
  };

  handleHomeSearchClick = (status) => {
    this.setState({ showPLPSearch: status });
  };

  hideSearchBar = () => {
    this.setState({
      showSearch: false,
      showPLPSearch: false,
    });
  };

  hidePDPSearchBar = () => {
    const { showPDPSearch } = this.props;
    showPDPSearch(false);
    this.setState({
      showPLPSearch: false,
    });
    document.body.style.overflow = "visible";
  };

  cancelSearch = () => {
    const { search } = this.state;
    this.setState({
      search : "",
      searchBarClick : false,
    })

    Event.dispatch(EVENT_GTM_CANCEL_SEARCH, search);
    MOE_trackEvent(EVENT_GTM_CANCEL_SEARCH, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      search_term: search || "",
      app6thstreet_platform: "Web",
    });
  }

  onSearchChange = (e) => {
    const { search } = this.state;
    this.setState({  search : e.target.value, isPopup : true });
    const SearchValue = sessionStorage.getItem("Searched_value") || null;
    const searchedQuery =
      typeof SearchValue == "object"
        ? JSON.stringify(SearchValue)
        : SearchValue;
    const inputValue = this.inputRef?.current?.value;
    const inputValueLength = this.inputRef?.current?.value?.length;
    if (!SearchValue) {
      sessionStorage.setItem("Searched_value", " ");
    }
    if (inputValueLength > 0 && searchedQuery.length < inputValueLength) {
      sessionStorage.setItem("Searched_value", inputValue);
    }
    if (inputValueLength === 0) {
      Event.dispatch(EVENT_GTM_CLEAR_SEARCH, SearchValue);
      MOE_trackEvent(EVENT_GTM_CLEAR_SEARCH, {
        country: getCountryFromUrl().toUpperCase(),
        language: getLanguageFromUrl().toUpperCase(),
        search_term: SearchValue || "",
        app6thstreet_platform: "Web",
      });
      if (sessionStorage.hasOwnProperty("Searched_value")) {
        sessionStorage.removeItem("Searched_value");
      }
    }
  };

  renderSearchOverlay = () => {
    const {isPopup} = this.state;
    this.setState({isPopup : !isPopup, searchBarClick : true});
  }

  closeSearchPopup = () => {
    const { hideActiveOverlay } = this.props;
    hideActiveOverlay();
    this.setState({ isOpen: false, showPopup: false });
  };

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

  logRecentSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      let recentSearches =
        JSON.parse(localStorage.getItem("recentSearches")) || [];
      let tempRecentSearches = [];
      if (recentSearches) {
        tempRecentSearches = [...recentSearches.reverse()];
      }
      tempRecentSearches = tempRecentSearches.filter(
        (item) =>
          item.name.toUpperCase().trim() !== searchQuery.toUpperCase().trim()
      );
      if (tempRecentSearches.length > 4) {
        tempRecentSearches.shift();
        tempRecentSearches.push({
          name: searchQuery,
        });
      } else {
        tempRecentSearches.push({ name: searchQuery });
      }
      localStorage.setItem(
        "recentSearches",
        JSON.stringify(tempRecentSearches.reverse())
      );
    }
  };

  onSearchSubmit = async () => {
    const { history, indexCodeRedux } = this.props;
    const { search, isArabic } = this.state;
    var invalid = /[°"§%()*\[\]{}=\\?´`'#<>|,;.:+_-]+/g;
    let finalSearch = search.match(invalid)
      ? encodeURIComponent(search)
      : search;
    const filteredItem = await this.checkForSKU(search);
    if (sessionStorage.hasOwnProperty("Searched_value")) {
      sessionStorage.removeItem("Searched_value");
    }
    if (filteredItem) {
      this.logRecentSearch(search);
      history.push(filteredItem?.url.split(".com")[1]);
    } else {
      const {
        AppState: { gender },
      } = getStore().getState();
      const PRODUCT_RESULT_LIMIT = 8;
      const productData = await new Algolia().searchBy(
        isArabic
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
        this.logRecentSearch(search);
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
      if (isArabic) {
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
        history.push({
          pathname: `/catalogsearch/result/?q=${finalSearch}&qid=${queryID}&p=0&dFR[in_stock][0]=${1}`,
          state: { prevPath: window.location.href },
        });
      } else {
        history.push({
          pathname: `/catalogsearch/result/?q=${finalSearch}&qid=${queryID}&dFR[in_stock][0]=${1}`,
          state: { prevPath: window.location.href },
        });
      }
    }
  };

  onSubmit = () => {
    const {
      current: {
        form: { children },
      },
    } = this.searchRef;
    const searchInput = children[0].children[0];
    const submitBtn = children[1];
    this.onSearchSubmit();
    this.closePopup();
  };

  ClearSearch = () => {
    const { search  } = this.state
    this.setState({
      search : "",
    });
    Event.dispatch(EVENT_GTM_CANCEL_SEARCH, search);
    MOE_trackEvent(EVENT_GTM_CANCEL_SEARCH, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      search_term: search || "",
      app6thstreet_platform: "Web",
    });
  };

  SearchFieldClick = () => {
    Event.dispatch(EVENT_GTM_GO_TO_SEARCH);
    MOE_trackEvent(EVENT_GTM_GO_TO_SEARCH, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      screen_name: this.getPageTypeTracking(),
      isLoggedIn: isSignedIn(),
      app6thstreet_platform: "Web",
    });
  }

  renderSearchIcon() {
    const { isArabic, showPLPSearch, search, isPopup, searchBarClick } = this.state;
    let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    if ((isMobile.any() && !this.isPLP()) || showPLPSearch) {
      return null;
    }
    return (
      <>
        {isMobile.any() ? (
          <div block="SearchIcon" mods={{ isArabic: isArabic }}>
            <button
              block="SearchIcon"
              onClick={
                isMobile.any()
                  ? this.handlePLPSearchClick.bind(this)
                  : this.handleSearchClick.bind(this)
              }
              elem="Button"
              aria-label="PLP Search Button"
              role="button"
            ></button>
          </div>
        ) : (
          <div
            id="searchBlock"
            mods={{ isArabic: isArabic }}
            onClick={this.renderSearchOverlay}
          >
            <div block="SearchIcon" mods={{ isArabic: isArabic }}>
              <div>
                <img
                  lazyLoad={true}
                  id="searchIconImage"
                  src={searchIcon}
                  alt="searchIcon"
                  mods={{ isArabic }}
                  onClick={this.onSubmit}
                />
              </div>
              <div onClick={this.SearchFieldClick}>
                <Form
                  block="searchFrom"
                  id="header-search"
                  onSubmit={this.onSubmit}
                  ref={this.searchRef}
                  autoComplete="off"
                >
                  <input
                    id="search-field"
                    ref={this.inputRef}
                    name="search"
                    type="text"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    placeholder={
                      isMobile.any() || isMobile.tablet()
                        ? __("What are you looking for?")
                        : (!isPopup || !searchBarClick) &&
                          __("Search for brands...")
                    }
                    onChange={this.onSearchChange}
                    onFocus={this.onFocus}
                    value={search}
                  />
                </Form>
              </div>
              {isPopup && (
                <div block="clear-button" onClick={this.cancelSearch}>
                  <img src={Clear} alt="clear-black.png" />
                </div>
              )}
            </div>
            <div id="overlay-sections">
              {(recentSearches.length > 0 || search.length > 2) && isPopup ? (
                <SearchOverlay
                  isPopup={isPopup}
                  search={this.state.search}
                  closePopup={this.closePopup}
                  ClearSearch={this.ClearSearch}
                />
              ) : null}
            </div>
          </div>
        )}
      </>
    );
  }

  renderDesktopSearch() {
    const { showSearch } = this.state;
    if (isMobile.any()) {
      return null;
    }
    if (!showSearch) {
      return null;
    }

    return (
      <div block="DesktopSearch">
        <HeaderSearch
          hideSearchBar={this.hideSearchBar}
          renderMySignInPopup={this.showMyAccountPopup}
          focusInput={true}
          key="searchDesktop"
        />
      </div>
    );
  }

  renderSearch = () => {
    const { displaySearch } = this.props;
    const { showPLPSearch } = this.state;
    const isPDPSearchVisible = this.isPDP() && displaySearch;
    let isPDP = this.isPDP();
    if (isMobile.any() || isMobile.tablet()) {
      return this.isPLP() && !showPLPSearch ? null : (
        <div block="HeaderSearchSection" mods={{ isPDPSearchVisible, isPDP }}>
          <HeaderSearch
            key="search"
            isPLP={this.isPLP() && showPLPSearch}
            isPDP={this.isPDP()}
            handleHomeSearchClick={this.handleHomeSearchClick}
            isPDPSearchVisible={isPDPSearchVisible}
            hideSearchBar={this.hidePDPSearchBar}
            focusInput={isPDPSearchVisible ? true : false}
          />
        </div>
      );
    }

    return null;
  };

  getHeaderMainSectionVisibility = () => {
    const { visible } = this.state;
    const { displaySearch } = this.props;

    if (this.isPDP()) {
      if (!displaySearch) {
        return visible;
      }
    }
    return true;
  };

  render() {
    const pageWithHiddenHeader = [TYPE_CART, TYPE_ACCOUNT];
    const { signInPopUp, showPLPSearch } = this.state;
    const { displaySearch, gender } = this.props;
    const isPDPSearchVisible = this.isPDP() && displaySearch;
    return pageWithHiddenHeader.includes(this.getPageType()) &&
      isMobile.any() ? null : (
      <>
        <div
          block="HeaderMainSection"
          mods={{ showPLPSearch }}
          data-visible={this.getHeaderMainSectionVisibility()}
        >
          {this.renderMySignInPopup()}
          {this.renderNavigationState()}
          {this.renderDesktopSearch()}
        </div>
        {gender !== "influencer" && this.renderSearch()}
      </>
    );
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HeaderMainSection)
);
