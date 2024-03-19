import ClickOutside from "Component/ClickOutside";
import Field from "Component/Field";
import Form from "Component/Form";
import SearchSuggestion from "Component/SearchSuggestion";
import PropTypes from "prop-types";
import { createRef, PureComponent } from "react";
import { isArabic } from "Util/App";
import "./HeaderSearch.style";
import Clear from "./icons/close-black.png";
import searchPng from "./icons/search.svg";
import isMobile from "Util/Mobile";
import Image from "Component/Image";
import Event, {
  EVENT_GTM_CANCEL_SEARCH,
  EVENT_GTM_GO_TO_SEARCH,
  MOE_trackEvent
} from "Util/Event";
import { isSignedIn } from "Util/Auth";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import {isMsiteMegaMenuRoute, isMsiteMegaMenuCategoriesRoute, isMsiteMegaMenuBrandsRoute } from "Component/MobileMegaMenu/Utils/MobileMegaMenu.helper";
import { brandSearchClickEvent } from "Component/MobileMegaMenu/MoEngageTrackingEvents/MoEngageTrackingEvents.helper";

export const URL_REWRITE = "url-rewrite";
class HeaderSearch extends PureComponent {
  static propTypes = {
    search: PropTypes.string,
    onSearchChange: PropTypes.func.isRequired,
    onSearchSubmit: PropTypes.func.isRequired,
    onSearchClean: PropTypes.func.isRequired,
    isVisible: PropTypes.bool,
  };

  static defaultProps = {
    search: "",
    isVisible: true,
  };

  state = {
    isArabic: isArabic(),
    isClearVisible: false,
    showSearch: false,
  };

  constructor(props) {
    super(props);
    this.inputRef = createRef();
  }
  componentDidMount() {
    const { focusInput } = this.props;
    const {
      current: {
        form: { children },
      },
    } = this.searchRef;
    const searchInput = children[0].children[0];
    if (focusInput && searchInput) {
      searchInput.focus();
    }
    if (sessionStorage.hasOwnProperty("Searched_value")) {
      sessionStorage.removeItem("Searched_value");
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const { focusInput, isPDPSearchVisible } = this.props;
    const { showSearch: prevShowSearch } = prevState;
    const { showSearch } = this.state;
    const {
      current: {
        form: { children },
      },
    } = this.searchRef;
    const searchInput = children[0].children[0];
    if (
      focusInput &&
      isPDPSearchVisible &&
      prevProps.isPDPSearchVisible !== isPDPSearchVisible &&
      searchInput
    ) {
      searchInput.focus();
    }

    if (showSearch && !prevShowSearch) {
      if(isMsiteMegaMenuBrandsRoute()) {
        brandSearchClickEvent({ gender: this.props?.gender });
      }
      Event.dispatch(EVENT_GTM_GO_TO_SEARCH);
      MOE_trackEvent(EVENT_GTM_GO_TO_SEARCH, {
        country: getCountryFromUrl().toUpperCase(),
        language: getLanguageFromUrl().toUpperCase(),
        screen_name: this.getPageType(),
        gender: this.props?.gender,
        current_page: sessionStorage.getItem("currentScreen"),
        isLoggedIn: isSignedIn(),
        app6thstreet_platform: "Web",
      });
    }
  }
  searchRef = createRef();

  static getDerivedStateFromProps(props) {
    const { search, isPDP, isPDPSearchVisible } = props;
    if (isPDP) {
      return {
        isClearVisible: search !== "",
        showSearch: isPDPSearchVisible,
      };
    }
    return {
      isClearVisible: search !== "",
    };
  }

  getPageType() {
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

  onSubmit = () => {
    const { onSearchSubmit } = this.props;
    const {
      current: {
        form: { children },
      },
    } = this.searchRef;

    if(isMsiteMegaMenuBrandsRoute()){
      return;
    }

    const searchInput = children[0].children[0];
    const submitBtn = children[1];
    submitBtn.blur();
    searchInput.blur();
    onSearchSubmit();
    this.closeSearch();
  };
  onFocus = () => {
    const { handleHomeSearchClick } = this.props;
    this.setState({ showSearch: true });
    if (handleHomeSearchClick) {
      handleHomeSearchClick(true);
    }
    window.onpopstate = (e) => {
      if (document.body.classList.contains("isSuggestionOpen")) {
        this.cancelSearch();
        history.forward();
        e.preventDefault();
      }
    };
  };
  cancelSearch = () => {
    const { search } = this.props;
    this.closeSearch();
    if (sessionStorage.hasOwnProperty("Searched_value")) {
      sessionStorage.removeItem("Searched_value");
    }
    Event.dispatch(EVENT_GTM_CANCEL_SEARCH, search);
    MOE_trackEvent(EVENT_GTM_CANCEL_SEARCH, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      search_term: search || "",
      current_page: sessionStorage.getItem("currentScreen"),
      gender: this.props?.gender,
      app6thstreet_platform: "Web",
    });
  };
  closeSearch = () => {
    const { hideSearchBar, onSearchClean, handleHomeSearchClick } = this.props;
    if (sessionStorage.hasOwnProperty("Searched_value")) {
      sessionStorage.removeItem("Searched_value");
    }
    if (hideSearchBar) {
      hideSearchBar();
    }
    onSearchClean();
    this.setState({ showSearch: false });
    if (handleHomeSearchClick) {
      handleHomeSearchClick(false);
    }
  };

  getPlaceholderText = () => {
    const {mobileMegaMenuPageOpenFlag = ""} = this.props;
    if(isMobile.any() || isMobile.tablet()) {
      if(isMsiteMegaMenuCategoriesRoute()) {
        return __("Search for Categories");
      } else if(isMsiteMegaMenuBrandsRoute()) {
        return __("Search for Brands");
      } else {
        return __("What are you looking for?");
      } 
    } else {
      return __("Search for items, brands, inspiration and styles");
    }
  }
  renderField() {
    const { search, onSearchChange, isVisible, onSearchClean, isPLP, mobileMegaMenuPageOpenFlag = "" } =
      this.props;
    const { isClearVisible, isArabic, showSearch } = this.state;
    const  modifiedPlaceholderText = this.getPlaceholderText(); 
    return (
      <>
        <Form
          id="header-search"
          onSubmit={this.onSubmit}
          ref={this.searchRef}
          autocomplete="off"
        >
          <Field
            id="search-field"
            ref={this.inputRef}
            name="search"
            type="text"
            autocomplete="off"
            autoCorrect="off"
            spellCheck="false"
            placeholder={modifiedPlaceholderText}
            onChange={onSearchChange}
            onFocus={this.onFocus}
            value={search}
          />
          {!isPLP && (
            <button
              block="HeaderSearch"
              elem="SubmitBtn"
              mods={{ isArabic }}
              type="submit"
            >
              <Image lazyLoad={true} src={searchPng} alt="searchIcon" />
            </button>
          )}

          <button
            block="HeaderSearch"
            elem="Clear"
            onClick={this.cancelSearch}
            type="button"
            mods={{
              type: "searchClear",
              isVisible,
              isClearVisible,
            }}
            aria-label="Clear search"
          >
            <Image
              lazyLoad={false}
              src={Clear}
              alt="close-black"
              style={{ top: "2px" }}
            />
          </button>
        </Form>
        {showSearch && !isMsiteMegaMenuRoute() ? (
          <div
            block="SearchSuggestion"
            elem="CloseContainer"
            mods={{ isArabic }}
          >
            <button
              block="CloseContainer"
              elem="Close"
              mods={{ isArabic }}
              onClick={this.cancelSearch}
            >
              {__("Cancel")}
            </button>
          </div>
        ) : null}
      </>
    );
  }

  renderSuggestion() {
    const { search, renderMySignInPopup, onSearchClean } = this.props;
    const { showSearch } = this.state;
    const { isPDPSearchVisible } = this.props;

    if (!showSearch) {
      return null;
    }
    if (isMobile.any() || isMobile.tablet()) {
      return (
        <>
          <SearchSuggestion
            closeSearch={this.closeSearch}
            cleanSearch={onSearchClean}
            renderMySignInPopup={renderMySignInPopup}
            search={search}
            isPDPSearchVisible={isPDPSearchVisible}
          />
        </>
      );
    }

    return (
      <>
        <SearchSuggestion
          closeSearch={this.closeSearch}
          cleanSearch={onSearchClean}
          renderMySignInPopup={renderMySignInPopup}
          search={search}
        />
      </>
    );
  }

  render() {
    const { isArabic } = this.state;
    const { isPDP, isPDPSearchVisible, isPLP, showMegaMenuHeaderSearchStyle = false } = this.props;
    const mobileMegaMenuStyle = showMegaMenuHeaderSearchStyle
      ? {
          top: "5px",
          width: "75%",
          left: isArabic ? "15%": "8%",
          height: "39px",
        }
      : {};

    return (
      <>
        <div block="SearchBackground" mods={{ isArabic }} />
        <ClickOutside
          onClick={() => {
            isPDP ? null : this.closeSearch();
          }}
        >
          <div block="HeaderSearch" mods={{ isArabic, isPLP}} style={mobileMegaMenuStyle}>
            {this.renderField()}
          </div>
        </ClickOutside>
        {this.renderSuggestion()}
      </>
    );
  }
}

export default HeaderSearch;
