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
      pageKey: 0
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { filters } = this.props;
    const { filters: prevFilters } = prevProps;
    if (JSON.stringify(prevFilters) !== JSON.stringify(filters)) {
      this.renderActiveFilter();
    }
  }
  renderPage = ([key, page]) => {
    const { products, isPlaceholder, isFirst = false } = page; 
    this.setState({
      pageKey : key
    })   
    const {
      impressions,
      query,
      renderMySignInPopup,
      prevPath = null,
      filters,
    } = this.props;

    if (isPlaceholder) {
      return (
        <PLPPagePlaceholder
          isFirst={isFirst}
          key={key}
          pageIndex={key}
          query={query}
        />
      );
    }
    
    return (
      <PLPPage
        key={key}
        products={products}
        impressions={impressions}
        renderMySignInPopup={renderMySignInPopup}
        prevPath={prevPath}
        filters={filters}
      />
    );
  };

  renderPages() {
    const { pages = {} } = this.props;
    if (pages && pages.length === 0) {
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

  renderActiveFilter() {
    const { filters } = this.props;
    const thisRef = this;
    {
      Object.values(filters).map(function (values, index) {
        if (values.data) {
          return Object.values(values.data).map(function (value, index) {
            if (value.subcategories) {
              return Object.values(value.subcategories).map(function (
                val,
                index
              ) {
                if (val.is_selected === true) {
                  const { facet_key, facet_value } = val;
                  thisRef.selectActiveFilter(facet_key, facet_value);
                }
              });
            } else {
              if (
                value.is_selected === true &&
                value.facet_key !== "categories.level1"
              ) {
                const { facet_key, facet_value } = value;
                thisRef.selectActiveFilter(facet_key, facet_value);
              }
            }
          });
        }
      });
    }
  }

  selectActiveFilter(initialFacetKey, facet_value) {
    const { activeFilters } = this.state;
    const filterArray = activeFilters[initialFacetKey];

    this.setState(
      {
        activeFilters: {
          ...activeFilters,
          [initialFacetKey]: filterArray
            ? [...filterArray, facet_value]
            : [facet_value],
        },
      },
      () => {
        this.select(false);
      }
    );
  }
  renderSelectedFilters() {
    const selectedFilters = this.props.filters;
    const thisRef = this;
    if (selectedFilters) {
      return (
        <ul>
          {Object.values(selectedFilters).map(function (values, index) {
            if (values.data) {
              return Object.values(values.data).map(function (value, index) {
                if (value.subcategories) {
                  return Object.values(value.subcategories).map(function (
                    val,
                    index
                  ) {
                    if (val.is_selected === true) {
                      return (
                        <li>
                          {thisRef.renderButtonView(val.label, () => {
                            const { facet_key, facet_value } = val;
                            const { is_radio } = values;
                            thisRef.handleCallback(
                              facet_key,
                              facet_value,
                              false,
                              is_radio,
                              false
                            );
                          })}
                        </li>
                      );
                    }
                  });
                } else {
                  if (
                    value.is_selected === true &&
                    value.facet_key !== "categories.level1"
                  ) {
                    return (
                      <li>
                        {thisRef.renderButtonView(value.label, () => {
                          const { facet_key, facet_value } = value;
                          const { is_radio } = values;
                          thisRef.handleCallback(
                            facet_key,
                            facet_value,
                            false,
                            is_radio,
                            false
                          );
                        })}
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
        onKeyDown={() => {}}
        aria-label="Dismiss"
        tabIndex={0}
        block="PLPPageFilter"
      >
        {label}
        <Close />
      </button>
    );
  }

  handleCallback = (
    initialFacetKey,
    facet_value,
    checked,
    isRadio,
    isQuickFilters = false
  ) => {
    const { activeFilters } = this.state;
    const filterArray = activeFilters[initialFacetKey];

    if (!isRadio) {
      if (filterArray) {
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
      } else {
        this.setState(
          {
            activeFilters: {
              [initialFacetKey]: [],
            },
          },
          () => this.select()
        );
      }
    } else {
      this.setState(
        {
          ...activeFilters,
          activeFilters: {
            [initialFacetKey]: facet_value,
          },
        },
        () => this.select()
      );
    }
  };

  select = (isQuickFilters) => {
    const { activeFilters = {} } = this.state;
    const { query } = this.props;
    if (!isMobile.any() || isQuickFilters) {
      Object.keys(activeFilters).map((key) =>
        WebUrlParser.setParam(key, activeFilters[key], query)
      );
    }
  };

  renderLoadMore(){
    return (
      <ProductLoad pageKey={this.state.pageKey}/>
    )
  }

  render() {

    return (
      <div block="PLPPages Products-Lists">
        <div class="ProductToolBar">
          <div block="ProductSelectedFilters">
            {this.renderSelectedFilters()}
          </div>

          {/* {this.renderButtonView("sort ", this.toggleSortDropdown)} */}
        </div>
        {this.renderPages()}
        {this.renderLoadMore()}
      </div>
    );
  }
}

export default PLPPages;
