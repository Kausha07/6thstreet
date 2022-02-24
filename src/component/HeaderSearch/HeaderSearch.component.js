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
  }
  componentDidUpdate(prevProps) {
    const { focusInput, isPDPSearchVisible } = this.props;
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

  onSubmit = () => {
    const { onSearchSubmit } = this.props;
    const {
      current: {
        form: { children },
      },
    } = this.searchRef;

    const searchInput = children[0].children[0];
    const submitBtn = children[1];

    submitBtn.blur();
    searchInput.blur();
    onSearchSubmit();
    this.closeSearch();
  };
  onFocus = () => {
    this.setState({ showSearch: true });
    window.onpopstate = (e) => {
      if (document.body.classList.contains("isSuggestionOpen")) {
        this.closeSearch();
        history.forward();
        e.preventDefault();
      }
    };
  };
  closeSearch = () => {
    const { hideSearchBar, onSearchClean } = this.props;
    if (hideSearchBar) {
      hideSearchBar();
    }
    onSearchClean();
    this.setState({ showSearch: false });
  };

  renderField() {
    const { search, onSearchChange, isVisible, onSearchClean, isPLP } =
      this.props;
    const { isClearVisible, isArabic, showSearch } = this.state;
    return (
      <>
        <Form
          id="header-search"
          onSubmit={this.onSubmit}
          ref={this.searchRef}
          autocomplete="off"
        >
          <Field
            block={isPLP ? "plpSearch" : ""}
            id="search-field"
            ref={this.inputRef}
            name="search"
            type="text"
            autocomplete="off"
            autoCorrect="off"
            spellCheck="false"
            placeholder={
              isMobile.any() || isMobile.tablet()
                ? __("What are you looking for?")
                : __("Search for items, brands, inspiration and styles")
            }
            onChange={onSearchChange}
            onFocus={this.onFocus}
            value={search}
          />
          <button
            block="HeaderSearch"
            elem="SubmitBtn"
            mods={{ isArabic }}
            type="submit"
          >
            <Image lazyLoad={true} src={searchPng} alt="search" />
          </button>
          <button
            block="HeaderSearch"
            elem="Clear"
            onClick={onSearchClean}
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
              alt="Clear button"
              style={{ top: "2px" }}
            />
          </button>
        </Form>
        {showSearch ? (
          <div
            block="SearchSuggestion"
            elem="CloseContainer"
            mods={{ isArabic }}
          >
            <button
              block="CloseContainer"
              elem="Close"
              mods={{ isArabic }}
              onClick={this.closeSearch}
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
    const { isPDP, isPDPSearchVisible } = this.props;
    return (
      <>
        <div block="SearchBackground" mods={{ isArabic }} />
        <ClickOutside
          onClick={() => {
            isPDP ? null : this.closeSearch();
          }}
        >
          <div block="HeaderSearch" mods={{ isArabic }}>
            {this.renderField()}
          </div>
        </ClickOutside>
        {this.renderSuggestion()}

      </>
    );
  }
}

export default HeaderSearch;
