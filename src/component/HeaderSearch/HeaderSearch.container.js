import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { HistoryType, LocationType } from "Type/Common";
// import { getStore } from "Store";
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
  };

  componentDidUpdate(prevProps) {
    const {
      location: { pathname: prevPathname },
    } = prevProps;
    const { pathname } = location;

    if (pathname !== prevPathname && pathname !== "/catalogsearch/result/") {
      if(prevPathname && pathname && !prevPathname.includes(pathname)){
        this.onSearchChange("");
      }
    }
  }

  containerProps = () => {
    const { search } = this.state;

    return { search };
  };

  onSearchChange(search) {
    this.setState({ search });
  }

  async onSearchSubmit() {
    const { history } = this.props;
    const { search } = this.state;
    const PRODUCT_RESULT_LIMIT = 8;
    // const queryID = getStore().getState().SearchSuggestions.queryID
    //   ? getStore().getState().SearchSuggestions.queryID
    //   : "";
    const productData = await new Algolia().searchBy(
      isArabic()
        ? {
            query: search,
            limit: PRODUCT_RESULT_LIMIT,
          }
        : {
            query: search,
            limit: PRODUCT_RESULT_LIMIT,
          }
    );
    const queryID = productData?.queryID ? productData?.queryID : null;
    history.push(`/catalogsearch/result/?q=${search}&qid=${queryID}`);
  }

  onSearchClean() {
    this.setState({ search: "" });
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
