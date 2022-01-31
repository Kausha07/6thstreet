import PLPPage from "Component/PLPPage";
import PLPPagePlaceholder from "Component/PLPPagePlaceholder";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { Products } from "Util/API/endpoint/Product/Product.type";
import "./PLPPages.style";
import { Close } from "Component/Icons";
import WebUrlParser from "Util/API/helper/WebUrlParser";
import isMobile from "Util/Mobile";
import ProductLoad from "Component/PLPLoadMore";
import { v4 } from "uuid";
import { withRouter } from "react-router";
import browserHistory from "Util/History";

class PLPPages extends PureComponent {
  static propTypes = {
    pages: PropTypes.arrayOf(
      PropTypes.shape({
        products: Products,
        isPlaceholder: PropTypes.bool,
      })
    ).isRequired,
    impressions: Products,
  };
  static defaultProps = {
    impressions: [],
  };
  constructor(props) {
    super(props);
    this.state = {
      showSortDropdown: false,
      activeFilter: undefined,
      activeFilters: {},
      isReset: false,
      defaultFilters: false,
      pageKey: 0,
      firstPageLoad: false,
      pageScrollHeight: 0,
      prevProductSku: "",
      loadedLastProduct: false,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.setState({ firstPageLoad: true });
    let prevLocation;
    let finalPrevLocation;
    let initialPrevProductSku;
    browserHistory.listen((nextLocation) => {
      let locationArr = ["/men.html", "/women.html", "kids.html", "/home.html"];
      finalPrevLocation = prevLocation;
      prevLocation = nextLocation;
      const { search } = nextLocation;
      if (
        finalPrevLocation &&
        !locationArr.includes(finalPrevLocation.pathname) &&
        finalPrevLocation.state &&
        finalPrevLocation.state.product
      ) {
        const {
          state: {
            product: { sku },
          },
        } = finalPrevLocation;
        initialPrevProductSku = sku;
        this.setState({ prevProductSku: sku });
        this.props.setPrevProductSku(sku);
      } else if (
        finalPrevLocation &&
        locationArr.includes(finalPrevLocation.pathname)
      ) {
        this.props.setPrevProductSku("");
        window.scrollTo(0, 0);
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { activeFilters, prevProductSku } = this.props;
    const {
      activeFilters: prevActiveFilters,
      prevProductSku: initialPrevProductSku,
    } = prevProps;
  
    if (activeFilters !== prevActiveFilters) {
      this.setState({
        activeFilters: activeFilters,
      });
    }
    if (
      this.props.pages.length > 0 &&
      this.props.pages.length > prevProps.pages.length &&
      (prevState.pageKey !== "0" || prevState.pageKey !== 0)
    ) {
      if (!isMobile.any() && !this.state.firstPageLoad) {
        const last =
          document.getElementById("Products-Lists")?.lastElementChild;
        last.style.scrollMarginTop = "180px";
        last.scrollIntoView({ behavior: "smooth" });
      }
      if (this.state.firstPageLoad) {
        this.setState({ firstPageLoad: false });
      }
    }

    if (prevProductSku) {
      let element = document.getElementById(prevProductSku);
      if (element && !this.state.loadedLastProduct) {
        var headerOffset = isMobile.any() ? 120 : 200;
        var elementPosition = element.getBoundingClientRect().top;
        var offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;
        if (isMobile.any()) {
          element.parentElement.style.scrollMarginTop = "0px";
        }
     
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        this.setState({ loadedLastProduct: true });
      }
    }
  }

  renderPage = ([key, page]) => {
    const { products, isPlaceholder, isFirst = false } = page;
    this.setState({
      pageKey: key,
    });
    const {
      impressions,
      query,
      renderMySignInPopup,
      prevPath = null,
      filters,
      productLoading,
    } = this.props;
    if (isMobile.any() && isPlaceholder) {
      return (
        <PLPPagePlaceholder
          isFirst={isFirst}
          key={v4()}
          pageIndex={key}
          query={query}
        />
      );
    }
    return (
      <PLPPage
        key={v4()}
        products={products}
        impressions={impressions}
        renderMySignInPopup={renderMySignInPopup}
        prevPath={prevPath}
        filters={filters}
      />
    );
  };

  renderPlaceHolder() {
    const { query } = this.props;
    return (
      <PLPPagePlaceholder
        isFirst={true}
        key={v4()}
        pageIndex={1}
        query={query}
      />
    );
  }
  
  renderPages() {
    const { pages = {}, productLoading } = this.props;

    if (pages && pages.length === 0 && productLoading) {
      const placeholderConfig = [
        {
          isPlaceholder: true,
          products: [],
          isFirst: true,
        },
      ];
      return Object.entries(placeholderConfig).map(this.renderPage);
    }
    return Object.entries(pages).map(this.renderPage);
  }

  OnDeselectFilter = (val, values) => {
    const { facet_key, facet_value } = val;
    const { is_radio } = values;
    this.handleCallback(facet_key, facet_value, false, is_radio, false);
  };

  renderSelectedFilters() {
    const selectedFilters = this.props.filters;
    const thisRef = this;
    if (selectedFilters) {
      return (
        <ul>
          {Object.values(selectedFilters).map(function (values, index) {
            if (values && values.data) {
              return Object.values(values.data).map(function (value, index) {
                if (value.subcategories) {
                  return Object.values(value.subcategories).map(function (
                    val,
                    index
                  ) {
                    if (val.is_selected === true) {
                      return (
                        <li key={v4()}>
                          {thisRef.renderButtonView(val.label, () =>
                            thisRef.OnDeselectFilter(val, values)
                          )}
                        </li>
                      );
                    }
                  });
                } else if (values) {
                  if (
                    value.is_selected === true &&
                    value.facet_key !== "categories.level1"
                  ) {
                    return (
                      <li key={v4()}>
                        {thisRef.renderButtonView(value.label, () =>
                          thisRef.OnDeselectFilter(value, values)
                        )}
                      </li>
                    );
                  }
                }
              });
            }
          })}
        </ul>
      );
    }
  }

  toggleSortDropdown = () => {
    this.setState({ showSortDropdown: !this.state.showSortDropdown });
  };

  renderSortBy() {
    const {
      filters: { sort: data },
    } = this.props;
    const { data: sortData } = data;
    return (
      <div block="sort-box">
        <ul>
          {Object.values(sortData).map((value, index) => {
            return <li key={index}>{value.label}</li>;
          })}
        </ul>
      </div>
    );
  }

  renderButtonView(label, onClick) {
    return (
      <button
        onClick={onClick}
        aria-label="Dismiss"
        tabIndex={0}
        block="PLPPageFilter"
      >
        {label}
        <Close />
      </button>
    );
  }

  updateInitialFilters = (
    data,
    facet_value,
    newFilterArray,
    categoryLevel1,
    checked,
    facet_key
  ) => {
    if (data[facet_value]) {
      data[facet_value].is_selected = checked;
      if (checked) {
        newFilterArray.selected_filters_count += 1;
      } else {
        newFilterArray.selected_filters_count -= 1;
      }
    } else {
      if (facet_key.includes("size")) {
        let categoryData = data[facet_key];
        if (
          categoryData.subcategories &&
          categoryData.subcategories[facet_value]
        ) {
          categoryData.subcategories[facet_value].is_selected = checked;
          if (checked) {
            categoryData.selected_filters_count += 1;
            newFilterArray.selected_filters_count += 1;
          } else {
            categoryData.selected_filters_count -= 1;
            newFilterArray.selected_filters_count -= 1;
          }
        }
      } else if (categoryLevel1) {
        return Object.entries(data).map((entry) => {
          return Object.entries(entry[1].subcategories).map((subEntry) => {
            if (subEntry[0] === facet_value) {
              subEntry[1].is_selected = checked;
              if (checked) {
                entry[1].selected_filters_count += 1;
                newFilterArray.selected_filters_count += 1;
              } else {
                entry[1].selected_filters_count -= 1;
                newFilterArray.selected_filters_count -= 1;
              }
            }
          });
        });
      } else {
        Object.keys(data).map((value) => {
          if (
            data[value].subcategories &&
            data[value].subcategories[facet_value]
          ) {
            data[value].subcategories[facet_value].is_selected = checked;
            if (checked) {
              data[value].selected_filters_count += 1;
              newFilterArray.selected_filters_count += 1;
            } else {
              data[value].selected_filters_count -= 1;
              newFilterArray.selected_filters_count -= 1;
            }
          }
        });
      }
    }
  };

  updateRadioFilters = (data, facet_value, newFilterArray) => {
    if (data[facet_value]) {
      Object.values(data).map((value) => {
        if (value.facet_value === facet_value) {
          value.is_selected = false;
        }
      });

      if (newFilterArray.selected_filters_count === 1) {
        newFilterArray.selected_filters_count = 0;
      }
    }
  };

  getRequestOptions = () => {
    let params;
    if (location.search && location.search.startsWith("?q")) {
      const { params: parsedParams } = WebUrlParser.parsePLP(location.href);
      params = parsedParams;
    } else {
      const { params: parsedParams } = WebUrlParser.parsePLPWithoutQuery(
        location.href
      );
      params = parsedParams;
    }
    return params;
  }
  
  handleCallback = (
    initialFacetKey,
    facet_value,
    checked,
    isRadio,
    isQuickFilters = false
  ) => {
    const { activeFilters } = this.state;
    const { filters, updatePLPInitialFilters, initialOptions } = this.props;
    const filterArray = activeFilters[initialFacetKey];
    let newFilterArray = filters[initialFacetKey];
    if (initialFacetKey.includes("size")) {
      newFilterArray = filters["sizes"];
    }
    let categoryLevel1 = this.getRequestOptions().q.split(" ")[1];


    if (!isRadio) {
      if (filterArray) {
        if (newFilterArray) {
          const { data = {} } = newFilterArray;

          this.updateInitialFilters(
            data,
            facet_value,
            newFilterArray,
            categoryLevel1,
            false,
            initialFacetKey
          );
          updatePLPInitialFilters(filters, initialFacetKey, facet_value);
          const index = filterArray.indexOf(facet_value);

          if (index > -1) {
            filterArray.splice(index, 1);
          }

          this.setState(
            {
              activeFilters: {
                [initialFacetKey]: filterArray,
              },
            },
            () => this.select()
          );
        }
      } else {
        if (newFilterArray) {
          const { data = {} } = newFilterArray;

          this.updateInitialFilters(
            data,
            facet_value,
            newFilterArray,
            categoryLevel1,
            false,
            initialFacetKey
          );
          updatePLPInitialFilters(filters, initialFacetKey, facet_value);
          this.setState(
            {
              activeFilters: {
                [initialFacetKey]: [],
              },
            },
            () => this.select()
          );
        }
      }
    } else {
      const { data = {} } = newFilterArray;

      if (newFilterArray) {
        this.updateRadioFilters(
          data,
          facet_value,
          newFilterArray,
          categoryLevel1,
          true
        );
        updatePLPInitialFilters(filters, initialFacetKey, facet_value);
        this.setState(
          {
            ...activeFilters,
            activeFilters: {
              [initialFacetKey]: [],
            },
          },
          () => this.select()
        );
      }
    }
  };

  select = (isQuickFilters) => {
    const { activeFilters = {} } = this.state;
    const { query, updateFiltersState } = this.props;
    const url = new URL(location.href.replace(/%20&%20/gi, "%20%26%20"));
    if(isMobile.any()){
      window.scrollTo(0, 0);
    }
    if (!isMobile.any() || isQuickFilters) {
      updateFiltersState(activeFilters);
      Object.keys(activeFilters).map((key) => {
        if (key !== "categories.level1")
          WebUrlParser.setParam(key, activeFilters[key], query);
      });
    }
  };

  renderLoadMore() {
    const { pages = {} } = this.props;
    if (pages[0]?.products.length == 0) {
      return null;
    }
    return (
      <ProductLoad
        pageKey={this.state.pageKey}
        productLoad={this.props.productLoading}
      />
    );
  }

  render() {
    const { pages = {}, productLoading } = this.props;
    return (
      <div block="PLPPagesContainer">
        <div block="PLPPages Products-Lists" id="Products-Lists">
          {!isMobile.any() && !(pages[0]?.products.length === 0) && (
            <div block="ProductToolBar">
              <div block="ProductSelectedFilters">
                {this.renderSelectedFilters()}
              </div>
            </div>
          )}

          {this.renderPages()}
          {productLoading && !isMobile.any() && this.renderPlaceHolder()}
        </div>
        {!isMobile.any() && this.renderLoadMore()}
      </div>
    );
  }
}

export default withRouter(PLPPages);
