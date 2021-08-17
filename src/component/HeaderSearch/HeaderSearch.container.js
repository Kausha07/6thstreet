import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { getStore } from "Store";
import { HistoryType, LocationType } from "Type/Common";
import { getGenderInArabic } from "Util/API/endpoint/Suggestions/Suggestions.create";
import Algolia from "Util/API/provider/Algolia";
import { isArabic } from "Util/App";
import HeaderSearch from "./HeaderSearch.component";
export const mapStateToProps = (_state) => ({
  // wishlistItems: state.WishlistReducer.productsInWishlist
});
export const mapDispatchToProps = (_dispatch) => ({
  // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class HeaderSearchContainer extends PureComponent {
  static propTypes = {
    search: PropTypes.string,
    history: HistoryType.isRequired,
    location: LocationType.isRequired,
  };
  constructor(props) {
    super(props);
    this.headerRef = React.createRef();
  }

  static defaultProps = {
    search: "",
  };

  state = {
    search: "",
  };

  containerFunctions = {
    onSearchChange: this.onSearchChange.bind(this),
    onSearchSubmit: this.onSearchSubmit.bind(this),
    onSearchClean: this.onSearchClean.bind(this),
    hideSearchBar: this.hideSearchBar.bind(this),
  };
  async onSearchSubmit() {
    const { history } = this.props;
    const { search } = this.state;
    const {
      AppState: { gender },
    } = getStore().getState();
    const PRODUCT_RESULT_LIMIT = 8;
    let recentSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    let tempRecentSearches = [];
    // const queryID = getStore().getState().SearchSuggestions.queryID
    //   ? getStore().getState().SearchSuggestions.queryID
    //   : "";
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
    if (search.trim()) {
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
    }
    const queryID = productData?.queryID ? productData?.queryID : null;
    let requestedGender = isArabic() ? getGenderInArabic(gender) : gender;
    history.push(
      `/catalogsearch/result/?q=${search}&gender=${requestedGender.replace(
        requestedGender.charAt(0),
        requestedGender.charAt(0).toUpperCase()
      )}`
    );
  }

  hideSearchBar() {
    const { hideSearchBar } = this.props;
    if (hideSearchBar) {
      hideSearchBar();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      location: { pathname: prevPathname },
    } = prevProps;
    const { pathname } = location;

    // if (pathname !== prevPathname && pathname !== "/catalogsearch/result/") {
    //   this.onSearchChange("");
    // }
  }

  containerProps = () => {
    const { focusInput } = this.props;
    const { search } = this.state;

    return { search, focusInput };
  };

  onSearchChange(search) {
    this.setState({ search });
  }

  onSearchClean() {
    this.setState({ search: "" });
    this.hideSearchBar();
  }

  render() {
    return (
      <HeaderSearch {...this.containerFunctions} {...this.containerProps()} />
    );
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HeaderSearchContainer)
);
