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
  searchRef = createRef();

  static getDerivedStateFromProps(props) {
    const { search } = props;

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
  };
  closeSearch = () => {
    const { hideSearchBar } = this.props;
    if (hideSearchBar) {
      hideSearchBar();
    }
    this.setState({ showSearch: false });
  };

  renderField() {
    const { search, onSearchChange, isVisible, onSearchClean } = this.props;
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
            id="search-field"
            ref={this.inputRef}
            name="search"
            type="text"
            autocomplete="off"
            autoCorrect="off"
            spellCheck="false"
            placeholder={
              isMobile.any() || isMobile.tablet()
                ? " What are you looking for ?"
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
            <Image src={searchPng} alt="search" />
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
            <Image src={Clear} alt="Clear button" style={{top:'2px'}} />
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
              {/* {svg} */}
            </button>
          </div>
        ) : null}
      </>
    );
  }

  renderSuggestion() {
    const { search, renderMySignInPopup } = this.props;
    const { showSearch } = this.state;

    if (!showSearch) {
      return null;
    }

    return (
      <>
        <SearchSuggestion
          closeSearch={this.closeSearch}
          renderMySignInPopup={renderMySignInPopup}
          search={search}
        />
      </>
    );
  }

  render() {
    const { isArabic } = this.state;
    return (
      <>
        <div block="SearchBackground" mods={{ isArabic }} />
        <ClickOutside onClick={this.closeSearch}>
          <div block="HeaderSearch" mods={{ isArabic }}>
            {this.renderField()}
            {this.renderSuggestion()}
          </div>
        </ClickOutside>
      </>
    );
  }
}

export default HeaderSearch;
