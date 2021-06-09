import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { HistoryType, LocationType } from "Type/Common";

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

    if (pathname !== prevPathname && pathname !== "/catalogsearch/result/") {
      this.onSearchChange("");
    }
  }

  containerProps = () => {
    const { focusInput } = this.props;
    const { search } = this.state;

    return { search, focusInput };
  };

  onSearchChange(search) {
    this.setState({ search });
  }

  onSearchSubmit() {
    const { history } = this.props;
    const { search } = this.state;
    history.push(`/catalogsearch/result/?q=${search}`);
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
