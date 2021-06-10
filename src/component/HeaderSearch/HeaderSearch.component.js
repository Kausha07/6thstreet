import PropTypes from "prop-types";
import { createRef, PureComponent } from "react";

import Field from "Component/Field";
import Form from "Component/Form";
import SearchSuggestion from "Component/SearchSuggestion";
import ClickOutside from "Component/ClickOutside";
import { isArabic } from "Util/App";

import Clear from "./icons/close-black.png";
import searchPng from "./icons/search-black.svg";

import "./HeaderSearch.style";

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
    console.log("inpute ref", this.inputRef.current);
    const {
      current: {
        form: { children },
      },
    } = this.searchRef;
    const searchInput = children[0].children[0];
    console.log({ searchInput });
    // debugger;
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
    const { isClearVisible, isArabic } = this.state;

    return (
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
          autocomplete="false"
          autocorrect="off"
          spellcheck="false"
          placeholder={__("What are you looking for?")}
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
          <img src={searchPng} alt="search" />
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
          <img src={Clear} alt="Clear button" />
        </button>
      </Form>
    );
  }

  renderSuggestion() {
    const { search } = this.props;
    const { showSearch } = this.state;

    if (!showSearch) {
      return null;
    }

    return (
      <>
        <SearchSuggestion closeSearch={this.closeSearch} search={search} />
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
